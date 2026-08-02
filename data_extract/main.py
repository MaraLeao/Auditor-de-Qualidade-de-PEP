import sys
import json
from data_extract.core.auditor import audit_medical_records
from data_extract.reporters.json_builder import build_json_report

def run_audit(records: list) -> list:
    """
    Main entry point for auditing medical records in memory.
    Expects a list of dictionaries (the parsed JSON records)
    and returns a structured list of audit results.
    """
    if not records:
        return []
        
    sys.stderr.write(f"Auditing {len(records)} records...\n")
    
    # Process all records using the core auditor
    results = audit_medical_records(records)
    
    # Format the results into final JSON structure
    final_json = build_json_report(results)
    
    return final_json

if __name__ == "__main__":
    try:
        # Lê o JSON da entrada padrão (stdin) para suportar payloads grandes vindos do JS
        input_data = sys.stdin.read()
        if not input_data.strip():
            sys.stderr.write("Erro: Nenhum dado JSON fornecido na entrada padrão (stdin).\n")
            sys.exit(1)
            
        records = json.loads(input_data)
        
        # Executa a auditoria
        json_results = run_audit(records)
        
        # Imprime o resultado como JSON puro no stdout (para o JS capturar)
        print(json.dumps(json_results, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        sys.stderr.write(f"Erro ao decodificar JSON: {str(e)}\n")
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"Erro interno: {str(e)}\n")
        sys.exit(1)
