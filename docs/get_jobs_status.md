# GET /jobs/:id/status

Consulta de forma assíncrona se um determinado job gerado no lote (via POST `/batches`) já teve sua auditoria finalizada pelo *Worker* e extrai o relatório.
Esta é a **rota recomendada**, pois ela garante que envios repetidos de um mesmo prontuário não mascarem o status da requisição atual.

- **Endpoint:** `GET /jobs/:id/status`
- **Parâmetro da URL:** `:id` é o `job_id` retornado na submissão do lote.

## Resposta: Em Processamento
Enquanto o *Worker* (Python) ainda está executando a extração ou o item aguarda na fila.

- **Status:** `202 Accepted`
- **Body:**
```json
{
  "status": "processing",
  "job_id": "11111111-2222-3333-4444-555555555555"
}
```

## Resposta: Processamento Concluído
Quando a auditoria finaliza, os resultados estruturados são retornados na chave `result`.

- **Status:** `200 OK`
- **Body:**
```json
{
  "status": "done",
  "result": {
    "record_id": "19.265.867",
    "audit_data": {
      "matriz_documentos": { "datas": [], "matriz": {} },
      "secao_a": { },
      "secao_b_anamnese": { },
      "conformity_global": {
        "total": 42,
        "valid": 39,
        "invalid": 3,
        "percent": 92.85
      }
    }
  }
}
```

## Erros Comuns
- `500 Internal Server Error`: Falha ao comunicar com o Redis na hora de buscar a chave de resultado.
