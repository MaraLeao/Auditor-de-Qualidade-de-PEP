"""Contrato do Worker: fila Redis (fakeredis) + execução do data_extract.

- `process_patient_record` é testado com o subprocesso REAL (`python -m data_extract.main`) falando
  com um servidor HTTP falso no lugar do LM Studio: cobre o caminho Worker → auditor → IA de ponta a ponta.
- O loop `main()` é testado com `process_patient_record` trocado por um dublê, para cobrir só a fila.
"""
import json
import re
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import fakeredis
import pytest

import worker.worker as worker
from tests.conftest import REPO_ROOT, records_of

QUEUE, DLQ, PREFIX = worker.QUEUE_KEY, worker.DLQ_KEY, worker.RESULT_KEY_PREFIX


# ── Redis falso + quebra-loop ────────────────────────────────────────────
class _StopLoop(BaseException):
    """BaseException de propósito: o `except Exception` do Worker não a captura."""


class LoopBreaker:
    """Envolve o FakeRedis: quando a fila esvazia, o brpop interrompe o loop `while True` do Worker."""

    def __init__(self, r):
        self._r = r

    def brpop(self, key, timeout=0):
        if self._r.llen(key) == 0:
            raise _StopLoop
        return self._r.brpop(key, timeout=1)

    def __getattr__(self, name):
        return getattr(self._r, name)


@pytest.fixture
def redis_fake(monkeypatch):
    raw = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(worker, "r", LoopBreaker(raw))
    monkeypatch.setattr(worker.time, "sleep", lambda s: None)
    return raw


def job(n=1, **extra):
    return {"job_id": f"job-{n}", "batch_id": "b", "record_number": f"{n}", "records": [{"x": 1}],
            "attempts": 0, **extra}


def run_loop():
    with pytest.raises(_StopLoop):
        worker.main()


# ── main(): fila ─────────────────────────────────────────────────────────
def test_success_saves_result_under_record_and_job_keys(redis_fake, monkeypatch):
    resultado = {"record_id": "1", "audit_data": {"ok": True}}
    monkeypatch.setattr(worker, "process_patient_record", lambda j: resultado)
    redis_fake.lpush(QUEUE, json.dumps(job(1)))
    run_loop()
    assert json.loads(redis_fake.get(f"{PREFIX}1")) == resultado          # por prontuário
    assert json.loads(redis_fake.get(f"{PREFIX}job-1")) == resultado       # por job
    assert redis_fake.llen(QUEUE) == 0 and redis_fake.llen(DLQ) == 0


def test_partial_result_is_saved_normally_not_sent_to_dlq(redis_fake, monkeypatch):
    parcial = {"record_id": "1", "audit_data": {"ia_incompleta": True, "observacao_ia": "IA não rodou"}}
    monkeypatch.setattr(worker, "process_patient_record", lambda j: parcial)
    redis_fake.lpush(QUEUE, json.dumps(job(1)))
    run_loop()
    assert json.loads(redis_fake.get(f"{PREFIX}job-1")) == parcial
    assert redis_fake.llen(DLQ) == 0


def test_failing_job_is_retried_once_then_goes_to_dlq(redis_fake, monkeypatch):
    chamadas = []

    def falha(j):
        chamadas.append(j["attempts"])
        raise RuntimeError("boom")

    monkeypatch.setattr(worker, "process_patient_record", falha)
    redis_fake.lpush(QUEUE, json.dumps(job(1)))
    run_loop()

    assert chamadas == [0, 1]                          # 2 execuções (1 repetição)
    assert redis_fake.llen(QUEUE) == 0 and redis_fake.llen(DLQ) == 1
    morto = json.loads(redis_fake.lrange(DLQ, 0, -1)[0])
    assert morto["attempts"] == 2 and morto["final_error"] == "boom"
    # a falha fica visível para quem consulta o job
    falha_publicada = json.loads(redis_fake.get(f"{PREFIX}job-1"))
    assert falha_publicada["_job_failed"] is True and falha_publicada["attempts"] == 2
    assert redis_fake.get(f"{PREFIX}1") is None        # não publica no resultado do prontuário


def test_job_that_recovers_on_second_attempt_is_saved(redis_fake, monkeypatch):
    estado = {"n": 0}

    def instavel(j):
        estado["n"] += 1
        if estado["n"] == 1:
            raise RuntimeError("falha transitória")
        return {"record_id": "1", "audit_data": {}}

    monkeypatch.setattr(worker, "process_patient_record", instavel)
    redis_fake.lpush(QUEUE, json.dumps(job(1)))
    run_loop()
    assert estado["n"] == 2 and redis_fake.llen(DLQ) == 0
    assert redis_fake.get(f"{PREFIX}job-1") is not None


def test_jobs_are_consumed_fifo(redis_fake, monkeypatch):
    ordem = []
    monkeypatch.setattr(worker, "process_patient_record", lambda j: ordem.append(j["job_id"]) or {"audit_data": {}})
    for n in (1, 2, 3):                                 # o Producer usa LPUSH; o Worker BRPOP
        redis_fake.lpush(QUEUE, json.dumps(job(n)))
    run_loop()
    assert ordem == ["job-1", "job-2", "job-3"]


