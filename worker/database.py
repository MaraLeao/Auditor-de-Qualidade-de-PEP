import json
import os
import sqlite3
import sys
from datetime import UTC, datetime


def _agora_utc():
    """UTC sem fuso no texto, igual ao antigo datetime.utcnow() (depreciado): o formato gravado não muda."""
    return datetime.now(UTC).replace(tzinfo=None).isoformat()


DB_PATH = os.environ.get("SQLITE_DB_PATH", "/app/data/auditor.db")


COLUNAS_AUDIT_RESULTS = (
    "id", "batch_id", "job_id", "record_number", "record_number_display",
    "encounter", "audit_data", "conformity_percent", "status", "created_at",
)

# `batch_id` continua em cada resultado (agrupa uma execução com GROUP BY), mas sem tabela `batches`:
# o progresso de um lote sai do polling por job_id, e ninguém lia o status gravado nela.
ESQUEMA_AUDIT_RESULTS = """
    CREATE TABLE {se_nao_existe} {nome} (
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
"""

# Usuários do sistema web. `senha_hash` é o hash argon2id completo (com sal e parâmetros), nunca a senha.
# `criado_por` aponta para o administrador que criou a conta (NULL no primeiro administrador).
ESQUEMA_USERS = """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        nome TEXT NOT NULL,
        senha_hash TEXT NOT NULL,
        papel TEXT NOT NULL CHECK (papel IN ('auditor', 'admin')),
        ativo INTEGER NOT NULL DEFAULT 1,
        deve_trocar_senha INTEGER NOT NULL DEFAULT 1,
        criado_por INTEGER REFERENCES users(id),
        criado_em TEXT NOT NULL,
        ultimo_login TEXT
    );
"""

INDICES = """
    CREATE INDEX IF NOT EXISTS idx_results_record ON audit_results(record_number);
    CREATE INDEX IF NOT EXISTS idx_results_batch ON audit_results(batch_id);
    CREATE INDEX IF NOT EXISTS idx_results_job ON audit_results(job_id);
"""


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
            conn.executescript(ESQUEMA_AUDIT_RESULTS.format(nome="audit_results", se_nao_existe="IF NOT EXISTS"))
            self._migrar_remover_batches(conn)
            conn.executescript(ESQUEMA_USERS)
            conn.executescript(INDICES)
            conn.commit()
            sys.stderr.write(f"[DB] SQLite initialized at {self.db_path}\n")
        finally:
            conn.close()

    @staticmethod
    def _migrar_remover_batches(conn):
        """Bancos antigos têm a tabela `batches` e uma FOREIGN KEY em audit_results apontando para ela.

        Sem migrar, todo INSERT novo falharia (o lote deixou de ser criado e a FK segue ativa). O SQLite não
        remove FK por ALTER, então a tabela é reconstruída; os resultados são copiados como estão.
        Não faz nada em banco novo ou já migrado.
        """
        tem_fk = conn.execute("PRAGMA foreign_key_list(audit_results)").fetchall()
        tem_batches = conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='batches'").fetchone()
        if not tem_fk and not tem_batches:
            return
        colunas = ", ".join(COLUNAS_AUDIT_RESULTS)
        # foreign_keys=OFF só vale fora de transação; o executescript faz o COMMIT pendente antes de rodar
        conn.executescript(
            "PRAGMA foreign_keys=OFF;"
            "BEGIN;"
            + ESQUEMA_AUDIT_RESULTS.format(nome="audit_results_novo", se_nao_existe="")
            + f"INSERT INTO audit_results_novo ({colunas}) SELECT {colunas} FROM audit_results;"
            "DROP TABLE audit_results;"
            "ALTER TABLE audit_results_novo RENAME TO audit_results;"
            "DROP TABLE IF EXISTS batches;"
            "COMMIT;"
            "PRAGMA foreign_keys=ON;"
        )

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
                     audit_data_json, conformity_percent, _agora_utc())
                )

            conn.commit()

            sys.stderr.write(f"[DB] Saved result for record {record_number} (job {job_id})\n")
        finally:
            conn.close()

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
