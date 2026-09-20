"""Persistência em SQLite: esquema sem a tabela `batches` e migração de bancos criados antes dela sair."""
import json
import sqlite3

import pytest

from worker.database import AuditDatabase

# Esquema de antes da remoção: `batches` + FOREIGN KEY em audit_results (é o que o volume Docker `audit-data`
# de quem já rodou o sistema contém).
ESQUEMA_ANTIGO = """
CREATE TABLE batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id TEXT UNIQUE NOT NULL,
    total_records INTEGER DEFAULT 0,
    status TEXT DEFAULT 'processing',
    created_at TEXT NOT NULL
);
CREATE TABLE audit_results (
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
CREATE INDEX idx_results_record ON audit_results(record_number);
"""


def _tabelas(path):
    conn = sqlite3.connect(path)
    try:
        return {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    finally:
        conn.close()


def _job(job_id, record="13.696.539"):
    return {"batch_id": "lote-1", "job_id": job_id, "record_number": record, "result": {"audit_data": {"conformity_global": {"percent": 80}}}}


def test_banco_novo_nao_tem_tabela_batches(tmp_path):
    path = str(tmp_path / "novo.db")
    AuditDatabase(path)
    assert "batches" not in _tabelas(path)
    assert "audit_results" in _tabelas(path)


def test_salvar_resultado_nao_exige_lote_previo(tmp_path):
    db = AuditDatabase(str(tmp_path / "novo.db"))
    db.save_result(_job("job-1"))
    linhas = db.get_all_results()
    assert [r["job_id"] for r in linhas] == ["job-1"]
    assert linhas[0]["conformity_percent"] == 80


def test_migra_banco_antigo_preservando_os_resultados(tmp_path):
    path = str(tmp_path / "antigo.db")
    conn = sqlite3.connect(path)
    conn.executescript(ESQUEMA_ANTIGO)
    conn.execute("INSERT INTO batches (batch_id, total_records, status, created_at) VALUES ('lote-0', 1, 'done', '2026-08-16T10:00:00')")
    conn.execute(
        "INSERT INTO audit_results (batch_id, job_id, record_number, record_number_display, encounter, audit_data, conformity_percent, status, created_at)"
        " VALUES ('lote-0', 'job-antigo', '19265867', '19.265.867', 'E1', ?, 55.5, 'done', '2026-08-16T10:00:01')",
        (json.dumps({"k": "v"}),),
    )
    conn.commit()
    conn.close()

    db = AuditDatabase(path)

    assert "batches" not in _tabelas(path)
    antigo = [r for r in db.get_all_results() if r["job_id"] == "job-antigo"]
    assert len(antigo) == 1 and antigo[0]["conformity_percent"] == 55.5 and antigo[0]["record_number_display"] == "19.265.867"
    # o ponto crítico: sem a migração, este INSERT falha, porque o lote não existe e a FK continua ativa
    db.save_result(_job("job-novo"))
    assert {r["job_id"] for r in db.get_all_results()} == {"job-antigo", "job-novo"}


def test_migracao_recria_os_indices_e_e_idempotente(tmp_path):
    path = str(tmp_path / "antigo.db")
    conn = sqlite3.connect(path)
    conn.executescript(ESQUEMA_ANTIGO)
    conn.commit()
    conn.close()

    AuditDatabase(path)
    AuditDatabase(path)  # segunda subida não pode falhar nem refazer nada

    conn = sqlite3.connect(path)
    try:
        indices = {r[1] for r in conn.execute("SELECT * FROM sqlite_master WHERE type='index'")}
        fks = conn.execute("PRAGMA foreign_key_list(audit_results)").fetchall()
    finally:
        conn.close()
    assert {"idx_results_record", "idx_results_batch", "idx_results_job"} <= indices
    assert fks == []


@pytest.mark.parametrize("campo", ["total_in_batch"])
def test_worker_nao_depende_mais_de_campo_de_lote(campo):
    import worker.worker as w

    assert not hasattr(w.db, "ensure_batch"), "ensure_batch deveria ter saído junto com a tabela"
    assert campo not in open(w.__file__, encoding="utf-8").read()
