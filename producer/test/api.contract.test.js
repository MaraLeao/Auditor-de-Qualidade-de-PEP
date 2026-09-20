// Contrato HTTP do Producer (Fase 0 da refatoração): congela o comportamento ATUAL.
//
// Roda com:  npm test        (Node >= 22.3; usa o mock de módulos do node:test, sem dependências novas)
//
// O `redis` é substituído por um dublê em memória ANTES de importar o servidor, então não precisa de
// Redis de verdade. Quando o Producer for refatorado (fase F6), estes testes têm que continuar passando.
import { test, mock, before } from "node:test";
import assert from "node:assert/strict";
import net from "node:net";

const store = new Map(); // chave -> string
const pushed = []; // { key, value } na ordem de LPUSH

const fakeClient = {
  on() {},
  async connect() {},
  async lPush(key, value) {
    pushed.push({ key, value });
    return pushed.length;
  },
  async get(key) {
    return store.has(key) ? store.get(key) : null;
  },
};

mock.module("redis", { namedExports: { createClient: () => fakeClient } });

const port = await new Promise((resolve) => {
  const s = net.createServer().listen(0, () => {
    const p = s.address().port;
    s.close(() => resolve(p));
  });
});
process.env.PORT = String(port);
const BASE = `http://127.0.0.1:${port}`;

await import("../server.js");

