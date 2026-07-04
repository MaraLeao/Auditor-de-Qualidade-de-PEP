import json
import os
# from langchain_ollama import OllamaLLM
# from langchain_core.prompts import PromptTemplate
#from langchain_core.output_parsers import JsonOutputParser

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_record_info(record):
    """Extract relevant information from a record based on its type"""
    info = {
        "prontuario": record.get("Prontuário", ""),
        "data_nascimento": record.get("Data De Nascimento pact", ""),
        "idade": record.get("Idade", ""),
        "especialidade_internacao": record.get("Especialidade", ""),
        "periodo_internacao": record.get("Data da internação", ""),
        "diagnostico_internacao": record.get("Hipóteses Diagnósticas", ""),
        "especialidade_cirurgia": record.get("Especialidade cirurgia", ""),
        "unidade_funcional": record.get("Unidade Funcional Interna\u00e7ao", ""),
        "tipo_registro": record.get("Tipo do registro", ""),
        "descricao": record.get("Descricao do registro", ""),
        "descricao_cirurgica": record.get("Descrição Cirurgica", ""),
        "data_cirurgia": record.get("Data Inicio Cirurgia", ""),
        "fim_cirurgia": record.get("Data Fim Cirurgia", ""),
        "cid_procedimento": record.get("Cid procedimento", ""),
        "procedimento_realizado": record.get("Procedimento cirurgico Realizado", ""),
        "opme": record.get("OPME", ""),
        "categoria_profissional": record.get("Categoria Profissional", ""),
    }
    return info

def calculate_age(nascimento_str, internacao_str):
    try:
        if not nascimento_str or not internacao_str:
            return ""
        from datetime import datetime
        nasc_part = nascimento_str.split(',')[0].strip()
        int_part = internacao_str.split(',')[0].strip()
        fmt = "%d/%m/%Y"
        nasc_date = datetime.strptime(nasc_part, fmt)
        int_date = datetime.strptime(int_part, fmt)
        age = int_date.year - nasc_date.year - ((int_date.month, int_date.day) < (nasc_date.month, nasc_date.day))
        return f"{age} ANOS"
    except Exception as e:
        print(f"DEBUG: Error calculating age: {e}")
        return ""

def merge_section(current, new_data):
    """Merge new conformity data, keeping 'conforme' se já estiver presente"""
    for k, v in new_data.items():
        if current.get(k) != "conforme" and v == "conforme":
            current[k] = "conforme"

