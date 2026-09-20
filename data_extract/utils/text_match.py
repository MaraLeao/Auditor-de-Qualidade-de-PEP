"""Busca de termos em texto clínico: sem acento, sem diferença de maiúscula e por PALAVRA INTEIRA.

A busca por trecho de palavra (`"ar" in texto`) casava dentro de outras palavras ("regul-ar")
e marcava sistemas do exame físico como presentes sem estarem.
"""
import re
import unicodedata
from functools import lru_cache


def normalize(text):
    """minúsculas + sem acentos ('Respiratório' -> 'respiratorio')."""
    if not text:
        return ""
    decomposed = unicodedata.normalize("NFKD", str(text).lower())
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


@lru_cache(maxsize=None)
def _word_pattern(term, plural):
    # (?<!\w) e (?!\w): o termo não pode estar colado em outras letras/dígitos
    sufixo = r"(?:s|es)?" if plural else ""
    return re.compile(r"(?<!\w)" + re.escape(normalize(term)) + sufixo + r"(?!\w)")


def has_word(text_normalized, term, plural=False):
    """True se `term` aparece como palavra (ou expressão) inteira em texto JÁ normalizado.
    plural=True aceita também o plural simples ('dreno' casa com 'drenos')."""
    return _word_pattern(term, plural).search(text_normalized) is not None


def find_words(text, terms, plural=False):
    """Termos de `terms` presentes no texto (normaliza o texto uma única vez)."""
    norm = normalize(text)
    return [t for t in terms if has_word(norm, t, plural)]