before(async () => {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${BASE}/health`);
      if (r.ok) return;
    } catch {
      /* servidor ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error("Producer não subiu");
});

const post = (path, body) => fetch(`${BASE}${path}`, { method: "POST", body });
const getJson = async (path) => {
  const r = await fetch(`${BASE}${path}`);
  return { status: r.status, body: await r.json() };
};
const reset = () => {
  store.clear();
  pushed.length = 0;
};

test("GET /health", async () => {
  assert.deepEqual(await getJson("/health"), { status: 200, body: { ok: true } });
});

test("POST /batches: agrupa por prontuário (sem pontos), publica 1 job por prontuário com model e seed", async () => {
  reset();
  const payload = JSON.stringify([
    { "Prontuário": "12.345", Atendimento: "9", "Tipo do registro": "Anamnese" },
    { "Prontuário": "12.345", Atendimento: "9", "Tipo do registro": "Evolução" },
    { "Prontuário": "67.890", Atendimento: "7" },
  ]);
  const res = await post("/batches?model=phi-4&seed=42", payload);
  assert.equal(res.status, 202);
  const body = await res.json();

  assert.equal(body.message, "Batch received and queued");
  assert.equal(body.total_records, 2);
  assert.deepEqual(body.jobs.map((j) => j.record_number), ["12345", "67890"]);

  assert.equal(pushed.length, 2);
  assert.ok(pushed.every((p) => p.key === "fila:prontuarios"));
  const job = JSON.parse(pushed[0].value);
  assert.equal(job.job_id, body.jobs[0].job_id);
  assert.equal(job.batch_id, body.batch_id);
  assert.equal(job.record_number, "12345");
  assert.equal(job.record_number_display, "12.345");
  assert.equal(job.total_entries, 2);
  assert.equal(job.records.length, 2);
  assert.equal(job.model_name, "phi-4");
  assert.equal(job.seed, 42);
  assert.equal(job.attempts, 0);
});

test("POST /batches: sem model/seed, o job não leva essas chaves", async () => {
  reset();
  await post("/batches", JSON.stringify([{ "Prontuário": "1" }]));
  const job = JSON.parse(pushed[0].value);
  assert.equal("model_name" in job, false);
  assert.equal("seed" in job, false);
});

test("POST /batches: aceita o formato {...},{...} (sem colchetes)", async () => {
  reset();
  const res = await post("/batches", '{"Prontuário":"1"},{"Prontuário":"2"}');
  assert.equal(res.status, 202);
  assert.equal((await res.json()).total_records, 2);
});

test("POST /batches: seed que não é inteiro -> 400", async () => {
  reset();
  const res = await post("/batches?seed=abc", JSON.stringify([{ "Prontuário": "1" }]));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /seed/);
  assert.equal(pushed.length, 0);
});

test("POST /batches: corpo vazio -> 400", async () => {
  reset();
  const res = await post("/batches", "");
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, "Empty or invalid request body");
});

test("POST /batches: corpo que não é JSON -> 400 'Invalid payload'", async () => {
  reset();
  const res = await post("/batches", "isto não é json {");
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /^Invalid payload/);
});

test("POST /batches: registro sem 'Prontuário' -> 400 e nada é publicado", async () => {
  reset();
  const res = await post("/batches", JSON.stringify([{ x: 1 }]));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /^Invalid payload.*Prontuário/);
  assert.equal(pushed.length, 0);
});

test("POST /batches: um registro sem 'Prontuário' derruba o lote inteiro (nada é publicado pela metade)", async () => {
  reset();
  const res = await post("/batches", JSON.stringify([{ "Prontuário": "12.345" }, { Atendimento: "9" }]));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /registro 2/);
  assert.equal(pushed.length, 0);
});

test("POST /batches: 'Prontuário' vazio ou em branco também é recusado", async () => {
  reset();
  for (const valor of ["", "   ", null]) {
    const res = await post("/batches", JSON.stringify([{ "Prontuário": valor }]));
    assert.equal(res.status, 400);
  }
  assert.equal(pushed.length, 0);
});

test("POST /batches: item que não é objeto -> 400 sem vazar erro interno", async () => {
  reset();
  const res = await post("/batches", JSON.stringify([null, "texto"]));
  assert.equal(res.status, 400);
  const { error } = await res.json();
  assert.match(error, /^Invalid payload/);
  assert.doesNotMatch(error, /Cannot read|undefined|TypeError/);
  assert.equal(pushed.length, 0);
});

test("POST /batches: 'Prontuário' numérico é aceito e vira texto", async () => {
  reset();
  const res = await post("/batches", JSON.stringify([{ "Prontuário": 12345 }]));
  assert.equal(res.status, 202);
  assert.deepEqual((await res.json()).jobs.map((j) => j.record_number), ["12345"]);
});

test("GET /jobs/:id/status: processing | done | partial | failed", async () => {
  reset();
  assert.deepEqual(await getJson("/jobs/abc/status"), { status: 202, body: { status: "processing", job_id: "abc" } });

  store.set("resultado:abc", JSON.stringify({ record_id: "1", audit_data: { ia_incompleta: false } }));
  let r = await getJson("/jobs/abc/status");
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "done");

  store.set("resultado:abc", JSON.stringify({ record_id: "1", audit_data: { ia_incompleta: true } }));
  r = await getJson("/jobs/abc/status");
  assert.equal(r.body.status, "partial");

  // Job que esgotou as tentativas: devolve o motivo de forma explícita. Não passa pelo transformer, que
  // descartaria o erro e montaria um resultado "vazio" com cara de auditoria.
  store.set("resultado:abc", JSON.stringify({ _job_failed: true, error: "boom", attempts: 3 }));
  r = await getJson("/jobs/abc/status");
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { status: "failed", job_id: "abc", error: "boom", attempts: 3 });
});

test("GET /jobs/:id/status: resultado parcial traz o aviso da IA em 'raw' para o front poder mostrá-lo", async () => {
  reset();
  const parcial = { record_id: "1", audit_data: { ia_incompleta: true, observacao_ia: "IA falhou em 2 campos" } };
  store.set("resultado:abc", JSON.stringify(parcial));
  const r = await getJson("/jobs/abc/status");
  assert.equal(r.body.status, "partial");
  assert.equal(r.body.raw.audit_data.observacao_ia, "IA falhou em 2 campos");
});

test("GET /records/:number/status: normaliza pontos e lê o último resultado do prontuário", async () => {
  reset();
  assert.deepEqual(await getJson("/records/12.345/status"), {
    status: 202,
    body: { status: "processing", record_number: "12345" },
  });
  store.set("resultado:12345", JSON.stringify({ record_id: "12.345", audit_data: {} }));
  const r = await getJson("/records/12.345/status");
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "done");
});

test("KNOWN (item 13): job e prontuário compartilham o prefixo 'resultado:' — o mesmo dado aparece nas duas rotas", async () => {
  reset();
  store.set("resultado:12345", JSON.stringify({ record_id: "12.345", audit_data: {} }));
  assert.equal((await getJson("/jobs/12345/status")).body.status, "done");
});
