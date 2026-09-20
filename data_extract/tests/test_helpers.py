import sys
import os
import pytest

# Add parent directory to path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from data_extract.utils.helpers import (
    calculate_age,
    format_periodo,
    check_keywords,
    check_exame_fisico_completo,
    check_curativo,
    is_valid,
    is_na
)

class TestCalculateAge:
    def test_valid_dates(self):
        assert calculate_age("15/05/1990", "15/05/2020") == "30 ANOS"
        assert calculate_age("16/05/1990", "15/05/2020") == "29 ANOS"

    def test_with_time_component(self):
        assert calculate_age("15/05/1990, 10:00", "15/05/2020, 14:00") == "30 ANOS"

    def test_empty_dates(self):
        assert calculate_age("", "15/05/2020") == ""
        assert calculate_age("15/05/1990", None) == ""
        
    def test_invalid_format(self):
        assert calculate_age("1990-05-15", "2020-05-15") == ""

class TestFormatPeriodo:
    def test_valid_period(self):
        assert format_periodo("10/05/2020, 10:00", "15/05/2020, 10:00") == "10/05/2020, 10:00 - 15/05/2020, 10:00 (5 dias)"

    def test_missing_internacao(self):
        assert format_periodo("", "15/05/2020, 10:00") == "Não registrado"
        assert format_periodo(None, "15/05/2020, 10:00") == "Não registrado"

    def test_missing_saida(self):
        assert format_periodo("10/05/2020, 10:00", "") == "10/05/2020, 10:00 - Data de saída não registrada"

    def test_invalid_format(self):
        # Should catch exception and return fallback format
        assert format_periodo("10/05/2020", "15/05/2020") == "10/05/2020 - 15/05/2020"

class TestCheckKeywords:
    def test_found_keywords(self):
        text = "Paciente apresenta hipertensão e diabetes."
        terms = ["hipertensão", "asma"]
        assert check_keywords(text, terms) == "conforme (hipertensão)"
        
    def test_multiple_found(self):
        text = "Paciente com asma e hipertensão."
        terms = ["hipertensão", "asma"]
        assert check_keywords(text, terms) == "conforme (hipertensão, asma)"

    def test_no_keywords_found(self):
        text = "Paciente saudável."
        terms = ["hipertensão", "asma"]
        assert check_keywords(text, terms) == "Não registrado"

    def test_empty_text(self):
        assert check_keywords("", ["hipertensão"]) == "Não registrado"
        assert check_keywords(None, ["hipertensão"]) == "Não registrado"

class TestCheckExameFisicoCompleto:
    @pytest.fixture
    def mock_dict(self):
        return {
            "respiratorio": ["murmúrio vesicular", "eupneico"],
            "cardiovascular": ["ritmo cardíaco regular", "rcr"]
        }

    def test_all_systems_present(self, mock_dict):
        text = "Paciente eupneico, rcr em 2 tempos."
        assert check_exame_fisico_completo(text, mock_dict) == "conforme"

    def test_missing_systems(self, mock_dict):
        text = "Paciente eupneico, abdome flácido."
        assert check_exame_fisico_completo(text, mock_dict) == "Incompleto (Faltam: cardiovascular)"

    def test_empty_text(self, mock_dict):
        assert check_exame_fisico_completo("", mock_dict) == "Não registrado"

class TestCheckCurativo:
    def test_valid_curativo(self):
        text = "Foi realizado curativo simples, tamanho pequeno, com pouco exsudato e sem presença de necrose."
        assert check_curativo(text) == "conforme"

    def test_missing_requirements(self):
        text = "Feito curativo simples na ferida operatória."
        assert check_curativo(text) == "não conforme (faltou: tamanho, exsudato, necrose)"

    def test_missing_some_requirements(self):
        text = "Curativo com exsudato seroso, sem necrose."
        assert check_curativo(text) == "não conforme (faltou: tamanho)"

    def test_not_applicable(self):
        text = "Ferida operatória limpa e seca." # no "curativo" related terms
        assert check_curativo(text) == "Não se aplica"

    def test_empty_text(self):
        assert check_curativo("") == "Não se aplica"

class TestBooleans:
    def test_is_valid(self):
        assert is_valid("conforme (hipertensão)") is True
        assert is_valid("conforme") is True
        assert is_valid("não conforme") is False
        assert is_valid("Não registrado") is False
        assert is_valid("") is False
        assert is_valid(None) is False

    def test_is_na(self):
        assert is_na("Não se aplica") is True
        assert is_na("N/A") is True
        assert is_na("conforme") is False
        assert is_na("") is False
        assert is_na(None) is False
