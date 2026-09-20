import re
import sys
from datetime import datetime

from data_extract.utils.text_match import has_word, normalize


def calculate_age(nascimento_str, internacao_str):
    try:
        if not nascimento_str or not internacao_str:
            return ""
        nasc_part = nascimento_str.split(',')[0].strip()
        int_part = internacao_str.split(',')[0].strip()
        fmt = "%d/%m/%Y"
        nasc_date = datetime.strptime(nasc_part, fmt)
        int_date = datetime.strptime(int_part, fmt)
        age = int_date.year - nasc_date.year - ((int_date.month, int_date.day) < (nasc_date.month, nasc_date.day))
        return f"{age} ANOS"
    except Exception:
        return ""

def format_periodo(internacao_str, saida_str):
    if not internacao_str:
        return "Não registrado"
    if not saida_str:
        return f"{internacao_str} - Data de saída não registrada"
    try:
        fmt = "%d/%m/%Y, %H:%M"
        int_date = datetime.strptime(internacao_str.strip(), fmt)
        out_date = datetime.strptime(saida_str.strip(), fmt)
        dias = (out_date - int_date).days
        return f"{internacao_str} - {saida_str} ({dias} dias)"
    except Exception as e:
        sys.stderr.write(f"DEBUG: Error calculating period: {e}\n")
        return f"{internacao_str} - {saida_str}"

def check_exame_fisico_completo(text, dicionario_sistemas):
    """Exame físico completo = pelo menos uma palavra-chave de CADA sistema (busca por palavra inteira)."""
    if not text:
        return "Não registrado"

    norm = normalize(text)
    missing_systems = [
        sistema for sistema, sinonimos in dicionario_sistemas.items()
        if not any(has_word(norm, sinonimo) for sinonimo in sinonimos)
    ]

    if missing_systems:
        return f"não conforme (Faltam: {', '.join(missing_systems)})"

    return "conforme"


CURATIVO_TIPOS = (("simples", "simples"), ("especial", "especial"), ("grau ii", "grau II"), ("grau 2", "grau II"))
_CURATIVO = r"curativos?"
_TIPO_ALT = "|".join(re.escape(t) for t, _ in CURATIVO_TIPOS)
_CURATIVO_TIPO_RE = re.compile(rf"(?<!\w)(?:{_CURATIVO}\s+(?:{_TIPO_ALT})|(?:{_TIPO_ALT})\s+{_CURATIVO})(?!\w)")
_CURATIVO_RE = re.compile(rf"(?<!\w){_CURATIVO}(?!\w)")
CURATIVO_DETALHES = ("tamanho", "exsudato", "necrose")


def tipo_curativo(text):
    """Tipo do curativo ('simples', 'especial' ou 'grau II') quando o tipo está JUNTO da palavra
    'curativo' (imediatamente antes ou depois). 'simples' solto no texto não conta."""
    m = _CURATIVO_TIPO_RE.search(normalize(text))
    if not m:
        return None
    trecho = m.group(0)
    for termo, nome in CURATIVO_TIPOS:
        if re.search(rf"(?<!\w){re.escape(termo)}(?!\w)", trecho):
            return nome
    return None


def check_curativo(text):
    """Curativo (item não obrigatório; avaliado só na evolução de enfermagem).

    - sem a palavra 'curativo': 'Não se aplica'
    - tipo identificado + tamanho, exsudato e necrose descritos: 'conforme (Curativo <tipo>)'
    - tipo identificado, mas faltou algo: 'não conforme (Curativo <tipo>; faltou: ...)'
    - curativo citado sem tipo identificável: 'Não registrado' -> o auditor manda para o fallback de IA
    """
    if not text:
        return "Não se aplica"

    norm = normalize(text)
    if not _CURATIVO_RE.search(norm):
        return "Não se aplica"

    tipo = tipo_curativo(text)
    if tipo is None:
        return "Não registrado"

    faltam = [d for d in CURATIVO_DETALHES if not has_word(norm, d)]
    if faltam:
        return f"não conforme (Curativo {tipo}; faltou: {', '.join(faltam)})"
    return f"conforme (Curativo {tipo})"
