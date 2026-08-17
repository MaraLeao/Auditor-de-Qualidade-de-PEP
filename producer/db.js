import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH =
  process.env.SQLITE_DB_PATH ||
  path.join(process.cwd(), "..", "data", "auditor.db");

let db = null;

function getDb() {
  if (!db) {
    try {
      // Ensure directory exists
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      db = new Database(DB_PATH);
      db.pragma("journal_mode = WAL");
      db.pragma("foreign_keys = ON");

      // Initialize tables
      db.exec(`
        CREATE TABLE IF NOT EXISTS batches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          batch_id TEXT UNIQUE NOT NULL,
          total_records INTEGER DEFAULT 0,
          status TEXT DEFAULT 'processing',
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS audit_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          batch_id TEXT NOT NULL,
          job_id TEXT UNIQUE NOT NULL,
          record_number TEXT NOT NULL,
          record_number_display TEXT,
          encounter TEXT,
          audit_data TEXT NOT NULL,
          conformity_percent REAL DEFAULT 0,
          status TEXT DEFAULT 'done',
          created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_results_record ON audit_results(record_number);
        CREATE INDEX IF NOT EXISTS idx_results_batch ON audit_results(batch_id);
        CREATE INDEX IF NOT EXISTS idx_results_job ON audit_results(job_id);
      `);

      console.log(`[DB] SQLite initialized at ${DB_PATH}`);
    } catch (err) {
      console.error(`[DB] Failed to connect to SQLite at ${DB_PATH}:`, err.message);
      return null;
    }
  }
  return db;
}

// ============================================================
// READ operations
// ============================================================

/**
 * Get all audit results, most recent first.
 */
export function getAllAudits() {
  const conn = getDb();
  if (!conn) return [];

  try {
    const rows = conn
      .prepare(
        `SELECT id, batch_id, job_id, record_number, record_number_display,
                encounter, audit_data, conformity_percent, status, created_at
         FROM audit_results
         ORDER BY created_at DESC`
      )
      .all();

    return rows.map((row) => ({
      ...row,
      audit_data: JSON.parse(row.audit_data),
    }));
  } catch (err) {
    console.error("[DB] Error fetching all audits:", err.message);
    return [];
  }
}

/**
 * Get a specific audit result by its database ID.
 */
export function getAuditById(id) {
  const conn = getDb();
  if (!conn) return null;

  try {
    const row = conn
      .prepare("SELECT * FROM audit_results WHERE id = ?")
      .get(id);

    if (!row) return null;
    return { ...row, audit_data: JSON.parse(row.audit_data) };
  } catch (err) {
    console.error("[DB] Error fetching audit by ID:", err.message);
    return null;
  }
}

/**
 * Get aggregated dashboard statistics.
 */
export function getDashboardStats() {
  const conn = getDb();
  if (!conn)
    return {
      total_audits: 0,
      avg_conformity: 0,
      min_conformity: { record_number: "", value: 0 },
      max_conformity: { record_number: "", value: 0 },
    };

  try {
    const total = conn
      .prepare("SELECT COUNT(*) as cnt FROM audit_results")
      .get().cnt;

    if (total === 0) {
      return {
        total_audits: 0,
        avg_conformity: 0,
        min_conformity: { record_number: "", value: 0 },
        max_conformity: { record_number: "", value: 0 },
      };
    }

    const avg = conn
      .prepare("SELECT AVG(conformity_percent) as avg_val FROM audit_results")
      .get().avg_val;

    const worst = conn
      .prepare(
        "SELECT record_number_display, conformity_percent FROM audit_results ORDER BY conformity_percent ASC LIMIT 1"
      )
      .get();

    const best = conn
      .prepare(
        "SELECT record_number_display, conformity_percent FROM audit_results ORDER BY conformity_percent DESC LIMIT 1"
      )
      .get();

    return {
      total_audits: total,
      avg_conformity: avg ? Math.round(avg * 10) / 10 : 0,
      min_conformity: {
        record_number: worst?.record_number_display || "",
        value: worst ? Math.round(worst.conformity_percent * 10) / 10 : 0,
      },
      max_conformity: {
        record_number: best?.record_number_display || "",
        value: best ? Math.round(best.conformity_percent * 10) / 10 : 0,
      },
    };
  } catch (err) {
    console.error("[DB] Error fetching dashboard stats:", err.message);
    return {
      total_audits: 0,
      avg_conformity: 0,
      min_conformity: { record_number: "", value: 0 },
      max_conformity: { record_number: "", value: 0 },
    };
  }
}

