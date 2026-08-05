import sys
import json
import urllib.request
import urllib.error
import os

LMSTUDIO_URL = os.environ.get("LMSTUDIO_URL", "http://localhost:1234/api/v1/chat")
MODEL_NAME = "qwen2.5-3b-instruct"

REGRAS_CAMPOS = {
    "curativo": "Quando houver curativo (ESTE ITEM NÃO É OBRIGATÓRIO), SEMPRE classificar por tipo: 'Curativo especial' (feridas complexas), 'Curativo simples' (feridas simples), ou 'Curativo grau II' (lesões abertas extensas). Se o texto mencionar um curativo sem a classificação exata, avalie pelo contexto ou marque ausente se não houver detalhamento adequado.",
    "hda": "História da Doença Atual. Procure por relatos sobre como a doença ou sintoma que causou a internação começou e evoluiu.",
    "hd_cid": "Hipótese Diagnóstica. Procure pelo diagnóstico clínico provável ou definitivo, geralmente após as marcas #HD:, HD:, Hipótese Diagnóstica ou CID.",
    "diagnostico_cid": "Diagnóstico clínico principal. Procure ESPECIFICAMENTE após as marcas #HD:, HD: ou Hipótese Diagnóstica. Exemplos: 'Hérnia Incisional pós-herniorrafia', 'Pneumonia Bacteriana', 'Apendicite Aguda'. NÃO use o nome de um procedimento cirúrgico como resposta.",
    "diagnostico_internacao": "Diagnóstico principal da internação. Procure por hipóteses diagnósticas (#HD:), CID, ou descrição da doença ou motivo que levou o paciente a ser internado. Exemplos: 'Hérnia Incisional', 'Insuficiência Cardíaca', 'Fratura de Fêmur'.",
    "descricao_procedimento": "Descrição do procedimento realizado ou intervenção cirúrgica.",
    "descricao_tecnica": "Descrição da técnica cirúrgica, achados ou passo a passo da cirurgia.",
    "uso_opme": "Uso de Órteses, Próteses ou Materiais Especiais (ex: tela, placa, parafuso, cateter, malha, etc).",
    "ap_app": "Antecedentes Pessoais (Patológicos). Procure por doenças pré-existentes, cirurgias anteriores, histórico médico, comorbidades (ex: HAS, DM, DLP), ou alergias do paciente. Termos comuns: COMORBIDADES, ALERGIAS, APP, Antecedentes Pessoais.",
    "af": "Antecedentes Familiares. Procure por histórico de doenças na família.",
    "exame_fisico": "Exame Físico. Procure por avaliações clínicas corporais (ausculta, palpação, inspeção, sinais vitais, estado geral).",
    "cd": "Conduta ou Terapêutica. Procure pelas ações tomadas (prescrição, exames solicitados, plano terapêutico).",
    "procedimentos_condutas_queixas": "Procedimentos, Condutas ou Queixas. Procure por ações tomadas, intervenções ou reclamações do paciente.",
    "motivo_internacao": "Motivo da internação. Por que o paciente está no hospital?",
    "escala_braden": "Escala de Braden. Avaliação de risco de lesão por pressão (úlceras).",
    "escala_morse": "Escala de Morse. Avaliação de risco de quedas.",
    "condutas": "Condutas de enfermagem realizadas.",
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
        "Sua tarefa é analisar o texto do registro médico abaixo e extrair as informações solicitadas.\n"
        "Você deve retornar APENAS um objeto JSON válido, onde a chave é o nome do campo e o valor é a string EXATA contendo o trecho do texto onde a informação foi encontrada. "
        "Se a informação não estiver presente no texto, o valor deve ser null.\n"
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
