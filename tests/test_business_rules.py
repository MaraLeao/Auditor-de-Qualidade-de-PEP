"""Regras de negócio decididas na fase N (itens 1–15 do plano). Fonte das regras:
evaluation/data/prompt-agente-auditor-originaal.txt (3.2, 3.4, 3.5, 3.6, 3.7 e Seção D)."""
import pytest

from data_extract.core import auditor, llm_client
from data_extract.core.auditor import aggregate_evolutions, calculate_conformity
from data_extract.core.temporal import check_criacao_anamnese, check_evolucao_diaria
from data_extract.keywords.exame_fisico import TERMOS_EXAME_FISICO_ENFERMAGEM, TERMOS_EXAME_FISICO_MEDICINA
from data_extract.utils.helpers import check_exame_fisico_completo

BASE = {
    "Prontuário": "1.111.111", "Atendimento": "1", "Data De Nascimento pact": "1/1/1950",
    "Data da internação": "10/01/2025, 10:00", "Data de saída": "13/01/2025, 10:00",
    "Especialidade cirurgia": "", "UF cirurgia": "", "Unidade Funcional Internaçao": "UF",
    "Cid procedimento": "", "Procedimento cirurgico Realizado": "",
    "Data Inicio Cirurgia": "", "Data Fim Cirurgia": "", "Descrição Cirurgica": "",
}
CIRURGIA = {"Especialidade cirurgia": "Ortopedia", "UF cirurgia": "BLOCO", "Data Inicio Cirurgia": "11/01/2025, 08:00",
            "Data Fim Cirurgia": "11/01/2025, 10:00", "Cid procedimento": "S72.1", "Procedimento cirurgico Realizado": "Osteossíntese"}
DESC_CIRURGICA = "passo a passo da cirurgia com mais de cinquenta caracteres com certeza sim"
EXAME_MEDICO = "estado geral bom, acv: ritmo regular, ar: mv presente, abd: flácido, ext: sem edemas"
EXAME_ENFERMAGEM = ("consciente e orientada, pele corada, eupneica, pulsos presentes, abdome flácido com dieta aceita, "
                    "diurese presente, deambulando, braden 15")


def rec(cat, tipo, desc, quando="10/01/2025, 10:00", **extra):
    return {**BASE, "Categoria Profissional": cat, "Tipo do registro": tipo,
            "Descricao do registro": desc, "criacao_anamnsese": quando, **extra}


def audit(records):
    return auditor.audit_medical_records(records)[0]["audit_data"]


def ai_answers(mapa):
    """LLM falso que responde `mapa[campo]` (default: null) — devolve o scenario para audit_env."""
    def scenario(payload, campos):
        return "ok", {c: mapa.get(c) for c in campos}, None
    return scenario


# ── Item 1: só "conforme" e "não conforme"; a IA explica o porquê ───────────
def test_item01_only_conforme_counts_as_valid():
    data = calculate_conformity({"secao_b_anamnese": {
        "hda": "não conforme (IA: x)", "hd_cid": "Incompleto (Faltam: ACV)",
        "ap_app": "Não registrado", "af": "conforme"}})
    assert data["conformity_b_anamnese"] == {"total": 7, "valid": 1, "percent": 1 / 7 * 100}


@pytest.mark.parametrize("resposta_ia,motivo", [
    ("não conforme: faltou o exame do abdome", "faltou o exame do abdome"),
    ("não conforme (incompleto)", "incompleto"),
    ("incompleto: sem sistemas básicos", "sem sistemas básicos"),
])
def test_item01_ai_incomplete_or_nonconforming_becomes_nao_conforme_with_reason(audit_env, resposta_ia, motivo):
    audit_env(ai_answers({"hda": resposta_ia}))
    d = audit([rec("MEDICINA", "Anamnese", "texto")])
    assert d["secao_b_anamnese"]["hda"] == f"não conforme (IA: {motivo})"


def test_item01_rule_based_exam_says_nao_conforme_not_incompleto():
    r = check_exame_fisico_completo("estado geral bom", TERMOS_EXAME_FISICO_MEDICINA)
    assert r.startswith("não conforme (Faltam:") and "Incompleto" not in r


