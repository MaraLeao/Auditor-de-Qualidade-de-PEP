import json
import os
import subprocess
import time

import redis

try:
    from database import AuditDatabase  # imagem Docker: worker.py e database.py ficam lado a lado em /app
except ImportError:
    from worker.database import AuditDatabase  # fora do Docker: importado como pacote (testes, mypy)

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379,
    decode_responses=True,
)

# Initialize SQLite database
db = AuditDatabase()

QUEUE_KEY = "fila:prontuarios"
DLQ_KEY = "fila:prontuarios:falhas"
RESULT_KEY_PREFIX = "resultado:"
# Execuções por job: 2 = 1 repetição, só para erro de infraestrutura (subprocesso caiu ou estourou o tempo).
# Falha da IA NÃO repete o job: vira resultado parcial (o cliente de IA já tenta 3 vezes por chamada).
MAX_ATTEMPTS = int(os.getenv("WORKER_MAX_ATTEMPTS", "2"))
SUBPROCESS_TIMEOUT = int(os.getenv("WORKER_SUBPROCESS_TIMEOUT", "3600"))

def process_patient_record(job: dict) -> dict:
    """
    Calls data_extract/main.py as a subprocess, passing the raw records
    via stdin (JSON array) and reading the audited result from stdout.
    """
    records = job["records"]
    model_name = job.get("model_name")

    env = os.environ.copy()
    if model_name:
        env["LLM_MODEL"] = model_name
    if job.get("seed") is not None:
        env["LLM_SEED"] = str(job["seed"])

    proc = subprocess.run(
        ["python", "-m", "data_extract.main"],
        input=json.dumps(records),
        capture_output=True,
        text=True,
        cwd=os.path.dirname(__file__),  # garante que roda com /app como raiz
        env=env,
        timeout=SUBPROCESS_TIMEOUT,
    )

    if proc.returncode != 0:
        raise RuntimeError(f"data_extract failed (code {proc.returncode}): {proc.stderr.strip()}")

    if proc.stderr:
        import sys
        sys.stderr.write(proc.stderr)

    try:
        output = json.loads(proc.stdout)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"data_extract returned invalid JSON: {e}\nstdout: {proc.stdout[:500]}") from e

    if not output:
        raise RuntimeError("data_extract returned an empty result")

    # o contrato retorna uma lista; como mandamos os registros de 1 prontuário só,
    # pegamos o primeiro (e único) item
    result = output[0]

    audit_data = result.get("audit_data", {})
    if audit_data.get("ia_incompleta"):
        # Resultado parcial: a IA falhou (após as tentativas do llm_client) em alguns campos.
        # Não vai para a DLQ — é entregue com o alerta em audit_data["observacao_ia"].
        print(f"[PARTIAL] patient record {job.get('record_number')}: {audit_data.get('observacao_ia')}")

    return result


def save_result(job: dict, result: dict):
    """Save result to both Redis (for fast polling) and SQLite (for persistence)."""
    # Redis: fast access for polling
    prontuario_key = f"{RESULT_KEY_PREFIX}{job['record_number']}"
    job_key = f"{RESULT_KEY_PREFIX}{job['job_id']}"

    data = json.dumps(result)
    r.set(prontuario_key, data)
    r.set(job_key, data)

    # SQLite: durable persistence for dashboard and history
    try:
        db.save_result({
            "batch_id": job.get("batch_id", "unknown"),
            "job_id": job.get("job_id", "unknown"),
            "record_number": job.get("record_number", "unknown"),
            "record_number_display": job.get("record_number_display", job.get("record_number", "")),
            "encounter": job.get("encounter", ""),
            "result": result
        })
    except Exception as e:
        print(f"[DB WARNING] Failed to save to SQLite (Redis saved OK): {e}")


def main():
    print("Worker started, waiting for jobs...")
    while True:
        try:
            item = r.brpop(QUEUE_KEY, timeout=5)
        except redis.exceptions.TimeoutError:
            continue
        except redis.exceptions.ConnectionError as e:
            print(f"[REDIS CONNECTION ERROR] {e} — retrying in 2s")
            time.sleep(2)
            continue

        if item is None:
            continue

        _, raw = item
        job = json.loads(raw)

        try:
            result = process_patient_record(job)
            save_result(job, result)
            print(f"[OK] patient record {job['record_number']}")

        except Exception as e:
            job["attempts"] = job.get("attempts", 0) + 1
            error_msg = str(e)
            if isinstance(e, subprocess.TimeoutExpired) or isinstance(e, subprocess.CalledProcessError):
                if e.stderr:
                    stderr = e.stderr.decode(errors="replace") if isinstance(e.stderr, bytes) else e.stderr
                    error_msg += f"\nStderr: {stderr}"

            print(f"[ERROR] patient record {job.get('record_number')}: {error_msg} (attempt {job['attempts']})")

            if job["attempts"] < MAX_ATTEMPTS:
                time.sleep(1)
                r.lpush(QUEUE_KEY, json.dumps(job))
            else:
                job["final_error"] = str(e)
                r.lpush(DLQ_KEY, json.dumps(job))
                # Publica a falha no resultado do job, para quem consulta não esperar para sempre
                r.set(
                    f"{RESULT_KEY_PREFIX}{job['job_id']}",
                    json.dumps({"_job_failed": True, "error": error_msg, "attempts": job["attempts"]}),
                )


if __name__ == "__main__":
    main()