def test_KNOWN_BUG_malformed_message_crashes_the_worker(redis_fake, monkeypatch):
    """json.loads(raw) está fora do try: uma mensagem inválida derruba o processo (plano F5)."""
    monkeypatch.setattr(worker, "process_patient_record", lambda j: {})
    redis_fake.lpush(QUEUE, "isto não é json")
    with pytest.raises(json.JSONDecodeError):
        worker.main()


# ── process_patient_record com subprocesso dublê ─────────────────────────
class _Done:
    def __init__(self, returncode=0, stdout="[]", stderr=""):
        self.returncode, self.stdout, self.stderr = returncode, stdout, stderr


def test_model_and_seed_are_passed_to_the_subprocess_env(monkeypatch):
    capturado = {}

    def run(cmd, **kw):
        capturado.update(kw)
        return _Done(stdout=json.dumps([{"record_id": "1", "audit_data": {}}]))

    monkeypatch.setattr(worker.subprocess, "run", run)
    out = worker.process_patient_record({"records": [{"a": 1}], "model_name": "phi-4", "seed": 42})
    assert out == {"record_id": "1", "audit_data": {}}
    assert capturado["env"]["LLM_MODEL"] == "phi-4" and capturado["env"]["LLM_SEED"] == "42"
    assert json.loads(capturado["input"]) == [{"a": 1}]
    assert capturado["timeout"] == worker.SUBPROCESS_TIMEOUT


@pytest.mark.parametrize("done,trecho", [
    (_Done(returncode=1, stderr="traceback"), "data_extract failed (code 1)"),
    (_Done(stdout="não é json"), "invalid JSON"),
    (_Done(stdout="[]"), "empty result"),
])
def test_subprocess_failures_raise_runtime_error(monkeypatch, done, trecho):
    monkeypatch.setattr(worker.subprocess, "run", lambda cmd, **kw: done)
    with pytest.raises(RuntimeError, match=re.escape(trecho)):
        worker.process_patient_record({"records": [{}]})


# ── process_patient_record de ponta a ponta (subprocesso real + LLM falso) ──
class _FakeLLM(BaseHTTPRequestHandler):
    modo = "null"   # null | erro500

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        if type(self).modo == "erro500":
            self.send_response(500)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        campos = re.findall(r"^- (\w+):", body["system_prompt"], flags=re.M)
        payload = json.dumps({"choices": [{"message": {"content": json.dumps({c: None for c in campos})}}]}).encode()
        self.send_response(200)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *a):
        pass


@pytest.fixture
def fake_llm_server(monkeypatch):
    srv = HTTPServer(("127.0.0.1", 0), _FakeLLM)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    monkeypatch.setenv("LMSTUDIO_URL", f"http://127.0.0.1:{srv.server_port}/")
    monkeypatch.setenv("AI_RETRY_DELAY_SECONDS", "0")
    monkeypatch.setenv("PYTHONPATH", str(REPO_ROOT))
    monkeypatch.delenv("LLM_SEED", raising=False)

    real_run = subprocess.run

    def run_no_repositorio(cmd, **kw):
        # o Worker chama "python" com cwd=worker/; aqui usa o interpretador do teste e a raiz do repo
        return real_run([sys.executable] + list(cmd[1:]), **{**kw, "cwd": str(REPO_ROOT)})

    monkeypatch.setattr(worker.subprocess, "run", run_no_repositorio)

    # o subprocesso real acrescenta linhas em data_extract/metadataProntuarios.txt: restaura ao final
    metadata = REPO_ROOT / "data_extract" / "metadataProntuarios.txt"
    original = metadata.read_bytes() if metadata.exists() else None
    yield _FakeLLM
    srv.shutdown()
    _FakeLLM.modo = "null"
    if original is None:
        metadata.unlink(missing_ok=True)
    else:
        metadata.write_bytes(original)


def test_end_to_end_real_subprocess_with_fake_llm(fake_llm_server, all_records):
    fake_llm_server.modo = "null"
    registros = records_of(all_records, "62.407.871")
    result = worker.process_patient_record({"records": registros, "model_name": "modelo-x"})
    assert result["record_id"] == "62.407.871"
    audit = result["audit_data"]
    assert audit["ia_incompleta"] is False
    assert audit["_ia_meta"]["model"] == "modelo-x"
    assert audit["_ia_meta"]["campos_erro"] == []
    assert audit["_ia_meta"]["campos_null"], "todos os campos enviados à IA deveriam ter voltado null"


def test_end_to_end_ai_down_returns_partial_result_not_an_exception(fake_llm_server, all_records):
    fake_llm_server.modo = "erro500"
    result = worker.process_patient_record({"records": records_of(all_records, "62.407.871")})
    audit = result["audit_data"]
    assert audit["ia_incompleta"] is True
    assert "A IA não rodou para todos os campos" in audit["observacao_ia"]
    assert audit["_ia_meta"]["campos_erro"]
