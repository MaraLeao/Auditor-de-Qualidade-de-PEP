import json
import os
import subprocess
import time
import redis

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379,
    decode_responses=True,
)

QUEUE_KEY = "fila:prontuarios"
DLQ_KEY = "fila:prontuarios:falhas"
RESULT_KEY_PREFIX = "resultado:"
MAX_ATTEMPTS = 3

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

    proc = subprocess.run(
    ["python", "-m", "data_extract.main"],
    input=json.dumps(records),
    capture_output=True,
    text=True,
    cwd=os.path.dirname(__file__),  # garante que roda com /app como raiz
    env=env,
)

    if proc.returncode != 0:
        raise RuntimeError(f"data_extract failed (code {proc.returncode}): {proc.stderr.strip()}")
        
    if proc.stderr:
        import sys
        sys.stderr.write(proc.stderr)

    try:
        output = json.loads(proc.stdout)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"data_extract returned invalid JSON: {e}\nstdout: {proc.stdout[:500]}")

    if not output:
        raise RuntimeError("data_extract returned an empty result")

    # o contrato retorna uma lista; como mandamos os registros de 1 prontuário só,
    # pegamos o primeiro (e único) item
    return output[0]


def save_result(job: dict, result: dict):
    prontuario_key = f"{RESULT_KEY_PREFIX}{job['record_number']}"
    job_key = f"{RESULT_KEY_PREFIX}{job['job_id']}"
    
    data = json.dumps(result)
    r.set(prontuario_key, data)
    r.set(job_key, data)


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
                    error_msg += f"\nStderr: {e.stderr}"
                    
            print(f"[ERROR] patient record {job.get('record_number')}: {error_msg} (attempt {job['attempts']})")

            if job["attempts"] < MAX_ATTEMPTS:
                time.sleep(1)
                r.lpush(QUEUE_KEY, json.dumps(job))
            else:
                job["final_error"] = str(e)
                r.lpush(DLQ_KEY, json.dumps(job))


if __name__ == "__main__":
    main()