def audit_medical_records(records):
    """Audit medical records and extract conformity information"""
    results = []
    
    # Agrupa registros por prontuário
    patients = {}
    for record in records:
        info = extract_record_info(record)
        prontuario = info["prontuario"]
        if not prontuario:
            prontuario = "Desconhecido"
            
        if prontuario not in patients:
            patients[prontuario] = []
        patients[prontuario].append(info)
        
    for prontuario, patient_records in patients.items():
        print(f"Auditing patient {prontuario} with {len(patient_records)} records...")
        
        # Puxa informações estáticas do primeiro registro lido
        base_info = patient_records[0]
        
        audit_data = {
            "secao_a": {
                "prontuario": base_info["prontuario"] if base_info["prontuario"] else "Não registrado",
                "data_nascimento": base_info["data_nascimento"] if base_info["data_nascimento"] else "Não registrado",
                "idade": base_info["idade"] if base_info["idade"] else (calculate_age(base_info["data_nascimento"], base_info["periodo_internacao"]) or "Não registrado"),
                "especialidade_internacao": base_info["especialidade_internacao"] if base_info["especialidade_internacao"] else "Não registrado",
                "periodo_internacao": base_info["periodo_internacao"] if base_info["periodo_internacao"] else "Não registrado",
                "diagnostico_internacao": base_info["diagnostico_internacao"] if base_info["diagnostico_internacao"] else "Não registrado",
                "especialidade_cirurgia": base_info["especialidade_cirurgia"] if base_info["especialidade_cirurgia"] else "Não se aplica",
                "unidade_funcional": base_info["unidade_funcional"] if base_info["unidade_funcional"] else "Não registrado"
            },
            "secao_b_anamnese": { k: "Não registrado" for k in ["hda", "hd_cid", "ap_app", "af", "exame_fisico", "cd", "criacao_anamnese"] },
            "secao_b_evolucao": { k: "Não registrado" for k in ["hd_cid", "exame_fisico", "procedimentos", "condutas_intercorrencias", "frequencia_diaria"] },
            "secao_c": {
                "tem_cirurgia": bool(base_info["especialidade_cirurgia"] and base_info["especialidade_cirurgia"] != ""),
                "especialidade": base_info["especialidade_cirurgia"] if base_info["especialidade_cirurgia"] else "Não registrado",
                "unidade_funcional": base_info.get("unidade_funcional", "Não registrado"),
                "data": base_info["data_cirurgia"] if base_info["data_cirurgia"] else "Não registrado",
                "inicio": base_info["data_cirurgia"] if base_info["data_cirurgia"] else "Não registrado",
                "fim": base_info["fim_cirurgia"] if base_info["fim_cirurgia"] else "Não registrado",
                "diagnostico_cid": base_info["cid_procedimento"] if base_info["cid_procedimento"] else "Não registrado",
                "descricao_procedimento": base_info["procedimento_realizado"] if base_info["procedimento_realizado"] else "Não registrado",
                "descricao_tecnica": "Não registrado",
                "uso_opme": base_info["opme"] if base_info["opme"] else "Não se aplica"
            },
            "secao_d_anamnese": { k: "Não registrado" for k in ["motivo_internacao", "ap_app", "af", "exame_fisico", "escala_braden", "escala_morse", "cd", "criacao_anamnese"] },
            "secao_d_evolucao": { k: "Não registrado" for k in ["motivo_internacao", "exame_fisico", "condutas", "escala_braden", "escala_morse", "criacao_evolucao"] },
            "secao_e": {
                "tem_outras_categorias": False,
                "categoria": "Não se aplica",
                "descricao": "Não se aplica"
            }
        }
        
        # Consolida de acordo com o tipo de registro e categoria
        for info in patient_records:
            cat = info["categoria_profissional"].upper() if info["categoria_profissional"] else ""
            tipo = info["tipo_registro"].lower() if info["tipo_registro"] else ""
            
            if info["descricao_cirurgica"] and len(info["descricao_cirurgica"]) > 50:
                audit_data["secao_c"]["descricao_tecnica"] = "conforme"
                
            if cat == "MEDICINA":
                if "anamnese" in tipo:
                    merge_section(audit_data["secao_b_anamnese"], {
                        "hda": "conforme" if "hda" in info["descricao"].lower() or "história da doença" in info["descricao"].lower() else "Não registrado",
                        "hd_cid": "conforme" if "hipótese" in info["descricao"].lower() or "cid" in info["descricao"].lower() or "#hd" in info["descricao"].lower() or "hd:" in info["descricao"].lower() else "Não registrado",
                        "ap_app": "conforme" if "antecedentes pessoais" in info["descricao"].lower() or "app" in info["descricao"].lower() or "#ap" in info["descricao"].lower() or "ap:" in info["descricao"].lower() else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in info["descricao"].lower() or "#af" in info["descricao"].lower() or "af:" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": "conforme" if "exame físico" in info["descricao"].lower() or "exame fisico" in info["descricao"].lower() else "Não registrado",
                        "cd": "conforme" if "conduta" in info["descricao"].lower() or "terapêutica" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "criacao_anamnese": "conforme"
                    })
                elif "evolução" in tipo:
                    merge_section(audit_data["secao_b_evolucao"], {
                        "hd_cid": "conforme" if "hipótese" in info["descricao"].lower() or "cid" in info["descricao"].lower() or "#hd" in info["descricao"].lower() or "hd:" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": "conforme" if "exame físico" in info["descricao"].lower() or "exame fisico" in info["descricao"].lower() else "Não registrado",
                        "procedimentos": "conforme" if "procedimento" in info["descricao"].lower() else "Não registrado",
                        "condutas_intercorrencias": "conforme" if "conduta" in info["descricao"].lower() or "intercorrência" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "frequencia_diaria": "conforme"
                    })
            elif cat == "ENFERMAGEM":
                if "anamnese" in tipo:
                    merge_section(audit_data["secao_d_anamnese"], {
                        "motivo_internacao": "conforme" if "motivo" in info["descricao"].lower() or "internação" in info["descricao"].lower() else "Não registrado",
                        "ap_app": "conforme" if "antecedentes" in info["descricao"].lower() or "comorbidade" in info["descricao"].lower() else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": "conforme" if "exame físico" in info["descricao"].lower() or "exame fisico" in info["descricao"].lower() else "Não registrado",
                        "escala_braden": "conforme" if "braden" in info["descricao"].lower() else "Não registrado",
                        "escala_morse": "conforme" if "morse" in info["descricao"].lower() else "Não registrado",
                        "cd": "conforme" if "conduta" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "criacao_anamnese": "conforme"
                    })
                elif "evolução" in tipo:
                    merge_section(audit_data["secao_d_evolucao"], {
                        "motivo_internacao": "conforme" if "motivo" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": "conforme" if "exame físico" in info["descricao"].lower() or "exame fisico" in info["descricao"].lower() else "Não registrado",
                        "condutas": "conforme" if "conduta" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "escala_braden": "conforme" if "braden" in info["descricao"].lower() else "Não registrado",
                        "escala_morse": "conforme" if "morse" in info["descricao"].lower() else "Não registrado",
                        "criacao_evolucao": "conforme"
                    })
            elif cat and cat not in ["MEDICINA", "ENFERMAGEM"]:
                audit_data["secao_e"]["tem_outras_categorias"] = True
                audit_data["secao_e"]["categoria"] = cat
                if info["descricao"]:
                    audit_data["secao_e"]["descricao"] = "conforme"
        
        # Calculate conformities
        audit_data = calculate_conformity(audit_data)
        
        results.append({
            "record_id": prontuario,
            "audit_data": audit_data
        })
            
    return results

