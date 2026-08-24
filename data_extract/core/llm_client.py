import sys
import json
import urllib.request
import urllib.error
import os

LMSTUDIO_URL = os.environ.get("LMSTUDIO_URL", "http://localhost:1234/api/v1/chat")
MODEL_NAME = os.environ.get("LLM_MODEL", "qwen2.5-3b-instruct")

REGRAS_CAMPOS = {
    "curativo": "Curativo (ITEM NÃO OBRIGATÓRIO — só preencha se houver menção explícita a curativo). Classifique OBRIGATORIAMENTE em uma das 3 categorias: 'Curativo especial' (feridas complexas, coberturas especiais, drenos, ou descrição detalhada de técnica), 'Curativo simples' (troca de curativo comum, sem complexidade adicional), ou 'Curativo grau II' (lesão aberta extensa, com exposição de tecido). Se houver menção a curativo mas SEM detalhamento suficiente para classificar com segurança, retorne o trecho encontrado mesmo assim, mas mantenha o texto original (não invente a classificação). Se não houver NENHUMA menção a curativo no texto, retorne null.",
    "hda": "História da Doença Atual (HDA). Procure relatos sobre como o sintoma ou doença que motivou a internação começou e evoluiu ao longo do tempo (ex: 'paciente iniciou quadro há 3 dias com...'). Geralmente é uma narrativa temporal, não apenas uma palavra ou diagnóstico isolado. Diferente de 'motivo_internacao', que é a razão objetiva e direta da internação.",
    "hd_cid": "Hipótese Diagnóstica (HD) ou CID, como está registrado no documento — extraia o trecho LITERAL que aparece após as marcas '#HD:', 'HD:', 'Hipótese Diagnóstica:' ou 'CID:'. Este campo é sobre COMO o diagnóstico está formalmente registrado no documento, não uma interpretação sua do diagnóstico.",
    "diagnostico_cid": "Diagnóstico clínico principal (a doença em si, não o registro formal). Procure ESPECIFICAMENTE após as marcas '#HD:', 'HD:' ou 'Hipótese Diagnóstica'. Exemplos válidos: 'Hérnia Incisional pós-herniorrafia', 'Pneumonia Bacteriana', 'Apendicite Aguda'. NÃO use o nome de um procedimento cirúrgico como resposta (ex: 'Sinusotomia' NÃO é diagnóstico, é o procedimento realizado — use o campo 'descricao_procedimento' para isso). Se 'hd_cid' e 'diagnostico_cid' apontarem para o mesmo trecho de texto, isso é esperado — retorne o mesmo valor nos dois campos.",
    "diagnostico_internacao": "Diagnóstico principal que justificou a internação (mesmo conceito clínico de 'diagnostico_cid', mas focado no motivo de internação). Procure por hipóteses diagnósticas (#HD:), CID, ou descrição da doença/motivo que levou à internação. Exemplos: 'Hérnia Incisional', 'Insuficiência Cardíaca', 'Fratura de Fêmur'. Se coincidir com 'diagnostico_cid', retorne o mesmo valor — não é erro os dois campos serem iguais.",
    "descricao_procedimento": "Descrição do procedimento ou intervenção cirúrgica REALIZADA (o que efetivamente foi feito na cirurgia). Geralmente encontrado em seções tipo 'PROCEDIMENTOS REALIZADOS' ou na descrição cirúrgica. Diferente de 'diagnostico_cid' (a doença) e de 'cd'/'condutas' (plano futuro de ação).",
    "descricao_tecnica": "Descrição da técnica cirúrgica, achados intraoperatórios ou passo a passo numerado da cirurgia (ex: '1. Paciente em decúbito dorsal...', '2. Assepsia...'). Geralmente é um texto longo e sequencial, diferente de 'descricao_procedimento', que é mais um resumo/nome do procedimento.",
    "uso_opme": "Uso de Órteses, Próteses ou Materiais Especiais. Procure menções explícitas a materiais implantados ou utilizados (ex: tela, placa, parafuso, cateter, malha, prótese). Se não houver nenhuma menção a esses materiais, retorne null — não infira uso de OPME apenas porque houve cirurgia.",
    "ap_app": "Antecedentes Pessoais (Patológicos) DO PRÓPRIO PACIENTE — não da família. Procure doenças pré-existentes, cirurgias anteriores, histórico médico, comorbidades (ex: HAS, DM, DLP) ou alergias DO PACIENTE. Termos comuns: COMORBIDADES, ALERGIAS, APP, Antecedentes Pessoais. IMPORTANTE — negação seguida de afirmação: se o texto tiver uma negação geral (ex: 'NEGA HAS/DM') seguida de uma afirmação específica (ex: 'REFERE ALERGIA A DIPIRONA'), a afirmação específica PREVALECE e deve ser extraída, mesmo com a negação anterior. Exemplo: texto 'PACIENTE NEGA HAS / DM. REFERE ALERGIA A DIPIRONA.' -> retornar 'REFERE ALERGIA A DIPIRONA'. Se o texto APENAS negar, sem nenhuma afirmação positiva depois (ex: só 'NEGA COMORBIDADES'), retorne null — negação pura não conta como informação presente. NÃO confunda com antecedentes familiares (campo 'af') — só preencha aqui se for sobre o próprio paciente, não sobre parentes.",
    "af": "Antecedentes Familiares — histórico de doenças em PARENTES do paciente (mãe, pai, irmãos, avós), e NÃO do próprio paciente. Só preencha se houver menção EXPLÍCITA a um familiar (ex: 'mãe hipertensa', 'pai diabético', 'histórico familiar de câncer'). Se o texto disser apenas 'paciente nega HAS/DM' (sem citar família), isso NÃO é antecedente familiar — retorne null, mesmo que HAS/DM sejam mencionados.",
    "exame_fisico": "Exame Físico. Procure avaliações clínicas corporais objetivas: ausculta, palpação, inspeção, sinais vitais, estado geral, sistemas (nervoso, respiratório, cardiovascular, etc.). Geralmente é uma seção estruturada com múltiplos subitens.",
    "cd": "Conduta médica (plano de ação definido pelo MÉDICO). Procure pelo plano terapêutico, geralmente após as marcas 'CD:', 'Conduta:' ou 'Plano:'. Inclui prescrições, exames solicitados, encaminhamentos. Exemplo: 'CD: Solicito TC de abdome, manter dieta zero' -> retornar 'Solicito TC de abdome, manter dieta zero'. Diferente de 'condutas' (que é a versão de ENFERMAGEM, não médica) e de 'procedimentos_condutas_queixas' (que também inclui queixas do paciente, não só o plano). NÃO confundir com motivo da internação nem diagnóstico.",
    "procedimentos_condutas_queixas": "Procedimentos, condutas OU queixas relatadas pelo paciente — campo mais amplo que 'cd', usado quando o registro mistura ações tomadas com reclamações/sintomas relatados pelo paciente. Use este campo apenas quando o texto não permitir separar claramente conduta de queixa.",
    "motivo_internacao": "Motivo objetivo da internação — resposta direta a 'por que o paciente está internado'. Geralmente uma frase curta (ex: 'internação para realização de sinusectomia bilateral'). Diferente de 'hda', que é a narrativa de como o quadro evoluiu, não apenas o motivo direto.",
    "escala_braden": "Escala de Braden — avaliação de risco de lesão por pressão (úlceras). Procure o valor numérico e/ou classificação de risco (ex: 'BRADEN 18 RISCO LEVE'). Retorne o trecho com valor e classificação, se ambos existirem.",
    "escala_morse": "Escala de Morse — avaliação de risco de quedas. Procure o valor numérico e/ou classificação de risco (ex: 'MORSE 15 RISCO BAIXO'). Retorne o trecho com valor e classificação, se ambos existirem.",
    "condutas": "Condutas de ENFERMAGEM (não médicas) realizadas ou planejadas. Geralmente aparece em seção 'CONDUTAS:' dentro de registros de Enfermagem. Diferente de 'cd', que é a conduta do MÉDICO.",
}