// ============================================================
// WRITE operations (for local mode without Redis)
// ============================================================

/**
 * Create a batch record if it doesn't exist.
 */
export function ensureBatch(batchId, totalRecords = 0) {
  const conn = getDb();
  if (!conn) return;

  try {
    const existing = conn
      .prepare("SELECT id FROM batches WHERE batch_id = ?")
      .get(batchId);

    if (!existing) {
      conn
        .prepare(
          "INSERT INTO batches (batch_id, total_records, status, created_at) VALUES (?, ?, 'processing', ?)"
        )
        .run(batchId, totalRecords, new Date().toISOString());
    }
  } catch (err) {
    console.error("[DB] Error ensuring batch:", err.message);
  }
}

/**
 * Save an audit result to the database.
 */
export function saveAuditResult({
  batchId,
  jobId,
  recordNumber,
  recordNumberDisplay,
  encounter,
  auditData,
}) {
  const conn = getDb();
  if (!conn) return;

  try {
    // Extract conformity percent
    let conformityPercent = 0;
    if (auditData && typeof auditData === "object") {
      const ad = auditData.audit_data || auditData;
      const cg = ad.conformity_global || {};
      conformityPercent = cg.percent || 0;
    }

    const auditDataJson = JSON.stringify(auditData);

    const existing = conn
      .prepare("SELECT id FROM audit_results WHERE job_id = ?")
      .get(jobId);

    if (existing) {
      conn
        .prepare(
          "UPDATE audit_results SET audit_data = ?, conformity_percent = ?, status = 'done' WHERE job_id = ?"
        )
        .run(auditDataJson, conformityPercent, jobId);
    } else {
      conn
        .prepare(
          `INSERT INTO audit_results 
           (batch_id, job_id, record_number, record_number_display, encounter, audit_data, conformity_percent, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'done', ?)`
        )
        .run(
          batchId,
          jobId,
          recordNumber,
          recordNumberDisplay || recordNumber,
          encounter || "",
          auditDataJson,
          conformityPercent,
          new Date().toISOString()
        );
    }

    // Update batch status
    updateBatchStatus(batchId);

    console.log(
      `[DB] Saved result for record ${recordNumber} (job ${jobId}), conformity: ${Math.round(conformityPercent * 10) / 10}%`
    );
  } catch (err) {
    console.error("[DB] Error saving audit result:", err.message);
  }
}

/**
 * Check if all jobs in a batch are done and update status.
 */
function updateBatchStatus(batchId) {
  const conn = getDb();
  if (!conn) return;

  try {
    const batch = conn
      .prepare("SELECT total_records FROM batches WHERE batch_id = ?")
      .get(batchId);
    if (!batch) return;

    const doneCount = conn
      .prepare(
        "SELECT COUNT(*) as cnt FROM audit_results WHERE batch_id = ? AND status = 'done'"
      )
      .get(batchId).cnt;

    if (doneCount >= batch.total_records) {
      conn
        .prepare("UPDATE batches SET status = 'done' WHERE batch_id = ?")
        .run(batchId);
    }
  } catch (err) {
    console.error("[DB] Error updating batch status:", err.message);
  }
}

/**
 * Get result by job ID (for polling).
 */
export function getResultByJobId(jobId) {
  const conn = getDb();
  if (!conn) return null;

  try {
    const row = conn
      .prepare("SELECT * FROM audit_results WHERE job_id = ?")
      .get(jobId);

    if (!row) return null;
    return { ...row, audit_data: JSON.parse(row.audit_data) };
  } catch (err) {
    console.error("[DB] Error fetching result by job ID:", err.message);
    return null;
  }
}

/**
 * Get result by record number (for polling).
 */
export function getResultByRecordNumber(recordNumber) {
  const conn = getDb();
  if (!conn) return null;

  try {
    const row = conn
      .prepare(
        "SELECT * FROM audit_results WHERE record_number = ? ORDER BY created_at DESC LIMIT 1"
      )
      .get(recordNumber);

    if (!row) return null;
    return { ...row, audit_data: JSON.parse(row.audit_data) };
  } catch (err) {
    console.error("[DB] Error fetching result by record number:", err.message);
    return null;
  }
}
