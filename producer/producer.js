import { createClient } from "redis";
import { randomUUID } from "crypto";

const redis = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
redis.on("error", (err) => console.error("Redis Client Error", err));
await redis.connect();

const QUEUE_KEY = "fila:prontuarios";
const RESULT_KEY_PREFIX = "resultado:";

function normalizeRecordNumber(numero) {
  return numero.replace(/\./g, "").trim();
}

function parsePayload(rawText) {
  const text = rawText.trim();
  const validJson = `[${text}]`;

  try {
    return JSON.parse(validJson);
  } catch (err) {
    throw new Error(`Invalid payload, could not parse: ${err.message}`);
  }
}

function groupByRecordNumber(records) {
  const groups = new Map();

  for (const record of records) {
    const originalNumber = record["Prontuário"];
    if (!originalNumber) {
      console.error("Record missing patient record number, skipping:", record["Tipo do registro"]);
      continue;
    }

    const number = normalizeRecordNumber(originalNumber);

    if (!groups.has(number)) {
      groups.set(number, {
        number,
        displayNumber: originalNumber,
        encounter: record["Atendimento"],
        records: [],
      });
    }

    groups.get(number).records.push(record);
  }

  return Array.from(groups.values());
}

async function publishBatch(rawText) {
  const batchId = randomUUID();
  const rawRecords = parsePayload(rawText);
  const patientRecords = groupByRecordNumber(rawRecords);

  const publishedJobs = [];

  for (const p of patientRecords) {
    const jobId = randomUUID();
    const job = {
      job_id: jobId,
      batch_id: batchId,
      record_number: p.number,
      record_number_display: p.displayNumber,
      encounter: p.encounter,
      total_entries: p.records.length,
      records: p.records,
      created_at: new Date().toISOString(),
      attempts: 0,
    };

    await redis.lPush(QUEUE_KEY, JSON.stringify(job));
    publishedJobs.push({
      record_number: p.number,
      job_id: jobId
    });
  }

  return { batchId, publishedJobs };
}

async function getResult(recordNumber) {
  const key = `${RESULT_KEY_PREFIX}${recordNumber}`;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

async function getJobResult(jobId) {
  const key = `${RESULT_KEY_PREFIX}${jobId}`;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export { publishBatch, getResult, getJobResult, redis };