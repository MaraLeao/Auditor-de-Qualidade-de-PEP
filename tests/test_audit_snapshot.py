"""Snapshot da auditoria completa (regras + IA falsa) sobre todos os registros do dataset congelado (tests/fixtures).

Este é o teste que protege a refatoração: a saída de `run_audit` tem que continuar
IDÊNTICA em todas as fases. Se um teste daqui falhar depois de um refactor, o refactor
mudou comportamento — a menos que a mudança tenha sido decidida e aprovada (aí, regrave
com UPDATE_SNAPSHOTS=1 num commit separado).
"""
import pytest

from data_extract.main import run_audit
from tests.conftest import normalize_audit, records_of

TODOS = None  # todos os prontuários do dataset congelado
SUBSET = ("94.098.934", "62.407.871", "60.616.859")  # com cirurgia, placeholders resolvidos, várias falhas

CASOS = [
    ("ok_mix", TODOS),
    ("all_null", TODOS),
    ("timeout", TODOS),
    ("invalid_json", SUBSET),
    ("missing_keys", SUBSET),
]


@pytest.mark.parametrize("scenario,prontuarios", CASOS, ids=[c[0] for c in CASOS])
def test_audit_output_is_frozen(scenario, prontuarios, all_records, audit_env, snapshot):
    audit_env(scenario)
    records = all_records if prontuarios is None else records_of(all_records, *prontuarios)
    result = normalize_audit(run_audit(records))
    snapshot(f"audit_{scenario}", result)


def test_audit_is_deterministic(all_records, audit_env):
    """Duas execuções iguais dão saída igual (sem dependência de ordem, relógio ou aleatoriedade)."""
    audit_env("ok_mix")
    a = normalize_audit(run_audit(all_records))
    b = normalize_audit(run_audit(all_records))
    assert a == b


def test_one_result_per_prontuario_in_input_order(all_records, audit_env):
    audit_env("all_null")
    result = run_audit(all_records)
    ordem = list(dict.fromkeys(r["Prontuário"] for r in all_records))
    assert [r["record_id"] for r in result] == ordem
    assert len(result) == len(ordem)
