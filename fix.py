import re

with open('data_extract/auditoria_prontuarios_v2.py', 'r') as f:
    content = f.read()

# Define the new content
new_func = '''def merge_section(current, new_data):
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
            
    return results'''

# We need to replace from def audit_medical_records to the end of the function.
# We'll use regex to find the start of audit_medical_records and the start of calculate_conformity
match = re.search(r'def audit_medical_records\(records\):.*?return results', content, re.DOTALL)
if match:
    content = content[:match.start()] + new_func + content[match.end():]
    with open('data_extract/auditoria_prontuarios_v2.py', 'w') as f:
        f.write(content)
    print("Done replacing.")
else:
    print("Could not find the function block.")
