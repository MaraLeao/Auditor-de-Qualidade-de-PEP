import express from "express";
import { publishBatch, getResult } from "./producer.js";

const app = express();

// aceita corpo como texto puro (é o formato esperado: {...},{...},{...})
app.use(express.text({ limit: "20mb", type: "*/*" }));

const PORT = process.env.PORT || 3001;

// POST /batches — recebe o lote bruto e publica na fila
app.post("/batches", async (req, res) => {
  try {
    const rawText = req.body;

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return res.status(400).json({ error: "Empty or invalid request body" });
    }

    const result = await publishBatch(rawText);

    res.status(202).json({
      message: "Batch received and queued",
      batch_id: result.batchId,
      total_records: result.publishedNumbers.length,
      record_numbers: result.publishedNumbers,
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

    res.json({ status: "done", result });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Producer API listening on port ${PORT}`);
});
