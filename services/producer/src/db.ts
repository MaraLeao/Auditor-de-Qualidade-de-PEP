import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { errorMessage } from "./errorMessage.js";
import type { RawAuditResult } from "./transformer.js";

const DB_PATH = process.env.SQLITE_DB_PATH || path.join(process.cwd(), "..", "data", "auditor.db");

const SCHEMA_SQL = `
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
`;

interface AuditRow {
  id: number;
  batch_id: string;
  job_id: string;
  record_number: string;
  record_number_display: string | null;
  encounter: string | null;
  audit_data: string;
  conformity_percent: number;
  status: string;
  created_at: string;
}

export interface AuditRecord extends Omit<AuditRow, "audit_data"> {
  audit_data: RawAuditResult;
}

interface ConformityExtreme {
  record_number: string;
  value: number;
}

export interface DashboardStats {
  total_audits: number;
  avg_conformity: number;
  min_conformity: ConformityExtreme;
  max_conformity: ConformityExtreme;
}

export interface SaveAuditResultInput {
  batchId: string;
  jobId: string;
  recordNumber: string;
  recordNumberDisplay?: string;
  encounter?: string;
  auditData: unknown;
}

interface ConformityHolder {
  conformity_global?: { percent?: number };
}

interface ExtremeRow {
  record_number_display: string | null;
  conformity_percent: number;
}

let connection: Database.Database | null = null;

function getDb(): Database.Database | null {
  if (connection) return connection;

  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const opened = new Database(DB_PATH);
    opened.pragma("journal_mode = WAL");
    opened.pragma("foreign_keys = ON");
    opened.exec(SCHEMA_SQL);
    connection = opened;
    console.log(`[DB] SQLite initialized at ${DB_PATH}`);
    return connection;
  } catch (error) {
    console.error(`[DB] Failed to connect to SQLite at ${DB_PATH}:`, errorMessage(error));
    return null;
  }
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

function emptyStats(): DashboardStats {
  return {
    total_audits: 0,
    avg_conformity: 0,
    min_conformity: { record_number: "", value: 0 },
    max_conformity: { record_number: "", value: 0 },
  };
}

function parseRow(row: AuditRow): AuditRecord {
  return { ...row, audit_data: JSON.parse(row.audit_data) };
}

function toExtreme(row: ExtremeRow | undefined): ConformityExtreme {
  return {
    record_number: row?.record_number_display || "",
    value: row ? roundToTenth(row.conformity_percent) : 0,
  };
}

function extractConformityPercent(auditData: unknown): number {
  if (!auditData || typeof auditData !== "object") return 0;
  const source = auditData as ConformityHolder & { audit_data?: ConformityHolder };
  const data = source.audit_data || source;
  return data.conformity_global?.percent || 0;
}

/** Returns every stored audit, most recent first. */
export function getAllAudits(): AuditRecord[] {
  const conn = getDb();
  if (!conn) return [];

  try {
    const rows = conn
      .prepare(
        `SELECT id, batch_id, job_id, record_number, record_number_display,
                encounter, audit_data, conformity_percent, status, created_at
         FROM audit_results
         ORDER BY created_at DESC`,
      )
      .all() as AuditRow[];
    return rows.map(parseRow);
  } catch (error) {
    console.error("[DB] Error fetching all audits:", errorMessage(error));
    return [];
  }
}

/** Returns one audit by its database id, or null when it does not exist. */
export function getAuditById(id: number | string): AuditRecord | null {
  return findOne("SELECT * FROM audit_results WHERE id = ?", id, "audit by ID");
}

/** Returns the stored audit for a job id, or null. */
export function getResultByJobId(jobId: string): AuditRecord | null {
  return findOne("SELECT * FROM audit_results WHERE job_id = ?", jobId, "result by job ID");
}

/** Returns the most recent stored audit for a record number, or null. */
export function getResultByRecordNumber(recordNumber: string): AuditRecord | null {
  return findOne(
    "SELECT * FROM audit_results WHERE record_number = ? ORDER BY created_at DESC LIMIT 1",
    recordNumber,
    "result by record number",
  );
}

function findOne(sql: string, parameter: number | string, description: string): AuditRecord | null {
  const conn = getDb();
  if (!conn) return null;

  try {
    const row = conn.prepare(sql).get(parameter) as AuditRow | undefined;
    return row ? parseRow(row) : null;
  } catch (error) {
    console.error(`[DB] Error fetching ${description}:`, errorMessage(error));
    return null;
  }
}

/** Returns totals, the average and the lowest and highest conformity. */
export function getDashboardStats(): DashboardStats {
  const conn = getDb();
  if (!conn) return emptyStats();

  try {
    const { total } = conn.prepare("SELECT COUNT(*) AS total FROM audit_results").get() as { total: number };
    if (total === 0) return emptyStats();

    const { average } = conn.prepare("SELECT AVG(conformity_percent) AS average FROM audit_results").get() as {
      average: number | null;
    };
    const extreme = (direction: "ASC" | "DESC") =>
      conn
        .prepare(
          `SELECT record_number_display, conformity_percent FROM audit_results
           ORDER BY conformity_percent ${direction} LIMIT 1`,
        )
        .get() as ExtremeRow | undefined;

    return {
      total_audits: total,
      avg_conformity: average ? roundToTenth(average) : 0,
      min_conformity: toExtreme(extreme("ASC")),
      max_conformity: toExtreme(extreme("DESC")),
    };
  } catch (error) {
    console.error("[DB] Error fetching dashboard stats:", errorMessage(error));
    return emptyStats();
  }
}

/** Inserts an audit result, or updates it when the job id already exists. */
export function saveAuditResult(input: SaveAuditResultInput): void {
  const conn = getDb();
  if (!conn) return;

  const { batchId, jobId, recordNumber, recordNumberDisplay, encounter, auditData } = input;

  try {
    const conformityPercent = extractConformityPercent(auditData);
    const auditDataJson = JSON.stringify(auditData);
    const existing = conn.prepare("SELECT id FROM audit_results WHERE job_id = ?").get(jobId);

    if (existing) {
      conn
        .prepare("UPDATE audit_results SET audit_data = ?, conformity_percent = ?, status = 'done' WHERE job_id = ?")
        .run(auditDataJson, conformityPercent, jobId);
    } else {
      conn
        .prepare(
          `INSERT INTO audit_results
           (batch_id, job_id, record_number, record_number_display, encounter, audit_data, conformity_percent, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'done', ?)`,
        )
        .run(
          batchId,
          jobId,
          recordNumber,
          recordNumberDisplay || recordNumber,
          encounter || "",
          auditDataJson,
          conformityPercent,
          new Date().toISOString(),
        );
    }

    console.log(
      `[DB] Saved result for record ${recordNumber} (job ${jobId}), conformity: ${roundToTenth(conformityPercent)}%`,
    );
  } catch (error) {
    console.error("[DB] Error saving audit result:", errorMessage(error));
  }
}
