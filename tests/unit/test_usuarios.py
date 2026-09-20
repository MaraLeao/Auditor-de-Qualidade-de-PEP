"""Usuários e seed: o administrador cria os auditores, e nenhuma senha é guardada em texto."""
import sqlite3

import pytest
from argon2 import PasswordHasher

from worker.usuarios import main, semear


def _conn(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


def _todos(path):
    conn = _conn(path)
    try:
        return [dict(r) for r in conn.execute("SELECT * FROM users ORDER BY id")]
    finally:
        conn.close()


def test_seed_cria_um_admin_e_dois_auditores(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path)
    usuarios = _todos(path)
    assert [u["papel"] for u in usuarios] == ["admin", "auditor", "auditor"]
    assert len({u["email"] for u in usuarios}) == 3


def test_auditores_sao_criados_pelo_admin(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path)
    admin, *auditores = _todos(path)
    assert admin["criado_por"] is None
    assert all(a["criado_por"] == admin["id"] for a in auditores)


def test_senha_nao_fica_em_texto_e_confere_com_argon2id(tmp_path):
    path = str(tmp_path / "a.db")
    credenciais = semear(path)
    por_email = {u["email"]: u for u in _todos(path)}
    for c in credenciais:
        hash_guardado = por_email[c.email]["senha_hash"]
        assert hash_guardado.startswith("$argon2id$")
        assert c.senha not in hash_guardado
        assert PasswordHasher().verify(hash_guardado, c.senha)  # levanta se não conferir


def test_senhas_geradas_sao_distintas_e_longas(tmp_path):
    credenciais = semear(str(tmp_path / "a.db"))
    senhas = [c.senha for c in credenciais]
    assert len(set(senhas)) == len(senhas)
    assert all(len(s) >= 16 for s in senhas)


def test_senha_do_admin_pode_vir_de_fora(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path, admin_senha="uma-senha-longa-e-minha")
    admin = _todos(path)[0]
    assert PasswordHasher().verify(admin["senha_hash"], "uma-senha-longa-e-minha")


def test_todos_devem_trocar_a_senha_no_primeiro_login(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path)
    assert all(u["deve_trocar_senha"] == 1 and u["ativo"] == 1 for u in _todos(path))


def test_seed_e_idempotente_e_nao_troca_senha_de_quem_ja_existe(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path)
    antes = _todos(path)

    segunda = semear(path)

    assert _todos(path) == antes  # nenhum hash mudou, nenhum usuário novo
    assert all(c.criado is False and c.senha is None for c in segunda)


def test_email_e_unico_sem_diferenciar_maiusculas(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path, admin_email="Admin@Auditor.Local")
    semear(path, admin_email="admin@auditor.local")
    assert sum(u["papel"] == "admin" for u in _todos(path)) == 1


def test_banco_recusa_papel_desconhecido(tmp_path):
    path = str(tmp_path / "a.db")
    semear(path)
    conn = _conn(path)
    try:
        with pytest.raises(sqlite3.IntegrityError):
            conn.execute(
                "INSERT INTO users (email, nome, senha_hash, papel, criado_em) VALUES ('x@y', 'X', 'h', 'superusuario', 'agora')"
            )
    finally:
        conn.close()


def test_cli_imprime_cada_senha_uma_vez_e_avisa(tmp_path, capsys):
    path = str(tmp_path / "a.db")
    assert main(["--db", path], env={}) == 0
    saida = capsys.readouterr().out
    for u in _todos(path):
        assert u["email"] in saida
    assert "não será exibida de novo" in saida.lower() or "nao sera exibida de novo" in saida.lower()


def test_cli_nao_reimprime_senha_de_quem_ja_existia(tmp_path, capsys):
    path = str(tmp_path / "a.db")
    main(["--db", path], env={})
    capsys.readouterr()
    main(["--db", path], env={})
    assert "já existia" in capsys.readouterr().out


def test_cli_recusa_criar_auditores_de_exemplo_em_producao(tmp_path, capsys):
    path = str(tmp_path / "a.db")
    assert main(["--db", path], env={"AMBIENTE": "producao"}) != 0
    assert not (tmp_path / "a.db").exists() or _todos(path) == []


def test_cli_em_producao_cria_so_o_admin_quando_pedido(tmp_path):
    path = str(tmp_path / "a.db")
    assert main(["--db", path, "--auditores", "0"], env={"AMBIENTE": "producao", "ADMIN_PASSWORD": "senha-de-producao-longa"}) == 0
    assert [u["papel"] for u in _todos(path)] == ["admin"]
