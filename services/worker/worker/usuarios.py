"""Usuários do sistema web e o seed inicial.

Rodar (da raiz do projeto, com o .venv ativo):

    python -m worker.usuarios                       # 1 administrador + 2 auditores de exemplo
    python -m worker.usuarios --auditores 0         # só o administrador
    ADMIN_PASSWORD='...' python -m worker.usuarios  # usa a senha informada no administrador

Regras que o script segue:
- Só o administrador cria usuários: os auditores levam o admin em `criado_por`.
- Senha nunca é gravada em texto: só o hash argon2id (o `argon2` do Node lê o mesmo formato).
- Sem senha padrão no código: cada senha é sorteada e mostrada UMA vez, na saída do comando.
- Idempotente: quem já existe não é recriado nem tem a senha trocada.
- Em AMBIENTE=producao recusa criar os auditores de exemplo.

O banco fica em SQLITE_DB_PATH (padrão `data/auditor.db`). Esse arquivo guarda hash de senha e,
depois, trechos de prontuário: não o versione.
"""
import argparse
import os
import secrets
import sqlite3
import sys
from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from argon2 import PasswordHasher

from worker.database import AuditDatabase, _agora_utc

_hasher = PasswordHasher()  # argon2id, com os parâmetros padrão da biblioteca

EMAIL_ADMIN_PADRAO = "admin@auditor.local"
DOMINIO_EXEMPLO = "auditor.local"


@dataclass
class Credencial:
    email: str
    papel: str
    senha: str | None  # None quando o usuário já existia: a senha antiga não é conhecida nem alterada
    criado: bool


def gerar_senha() -> str:
    return secrets.token_urlsafe(15)  # 20 caracteres, ~120 bits


def _conectar(db_path: str) -> sqlite3.Connection:
    AuditDatabase(db_path)  # garante o esquema (inclui a tabela users)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def _garantir(
    conn: sqlite3.Connection, email: str, nome: str, papel: str, senha: str | None, criado_por: int | None
) -> tuple[int, Credencial]:
    existente = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()  # NOCASE na coluna
    if existente:
        return existente["id"], Credencial(email, papel, None, False)
    senha = senha or gerar_senha()
    cur = conn.execute(
        "INSERT INTO users (email, nome, senha_hash, papel, criado_por, criado_em) VALUES (?, ?, ?, ?, ?, ?)",
        (email, nome, _hasher.hash(senha), papel, criado_por, _agora_utc()),
    )
    assert cur.lastrowid is not None
    return cur.lastrowid, Credencial(email, papel, senha, True)


def semear(
    db_path: str,
    admin_email: str = EMAIL_ADMIN_PADRAO,
    admin_senha: str | None = None,
    n_auditores: int = 2,
) -> list[Credencial]:
    """Cria o administrador e, por ele, os auditores de exemplo. Devolve as credenciais na ordem de criação."""
    conn = _conectar(db_path)
    try:
        admin_id, cred_admin = _garantir(conn, admin_email, "Administrador", "admin", admin_senha, None)
        credenciais = [cred_admin]
        for i in range(1, n_auditores + 1):
            _, cred = _garantir(conn, f"auditor{i}@{DOMINIO_EXEMPLO}", f"Auditor {i}", "auditor", None, admin_id)
            credenciais.append(cred)
        conn.commit()
        return credenciais
    finally:
        conn.close()


def _imprimir(credenciais: list[Credencial], senha_informada: str | None) -> None:
    print("\nUsuários do sistema")
    print("Cada senha só aparece agora e não será exibida de novo. Anote antes de fechar o terminal.\n")
    print(f"{'e-mail':<28}{'papel':<10}senha")
    for c in credenciais:
        if c.senha is None:  # já existia
            texto = "(já existia; senha mantida)"
        elif c.senha == senha_informada:
            texto = "(a informada em ADMIN_PASSWORD)"
        else:
            texto = c.senha
        print(f"{c.email:<28}{c.papel:<10}{texto}")
    print("\nTodos devem trocar a senha no primeiro login.")


def main(argv: Sequence[str] | None = None, env: Mapping[str, str] | None = None) -> int:
    env = os.environ if env is None else env
    parser = argparse.ArgumentParser(description="Cria o administrador e auditores de exemplo.")
    parser.add_argument("--db", default=env.get("SQLITE_DB_PATH", "data/auditor.db"), help="caminho do banco SQLite")
    parser.add_argument("--admin-email", default=env.get("ADMIN_EMAIL", EMAIL_ADMIN_PADRAO))
    parser.add_argument("--auditores", type=int, default=2, help="quantos auditores de exemplo criar (padrão: 2)")
    args = parser.parse_args(argv)

    if env.get("AMBIENTE") == "producao" and args.auditores > 0:
        print(
            "Recusado: em AMBIENTE=producao não se criam auditores de exemplo. Use --auditores 0.",
            file=sys.stderr,
        )
        return 2

    senha_admin = env.get("ADMIN_PASSWORD") or None
    credenciais = semear(args.db, args.admin_email, senha_admin, args.auditores)
    _imprimir(credenciais, senha_admin)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
