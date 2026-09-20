import re
import sys
import time
from datetime import datetime

from data_extract.core.llm_client import (
    AI_MAX_CONTEXT_CHARS,
    AI_MISSING_FIELDS,
    AI_OK,
    AI_SEED,
    MODEL_NAME,
    query_ai_fields,
)
from data_extract.core.parser import extract_record_info
from data_extract.core.temporal import check_criacao_anamnese, check_evolucao_diaria
from data_extract.keywords.exame_fisico import TERMOS_EXAME_FISICO_ENFERMAGEM, TERMOS_EXAME_FISICO_MEDICINA
from data_extract.keywords.opme import TERMOS_OPME
from data_extract.utils.helpers import (
    calculate_age,
    check_curativo,
    check_exame_fisico_completo,
    format_periodo,
)
from data_extract.utils.text_match import find_words, normalize


def tem_hipotese_diagnostica(texto):
    """Hipótese diagnóstica/CID registrada no texto (sem acento: há registros escritos sem acentuação).
    'cid' só conta como palavra inteira: a busca por trecho casava com 'flácido', 'acidente' etc."""
    t = normalize(texto)
    return "hipotese" in t or "#hd" in t or "hd:" in t or re.search(r"\bcid\b", t) is not None


def _new_ia_meta():
    return {
        "model": MODEL_NAME,
        "seed": AI_SEED,
        "seed_aplicada": None if AI_SEED is None else True,
        "chamadas": 0,
        "chamadas_ok": 0,
        "tentativas_total": 0,
        "latencia_ia_s": 0.0,
        "campos_enviados": [],
        "campos_ok": [],
        "campos_null": [],
        "campos_erro": [],
    }


# Campos calculados por data/hora: não existe trecho de texto para a IA procurar
CAMPOS_SEM_IA = frozenset({"criacao_anamnese", "criacao_evolucao", "frequencia_diaria"})


def motivo_nao_conforme(valor):
    """Tira o prefixo da resposta da IA: 'não conforme: falta ACV' -> 'falta ACV'."""
    texto = re.sub(r"^\s*(?:n[ãa]o conforme|incompleto)\s*[:\-–]?\s*", "", valor.strip(), flags=re.IGNORECASE).strip()
    if texto.startswith("(") and texto.endswith(")"):
        texto = texto[1:-1].strip()
    return texto or valor.strip()


def limitar_texto(texto):
    """Limita o texto enviado à IA ao orçamento de caracteres configurado."""
    return texto if len(texto) <= AI_MAX_CONTEXT_CHARS else texto[:AI_MAX_CONTEXT_CHARS]


def call_ai_and_apply(target, campos, texto, tipo_registro, secao_key, ia_meta, null_overrides=None):
    """
    Envia `campos` à IA e grava em `target` o resultado com a "assinatura" de cada campo:
      - conforme / não conforme (IA: trecho)          -> a IA respondeu com um trecho
      - Não registrado (IA: null)                     -> a IA respondeu null (olhou e não achou)
      - Não registrado (IA_NAO_EXECUTADA: <motivo>)   -> a IA não rodou (timeout, JSON inválido...)
    `null_overrides` troca o valor gravado quando a IA responde null (ex.: uso_opme -> "Não se aplica").
    Só existem "conforme" e "não conforme": incompleto/não conforme da IA viram
    "não conforme (IA: <motivo>)". Devolve o tempo gasto na IA (segundos).
    Sem texto, nada é enviado nem registrado.
    """
    null_overrides = null_overrides or {}
    resp = query_ai_fields(texto, campos, tipo_registro)
    if resp["attempts"] == 0:
        return 0.0

    ia_meta["chamadas"] += 1
    ia_meta["tentativas_total"] += resp["attempts"]
    ia_meta["latencia_ia_s"] += resp["latency"]
    if resp.get("seed_applied") is False:
        ia_meta["seed_aplicada"] = False
    if resp["status"] == AI_OK:
        ia_meta["chamadas_ok"] += 1

    for campo in campos:
        id_campo = f"{secao_key}.{campo}"
        ia_meta["campos_enviados"].append(id_campo)

        if campo not in resp["fields"]:
            motivo = resp["status"] if resp["status"] != AI_OK else AI_MISSING_FIELDS
            target[campo] = f"Não registrado (IA_NAO_EXECUTADA: {motivo})"
            ia_meta["campos_erro"].append({"campo": id_campo, "motivo": motivo, "detalhe": resp["error"]})
            sys.stderr.write(f"  [AI Fallback Error] Campo {id_campo} não foi processado pela IA ({motivo}).\n")
            continue

        valor_ia = resp["fields"][campo]
        if valor_ia and isinstance(valor_ia, str):
            if "não conforme" in valor_ia.lower() or "incompleto" in valor_ia.lower():
                target[campo] = f"não conforme (IA: {motivo_nao_conforme(valor_ia)})"
            else:
                target[campo] = f"conforme (IA: {valor_ia})"
            ia_meta["campos_ok"].append(id_campo)
        elif valor_ia:
            target[campo] = "conforme (validado por IA)"
            ia_meta["campos_ok"].append(id_campo)
        else:
            target[campo] = null_overrides.get(campo, "Não registrado (IA: null)")
            ia_meta["campos_null"].append(id_campo)

    return resp["latency"]


