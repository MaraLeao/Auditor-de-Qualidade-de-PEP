"""Infra dos testes de caracterização (Fase 0 da refatoração).

Objetivo: congelar o comportamento ATUAL do backend. Nenhum teste aqui julga se o
comportamento está certo — só que ele não muda por acidente durante a refatoração.
"""
import hashlib
import json
import os
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent

FIXTURES = Path(__file__).parent / "fixtures"
SNAPSHOTS = Path(__file__).parent / "snapshots"


# ── Dados ────────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def all_records():
    """Cópia congelada de prontuarios.json (115 registros, 16 prontuários)."""
    with open(FIXTURES / "prontuarios_sample.json", encoding="utf-8") as f:
        return json.load(f)


def records_of(all_records, *prontuarios):
    return [r for r in all_records if r["Prontuário"] in prontuarios]


# ── Snapshots ────────────────────────────────────────────────────────────
def _diff(a, b, path="$", out=None, limit=8):
    out = [] if out is None else out
    if len(out) >= limit:
        return out
    if type(a) is not type(b):
        out.append(f"{path}: tipo {type(a).__name__} != {type(b).__name__}")
    elif isinstance(a, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a:
                out.append(f"{path}.{k}: apareceu (esperado ausente): {str(b[k])[:80]!r}")
            elif k not in b:
                out.append(f"{path}.{k}: sumiu (esperado {str(a[k])[:80]!r})")
            else:
                _diff(a[k], b[k], f"{path}.{k}", out, limit)
    elif isinstance(a, list):
        if len(a) != len(b):
            out.append(f"{path}: tamanho {len(a)} != {len(b)}")
        for i, (x, y) in enumerate(zip(a, b, strict=False)):
            _diff(x, y, f"{path}[{i}]", out, limit)
    elif a != b:
        out.append(f"{path}: esperado {str(a)[:80]!r} mas veio {str(b)[:80]!r}")
    return out


@pytest.fixture
def snapshot():
    """snapshot("nome", dados): compara com tests/snapshots/nome.json.
    Para regravar de propósito (ex.: correção de negócio aprovada): UPDATE_SNAPSHOTS=1 pytest."""

    def check(name, data):
        path = SNAPSHOTS / f"{name}.json"
        # round-trip pelo JSON: garante que compara exatamente o que seria gravado
        data = json.loads(json.dumps(data, ensure_ascii=False))
        if os.environ.get("UPDATE_SNAPSHOTS") == "1":
            path.write_text(json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
            return
        if not path.exists():
            pytest.fail(f"Snapshot {path.name} não existe. Gere com UPDATE_SNAPSHOTS=1 pytest.")
        expected = json.loads(path.read_text(encoding="utf-8"))
        if expected != data:
            diffs = "\n  ".join(_diff(expected, data))
            pytest.fail(f"Saída mudou em relação ao snapshot {path.name}:\n  {diffs}")

    return check


# ── LLM falso e determinístico ───────────────────────────────────────────
def _bucket(campo, texto):
    return int(hashlib.sha1(f"{campo}|{texto}".encode("utf-8")).hexdigest(), 16) % 10


def scenario_ok_mix(payload, campos):
    """Mistura determinística de: trecho, null, 'não conforme (incompleto)' e valor não-string."""
    texto = payload["input"].split("TEXTO DO REGISTRO:\n", 1)[-1]
    out = {}
    for c in campos:
        b = _bucket(c, texto)
        if b < 5:
            out[c] = f"trecho[{c}]: {texto[:40]}"
        elif b < 7:
            out[c] = None
        elif b < 8:
            out[c] = "não conforme (incompleto)"
        else:
            out[c] = True
    return "ok", out, None


def scenario_all_null(payload, campos):
    return "ok", {c: None for c in campos}, None


def scenario_timeout(payload, campos):
    return "timeout", {}, "timeout simulado"


def scenario_invalid_json(payload, campos):
    return "invalid_json", {}, "json inválido simulado"


def scenario_missing_keys(payload, campos):
    metade = campos[: len(campos) // 2]
    return "campos_ausentes", {c: f"trecho[{c}]" for c in metade}, "chaves ausentes simuladas"


SCENARIOS = {
    "ok_mix": scenario_ok_mix,
    "all_null": scenario_all_null,
    "timeout": scenario_timeout,
    "invalid_json": scenario_invalid_json,
    "missing_keys": scenario_missing_keys,
}


@pytest.fixture
def audit_env(monkeypatch, tmp_path):
    """Isola o auditor do ambiente: configuração fixa, sem sleep, sem gravar no repositório."""
    from data_extract.core import auditor, llm_client

    monkeypatch.setattr(llm_client, "AI_MAX_ATTEMPTS", 3)
    monkeypatch.setattr(llm_client, "AI_RETRY_DELAY_SECONDS", 0)
    monkeypatch.setattr(llm_client, "AI_SEED", None)
    monkeypatch.setattr(auditor, "MODEL_NAME", "modelo-de-teste")
    monkeypatch.setattr(auditor, "AI_SEED", None)
    # o auditor grava metadataProntuarios.txt ao lado do pacote: desvia para a pasta temporária
    (tmp_path / "core").mkdir()
    monkeypatch.setattr(auditor, "__file__", str(tmp_path / "core" / "auditor.py"))

    def use(scenario):
        calls = []
        fn = SCENARIOS[scenario] if isinstance(scenario, str) else scenario

        def fake(payload, campos):
            calls.append({"campos": list(campos), "input": payload["input"]})
            return fn(payload, campos)

        monkeypatch.setattr(llm_client, "_single_attempt", fake)
        return calls

    return use


def normalize_audit(results):
    """Remove o que muda de execução para execução (tempo medido)."""
    out = json.loads(json.dumps(results, ensure_ascii=False))
    for r in out:
        meta = r["audit_data"].get("_ia_meta")
        if meta:
            meta["latencia_ia_s"] = 0.0
    return out