# ── Item 2: anamnese em até 12h (regra 3.5) ─────────────────────────────────
@pytest.mark.parametrize("criacao,esperado", [
    ("10/01/2025, 22:00", "conforme"),                       # exatamente 12h
    ("10/01/2025, 22:01", "não conforme (criada 12h01 após a internação; prazo de 12h)"),
    ("11/01/2025, 09:00", "não conforme (criada 23h após a internação; prazo de 12h)"),
    ("10/01/2025, 10:00", "conforme"),
])
def test_item02_anamnese_creation_deadline(criacao, esperado):
    assert check_criacao_anamnese("10/01/2025, 10:00", criacao) == esperado


def test_item02_applies_to_medical_and_nursing_anamnese(audit_env):
    audit_env("all_null")
    d = audit([rec("MEDICINA", "Anamnese", "x", quando="11/01/2025, 09:00"),
               rec("ENFERMAGEM", "Anamnese", "x", quando="10/01/2025, 20:00")])
    assert d["secao_b_anamnese"]["criacao_anamnese"].startswith("não conforme (criada 23h")
    assert d["secao_d_anamnese"]["criacao_anamnese"] == "conforme"


def test_item02_missing_dates_is_not_registered_and_never_sent_to_ai(audit_env):
    calls = audit_env("all_null")
    d = audit([rec("MEDICINA", "Anamnese", "x", quando="")])
    assert d["secao_b_anamnese"]["criacao_anamnese"] == "Não registrado"
    assert not any("criacao_anamnese" in c["campos"] for c in calls)


# ── Item 3: evolução diária em janelas de 24h (regra 3.6) ───────────────────
INT, ALTA = "15/03/2024, 14:30", "19/03/2024, 10:00"


def test_item03_daily_evolutions_are_conforme():
    assert check_evolucao_diaria(INT, ALTA, [INT], ["16/03/2024, 14:30", "17/03/2024, 14:30", "18/03/2024, 14:30"]) == "conforme"


def test_item03_missing_day_names_the_window():
    r = check_evolucao_diaria(INT, ALTA, [INT], ["16/03/2024, 14:30", "18/03/2024, 14:30"])
    assert r == "não conforme (sem evolução entre 17/03 14:30 e 18/03 14:30)"


def test_item03_stay_of_three_days_needs_two_evolutions_but_accepts_three():
    intern, alta = "20/03/2025, 08:00", "23/03/2025, 08:00"           # 3 dias
    dois = ["21/03/2025, 08:00", "22/03/2025, 08:00"]
    assert check_evolucao_diaria(intern, alta, [intern], dois) == "conforme"
    assert check_evolucao_diaria(intern, alta, [intern], dois + ["22/03/2025, 20:00"]) == "conforme"
    assert check_evolucao_diaria(intern, alta, [intern], dois[:1]).startswith("não conforme")


def test_item03_without_first_day_anamnese_counting_starts_at_admission():
    intern, alta = "20/03/2025, 08:00", "22/03/2025, 08:00"
    com_anamnese = check_evolucao_diaria(intern, alta, [intern], ["21/03/2025, 08:00"])
    sem_anamnese = check_evolucao_diaria(intern, alta, [], ["21/03/2025, 08:00"])
    assert com_anamnese == "conforme"
    assert sem_anamnese == "não conforme (sem evolução entre 20/03 08:00 e 21/03 08:00)"


def test_item03_late_anamnese_does_not_exempt_the_first_window():
    intern, alta = "20/03/2025, 08:00", "22/03/2025, 08:00"
    assert check_evolucao_diaria(intern, alta, ["21/03/2025, 09:00"], ["21/03/2025, 09:00"]).startswith("não conforme")


def test_item03_missing_discharge_date_is_not_registered():
    assert check_evolucao_diaria(INT, "", [INT], []) == "Não registrado"


def test_item03_audit_uses_medical_for_frequencia_and_nursing_for_criacao_evolucao(audit_env):
    audit_env("all_null")
    d = audit([
        rec("MEDICINA", "Anamnese", "x", quando="10/01/2025, 10:00"),
        rec("MEDICINA", "Evolução", "a", quando="11/01/2025, 10:00"),
        rec("MEDICINA", "Evolução", "b", quando="12/01/2025, 10:00"),
        rec("ENFERMAGEM", "Anamnese", "x", quando="10/01/2025, 10:00"),
        rec("ENFERMAGEM", "Evolução", "c", quando="12/01/2025, 10:00"),
    ])
    assert d["secao_b_evolucao"]["frequencia_diaria"] == "conforme"
    assert d["secao_d_evolucao"]["criacao_evolucao"] == "não conforme (sem evolução entre 11/01 10:00 e 12/01 10:00)"


