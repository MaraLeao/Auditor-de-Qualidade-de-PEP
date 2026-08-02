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
            f.write(f"Procedimentos, condutas, queixas e intercorrências: {s_b_e.get('procedimentos_condutas_queixas', 'Não registrado')}\n")
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
            f.write(f"Criação da Anamnese: {s_d_a.get('criacao_anamnese', 'Não registrado')}\n")
            f.write(f"Curativo: {s_d_a.get('curativo', 'Não se aplica')}\n\n")
            
            c_d_a = data.get("conformity_d_anamnese", {})
            f.write(f"Percentual de conformidade da Anamnese de Enfermagem: {c_d_a.get('percent', 0):.1f}%\n\n")
            
            f.write("Evolução de Enfermagem\n\n")
            s_d_e = data.get("secao_d_evolucao", {})
            f.write(f"Motivo da internação ou HD/CID: {s_d_e.get('motivo_internacao', 'Não registrado')}\n")
            f.write(f"Exame físico completo: {s_d_e.get('exame_fisico', 'Não registrado')}\n")
            f.write(f"Condutas realizadas: {s_d_e.get('condutas', 'Não registrado')}\n")
            f.write(f"Escala de Braden: {s_d_e.get('escala_braden', 'Não registrado')}\n")
            f.write(f"Escala de Morse: {s_d_e.get('escala_morse', 'Não registrado')}\n")
            f.write(f"Criação da Evolução: {s_d_e.get('criacao_evolucao', 'Não registrado')}\n")
            f.write(f"Curativo: {s_d_e.get('curativo', 'Não se aplica')}\n\n")
            
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
            
            c_b_total = c_b_a.get('total', 0) + c_b_e.get('total', 0)
            c_b_valid = c_b_a.get('valid', 0) + c_b_e.get('valid', 0)
            c_b_percent = (c_b_valid / c_b_total * 100) if c_b_total > 0 else 0
            f.write(f"{'Seção B – Medicina':<35} | {c_b_total:<15} | {c_b_valid:<10} | {c_b_total - c_b_valid:<12} | {c_b_percent:.1f}%\n")
            
            if c_c.get("applies", False):
                f.write(f"{'Seção C – Cirurgia':<35} | {c_c.get('total', 0):<15} | {c_c.get('valid', 0):<10} | {c_c.get('total', 0) - c_c.get('valid', 0):<12} | {c_c.get('percent', 0):.1f}%\n")
            else:
                f.write(f"{'Seção C – Cirurgia':<35} | {'N/A':<15} | {'N/A':<10} | {'N/A':<12} | {'N/A':<10}\n")
                
            c_d_total = c_d_a.get('total', 0) + c_d_e.get('total', 0)
            c_d_valid = c_d_a.get('valid', 0) + c_d_e.get('valid', 0)
            c_d_percent = (c_d_valid / c_d_total * 100) if c_d_total > 0 else 0
            f.write(f"{'Seção D – Enfermagem':<35} | {c_d_total:<15} | {c_d_valid:<10} | {c_d_total - c_d_valid:<12} | {c_d_percent:.1f}%\n")
            
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
            f.write("-" * 80 + "\n\n")
            
            matriz_info = data.get("matriz_documentos", {})
            datas = matriz_info.get("datas", [])
            matriz = matriz_info.get("matriz", {})
            
            if datas and matriz:
                f.write("Quantitativo de Registros por Categoria e Dia\n\n")
                
                header_format = f"{'Documento':<40} | " + " | ".join([f"{d:<11}" for d in datas]) + " | Total"
                f.write(header_format + "\n")
                f.write("-" * len(header_format) + "\n")
                
                for doc, counts in sorted(matriz.items()):
                    row_str = f"{doc:<40} | "
                    total_row = 0
                    for d in datas:
                        c = counts.get(d, 0)
                        total_row += c
                        row_str += f"{c:<11} | "
                    row_str += f"{total_row}"
                    f.write(row_str + "\n")
                    
                f.write("\n")
                
            f.write("=" * 80 + "\n\n\n")

