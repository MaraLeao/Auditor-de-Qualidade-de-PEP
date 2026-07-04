import json
import os
import signal
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def audit_medical_records(records):
    #llm = OllamaLLM(model="qwen2.5:0.5b")
    llm = OllamaLLM(model="steamdj/llama3.1-cpu-only")
    #llm = OllamaLLM(model="qwen3:8b")
    
    prompt_template = """
    Você é um auditor médico experiente. Analise o seguinte registro de prontuário médico e identifique se há informações cruciais faltando (como diagnóstico, evolução, conduta, sinais vitais, etc.).
    
    Registro:
    {record}
    
    Responda apenas com um JSON válido no seguinte formato exato, sem nenhum texto adicional:
    {{
        "missing_terms": ["termo1", "termo2"],
        "missing_percentage": 50.0
    }}
    Se não faltar nada, retorne uma lista vazia e 0.0.
    """
    
    prompt = PromptTemplate(template=prompt_template, input_variables=["record"])
    parser = JsonOutputParser()
    chain = prompt | llm | parser
    
    results = []
    total_missing_percentage = 0
    
    for i, record in enumerate(records):
        print(f"Auditing record {i+1}/{len(records)}...")
        record_str = json.dumps(record, ensure_ascii=False, indent=2)
        
        try:
            # Try to use LLM but with a simpler approach to avoid hanging
            # If it hangs, we'll just use the fallback
            result_json = chain.invoke({"record": record_str})
            
            results.append({
                "record_id": record.get("Prontuário", f"Record_{i+1}"),
                "missing_terms": result_json.get("missing_terms", []),
                "missing_percentage": result_json.get("missing_percentage", 0.0)
            })
            total_missing_percentage += result_json.get("missing_percentage", 0.0)
            
        except Exception as e:
            print(f"Error processing record {i+1}: {e}")
            
            # Fallback to a simple rule-based check if LLM fails
            missing = []
            if "Evolução" not in record_str and "evolução" not in record_str:
                missing.append("Evolução")
            if "Conduta" not in record_str and "conduta" not in record_str:
                missing.append("Conduta")
            if "Diagnóstico" not in record_str and "diagnóstico" not in record_str and "Hipóteses Diagnósticas" not in record_str:
                missing.append("Diagnóstico")
                
            perc = (len(missing) / 3) * 100 if missing else 0.0
            
            results.append({
                "record_id": record.get("Prontuário", f"Record_{i+1}"),
                "missing_terms": missing if missing else ["Nenhum (Análise por regras)"],
                "missing_percentage": perc,
                "error": f"LLM falhou: {str(e)}. Usado fallback de regras."
            })
            total_missing_percentage += perc
            
    # Generate summary
    summary = {
        "total_records_audited": len(records),
        "average_missing_percentage": total_missing_percentage / len(records) if records else 0,
        "detailed_results": results
    }
    
    return summary

def generate_report(summary, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Relatório de Auditoria de Prontuários Médicos\n\n")
        f.write("## Sumário Geral\n")
        f.write(f"- **Total de prontuários auditados:** {summary['total_records_audited']}\n")
        f.write(f"- **Porcentagem média de dados faltantes:** {summary['average_missing_percentage']:.2f}%\n\n")
        
        f.write("## Resultados Detalhados por Prontuário\n\n")
        for result in summary['detailed_results']:
            f.write(f"### Prontuário: {result['record_id']}\n")
            f.write(f"- **Porcentagem de dados faltantes:** {result['missing_percentage']:.2f}%\n")
            f.write(f"- **Termos faltantes:** {', '.join(result['missing_terms']) if result['missing_terms'] else 'Nenhum'}\n")
            if "error" in result:
                f.write(f"- **Observação:** {result['error']}\n")
            f.write("\n")

if __name__ == "__main__":
    input_file = "dados/P20-8600.json"
    output_file = "rel_cpu/relatorio_auditoria.md"
    
    print(f"Loading records from {input_file}...")
    records = load_json(input_file)
    
    print(f"Auditing {len(records)} records...")
    summary = audit_medical_records(records)
    
    print(f"Generating report at {output_file}...")
    generate_report(summary, output_file)
    
    print("Done!")