def test_item03_every_evolution_must_be_conforme_and_reason_names_the_day():
    r = aggregate_evolutions([
        ("11/01", {"exame_fisico": "conforme", "hd_cid": "conforme (IA: HD x)"}),
        ("12/01", {"exame_fisico": "não conforme (Faltam: Abdome)", "hd_cid": "conforme"}),
        ("13/01", {"exame_fisico": "não conforme (Faltam: Extremidades)", "hd_cid": "Não registrado (IA: null)"}),
    ])
    assert r["exame_fisico"] == "não conforme (Faltam: Abdome — dia 12/01, 13/01)"
    assert r["hd_cid"] == "não conforme (IA: null — dia 13/01)"


def test_item03_aggregation_keeps_ai_signature_when_all_conform():
    r = aggregate_evolutions([("11/01", {"c": "conforme (IA: trecho)"}), ("12/01", {"c": "conforme"})])
    assert r["c"] == "conforme (IA: trecho)"


def test_item03_aggregation_keeps_not_registered_when_no_evolution_has_it():
    r = aggregate_evolutions([("11/01", {"c": "Não registrado (IA: null)"}), ("12/01", {"c": "Não registrado (IA: null)"})])
    assert r["c"] == "Não registrado (IA: null)"


def test_item03_ai_failure_signature_survives_aggregation():
    r = aggregate_evolutions([("11/01", {"c": "conforme"}), ("12/01", {"c": "Não registrado (IA_NAO_EXECUTADA: timeout)"})])
    assert "IA_NAO_EXECUTADA: timeout" in r["c"] and "dia 12/01" in r["c"]


# ── Item 4: exame físico completo = ao menos uma palavra de CADA sistema ────
def test_item04_complete_medical_exam():
    assert check_exame_fisico_completo(EXAME_MEDICO, TERMOS_EXAME_FISICO_MEDICINA) == "conforme"


def test_item04_medical_needs_all_five_systems():
    r = check_exame_fisico_completo("estado geral bom, acv: rcr, abd: flácido", TERMOS_EXAME_FISICO_MEDICINA)
    assert r == "não conforme (Faltam: Respiratório, Extremidades)"


def test_item04_whole_word_only_regular_is_not_ar():
    r = check_exame_fisico_completo("regular", TERMOS_EXAME_FISICO_MEDICINA)
    assert "Respiratório" in r and "Geral" in r     # "regular" não é "ar" nem "reg"


def test_item04_anestesia_geral_is_not_the_general_exam():
    r = check_exame_fisico_completo("sob anestesia geral", TERMOS_EXAME_FISICO_MEDICINA)
    assert "Geral" in r


def test_item04_accents_and_case_do_not_matter():
    r = check_exame_fisico_completo("ESTADO GERAL; ACV rcr; ABDÔMEN flácido; EXTREMIDADES; Murmúrio Vesicular",
                                    TERMOS_EXAME_FISICO_MEDICINA)
    assert r == "conforme"


def test_item04_nursing_has_eight_systems_including_escalas():
    assert check_exame_fisico_completo(EXAME_ENFERMAGEM, TERMOS_EXAME_FISICO_ENFERMAGEM) == "conforme"
    sem_escalas = EXAME_ENFERMAGEM.replace("braden 15", "")
    assert check_exame_fisico_completo(sem_escalas, TERMOS_EXAME_FISICO_ENFERMAGEM) == "não conforme (Faltam: Escalas)"
    assert len(TERMOS_EXAME_FISICO_ENFERMAGEM) == 8 and len(TERMOS_EXAME_FISICO_MEDICINA) == 5


# ── Item 5: "sem queixas" é registro de queixa (regra intencional) ──────────
def test_item05_sem_queixas_counts_as_queixas_registered(audit_env):
    audit_env("all_null")
    d = audit([rec("MEDICINA", "Evolução", "paciente sem queixas.")])
    assert d["secao_b_evolucao"]["procedimentos_condutas_queixas"] == "conforme"


# ── Itens 6 e 7: curativo só na evolução de enfermagem ──────────────────────
def test_item06_curativo_is_only_evaluated_in_nursing_evolution(audit_env):
    audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Anamnese", "curativo simples tamanho exsudato necrose")])
    assert "curativo" not in d["secao_d_anamnese"]
    assert "curativo" not in d["conformity_d_anamnese"]