def finalize_ia_meta(audit_data, ia_meta):
    """Anexa ao resultado o resumo da IA e, se houve falha, o alerta de resultado parcial."""
    ia_meta["latencia_ia_s"] = round(ia_meta["latencia_ia_s"], 2)
    audit_data["_ia_meta"] = ia_meta
    erros = ia_meta["campos_erro"]
    audit_data["ia_incompleta"] = bool(erros)
    if erros:
        lista = ", ".join(f"{e['campo']} ({e['motivo']})" for e in erros)
        audit_data["observacao_ia"] = (
            f"A IA não rodou para todos os campos ({len(erros)} de {len(ia_meta['campos_enviados'])}): {lista}. "
            "Esses campos foram marcados como 'Não registrado' e o resultado é parcial."
        )
        sys.stderr.write(f"  [Auditor] ALERTA: resultado parcial — {audit_data['observacao_ia']}\n")


def merge_section(current, new_data):
    """Merge new conformity data, keeping 'conforme' se já estiver presente"""
    for k, v in new_data.items():
        curr_v = str(current.get(k))
        new_v = str(v)
        if not curr_v.startswith("conforme") and new_v.startswith("conforme"):
            current[k] = v
        elif (curr_v.startswith("Não registrado") or curr_v.startswith("Não se aplica")) and not (new_v.startswith("Não registrado") or new_v.startswith("Não se aplica")):
            current[k] = v

def _anexa_dias(valor, dias):
    return valor[:-1] + f" — dia {dias})" if valor.endswith(")") else f"{valor} (dia {dias})"


def aggregate_evolutions(entries):
    """Evoluções: TODAS precisam estar conformes. `entries` = [(dia 'DD/MM', {campo: valor})].

    - todas conformes -> mantém o valor da primeira (com a assinatura da IA, se houver)
    - alguma falhou    -> 'não conforme (<motivo> — dia DD/MM, DD/MM)', dizendo em que dia falhou
    - nenhuma evolução tem o dado (só 'Não registrado') -> mantém 'Não registrado'
    - 'Não se aplica' em todas -> 'Não se aplica' (ex.: curativo)
    """
    por_campo: dict[str, list[tuple[str, str]]] = {}
    for dia, valores in entries:
        for campo, valor in valores.items():
            por_campo.setdefault(campo, []).append((dia, str(valor)))

    resultado = {}
    for campo, itens in por_campo.items():
        avaliados = [(d, v) for d, v in itens if not v.startswith("Não se aplica")]
        if not avaliados:
            resultado[campo] = itens[0][1]
            continue
        falhas = [(d, v) for d, v in avaliados if not v.startswith("conforme")]
        if not falhas:
            resultado[campo] = avaliados[0][1]
            continue
        dias = ", ".join(d for d, _ in falhas)
        v0 = falhas[0][1]
        erro_ia = next((v for _, v in falhas if "IA_NAO_EXECUTADA" in v), None)
        algum_conforme = len(falhas) < len(avaliados)
        algum_nao_conforme = any(v.startswith("não conforme") for _, v in falhas)
        if erro_ia:
            resultado[campo] = _anexa_dias(erro_ia, dias)
        elif not algum_conforme and not algum_nao_conforme:
            resultado[campo] = v0
        elif v0.startswith("não conforme"):
            resultado[campo] = _anexa_dias(v0, dias)
        else:
            interior = v0[len("Não registrado"):].strip()
            interior = interior[1:-1] if interior.startswith("(") and interior.endswith(")") else "não registrado"
            resultado[campo] = f"não conforme ({interior} — dia {dias})"
    return resultado


