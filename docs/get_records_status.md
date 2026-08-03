# GET /records/:number/status

Consulta de forma assíncrona se um determinado prontuário já teve sua auditoria finalizada pelo *Worker* e extrai o relatório.

- **Endpoint:** `GET /records/:number/status`
- **Parâmetro da URL:** `:number` é o número do prontuário (pode conter pontos, ex: `19.265.867`, pois a API fará a limpeza automática).

## Resposta: Em Processamento
Enquanto o *Worker* (Python) ainda está executando a extração ou o item aguarda na fila.

- **Status:** `202 Accepted`
- **Body:**
```json
{
  "status": "processing",
  "record_number": "19265867"
}
```

## Resposta: Processamento Concluído
Quando a auditoria finaliza, os resultados estruturados são retornados na chave `result`. (Para ver a fundo a tipagem do conteúdo dentro do `audit_data`, consulte o contrato do extrator em `data_extract_contract.md`).

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
