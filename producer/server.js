import express from "express";
import cors from "cors";
import { publishBatch, getResult, getJobResult, jobStatusOf } from "./producer.js";
import { getAllAudits, getAuditById, getDashboardStats } from "./db.js";
import { transformAuditResult } from "./transformer.js";

const app = express();

// CORS: allow frontend dev server
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// aceita corpo como texto puro (é o formato esperado: {...},{...},{...})
app.use(express.text({ limit: "20mb", type: "text/*" }));
app.use(express.json({ limit: "20mb" }));

const PORT = process.env.PORT || 3001;

// ============================================================
// EXISTING ENDPOINTS (Queue / Redis)
// ============================================================

// POST /batches — recebe o lote bruto e publica na fila
app.post("/batches", async (req, res) => {
  try {
    const rawText = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const modelName = req.query.model;

    // seed opcional (inteiro): repassada ao worker -> LLM para reprodutibilidade
    let seed;
    if (req.query.seed !== undefined && req.query.seed !== "") {
      if (!/^-?\d+$/.test(String(req.query.seed))) {
        return res.status(400).json({ error: "Invalid 'seed': must be an integer" });
      }
      seed = parseInt(req.query.seed, 10);
    }

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return res.status(400).json({ error: "Empty or invalid request body" });
    }

    const result = await publishBatch(rawText, modelName, seed);

    res.status(202).json({
      message: "Batch received and queued",
      batch_id: result.batchId,
      total_records: result.publishedJobs.length,
      jobs: result.publishedJobs,
    });
  } catch (err) {
    console.error("Error publishing batch:", err);
    res.status(400).json({ error: err.message });
  }
});

// GET /records/:number/status — consulta status/resultado de um prontuário
app.get("/records/:number/status", async (req, res) => {
  try {
    const recordNumber = req.params.number.replace(/\./g, "").trim();
    const result = await getResult(recordNumber);

    if (!result) {
      return res.status(202).json({ status: "processing", record_number: recordNumber });
    }

    // Transform to frontend format
    const transformed = transformAuditResult(result);
    res.json({ status: "done", result: transformed, raw: result });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /jobs/:id/status — consulta status/resultado de um job específico
app.get("/jobs/:id/status", async (req, res) => {
  try {
    const jobId = req.params.id.trim();
    const result = await getJobResult(jobId);

    if (!result) {
      return res.status(202).json({ status: "processing", job_id: jobId });
    }

    // failed: o Worker esgotou as tentativas. Devolve o motivo explícito; passar pelo transformer descartaria
    // o erro e montaria um resultado vazio com cara de auditoria.
    if (result._job_failed) {
      return res.json({ status: "failed", job_id: jobId, error: result.error, attempts: result.attempts });
    }

    // done | partial (IA não rodou em todos os campos)
    const transformed = transformAuditResult(result);
    res.json({ status: jobStatusOf(result), result: transformed, raw: result });
  } catch (err) {
    console.error("Error fetching job result:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// NEW ENDPOINTS (SQLite / Dashboard)
// ============================================================

// GET /api/audits — lista todas as auditorias do banco
app.get("/api/audits", (_req, res) => {
  try {
    const audits = getAllAudits();
    const transformed = audits.map((audit) => {
      try {
        const t = transformAuditResult(audit.audit_data);
        return {
          id: audit.id,
          batch_id: audit.batch_id,
          job_id: audit.job_id,
          record_number: audit.record_number,
          record_number_display: audit.record_number_display,
          encounter: audit.encounter,
          conformity_percent: audit.conformity_percent,
          created_at: audit.created_at,
          status: audit.status,
          audit: t,
        };
      } catch (err) {
        console.error(`Error transforming audit ${audit.id}:`, err.message);
        return {
          id: audit.id,
          record_number: audit.record_number,
          record_number_display: audit.record_number_display,
          conformity_percent: audit.conformity_percent,
          created_at: audit.created_at,
          status: audit.status,
          audit: null,
          error: "Transform failed",
        };
      }
    });

    res.json({ audits: transformed, total: transformed.length });
  } catch (err) {
    console.error("Error fetching audits:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/audits/:id — detalhes de uma auditoria específica
app.get("/api/audits/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const audit = getAuditById(id);

    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }

    const transformed = transformAuditResult(audit.audit_data);
    res.json({
      id: audit.id,
      record_number: audit.record_number,
      record_number_display: audit.record_number_display,
      encounter: audit.encounter,
      conformity_percent: audit.conformity_percent,
      created_at: audit.created_at,
      audit: transformed,
      raw: audit.audit_data,
    });
  } catch (err) {
    console.error("Error fetching audit:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/stats — estatísticas agregadas
app.get("/api/dashboard/stats", (_req, res) => {
  try {
    const stats = getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Producer API listening on port ${PORT}`);
});