def test_item07_curativo_conforme_needs_type_and_the_three_details(audit_env):
    audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Evolução", "curativo simples, tamanho 3cm, exsudato seroso, sem necrose")])
    assert d["secao_d_evolucao"]["curativo"] == "conforme (Curativo simples)"


def test_item07_type_found_but_incomplete_is_nao_conforme_with_reason(audit_env):
    audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Evolução", "curativo especial com exsudato")])
    assert d["secao_d_evolucao"]["curativo"] == "não conforme (Curativo especial; faltou: tamanho, necrose — dia 10/01)"


def test_item07_type_not_identified_goes_to_ai(audit_env):
    calls = audit_env(ai_answers({"curativo": "Curativo simples"}))
    d = audit([rec("ENFERMAGEM", "Evolução", "curativo oclusivo seco")])
    assert any("curativo" in c["campos"] for c in calls)
    assert d["secao_d_evolucao"]["curativo"] == "conforme (IA: Curativo simples)"


def test_item07_ai_cannot_identify_type_is_nao_conforme(audit_env):
    audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Evolução", "curativo oclusivo seco")])
    assert d["secao_d_evolucao"]["curativo"] == "não conforme (IA: tipo de curativo não identificado — dia 10/01)"


def test_item07_no_curativo_is_not_applicable_and_never_sent_to_ai(audit_env):
    calls = audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Evolução", "ferida operatória limpa e seca, analgesia simples")])
    assert d["secao_d_evolucao"]["curativo"] == "Não se aplica"
    assert not any("curativo" in c["campos"] for c in calls)


# ── Item 8: OPME ────────────────────────────────────────────────────────────
def cirurgia_rec(descricao=DESC_CIRURGICA):
    return rec("MEDICINA", "Anamnese", "x", **CIRURGIA, **{"Descrição Cirurgica": descricao})


def test_item08_opme_term_found_is_conforme_and_not_sent_to_ai(audit_env):
    calls = audit_env("all_null")
    d = audit([cirurgia_rec("fixação com placa e parafusos, síntese por planos, cirurgia longa e detalhada")])
    assert d["secao_c"]["uso_opme"].startswith("conforme (placa, parafuso")
    assert not any("uso_opme" in c["campos"] for c in calls)


def test_item08_no_term_goes_to_ai_and_null_means_nao_se_aplica(audit_env):
    calls = audit_env("all_null")
    d = audit([cirurgia_rec()])
    assert any("uso_opme" in c["campos"] for c in calls)
    assert d["secao_c"]["uso_opme"] == "Não se aplica (IA: null)"
    assert d["conformity_c"]["total"] == 7          # OPME fora do cálculo (só os 7 itens obrigatórios)


def test_item08_poorly_described_opme_is_nao_conforme(audit_env):
    audit_env(ai_answers({"uso_opme": "não conforme: cita 'material de síntese' sem dizer qual"}))
    d = audit([cirurgia_rec()])
    assert d["secao_c"]["uso_opme"] == "não conforme (IA: cita 'material de síntese' sem dizer qual)"


def test_item08_plural_terms_match():
    from data_extract.utils.text_match import find_words
    assert find_words("colocados drenos e telas", ["dreno", "tela"], plural=True) == ["dreno", "tela"]
    assert find_words("cartela e supino", ["tela", "pino"], plural=True) == []


# ── Item 9: colunas estruturadas vazias NÃO vão para a IA ───────────────────
def test_item09_empty_structured_surgery_fields_stay_not_registered_without_ai(audit_env):
    calls = audit_env("all_null")
    d = audit([rec("MEDICINA", "Anamnese", "x", **{"Especialidade cirurgia": "Ortopedia", "Descrição Cirurgica": DESC_CIRURGICA})])
    for campo in ("unidade_funcional", "inicio", "fim", "diagnostico_cid", "descricao_procedimento"):
        assert d["secao_c"][campo] == "Não registrado"
    enviados_c = [c for c in d["_ia_meta"]["campos_enviados"] if c.startswith("secao_c.")]
    assert sorted(enviados_c) == ["secao_c.descricao_tecnica", "secao_c.uso_opme"]
    assert calls


