# Auditor de Prontuários

Demo de IA auditora de prontuários eletrônicos.

## Rodando localmente

```bash
npm install
npm run dev
```

## Arquitetura Backend (Docker)

O projeto conta com um ecossistema backend em container para processamento assíncrono e auditoria:
- **Redis:** Fila de processamento (`fila:prontuarios`).
- **Worker (Python):** Consome a fila, executa a auditoria no `data_extract/main.py` e salva o resultado.
- **Producer API (Node.js):** Expõe as rotas HTTP para receber dados na porta 3001 e enviar pra fila.

Para iniciar todo o sistema de auditoria localmente via Docker, execute:

```bash
sudo docker compose up -d --build
```

A API estará rodando em:
- **Producer API:** `http://localhost:3001` (POST `/batches`, GET `/jobs/:id/status` e GET `/records/:number/status`)

Para acompanhar os logs do processamento em tempo real:
```bash
sudo docker compose logs -f
```

*(Consulte a pasta `docs/` para ver a documentação técnica detalhada dos contratos e endpoints das APIs).*
