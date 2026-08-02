from data_extract.keywords.exame_fisico import TERMOS_EXAME_FISICO

def check_keywords(text, terms):
    if not text:
        return "Não registrado"
    found = [term for term in terms if term in text.lower()]
    if found:
        return f"conforme ({', '.join(found)})"
    return "Não registrado"

print(check_keywords("paciente em bom estado geral, pele normal", TERMOS_EXAME_FISICO))
