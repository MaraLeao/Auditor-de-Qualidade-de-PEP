# POST /batches

Recebe registros médicos brutos exportados do sistema de origem e os publica na fila para processamento assíncrono.

- **Endpoint:** `POST /batches`
- **Content-Type:** `text/plain` (ou aceita qualquer formato de texto, pois converte para texto puro)

## Formato da Requisição (Body)
O corpo da requisição **não é um JSON Array válido**. O formato esperado é uma sequência de objetos JSON divididos por vírgula (formato bruto de exportação, sem os colchetes `[]` englobando).

```text
{"Prontuário":"19.265.867", "Tipo do registro":"Anamnese", "Atendimento": "123"},
{"Prontuário":"19.265.867", "Tipo do registro":"Evolução", "Atendimento": "123"},
{"Prontuário":"22.111.222", "Tipo do registro":"Anamnese", "Atendimento": "456"}
```

## Formato da Resposta
- **Status de Sucesso:** `202 Accepted`
- **Body:**
```json
{
  "message": "Batch received and queued",
  "batch_id": "e450c5b2-d401-4ddd-9904-df71dbb97dc1",
  "total_records": 2,
  "jobs": [
    {
      "record_number": "19265867",
      "job_id": "11111111-2222-3333-4444-555555555555"
    },
    {
      "record_number": "22111222",
      "job_id": "66666666-7777-8888-9999-000000000000"
    }
  ]
}
```

> [!NOTE]
> A API automaticamente agrupa múltiplos documentos que pertencem ao mesmo número de `"Prontuário"`. O retorno `jobs` exibe os números de prontuário com a pontuação já normalizada junto com o ID único gerado para aquela requisição (usado na consulta via `/jobs/:id/status`).

## Erros Comuns
- `400 Bad Request`: Caso o corpo da requisição esteja vazio, malformado ou o parse dos objetos falhe.
