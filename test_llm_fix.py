import urllib.request
import json

payload = {
    "model": "qwen2.5-3b-instruct",
    "system_prompt": """Você é um auditor médico altamente técnico e preciso. Sua tarefa é analisar o texto do registro médico abaixo e extrair as informações solicitadas.
Você deve retornar APENAS um objeto JSON válido, onde a chave é o nome do campo e o valor é a string EXATA contendo o trecho do texto onde a informação foi encontrada. Se a informação não estiver presente no texto, o valor deve ser null.
NUNCA retorne texto fora do JSON. NUNCA use formatação markdown como ```json.

Campos que você deve buscar:
- diagnostico_cid: Diagnóstico, CID ou nome do procedimento principal realizado.""",
    "input": """TIPO DO REGISTRO: Cirurgia / Descrição Cirúrgica
TEXTO DO REGISTRO:
TITULO COMPLETO: HERNIOPLASTIA INCISIONAL 

1. Paciente em decúbito dorsal sob raquianestesia
2. Assepsia, antissepsia e aposição de campos estéreis 
3. Incisão mediana transumbilical + abertura por planos anatômicos; 
4. Achados: 
   - Presença de falha aponeurótica supraumbilical de 3cm aproximadamente, com sinais de hernioplastia prévia com tela. saco herniário com omento em seu interior. 
   - Diástase do reto abdominal. 
5. Conduta: 
   - Dissecção da aponeurose até encontrá-la sadia
  - Fechamento da aponeurose com imbricatura utilizando vicryl 1
   - Aposição de tela de prolene 15x15cm em posição onlay 
   - Fixação do umbigo com nylon 2-0
   - Aposição de dreno portovac 6.4 em subcutâneo e fixado com nylon 2-0 
6. Aproximado tecido celular subcutâneo com fio Vicryl 0; 
7. Síntese da pele com Nylon.0 
8. Curativo oclusivo"""
}

req = urllib.request.Request(
    "http://192.168.0.18:1234/api/v1/chat",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=60) as response:
        result_json = json.loads(response.read().decode("utf-8"))
        if "output" in result_json and isinstance(result_json["output"], list) and len(result_json["output"]) > 0:
            print(result_json["output"][0].get("content", ""))
        else:
            print(result_json)
except Exception as e:
    print(f"Error: {e}")
