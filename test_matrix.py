import json
with open('data_extract/data/P2-6800.json', 'r') as f:
    data = json.load(f)

for r in data:
    cat = r.get("Categoria Profissional")
    tipo = r.get("Tipo do registro")
    dt = r.get("criacao_anamnsese", "").split(',')[0].strip()
    print(f"{cat} - {tipo} no dia {dt}")
