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
  "record_numbers": [
    "19265867",
    "22111222"
  ]
}
```

> [!NOTE]
> A API automaticamente agrupa múltiplos documentos que pertencem ao mesmo número de `"Prontuário"`. O retorno `record_numbers` exibe os números de prontuário com a pontuação já normalizada.

## Erros Comuns
- `400 Bad Request`: Caso o corpo da requisição esteja vazio, malformado ou o parse dos objetos falhe.