def calculate_conformity(data):
    """Calculate conformity percentages for each section"""
    
    # Helper to check if a value is valid (not missing/empty)
    def is_valid(val):
        if isinstance(val, bool):
            return val
        if not val:
            return False
        val_str = str(val).lower().strip()
        return val_str not in ["não registrado", "nao registrado", "não", "nao", "false", ""]
        
    # Helper to check if a value is "Não se aplica"
    def is_na(val):
        if not val:
            return False
        val_str = str(val).lower().strip()
        return val_str in ["não se aplica", "nao se aplica", "n/a", "na"]

    # Section A
    secao_a = data.get("secao_a", {})
    a_items = ["prontuario", "data_nascimento", "idade", "periodo_internacao", "diagnostico_internacao", "unidade_funcional"]
    a_valid = sum(1 for item in a_items if is_valid(secao_a.get(item)))
    a_total = len(a_items)
    
    # Add optional items if they apply
    if not is_na(secao_a.get("especialidade_cirurgia")):
        a_items.append("especialidade_cirurgia")
        a_total += 1
        if is_valid(secao_a.get("especialidade_cirurgia")):
            a_valid += 1
            
    if not is_na(secao_a.get("especialidade_internacao")):
        a_items.append("especialidade_internacao")
        a_total += 1
        if is_valid(secao_a.get("especialidade_internacao")):
            a_valid += 1
            
    data["conformity_a"] = {
        "total": a_total,
        "valid": a_valid,
        "percent": (a_valid / a_total * 100) if a_total > 0 else 0
    }
    
    # Section B - Anamnese
    secao_b_a = data.get("secao_b_anamnese", {})
    b_a_items = ["hda", "hd_cid", "ap_app", "af", "exame_fisico", "cd", "criacao_anamnese"]
    b_a_valid = sum(1 for item in b_a_items if is_valid(secao_b_a.get(item)))
    b_a_total = len(b_a_items)
    
    data["conformity_b_anamnese"] = {
        "total": b_a_total,
        "valid": b_a_valid,
        "percent": (b_a_valid / b_a_total * 100) if b_a_total > 0 else 0
    }
    
    # Section B - Evolucao
    secao_b_e = data.get("secao_b_evolucao", {})
    b_e_items = ["hd_cid", "exame_fisico", "procedimentos", "condutas_intercorrencias", "frequencia_diaria"]
    b_e_valid = sum(1 for item in b_e_items if is_valid(secao_b_e.get(item)))
    b_e_total = len(b_e_items)
    
    data["conformity_b_evolucao"] = {
        "total": b_e_total,
        "valid": b_e_valid,
        "percent": (b_e_valid / b_e_total * 100) if b_e_total > 0 else 0
    }
    
    # Section C
    secao_c = data.get("secao_c", {})
    tem_cirurgia = secao_c.get("tem_cirurgia", False)
    
    if tem_cirurgia:
        c_items = ["especialidade", "unidade_funcional", "data", "inicio", "fim", "diagnostico_cid", "descricao_procedimento", "descricao_tecnica"]
        c_valid = sum(1 for item in c_items if is_valid(secao_c.get(item)))
        c_total = len(c_items)
        
        if not is_na(secao_c.get("uso_opme")):
            c_total += 1
            if is_valid(secao_c.get("uso_opme")):
                c_valid += 1
                
        data["conformity_c"] = {
            "total": c_total,
            "valid": c_valid,
            "percent": (c_valid / c_total * 100) if c_total > 0 else 0,
            "applies": True
        }
    else:
        data["conformity_c"] = {
            "total": 0,
            "valid": 0,
            "percent": 100,
            "applies": False
        }
        
    # Section D - Anamnese
    secao_d_a = data.get("secao_d_anamnese", {})
    d_a_items = ["motivo_internacao", "ap_app", "af", "exame_fisico", "escala_braden", "escala_morse", "cd", "criacao_anamnese"]
    d_a_valid = sum(1 for item in d_a_items if is_valid(secao_d_a.get(item)))
    d_a_total = len(d_a_items)
    
    data["conformity_d_anamnese"] = {
        "total": d_a_total,
        "valid": d_a_valid,
        "percent": (d_a_valid / d_a_total * 100) if d_a_total > 0 else 0
    }
    
    # Section D - Evolucao
    secao_d_e = data.get("secao_d_evolucao", {})
    d_e_items = ["motivo_internacao", "exame_fisico", "condutas", "escala_braden", "escala_morse", "criacao_evolucao"]
    d_e_valid = sum(1 for item in d_e_items if is_valid(secao_d_e.get(item)))
    d_e_total = len(d_e_items)
    
    data["conformity_d_evolucao"] = {
        "total": d_e_total,
        "valid": d_e_valid,
        "percent": (d_e_valid / d_e_total * 100) if d_e_total > 0 else 0
    }
    
    # Section E
    secao_e = data.get("secao_e", {})
    tem_outras = secao_e.get("tem_outras_categorias", False)
    
    if tem_outras:
        e_items = ["descricao"]
        e_valid = sum(1 for item in e_items if is_valid(secao_e.get(item)))
        e_total = len(e_items)
        
        data["conformity_e"] = {
            "total": e_total,
            "valid": e_valid,
            "percent": (e_valid / e_total * 100) if e_total > 0 else 0,
            "applies": True,
            "categoria": secao_e.get("categoria", "Outras")
        }
    else:
        data["conformity_e"] = {
            "total": 0,
            "valid": 0,
            "percent": 100,
            "applies": False,
            "categoria": "Outras"
        }
        
    # Global conformity
    global_total = a_total + b_a_total + b_e_total + d_a_total + d_e_total
    global_valid = a_valid + b_a_valid + b_e_valid + d_a_valid + d_e_valid
    
    if tem_cirurgia:
        global_total += data["conformity_c"]["total"]
        global_valid += data["conformity_c"]["valid"]
        
    if tem_outras:
        global_total += data["conformity_e"]["total"]
        global_valid += data["conformity_e"]["valid"]
        
    data["conformity_global"] = {
        "total": global_total,
        "valid": global_valid,
        "invalid": global_total - global_valid,
        "percent": (global_valid / global_total * 100) if global_total > 0 else 0
    }
    
    return data