def audit_medical_records(records):
    """Audit medical records and extract conformity information"""
    results = []

    # Agrupa registros por prontuário
    patients: dict[str, list[dict]] = {}
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

        matrix: dict[str, dict[str, int]] = {}
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
            "secao_d_anamnese": { k: "Não registrado" for k in ["motivo_internacao", "ap_app", "af", "exame_fisico", "escala_braden", "escala_morse", "cd", "criacao_anamnese"] },
            "secao_d_evolucao": dict({ k: "Não registrado" for k in ["motivo_internacao", "exame_fisico", "condutas", "escala_braden", "escala_morse", "criacao_evolucao"] }, curativo="Não se aplica"),
            "secao_e": {
                "tem_outras_categorias": False,
                "categoria": "Não se aplica",
                "descricao": "Não se aplica"
            }
        }

        # Consolida de acordo com o tipo de registro e categoria
        descricao_cirurgica_unica = next(
            (r["descricao_cirurgica"] for r in patient_records if r.get("descricao_cirurgica")),
            None
        )

        prontuario_inicio = time.time()
        meta_lines = []
        tempo_ia_total = 0.0
        ia_meta = _new_ia_meta()
        meta_lines.append(f"\nProntuario {prontuario}")
        meta_lines.append(f"Modelo IA: {MODEL_NAME}")

        outras_categorias: dict[str, bool] = {}   # categoria -> tem descrição (seção E)
        evolucoes: dict[str, list[tuple[str, dict]]] = {}   # seção -> [(dia, resultados)]: evoluções são agregadas no fim

        for info in patient_records:
            cat = info["categoria_profissional"].upper() if info["categoria_profissional"] else ""
            tipo = info["tipo_registro"].lower() if info["tipo_registro"] else ""
            desc_norm = normalize(info["descricao"])  # sem acento e minúsculo: as regras abaixo comparam com termos sem acento

            if descricao_cirurgica_unica and audit_data["secao_c"].get("tem_cirurgia"):
                secao_c_inicio = time.time()
                meta_lines.append(f"Seção C - inicio {datetime.now().strftime('%d/%m/%y, %H:%M:%S')}")

                # descricao_tecnica começa "Não registrado" e sempre vai para a IA.
                # OPME: termo encontrado -> conforme; sem termo -> a IA decide (null = "Não se aplica").
                termos_encontrados = find_words(descricao_cirurgica_unica, TERMOS_OPME, plural=True)
                if termos_encontrados:
                    audit_data["secao_c"]["uso_opme"] = f"conforme ({', '.join(termos_encontrados)})"
                else:
                    audit_data["secao_c"]["uso_opme"] = "Não registrado"

                # Só os campos ABERTOS vão para a IA. Colunas estruturadas vazias (especialidade, unidade,
                # início, fim, CID, procedimento) ficam "Não registrado": a coluna é a fonte oficial.
                faltantes_cirurgia = [k for k in ("descricao_tecnica", "uso_opme") if audit_data["secao_c"][k] == "Não registrado"]
                if faltantes_cirurgia:
                    meta_lines.append(f"Seção C - IA ({', '.join(faltantes_cirurgia)}) inicio {datetime.now().strftime('%H:%M:%S')}")
                    ia_duracao = call_ai_and_apply(
                        audit_data["secao_c"], faltantes_cirurgia, limitar_texto(descricao_cirurgica_unica),
                        "Cirurgia / Descrição Cirúrgica", "secao_c", ia_meta,
                        null_overrides={"uso_opme": "Não se aplica (IA: null)"}
                    )
                    tempo_ia_total += ia_duracao
                    meta_lines.append(f"Seção C - IA ({', '.join(faltantes_cirurgia)}) fim {datetime.now().strftime('%H:%M:%S')} ({ia_duracao:.1f}s)")

                meta_lines.append(f"Seção C - fim {datetime.now().strftime('%d/%m/%y, %H:%M:%S')} ({time.time() - secao_c_inicio:.1f}s)")
                sys.stderr.write(f"  [Auditor] Seção Cirurgia finalizada para o prontuário {prontuario}.\n")
                # Marca como None para nao repetir nos outros registros
                descricao_cirurgica_unica = None

            local_val = {}
            target_section = None
            target_key = None

            if cat == "MEDICINA":
                if "anamnese" in tipo:
                    target_section = audit_data["secao_b_anamnese"]
                    target_key = "secao_b_anamnese"
                    local_val = {
                        "hda": "conforme" if "hda" in desc_norm or "historia da doenca" in desc_norm else "Não registrado",
                        "hd_cid": "conforme" if tem_hipotese_diagnostica(info["descricao"]) else "Não registrado",
                        "ap_app": "conforme" if "antecedentes pessoais" in desc_norm or "app" in desc_norm or "#ap" in desc_norm or "ap:" in desc_norm else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in desc_norm or "#af" in desc_norm or "af:" in desc_norm else "Não registrado",
                        "exame_fisico": check_exame_fisico_completo(info["descricao"], TERMOS_EXAME_FISICO_MEDICINA),
                        "cd": "conforme" if "conduta" in desc_norm or "terapeutica" in desc_norm or "#cd" in desc_norm or "cd:" in desc_norm else "Não registrado",
                        "criacao_anamnese": check_criacao_anamnese(info["periodo_internacao"], info["data_criacao"])
                    }
                elif "evolução" in tipo:
                    target_section = audit_data["secao_b_evolucao"]
                    target_key = "secao_b_evolucao"
                    local_val = {
                        "hd_cid": "conforme" if tem_hipotese_diagnostica(info["descricao"]) else "Não registrado",
                        "exame_fisico": check_exame_fisico_completo(info["descricao"], TERMOS_EXAME_FISICO_MEDICINA),
                        "procedimentos_condutas_queixas": "conforme" if "procedimento" in desc_norm or "conduta" in desc_norm or "queixa" in desc_norm or "intercorrencia" in desc_norm or "#cd" in desc_norm or "cd:" in desc_norm else "Não registrado"
                    }
            elif cat == "ENFERMAGEM":
                if "anamnese" in tipo:
                    target_section = audit_data["secao_d_anamnese"]
                    target_key = "secao_d_anamnese"
                    local_val = {
                        "motivo_internacao": "conforme" if "motivo" in desc_norm or "internacao" in desc_norm else "Não registrado",
                        "ap_app": "conforme" if "antecedentes" in desc_norm or "comorbidade" in desc_norm else "Não registrado",
                        "af": "conforme" if "antecedentes familiares" in desc_norm else "Não registrado",
                        "exame_fisico": check_exame_fisico_completo(info["descricao"], TERMOS_EXAME_FISICO_ENFERMAGEM),
                        "escala_braden": "conforme" if "braden" in desc_norm else "Não registrado",
                        "escala_morse": "conforme" if "morse" in desc_norm else "Não registrado",
                        "cd": "conforme" if "conduta" in desc_norm or "#cd" in desc_norm or "cd:" in desc_norm else "Não registrado",
                        "criacao_anamnese": check_criacao_anamnese(info["periodo_internacao"], info["data_criacao"])
                    }
                elif "evolução" in tipo:
                    target_section = audit_data["secao_d_evolucao"]
                    target_key = "secao_d_evolucao"
                    local_val = {
                        "motivo_internacao": "conforme" if "motivo" in desc_norm else "Não registrado",
                        "exame_fisico": check_exame_fisico_completo(info["descricao"], TERMOS_EXAME_FISICO_ENFERMAGEM),
                        "condutas": "conforme" if "conduta" in desc_norm or "#cd" in desc_norm or "cd:" in desc_norm else "Não registrado",
                        "escala_braden": "conforme" if "braden" in desc_norm else "Não registrado",
                        "escala_morse": "conforme" if "morse" in desc_norm else "Não registrado",
                        "curativo": check_curativo(info["descricao"])
                    }
            elif cat and cat not in ["MEDICINA", "ENFERMAGEM"]:
                audit_data["secao_e"]["tem_outras_categorias"] = True
                outras_categorias[cat] = outras_categorias.get(cat, False) or bool(info["descricao"])

            # Apply AI fallback if applicable
            if local_val and target_section is not None and target_key is not None:
                secao_label = f"{cat} - {tipo}"
                secao_inicio = time.time()
                meta_lines.append(f"Seção {secao_label} - inicio {datetime.now().strftime('%d/%m/%y, %H:%M:%S')}")

                faltantes = [k for k, v in local_val.items()
                             if k not in CAMPOS_SEM_IA and (v == "Não registrado" or (isinstance(v, str) and v.startswith("Não registrado")))]
                if faltantes:
                    texto_base = info["descricao"]
                    meta_lines.append(f"Seção {secao_label} - IA ({', '.join(faltantes)}) inicio {datetime.now().strftime('%H:%M:%S')}")
                    ia_duracao = call_ai_and_apply(
                        local_val, faltantes, limitar_texto(texto_base), f"{cat} - {tipo}", target_key, ia_meta,
                        null_overrides={"curativo": "não conforme (IA: tipo de curativo não identificado)"}
                    )
                    tempo_ia_total += ia_duracao
                    meta_lines.append(f"Seção {secao_label} - IA ({', '.join(faltantes)}) fim {datetime.now().strftime('%H:%M:%S')} ({ia_duracao:.1f}s)")

                if "evolução" in tipo:
                    evolucoes.setdefault(target_key, []).append((info["data_criacao"][:5], local_val))
                else:
                    merge_section(target_section, local_val)
                meta_lines.append(f"Seção {secao_label} - fim {datetime.now().strftime('%d/%m/%y, %H:%M:%S')} ({time.time() - secao_inicio:.1f}s)")
                sys.stderr.write(f"  [Auditor] Seção {cat} - {tipo} finalizada para o prontuário {prontuario}.\n")

        # Evoluções: todas precisam estar conformes (o motivo diz em que dia falhou)
        for key, entries in evolucoes.items():
            audit_data[key].update(aggregate_evolutions(entries))

        # Evolução diária (regra 3.6): médica -> frequencia_diaria; enfermagem -> criacao_evolucao
        for categoria, key, campo in (("MEDICINA", "secao_b_evolucao", "frequencia_diaria"),
                                      ("ENFERMAGEM", "secao_d_evolucao", "criacao_evolucao")):
            da_categoria = [r for r in patient_records if (r["categoria_profissional"] or "").upper() == categoria]
            anamneses = [r["data_criacao"] for r in da_categoria if "anamnese" in (r["tipo_registro"] or "").lower()]
            evolucoes_datas = [r["data_criacao"] for r in da_categoria if "evolução" in (r["tipo_registro"] or "").lower()]
            if anamneses or evolucoes_datas:
                audit_data[key][campo] = check_evolucao_diaria(
                    base_info["periodo_internacao"], base_info.get("data_saida", ""), anamneses, evolucoes_datas)

        # Seção E: guarda TODAS as categorias; só verifica se há descrição (sem avaliar o conteúdo)
        if outras_categorias:
            audit_data["secao_e"]["categoria"] = ", ".join(outras_categorias)
            audit_data["secao_e"]["descricao"] = "conforme" if all(outras_categorias.values()) else "Não registrado"

        # Fallback de IA para a seção A: diagnostico_internacao.
        # Só texto MÉDICO (regra 3.4): anamnese médica; sem ela, a primeira evolução médica.
        if audit_data["secao_a"].get("diagnostico_internacao") == "Não registrado":
            medicos = [r for r in patient_records
                       if (r["categoria_profissional"] or "").upper() == "MEDICINA" and r.get("descricao")]
            base_diagnostico = next((r for r in medicos if "anamnese" in (r["tipo_registro"] or "").lower()), None) \
                or next((r for r in medicos if "evolução" in (r["tipo_registro"] or "").lower()), None)
            if base_diagnostico:
                meta_lines.append(f"Seção A - IA (diagnostico_internacao) inicio {datetime.now().strftime('%H:%M:%S')}")
                ia_duracao = call_ai_and_apply(
                    audit_data["secao_a"], ["diagnostico_internacao"], limitar_texto(base_diagnostico["descricao"]),
                    "Identificação do Paciente", "secao_a", ia_meta
                )
                tempo_ia_total += ia_duracao
                meta_lines.append(f"Seção A - IA (diagnostico_internacao) fim {datetime.now().strftime('%H:%M:%S')} ({ia_duracao:.1f}s)")
                sys.stderr.write(f"  [Auditor] Seção A - diagnóstico_internacao finalizado para o prontuário {prontuario}.\n")

        tempo_total = time.time() - prontuario_inicio
        meta_lines.append(f"Tempo total prontuario {prontuario} = {tempo_total:.1f}s")
        meta_lines.append(f"Tempo total IA = {tempo_ia_total:.1f}s")

        # Grava metadata no arquivo
        try:
            import os
            meta_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "metadataProntuarios.txt")
            with open(meta_path, "a", encoding="utf-8") as meta_file:
                meta_file.write("\n".join(meta_lines) + "\n")
        except Exception:
            pass

        # Calculate conformities
        audit_data = calculate_conformity(audit_data)
        finalize_ia_meta(audit_data, ia_meta)

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
        # Só "conforme" conta: "Não registrado (...)", "não conforme (...)" e "Incompleto (...)" são inválidos
        if val_str.startswith(("não registrado", "nao registrado", "não conforme", "nao conforme", "incompleto")):
            return False
        return val_str not in ["não", "nao", "false", ""]

    # Helper to check if a value is "Não se aplica"
    def is_na(val):
        if not val:
            return False
        val_str = str(val).lower().strip()
        return val_str.startswith(("não se aplica", "nao se aplica")) or val_str in ["n/a", "na"]

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

