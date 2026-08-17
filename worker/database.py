import sqlite3
import json
import os
import sys
from datetime import datetime


DB_PATH = os.environ.get("SQLITE_DB_PATH", "/app/data/auditor.db")


class AuditDatabase:
    """SQLite database for persisting audit results."""

    def __init__(self, db_path=None):
        self.db_path = db_path or DB_PATH
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_conn(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn

    def _init_db(self):
        conn = self._get_conn()
        try:
            conn.executescript("""
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
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (batch_id) REFERENCES batches(batch_id)
                );

                CREATE INDEX IF NOT EXISTS idx_results_record ON audit_results(record_number);
                CREATE INDEX IF NOT EXISTS idx_results_batch ON audit_results(batch_id);
                CREATE INDEX IF NOT EXISTS idx_results_job ON audit_results(job_id);
            """)
            conn.commit()
            sys.stderr.write(f"[DB] SQLite initialized at {self.db_path}\n")
        finally:
            conn.close()

    def ensure_batch(self, batch_id, total_records=0):
        """Create or update a batch record."""
        conn = self._get_conn()
        try:
            existing = conn.execute(
                "SELECT id FROM batches WHERE batch_id = ?", (batch_id,)
            ).fetchone()
            if not existing:
                conn.execute(
                    "INSERT INTO batches (batch_id, total_records, status, created_at) VALUES (?, ?, 'processing', ?)",
                    (batch_id, total_records, datetime.utcnow().isoformat())
                )
                conn.commit()
        finally:
            conn.close()

    def save_result(self, job):
        """Save a completed audit result to the database."""
        conn = self._get_conn()
        try:
            batch_id = job.get("batch_id", "unknown")
            job_id = job.get("job_id", "unknown")
            record_number = job.get("record_number", "unknown")
            record_number_display = job.get("record_number_display", record_number)
            encounter = job.get("encounter", "")
            audit_data = job.get("result", {})
            
            # Extract conformity percentage from the audit data
            conformity_percent = 0
            if isinstance(audit_data, dict):
                ad = audit_data.get("audit_data", audit_data)
                cg = ad.get("conformity_global", {})
                conformity_percent = cg.get("percent", 0)

            audit_data_json = json.dumps(audit_data, ensure_ascii=False)

            # Upsert: if the job_id already exists, update it
            existing = conn.execute(
                "SELECT id FROM audit_results WHERE job_id = ?", (job_id,)
            ).fetchone()

            if existing:
                conn.execute(
                    """UPDATE audit_results 
                       SET audit_data = ?, conformity_percent = ?, status = 'done'
                       WHERE job_id = ?""",
                    (audit_data_json, conformity_percent, job_id)
                )
            else:
                conn.execute(
                    """INSERT INTO audit_results 
                       (batch_id, job_id, record_number, record_number_display, encounter, audit_data, conformity_percent, status, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, 'done', ?)""",
                    (batch_id, job_id, record_number, record_number_display, encounter,
                     audit_data_json, conformity_percent, datetime.utcnow().isoformat())
                )

            conn.commit()

            # Check if all jobs in the batch are done
            self._update_batch_status(conn, batch_id)

            sys.stderr.write(f"[DB] Saved result for record {record_number} (job {job_id})\n")
        finally:
            conn.close()

    def _update_batch_status(self, conn, batch_id):
        """Check if all records in a batch are done and update batch status."""
        batch = conn.execute(
            "SELECT total_records FROM batches WHERE batch_id = ?", (batch_id,)
        ).fetchone()
        if not batch:
            return

        done_count = conn.execute(
            "SELECT COUNT(*) as cnt FROM audit_results WHERE batch_id = ? AND status = 'done'",
            (batch_id,)
        ).fetchone()["cnt"]

        if done_count >= batch["total_records"]:
            conn.execute(
                "UPDATE batches SET status = 'done' WHERE batch_id = ?", (batch_id,)
            )
            conn.commit()

    def get_all_results(self):
        """Retrieve all audit results, most recent first."""
        conn = self._get_conn()
        try:
            rows = conn.execute(
                """SELECT id, batch_id, job_id, record_number, record_number_display,
                          encounter, audit_data, conformity_percent, status, created_at
                   FROM audit_results
                   ORDER BY created_at DESC"""
            ).fetchall()
            results = []
            for row in rows:
                item = dict(row)
                item["audit_data"] = json.loads(item["audit_data"])
                results.append(item)
            return results
        finally:
            conn.close()

    def get_result_by_record(self, record_number):
        """Get the latest audit result for a given record number."""
        conn = self._get_conn()
        try:
            row = conn.execute(
                """SELECT * FROM audit_results
                   WHERE record_number = ?
                   ORDER BY created_at DESC LIMIT 1""",
                (record_number,)
            ).fetchone()
            if row:
                item = dict(row)
                item["audit_data"] = json.loads(item["audit_data"])
                return item
            return None
        finally:
            conn.close()

    def get_result_by_job(self, job_id):
        """Get audit result for a specific job ID."""
        conn = self._get_conn()
        try:
            row = conn.execute(
                "SELECT * FROM audit_results WHERE job_id = ?", (job_id,)
            ).fetchone()
            if row:
                item = dict(row)
                item["audit_data"] = json.loads(item["audit_data"])
                return item
            return None
        finally:
            conn.close()

    def get_dashboard_stats(self):
        """Calculate aggregated dashboard statistics."""
        conn = self._get_conn()
        try:
            total = conn.execute("SELECT COUNT(*) as cnt FROM audit_results").fetchone()["cnt"]
            
            if total == 0:
                return {
                    "total_audits": 0,
                    "avg_conformity": 0,
                    "min_conformity": {"record_number": "", "value": 0},
                    "max_conformity": {"record_number": "", "value": 0},
                }

            avg = conn.execute(
                "SELECT AVG(conformity_percent) as avg_val FROM audit_results"
            ).fetchone()["avg_val"]

            worst = conn.execute(
                "SELECT record_number_display, conformity_percent FROM audit_results ORDER BY conformity_percent ASC LIMIT 1"
            ).fetchone()

            best = conn.execute(
                "SELECT record_number_display, conformity_percent FROM audit_results ORDER BY conformity_percent DESC LIMIT 1"
            ).fetchone()

            return {
                "total_audits": total,
                "avg_conformity": round(avg, 1) if avg else 0,
                "min_conformity": {
                    "record_number": worst["record_number_display"] if worst else "",
                    "value": round(worst["conformity_percent"], 1) if worst else 0
                },
                "max_conformity": {
                    "record_number": best["record_number_display"] if best else "",
                    "value": round(best["conformity_percent"], 1) if best else 0
                }
            }
        finally:
            conn.close()
