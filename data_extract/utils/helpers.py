import sys
import json
from datetime import datetime

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

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
    except Exception as e:
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

def check_keywords(text, terms):
    if not text:
        return "Não registrado"
    found = [term for term in terms if term in text.lower()]
    if found:
        return f"conforme ({', '.join(found)})"
    return "Não registrado"

def check_curativo(text):
    if not text:
        return "Não se aplica"
    
    text_lower = text.lower()
    termos_curativo = ["curativo", "especial", "simples", "grau ii", "grau 2", "oclusão", "octuído", "ocluído", "oclusa"]
    
    has_curativo = any(termo in text_lower for termo in termos_curativo)
    if not has_curativo:
        return "Não se aplica"
        
    reqs = ["tamanho", "exsudato", "necrose"]
    missing = [req for req in reqs if req not in text_lower]
    
    if missing:
        return f"não conforme (faltou: {', '.join(missing)})"
    return "conforme"

def is_valid(value):
    if not value:
        return False
    return str(value).startswith("conforme")

def is_na(value):
    if not value:
        return False
    return str(value) in ["Não se aplica", "N/A"]