def validate_missing_fields_with_ai(texto, campos_faltantes, tipo_registro):
    """
    Usa um LLM via LMStudio para tentar encontrar campos que as regras baseadas em regex/palavras-chave não acharam.
    """
    if not texto or not texto.strip():
        return {}

    # Prepara as definições dos campos faltantes
    definicoes = []
    for campo in campos_faltantes:
        desc = REGRAS_CAMPOS.get(campo, f"Encontre se existe informação sobre {campo}.")
        definicoes.append(f"- {campo}: {desc}")
    
    definicoes_texto = "\n".join(definicoes)

    system_prompt = (
        "Você é um auditor médico altamente técnico e preciso. "
        "Sua tarefa é analisar o texto do registro médico abaixo e extrair as informações solicitadas, avaliando também sua completude.\n"
        "Você deve retornar APENAS um objeto JSON válido, onde a chave é o nome do campo e o valor é a string EXATA contendo o trecho do texto onde a informação foi encontrada. "
        "Se a informação não estiver presente no texto, o valor deve ser null.\n"
        "IMPORTANTE: Verifique a completude da informação. Por exemplo, no 'exame_fisico', se a descrição for muito curta ou faltarem os sistemas básicos (respiratório, cardiovascular, etc), você DEVE retornar a string 'não conforme (incompleto)' em vez da extração.\n"
        "NUNCA retorne texto fora do JSON. NUNCA use formatação markdown como ```json.\n\n"
        f"Campos que você deve buscar:\n{definicoes_texto}"
    )

    input_text = f"TIPO DO REGISTRO: {tipo_registro}\nTEXTO DO REGISTRO:\n{texto}"

    payload = {
        "model": MODEL_NAME,
        "system_prompt": system_prompt,
        "input": input_text
    }

    try:
        sys.stderr.write(f"  [AI Fallback] Chamando LMStudio para os campos: {campos_faltantes}...\n")
        
        req = urllib.request.Request(
            LMSTUDIO_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=300) as response:
            response_data = response.read().decode("utf-8")
            result_json = json.loads(response_data)
        
        # O modelo costuma retornar o texto da resposta numa chave como 'choices' -> 'message' -> 'content'
        # ou direto no formato do endpoint simplificado. Vamos lidar com formatos comuns do LMStudio.
        
        if "choices" in result_json:
            texto_resposta = result_json["choices"][0]["message"]["content"]
        elif "output" in result_json and isinstance(result_json["output"], list) and len(result_json["output"]) > 0:
            texto_resposta = result_json["output"][0].get("content", "")
        elif "content" in result_json:
            texto_resposta = result_json["content"]
        elif "response" in result_json:
            texto_resposta = result_json["response"]
        elif "text" in result_json:
            texto_resposta = result_json["text"]
        else:
            # Se for só a string direta (improvável para JSON, mas por segurança)
            texto_resposta = str(result_json)

        # Limpeza caso a IA teime em colocar blocos de markdown
        texto_resposta = texto_resposta.strip()
        if texto_resposta.startswith("```json"):
            texto_resposta = texto_resposta[7:]
        if texto_resposta.startswith("```"):
            texto_resposta = texto_resposta[3:]
        if texto_resposta.endswith("```"):
            texto_resposta = texto_resposta[:-3]
        texto_resposta = texto_resposta.strip()
        
        sys.stderr.write(f"  [AI Fallback] Resposta: {texto_resposta}\n")

        analise = json.loads(texto_resposta)
        return analise

    except Exception as e:
        sys.stderr.write(f"  [AI Fallback Error] Erro ao chamar LMStudio: {str(e)}\n")
        return {}
