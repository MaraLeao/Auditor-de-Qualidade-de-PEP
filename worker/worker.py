import json
import os
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
MAX_TENTATIVAS = 3


def processar_prontuario(job: dict) -> dict:
    numero = job["numero_prontuario"]
    conteudo = job["conteudo"]

    if len(conteudo) < 5:
        raise ValueError("conteúdo insuficiente para extração")

    resultado = {
        "numero_prontuario": numero,
        "status": "ok",
        "campos_extraidos": {},
        "erros_validacao": [],
    }
    return resultado


def salvar_resultado(job: dict, resultado: dict):
    key = f"{RESULT_KEY_PREFIX}{job['numero_prontuario']}"
    r.set(key, json.dumps(resultado))


def main():
    print("Worker iniciado, aguardando jobs...")
    while True:
        item = r.brpop(QUEUE_KEY, timeout=5)
        if item is None:
            continue

        _, raw = item
        job = json.loads(raw)

        try:
            resultado = processar_prontuario(job)
            salvar_resultado(job, resultado)
            print(f"[OK] prontuário {job['numero_prontuario']}")

        except Exception as e:
            job["tentativas"] += 1
            print(f"[ERRO] prontuário {job['numero_prontuario']}: {e} (tentativa {job['tentativas']})")

            if job["tentativas"] < MAX_TENTATIVAS:
                time.sleep(1)
                r.lpush(QUEUE_KEY, json.dumps(job))
            else:
                job["erro_final"] = str(e)
                r.lpush(DLQ_KEY, json.dumps(job))


if __name__ == "__main__":
    main()