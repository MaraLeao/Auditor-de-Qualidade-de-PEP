# Testes de caracterização (Fase 0)

Estes testes **congelam o comportamento atual** do backend antes da refatoração. Eles não
dizem que o comportamento está certo — só que ele não muda por acidente.

## Como rodar

```bash
pip install -r requirements-dev.txt
python -m pytest                 # tudo (Python)
npm --prefix services/producer test          # contrato HTTP do Producer (Node >= 22.3)
```

## O que cada arquivo protege

| Arquivo | Protege |
|---|---|
| `unit/` | Testes unitários de `helpers`, `parser` e da assinatura da IA |
| `test_audit_snapshot.py` | Saída completa de `run_audit` (regras + IA falsa) nos 5 cenários: `ok_mix`, `all_null`, `timeout`, `invalid_json`, `missing_keys` |
| `test_business_rules.py` | Regras de negócio decididas na fase N (itens 1–15 do plano), com a origem no prompt original de auditoria |
| `test_worker_contract.py` | Fila Redis do Worker (sucesso, parcial, retentativas, DLQ) e o caminho real Worker → subprocesso → auditor → LLM falso |
| `services/producer/test/api.contract.test.js` | `POST /batches`, `GET /jobs/:id/status`, `GET /records/:n/status`, `/health` |

## Regras

- `tests/fixtures/prontuarios_sample.json` é uma **cópia congelada** do dataset. Não muda quando
  `evaluation/.../prontuarios.json` for regenerado.
- Se um snapshot falhar depois de um refactor, **o refactor mudou o comportamento**. Desfaça.
- Mudança de comportamento **decidida** (nova regra de negócio): altere o teste em
  `test_business_rules.py` e regrave os snapshots **no mesmo commit**:
  `UPDATE_SNAPSHOTS=1 python -m pytest tests/test_audit_snapshot.py`
- Testes com `KNOWN_BUG` no nome documentam defeitos que o plano de refatoração corrige na fase indicada.
- O snapshot da fase N foi regravado de propósito: as regras de negócio mudaram (itens 1–4, 6–11 e 15).

## Qualidade de código

```bash
pip install -r requirements-dev.txt
ruff check data_extract worker tests    # lint (regras no pyproject.toml)
mypy                                    # tipos, modo gradual
pre-commit install                      # roda ruff e mypy a cada commit (e pytest no push)

cd services/producer && npm install && npm run lint && npm run format:check
```