# ── Item 10: seção E guarda todas as categorias ─────────────────────────────
def test_item10_secao_e_keeps_all_categories_and_checks_only_presence(audit_env):
    audit_env("all_null")
    d = audit([rec("FISIOTERAPIA", "Evolução", "f"), rec("NUTRICAO", "Evolução", "n"), rec("FISIOTERAPIA", "Anamnese", "g")])
    assert d["secao_e"] == {"tem_outras_categorias": True, "categoria": "FISIOTERAPIA, NUTRICAO", "descricao": "conforme"}


def test_item10_category_without_description_is_not_registered(audit_env):
    audit_env("all_null")
    d = audit([rec("FISIOTERAPIA", "Evolução", "f"), rec("NUTRICAO", "Evolução", "")])
    assert d["secao_e"]["descricao"] == "Não registrado"


# ── Item 11: diagnóstico da internação só com texto médico, limitado ────────
def diag_calls(calls):
    return [c for c in calls if c["campos"] == ["diagnostico_internacao"]]


def test_item11_sends_only_the_medical_anamnese(audit_env):
    calls = audit_env("all_null")
    audit([rec("ENFERMAGEM", "Anamnese", "TEXTO DA ENFERMAGEM"), rec("MEDICINA", "Anamnese", "TEXTO MEDICO"),
           rec("MEDICINA", "Evolução", "EVOLUCAO MEDICA")])
    (chamada,) = diag_calls(calls)
    assert "TEXTO MEDICO" in chamada["input"]
    assert "ENFERMAGEM" not in chamada["input"] and "EVOLUCAO" not in chamada["input"]


def test_item11_without_medical_anamnese_uses_the_first_medical_evolution(audit_env):
    calls = audit_env("all_null")
    audit([rec("ENFERMAGEM", "Anamnese", "TEXTO DA ENFERMAGEM"), rec("MEDICINA", "Evolução", "PRIMEIRA EVOLUCAO"),
           rec("MEDICINA", "Evolução", "SEGUNDA EVOLUCAO")])
    (chamada,) = diag_calls(calls)
    assert "PRIMEIRA EVOLUCAO" in chamada["input"] and "SEGUNDA" not in chamada["input"]


def test_item11_without_medical_text_nothing_is_sent(audit_env):
    calls = audit_env("all_null")
    d = audit([rec("ENFERMAGEM", "Anamnese", "TEXTO DA ENFERMAGEM")])
    assert not diag_calls(calls)
    assert d["secao_a"]["diagnostico_internacao"] == "Não registrado"


def test_item11_text_is_limited_to_the_configured_budget(audit_env, monkeypatch):
    monkeypatch.setattr(auditor, "AI_MAX_CONTEXT_CHARS", 50)
    calls = audit_env("all_null")
    audit([rec("MEDICINA", "Anamnese", "A" * 500)])
    (chamada,) = diag_calls(calls)
    assert chamada["input"].count("A") == 50


# ── Item 15: descricao_tecnica não depende mais do tamanho ──────────────────
def test_item15_descricao_tecnica_always_goes_to_ai(audit_env):
    calls = audit_env(ai_answers({"descricao_tecnica": "passo a passo numerado"}))
    d = audit([cirurgia_rec("a" * 500)])
    assert any("descricao_tecnica" in c["campos"] for c in calls)
    assert d["secao_c"]["descricao_tecnica"] == "conforme (IA: passo a passo numerado)"


def test_item15_ai_can_reject_a_long_description(audit_env):
    audit_env(ai_answers({"descricao_tecnica": "não conforme: sem passo a passo"}))
    d = audit([cirurgia_rec("a" * 500)])
    assert d["secao_c"]["descricao_tecnica"] == "não conforme (IA: sem passo a passo)"


# ── Item 12: retentativas (Worker: 2; cliente de IA: 3) ─────────────────────
def test_item12_retry_layers_defaults():
    import worker.worker as worker
    assert worker.MAX_ATTEMPTS == 2
    assert llm_client.AI_MAX_ATTEMPTS >= 1


# ── Regras de texto ignoram acento (há registros escritos sem acentuação) ───
def test_rules_ignore_accents_in_the_record_text(audit_env):
    audit_env("all_null")
    d = audit([rec("MEDICINA", "Evolução", "hipotese diagnostica: sindrome coronariana. conduta: manter medicacoes.")])
    assert d["secao_b_evolucao"]["hd_cid"] == "conforme"
    assert d["secao_b_evolucao"]["procedimentos_condutas_queixas"] == "conforme"
