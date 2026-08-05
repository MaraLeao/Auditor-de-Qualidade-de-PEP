import sys
from data_extract.keywords.exame_fisico import TERMOS_EXAME_FISICO
from data_extract.keywords.opme import TERMOS_OPME
from data_extract.utils.helpers import (
    calculate_age,
    format_periodo,
    check_keywords,
    check_curativo,
    is_valid,
    is_na
)
from data_extract.core.llm_client import validate_missing_fields_with_ai
from data_extract.core.parser import extract_record_info

def merge_section(current, new_data):
    """Merge new conformity data, keeping 'conforme' se já estiver presente"""
    for k, v in new_data.items():
        curr_v = str(current.get(k))
        new_v = str(v)
        if not curr_v.startswith("conforme") and new_v.startswith("conforme"):
            current[k] = v
        elif curr_v in ["Não registrado", "Não se aplica"] and new_v not in ["Não registrado", "Não se aplica"]:
            current[k] = v

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
        sys.stderr.write(f"Auditing patient {prontuario} with {len(patient_records)} records...\n")
        
        # Puxa informações estáticas do primeiro registro lido
        base_info = patient_records[0]
        
        matrix = {}
        all_dates = set()
        for info_rec in patient_records:
            cat = info_rec.get("categoria_profissional", "Outros")
            tipo = info_rec.get("tipo_registro", "Registro")
            doc_name = f"{cat} - {tipo}"
            
            dt_raw = info_rec.get("data_criacao", "")
            if dt_raw:
                dt = dt_raw.split(',')[0].strip()
                all_dates.add(dt)
                if doc_name not in matrix:
                    matrix[doc_name] = {}
                matrix[doc_name][dt] = matrix[doc_name].get(dt, 0) + 1
                
        audit_data = {
            "matriz_documentos": {
                "datas": sorted(list(all_dates), key=lambda d: d.split('/')[2] + d.split('/')[1] + d.split('/')[0] if d.count('/') == 2 else d),
                "matriz": matrix
            },
            "secao_a": {
                "prontuario": base_info["prontuario"] if base_info["prontuario"] else "Não registrado",
                "data_nascimento": base_info["data_nascimento"] if base_info["data_nascimento"] else "Não registrado",
                "idade": base_info["idade"] if base_info["idade"] else (calculate_age(base_info["data_nascimento"], base_info["periodo_internacao"]) or "Não registrado"),
                "especialidade_internacao": base_info["especialidade_internacao"] or base_info["especialidade_cirurgia"] or "Não registrado",
                "periodo_internacao": format_periodo(base_info["periodo_internacao"], base_info.get("data_saida", "")),
                "diagnostico_internacao": base_info["diagnostico_internacao"] if base_info["diagnostico_internacao"] else "Não registrado",
                "especialidade_cirurgia": base_info["especialidade_cirurgia"] if base_info["especialidade_cirurgia"] else "Não se aplica",
                "unidade_funcional": base_info["unidade_funcional"] if base_info["unidade_funcional"] else "Não registrado"
            },
            "secao_b_anamnese": { k: "Não registrado" for k in ["hda", "hd_cid", "ap_app", "af", "exame_fisico", "cd", "criacao_anamnese"] },
            "secao_b_evolucao": { k: "Não registrado" for k in ["hd_cid", "exame_fisico", "procedimentos_condutas_queixas", "frequencia_diaria"] },
            "secao_c": {
                "tem_cirurgia": bool(base_info["especialidade_cirurgia"] and base_info["especialidade_cirurgia"] != ""),
                "especialidade": base_info["especialidade_cirurgia"] if base_info["especialidade_cirurgia"] else "Não registrado",
                "unidade_funcional": base_info.get("uf_cirurgia") or "Não registrado",
                "inicio": base_info["data_cirurgia"] if base_info["data_cirurgia"] else "Não registrado",
                "fim": base_info["fim_cirurgia"] if base_info["fim_cirurgia"] else "Não registrado",
                "diagnostico_cid": base_info["cid_procedimento"] if base_info["cid_procedimento"] else "Não registrado",
                "descricao_procedimento": base_info["procedimento_realizado"] if base_info["procedimento_realizado"] else "Não registrado",
                "descricao_tecnica": "Não registrado",
                "uso_opme": "Não se aplica"
            },
            "secao_d_anamnese": dict({ k: "Não registrado" for k in ["motivo_internacao", "ap_app", "af", "exame_fisico", "escala_braden", "escala_morse", "cd", "criacao_anamnese"] }, curativo="Não se aplica"),
            "secao_d_evolucao": dict({ k: "Não registrado" for k in ["motivo_internacao", "exame_fisico", "condutas", "escala_braden", "escala_morse", "criacao_evolucao"] }, curativo="Não se aplica"),
            "secao_e": {
                "tem_outras_categorias": False,
                "categoria": "Não se aplica",
                "descricao": "Não se aplica"
            }
        }
        
        # Consolida de acordo com o tipo de registro e categoria
        # Pega a descricao cirurgica uma unica vez (ela se repete em todos os registros)
        descricao_cirurgica_unica = next(
            (r["descricao_cirurgica"] for r in patient_records if r.get("descricao_cirurgica")),
            None
        )
        # Texto combinado para seção C: cirurgia + todos os registros clínicos
        # Assim a IA pode encontrar tanto achados cirúrgicos quanto o diagnóstico clínico
        textos_clinicos_secao_c = "\n---\n".join([
            r["descricao"] for r in patient_records if r.get("descricao")
        ])
        texto_secao_c = "\n".join(filter(None, [descricao_cirurgica_unica, textos_clinicos_secao_c]))

        for info in patient_records:
            cat = info["categoria_profissional"].upper() if info["categoria_profissional"] else ""
            tipo = info["tipo_registro"].lower() if info["tipo_registro"] else ""
            
            if descricao_cirurgica_unica and audit_data["secao_c"].get("tem_cirurgia"):
                if len(descricao_cirurgica_unica) > 50:
                    audit_data["secao_c"]["descricao_tecnica"] = "conforme"
                termos_encontrados = [termo for termo in TERMOS_OPME if termo in descricao_cirurgica_unica.lower()]
                if termos_encontrados:
                    audit_data["secao_c"]["uso_opme"] = f"conforme ({', '.join(termos_encontrados)})"

                faltantes_cirurgia = [k for k, v in audit_data["secao_c"].items() if v == "Não registrado"]
                if faltantes_cirurgia:
                    ai_result_cirurgia = validate_missing_fields_with_ai(
                        texto_secao_c, faltantes_cirurgia, "Cirurgia / Descrição Cirúrgica"
                    )
                    for campo in faltantes_cirurgia:
                        valor_ia = ai_result_cirurgia.get(campo)
                        if valor_ia and isinstance(valor_ia, str):
                            audit_data["secao_c"][campo] = f"conforme (IA: {valor_ia})"
                        elif valor_ia:
                            audit_data["secao_c"][campo] = "conforme (validado por IA)"
                sys.stderr.write(f"  [Auditor] Seção Cirurgia finalizada para o prontuário {prontuario}.\n")
                # Marca como None para nao repetir nos outros registros
                descricao_cirurgica_unica = None
                
            local_val = {}
            target_section = None
            
            if cat == "MEDICINA":
                if "anamnese" in tipo:
                    target_section = audit_data["secao_b_anamnese"]
                    local_val = {
                        "hda": "conforme" if "hda" in info["descricao"].lower() or "história da doença" in info["descricao"].lower() else "Não registrado",
                        "hd_cid": "conforme" if "hipótese" in info["descricao"].lower() or "cid" in info["descricao"].lower() or "#hd" in info["descricao"].lower() or "hd:" in info["descricao"].lower() else "Não registrado",
                        "ap_app": "conforme" if "antecedentes pessoais" in info["descricao"].lower() or "app" in info["descricao"].lower() or "#ap" in info["descricao"].lower() or "ap:" in info["descricao"].lower() else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in info["descricao"].lower() or "#af" in info["descricao"].lower() or "af:" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": check_keywords(info["descricao"], TERMOS_EXAME_FISICO),
                        "cd": "conforme" if "conduta" in info["descricao"].lower() or "terapêutica" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "criacao_anamnese": "conforme"
                    }
                elif "evolução" in tipo:
                    target_section = audit_data["secao_b_evolucao"]
                    local_val = {
                        "hd_cid": "conforme" if "hipótese" in info["descricao"].lower() or "cid" in info["descricao"].lower() or "#hd" in info["descricao"].lower() or "hd:" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": check_keywords(info["descricao"], TERMOS_EXAME_FISICO),
                        "procedimentos_condutas_queixas": "conforme" if "procedimento" in info["descricao"].lower() or "conduta" in info["descricao"].lower() or "queixa" in info["descricao"].lower() or "intercorrência" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "frequencia_diaria": "conforme"
                    }
            elif cat == "ENFERMAGEM":
                if "anamnese" in tipo:
                    target_section = audit_data["secao_d_anamnese"]
                    local_val = {
                        "motivo_internacao": "conforme" if "motivo" in info["descricao"].lower() or "internação" in info["descricao"].lower() else "Não registrado",
                        "ap_app": "conforme" if "antecedentes" in info["descricao"].lower() or "comorbidade" in info["descricao"].lower() else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": check_keywords(info["descricao"], TERMOS_EXAME_FISICO),
                        "escala_braden": "conforme" if "braden" in info["descricao"].lower() else "Não registrado",
                        "escala_morse": "conforme" if "morse" in info["descricao"].lower() else "Não registrado",
                        "cd": "conforme" if "conduta" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "criacao_anamnese": "conforme",
                        "curativo": check_curativo(info["descricao"])
                    }
                elif "evolução" in tipo:
                    target_section = audit_data["secao_d_evolucao"]
                    local_val = {
                        "motivo_internacao": "conforme" if "motivo" in info["descricao"].lower() else "Não registrado",
                        "exame_fisico": check_keywords(info["descricao"], TERMOS_EXAME_FISICO),
                        "condutas": "conforme" if "conduta" in info["descricao"].lower() or "#cd" in info["descricao"].lower() or "cd:" in info["descricao"].lower() else "Não registrado",
                        "escala_braden": "conforme" if "braden" in info["descricao"].lower() else "Não registrado",
                        "escala_morse": "conforme" if "morse" in info["descricao"].lower() else "Não registrado",
                        "criacao_evolucao": "conforme",
                        "curativo": check_curativo(info["descricao"])
                    }
            elif cat and cat not in ["MEDICINA", "ENFERMAGEM"]:
                audit_data["secao_e"]["tem_outras_categorias"] = True
                audit_data["secao_e"]["categoria"] = cat
                if info["descricao"]:
                    audit_data["secao_e"]["descricao"] = "conforme"
            
            # Apply AI fallback if applicable
            if local_val and target_section is not None:
                faltantes = [k for k, v in local_val.items() if v == "Não registrado" or (isinstance(v, str) and v.startswith("Não registrado"))]
                if faltantes:
                    texto_base = info["descricao"]
                    ai_result = validate_missing_fields_with_ai(texto_base, faltantes, f"{cat} - {tipo}")
                    for campo in faltantes:
                        valor_ia = ai_result.get(campo)
                        if valor_ia and isinstance(valor_ia, str):
                            local_val[campo] = f"conforme (IA: {valor_ia})"
                        elif valor_ia:
                            local_val[campo] = "conforme (validado por IA)"
                
                merge_section(target_section, local_val)
                sys.stderr.write(f"  [Auditor] Seção {cat} - {tipo} finalizada para o prontuário {prontuario}.\n")
        
        # Fallback de IA para a seção A: diagnostico_internacao
        if audit_data["secao_a"].get("diagnostico_internacao") == "Não registrado":
            todos_textos = "\n---\n".join([r["descricao"] for r in patient_records if r.get("descricao")])
            if todos_textos:
                ai_result_a = validate_missing_fields_with_ai(todos_textos, ["diagnostico_internacao"], "Identificação do Paciente")
                valor_ia = ai_result_a.get("diagnostico_internacao")
                if valor_ia and isinstance(valor_ia, str):
                    audit_data["secao_a"]["diagnostico_internacao"] = f"conforme (IA: {valor_ia})"
                elif valor_ia:
                    audit_data["secao_a"]["diagnostico_internacao"] = "conforme (validado por IA)"
                sys.stderr.write(f"  [Auditor] Seção A - diagnóstico_internacao finalizado para o prontuário {prontuario}.\n")

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
    b_e_items = ["hd_cid", "exame_fisico", "procedimentos_condutas_queixas", "frequencia_diaria"]
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
        c_items = ["especialidade", "unidade_funcional", "inicio", "fim", "diagnostico_cid", "descricao_procedimento", "descricao_tecnica"]
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
    
    if not is_na(secao_d_a.get("curativo")):
        d_a_total += 1
        if is_valid(secao_d_a.get("curativo")):
            d_a_valid += 1
            
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
    
    if not is_na(secao_d_e.get("curativo")):
        d_e_total += 1
        if is_valid(secao_d_e.get("curativo")):
            d_e_valid += 1
            
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