def generate_report(results, output_path):
    """Generate audit report in text format"""
    import os
    
    # Criar pasta de destino se não existir
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for result in results:
            record_id = result["record_id"]
            data = result["audit_data"]
            
            # Header
            f.write(f"Auditoria do Prontuário {record_id}\n")
            f.write("-" * 80 + "\n\n")
            
            # Section A
            f.write("Seção A – Identificação do Atendimento\n\n")
            s_a = data.get("secao_a", {})
            f.write(f"Prontuário: {s_a.get('prontuario', 'Não registrado')}\n")
            f.write(f"Data de nascimento: {s_a.get('data_nascimento', 'Não registrado')}\n")
            f.write(f"Idade: {s_a.get('idade', 'Não registrado')}\n")
            f.write(f"Especialidade da Internação: {s_a.get('especialidade_internacao', 'Não registrado')}\n")
            f.write(f"Período da internação: {s_a.get('periodo_internacao', 'Não registrado')}\n")
            f.write(f"Diagnóstico/CID da internação: {s_a.get('diagnostico_internacao', 'Não registrado')}\n")
            f.write(f"Especialidade da cirurgia: {s_a.get('especialidade_cirurgia', 'Não se aplica')}\n")
            f.write(f"Unidade Funcional: {s_a.get('unidade_funcional', 'Não registrado')}\n\n")
            
            c_a = data.get("conformity_a", {})
            f.write("Cálculo de Conformidade - Seção A\n\n")
            f.write(f"• Itens obrigatórios: {c_a.get('total', 0)}\n")
            f.write(f"• Itens conformes: {c_a.get('valid', 0)}\n")
            f.write(f"• Percentual de conformidade: {c_a.get('percent', 0):.1f}%\n\n")
            f.write("-" * 80 + "\n\n")
            
            # Section B
            f.write("Seção B – Anamnese e Evoluções Médicas\n\n")
            f.write("Anamnese Médica\n\n")
            s_b_a = data.get("secao_b_anamnese", {})
            f.write(f"HDA (História da Doença Atual): {s_b_a.get('hda', 'Não registrado')}\n")
            f.write(f"HD (Hipótese Diagnóstica) ou CID: {s_b_a.get('hd_cid', 'Não registrado')}\n")
            f.write(f"AP/APP (Antecedentes Pessoais e Patológicos): {s_b_a.get('ap_app', 'Não registrado')}\n")
            f.write(f"AF (Antecedentes Familiares): {s_b_a.get('af', 'Não registrado')}\n")
            f.write(f"Exame Físico: {s_b_a.get('exame_fisico', 'Não registrado')}\n")
            f.write(f"CD (Conduta Terapêutica): {s_b_a.get('cd', 'Não registrado')}\n")
            f.write(f"Criação da Anamnese: {s_b_a.get('criacao_anamnese', 'Não registrado')}\n\n")
            
            c_b_a = data.get("conformity_b_anamnese", {})
            f.write(f"Percentual de conformidade da Anamnese Médica: {c_b_a.get('percent', 0):.1f}%\n\n")
            
            f.write("Evolução Médica\n\n")
            s_b_e = data.get("secao_b_evolucao", {})
            f.write(f"HD ou CID: {s_b_e.get('hd_cid', 'Não registrado')}\n")
            f.write(f"Exame Físico: {s_b_e.get('exame_fisico', 'Não registrado')}\n")
            f.write(f"Procedimentos: {s_b_e.get('procedimentos', 'Não registrado')}\n")
            f.write(f"Condutas e intercorrências: {s_b_e.get('condutas_intercorrencias', 'Não registrado')}\n")
            f.write(f"Frequência diária e completude dos registros: {s_b_e.get('frequencia_diaria', 'Não registrado')}\n\n")
            
            c_b_e = data.get("conformity_b_evolucao", {})
            f.write(f"• Itens obrigatórios: {c_b_e.get('total', 0)}\n")
            f.write(f"• Itens conformes: {c_b_e.get('valid', 0)}\n\n")
            f.write(f"Percentual de conformidade da Evolução Médica: {c_b_e.get('percent', 0):.1f}%\n\n")
            f.write("-" * 80 + "\n\n")
            
            # Section C
            f.write("Seção C – Cirurgia\n\n")
            c_c = data.get("conformity_c", {})
            if c_c.get("applies", False):
                s_c = data.get("secao_c", {})
                f.write(f"Especialidade da cirurgia: {s_c.get('especialidade', 'Não registrado')}\n")
                f.write(f"Unidade Funcional da cirurgia: {s_c.get('unidade_funcional', 'Não registrado')}\n")
                f.write(f"Data da cirurgia: {s_c.get('data', 'Não registrado')}\n")
                f.write(f"Início da cirurgia: {s_c.get('inicio', 'Não registrado')}\n")
                f.write(f"Fim da cirurgia: {s_c.get('fim', 'Não registrado')}\n")
                f.write(f"Diagnóstico ou CID do procedimento cirúrgico: {s_c.get('diagnostico_cid', 'Não registrado')}\n")
                f.write(f"Descrição do procedimento cirúrgico realizado: {s_c.get('descricao_procedimento', 'Não registrado')}\n")
                f.write(f"Descrição da técnica cirúrgica: {s_c.get('descricao_tecnica', 'Não registrado')}\n")
                f.write(f"Uso de OPME: {s_c.get('uso_opme', 'Não se aplica')}\n\n")
                f.write(f"Percentual de conformidade da Cirurgia: {c_c.get('percent', 0):.1f}%\n\n")
            else:
                f.write("Não se aplica (Sem registro de cirurgia)\n\n")
            f.write("-" * 80 + "\n\n")
            
            # Section D
            f.write("Seção D – Anamnese e Evoluções de Enfermagem\n\n")
            f.write("Anamnese de Enfermagem\n\n")
            s_d_a = data.get("secao_d_anamnese", {})
            f.write(f"Motivo da internação ou HD ou CID: {s_d_a.get('motivo_internacao', 'Não registrado')}\n")
            f.write(f"AP/APP ou comorbidades: {s_d_a.get('ap_app', 'Não registrado')}\n")
            f.write(f"AF (Antecedentes Familiares): {s_d_a.get('af', 'Não registrado')}\n")
            f.write(f"Exame físico: {s_d_a.get('exame_fisico', 'Não registrado')}\n")
            f.write(f"Escala de Braden: {s_d_a.get('escala_braden', 'Não registrado')}\n")
            f.write(f"Escala de Morse: {s_d_a.get('escala_morse', 'Não registrado')}\n")
            f.write(f"CD (Conduta de Enfermagem): {s_d_a.get('cd', 'Não registrado')}\n")
            f.write(f"Criação da Anamnese: {s_d_a.get('criacao_anamnese', 'Não registrado')}\n\n")
            
            c_d_a = data.get("conformity_d_anamnese", {})
            f.write(f"Percentual de conformidade da Anamnese de Enfermagem: {c_d_a.get('percent', 0):.1f}%\n\n")
            
            f.write("Evolução de Enfermagem\n\n")
            s_d_e = data.get("secao_d_evolucao", {})
            f.write(f"Motivo da internação ou HD/CID: {s_d_e.get('motivo_internacao', 'Não registrado')}\n")
            f.write(f"Exame físico completo: {s_d_e.get('exame_fisico', 'Não registrado')}\n")
            f.write(f"Condutas realizadas: {s_d_e.get('condutas', 'Não registrado')}\n")
            f.write(f"Escala de Braden: {s_d_e.get('escala_braden', 'Não registrado')}\n")
            f.write(f"Escala de Morse: {s_d_e.get('escala_morse', 'Não registrado')}\n")
            f.write(f"Criação da Evolução: {s_d_e.get('criacao_evolucao', 'Não registrado')}\n\n")
            
            c_d_e = data.get("conformity_d_evolucao", {})
            f.write(f"Percentual de conformidade da Evolução de Enfermagem: {c_d_e.get('percent', 0):.1f}%\n\n")
            f.write("-" * 80 + "\n\n")
            
            # Section E
            f.write("Seção E – Outras Categorias Profissionais\n\n")
            c_e = data.get("conformity_e", {})
            if c_e.get("applies", False):
                s_e = data.get("secao_e", {})
                categoria = s_e.get("categoria", "Outras")
                f.write(f"{categoria}\n\n")
                f.write(f"Descrição: {s_e.get('descricao', 'Não registrado')}\n\n")
                f.write(f"Percentual de conformidade {categoria}: {c_e.get('percent', 0):.1f}%\n\n")
            else:
                f.write("Outras categorias profissionais: Não se aplica\n\n")
            f.write("-" * 80 + "\n\n")
            
            # Summary
            f.write("Resumo Geral da Auditoria\n\n")
            
            # Table header
            f.write(f"{'Seção':<35} | {'Itens Avaliados':<15} | {'Conforme':<10} | {'Não Conforme':<12} | {'Percentual':<10}\n")
            f.write("-" * 93 + "\n")
            
            # Table rows
            f.write(f"{'Seção A – Identificação':<35} | {c_a.get('total', 0):<15} | {c_a.get('valid', 0):<10} | {c_a.get('total', 0) - c_a.get('valid', 0):<12} | {c_a.get('percent', 0):.1f}%\n")
            f.write(f"{'Seção B – Anamnese Médica':<35} | {c_b_a.get('total', 0):<15} | {c_b_a.get('valid', 0):<10} | {c_b_a.get('total', 0) - c_b_a.get('valid', 0):<12} | {c_b_a.get('percent', 0):.1f}%\n")
            f.write(f"{'Seção B – Evolução Médica':<35} | {c_b_e.get('total', 0):<15} | {c_b_e.get('valid', 0):<10} | {c_b_e.get('total', 0) - c_b_e.get('valid', 0):<12} | {c_b_e.get('percent', 0):.1f}%\n")
            
            if c_c.get("applies", False):
                f.write(f"{'Seção C – Cirurgia':<35} | {c_c.get('total', 0):<15} | {c_c.get('valid', 0):<10} | {c_c.get('total', 0) - c_c.get('valid', 0):<12} | {c_c.get('percent', 0):.1f}%\n")
            else:
                f.write(f"{'Seção C – Cirurgia':<35} | {'N/A':<15} | {'N/A':<10} | {'N/A':<12} | {'N/A':<10}\n")
                
            f.write(f"{'Seção D – Anamnese de Enfermagem':<35} | {c_d_a.get('total', 0):<15} | {c_d_a.get('valid', 0):<10} | {c_d_a.get('total', 0) - c_d_a.get('valid', 0):<12} | {c_d_a.get('percent', 0):.1f}%\n")
            f.write(f"{'Seção D – Evolução de Enfermagem':<35} | {c_d_e.get('total', 0):<15} | {c_d_e.get('valid', 0):<10} | {c_d_e.get('total', 0) - c_d_e.get('valid', 0):<12} | {c_d_e.get('percent', 0):.1f}%\n")
            
            if c_e.get("applies", False):
                categoria = c_e.get("categoria", "Outras")
                f.write(f"{f'Seção E – {categoria}':<35} | {c_e.get('total', 0):<15} | {c_e.get('valid', 0):<10} | {c_e.get('total', 0) - c_e.get('valid', 0):<12} | {c_e.get('percent', 0):.1f}%\n")
            else:
                f.write(f"{'Seção E – Outras Categorias':<35} | {'N/A':<15} | {'N/A':<10} | {'N/A':<12} | {'N/A':<10}\n")
                
            f.write("\n")
            
            c_global = data.get("conformity_global", {})
            f.write(f"Total de itens obrigatórios avaliados: {c_global.get('total', 0)}\n")
            f.write(f"Total de itens conformes: {c_global.get('valid', 0)}\n")
            f.write(f"Total de itens não conformes: {c_global.get('invalid', 0)}\n")
            f.write(f"Percentual de conformidade global: {c_global.get('percent', 0):.2f}%\n\n")
            
            f.write("=" * 80 + "\n\n\n")

if __name__ == "__main__":
    input_file = "data_extract/data/p1.json"
    output_file = "data_extract/rel_cpu/relatorio_auditoria_v2.txt"
    
    print(f"Loading records from {input_file}...")
    records = load_json(input_file)
    
    # Processa todos os registros do arquivo
    print(f"Auditing {len(records)} records...")
    results = audit_medical_records(records)
    
    print(f"Generating report at {output_file}...")
    generate_report(results, output_file)
    
    print("Done!")
