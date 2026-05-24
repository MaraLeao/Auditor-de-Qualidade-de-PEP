import React, { useState } from 'react';

export default function ExplanationView({ isMobile }) {
  const [openSection, setOpenSection] = useState({
    A: true,
    B: true,
    C: false,
    D: false,
    E: false,
    F: false
  });

  const toggle = (id) => {
    setOpenSection(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const regulations = [
    {
      title: 'CFM (Conselho Federal de Medicina)',
      sub: 'Resoluções CFM nº 1.821/07 e nº 2.217/18',
      icon: '⚖️',
      color: 'var(--accent)',
      points: [
        'Estruturação obrigatória de Anamnese nas primeiras 24 horas de admissão.',
        'Exigência de Evolução Médica diária, com registro cronológico claro.',
        'Legibilidade, identificação do profissional e assinatura com CRM/Registro.',
        'Registro de Hipótese Diagnóstica (HD) e conduta terapêutica clara.'
      ]
    },
    {
      title: 'LGPD (Privacidade em Saúde)',
      sub: 'Lei Geral de Proteção de Dados (Lei nº 13.709/18)',
      icon: '🔒',
      color: 'var(--yellow)',
      points: [
        'Tratamento de dados sensíveis de saúde com restrição de acesso e criptografia.',
        'Anonimização ou pseudonimização de dados pessoais identificadores no painel geral.',
        'Rastreabilidade completa de quem visualizou ou alterou o PEP.',
        'Consentimento e finalidade bem definidas para auditoria e pesquisas.'
      ]
    },
    {
      title: 'RDC 63/2011 (Anvisa)',
      sub: 'Requisitos de Boas Práticas de Serviços de Saúde',
      icon: '🛡️',
      color: 'var(--green)',
      points: [
        'Garantia de segurança do paciente com registros de integridade lógica.',
        'Proibição absoluta de rasuras, apagamentos ou sobreposições de texto.',
        'Segregação adequada de responsabilidade profissional entre medicina, enfermagem, etc.',
        'Identificação de conformidades físicas em salas de bloco cirúrgico e UTI.'
      ]
    }
  ];

  return (
    <div style={{ padding: isMobile ? '12px 10px 80px' : '24px 16px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>⚕</span> Guia de Auditoria e Conformidade
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: isMobile ? 13 : 15, marginTop: 8, maxWidth: 700, lineHeight: 1.6 }}>
          Entenda as regras de negócios clínicas e administrativas que ditam as conformidades nos relatórios e auditorias de prontuários da instituição.
        </p>
      </div>

      {/* Regs Cards */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16, letterSpacing: '-0.02em' }}>Bases Legais e Regulatórias</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        {regulations.map((reg, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 24,
                width: 44,
                height: 44,
                borderRadius: 10,
                background: `${reg.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: reg.color
              }}>{reg.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{reg.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{reg.sub}</div>
              </div>
            </div>
            <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />
            <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reg.points.map((pt, i) => (
                <li key={i} style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Section Header */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16, letterSpacing: '-0.02em' }}>Mapeamento das Seções de Auditoria</h2>
      
      {/* Legend Block */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: 16
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', padding: '2px 8px', borderRadius: 6, fontFamily: 'var(--mono)', fontWeight: 600 }}>✅ Conforme</span>
          <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>Informação presente, adequada e compatível com o padrão exigido.</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, background: 'rgba(255, 82, 82, 0.1)', color: '#ff5252', padding: '2px 8px', borderRadius: 6, fontFamily: 'var(--mono)', fontWeight: 600 }}>❌ Não conforme</span>
          <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>Informação ausente, incompleta, inconsistente ou inadequada.</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14, background: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontFamily: 'var(--mono)', fontWeight: 600 }}>🔵 Não se aplica</span>
          <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>Item não obrigatório ou categoria inexistente no prontuário.</span>
        </div>
      </div>

      {/* Accordions Wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        
        {/* Seção A */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('A')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção A</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Identificação do Atendimento</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.A ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.A && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Validar se os dados administrativos e assistenciais básicos do atendimento estão completos e coerentes.</p>
              
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CAMPOS AVALIADOS</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Prontuário', 'Data de nascimento', 'Idade', 'Período da internação', 'Diagnóstico/CID', 'Especialidade cirúrgica', 'Unidade funcional da internação', 'Unidade funcional cirúrgica'].map(f => (
                  <span key={f} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 10px', borderRadius: 20, fontFamily: 'var(--sans)' }}>{f}</span>
                ))}
              </div>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CRITÉRIOS DE AVALIAÇÃO</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <span style={{ color: '#00e676', fontWeight: 600 }}>Conforme:</span>
                  <span style={{ color: 'var(--text2)' }}>Todos os dados identificadores estão presentes; datas são coerentes; CID compatível com diagnóstico; unidade assistencial descrita corretamente.</span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <span style={{ color: '#ff5252', fontWeight: 600 }}>Não Conforme:</span>
                  <span style={{ color: 'var(--text2)' }}>Presença de ausência de identificação, datas inconsistentes, CID incompatível ou unidade não registrada.</span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Não se Aplica:</span>
                  <span style={{ color: 'var(--text3)' }}>Normalmente não utilizado nesta seção, pois todos os campos de identificação são obrigatórios.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção B */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('B')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção B</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Anamnese e Evoluções Médicas</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.B ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.B && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Avaliar a qualidade técnica da admissão médica inicial e a continuidade da assistência médica durante todo o internamento.</p>

              {/* Subsection 2.1 */}
              <div style={{ marginTop: 20, background: 'var(--bg3)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px 0' }}>2.1 Anamnese Médica</h5>
                <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 12px 0' }}>Avaliação da admissão inicial do paciente. <strong>Regra institucional:</strong> deve ser elaborada em até 12 horas após a data de internação.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { c: 'HDA', val: 'Descrição clara da doença atual, com sintomas, tempo de evolução e contexto clínico.', err: 'HDA ausente, superficial ou sem descrição da queixa principal.' },
                    { c: 'HD/CID', val: 'Presença de hipótese diagnóstica e CID compatível com o quadro descrito.', err: 'Ausência de HD ou CID incompatível.' },
                    { c: 'AP/APP', val: 'Registro de comorbidades, cirurgias prévias, hábitos e antecedentes pessoais.', err: 'Antecedentes pessoais ausentes no registro.' },
                    { c: 'AF', val: 'Histórico de antecedentes familiares claramente detalhado.', err: 'Ausência de antecedentes familiares.' },
                    { c: 'Exame Físico', val: 'Exame clínico organizado contendo sinais vitais e avaliação de sistemas corporais.', err: 'Exame clínico incompleto ou com ausência de sistemas corporais.' },
                    { c: 'Conduta', val: 'Plano terapêutico detalhado (medicações, exames, encaminhamentos ou cirurgia).', err: 'Ausência de plano assistencial ou condutas vagas.' },
                    { c: 'Tempo', val: 'Tempo decorrido entre internação e anamnese ≤ 12h.', err: 'Anamnese realizada após 12h da internação.' }
                  ].map(item => (
                    <div key={item.c} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, fontSize: 11 }}>
                      <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>{item.c}</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                        <span style={{ color: '#00e676' }}>✅ Conforme se: {item.val}</span>
                        <span style={{ color: '#ff5252' }}>❌ Não Conforme se: {item.err}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsection 2.2 */}
              <div style={{ marginTop: 20, background: 'var(--bg3)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px 0' }}>2.2 Evoluções Médicas</h5>
                <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 12px 0' }}>Avaliação da continuidade assistencial médica diária do paciente.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { c: 'Evolução Diária', val: 'Existência de evolução para todos os dias regulamentares da internação.', err: 'Ausência de registro de evolução em qualquer dia necessário.' },
                    { c: 'Exame Físico', val: 'Contém avaliação clínica objetiva/exame físico do dia na evolução.', err: 'Evolução puramente narrativa, sem registro do exame clínico.' },
                    { c: 'Condutas', val: 'Plano terapêutico explícito e condutas tomadas no dia.', err: 'Ausência de registro de conduta.' },
                    { c: 'Queixas/Intercorrências', val: 'Sintomas relatados e evolução clínica descritos de forma objetiva.', err: 'Ausência de evolução clínica ou relato de queixas.' }
                  ].map(item => (
                    <div key={item.c} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, fontSize: 11 }}>
                      <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>{item.c}</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                        <span style={{ color: '#00e676' }}>✅ Conforme se: {item.val}</span>
                        <span style={{ color: '#ff5252' }}>❌ Não Conforme se: {item.err}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção C */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('C')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção C</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Cirurgia</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.C ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.C && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Validar a qualidade do registro operatório do procedimento realizado no bloco cirúrgico.</p>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>ITENS AVALIADOS</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Especialidade', 'Unidade Funcional', 'Data', 'Horário Início/Fim', 'CID', 'Procedimento', 'Técnica Operatória', 'OPME'].map(f => (
                  <span key={f} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 10px', borderRadius: 20 }}>{f}</span>
                ))}
              </div>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CRITÉRIOS DE AVALIAÇÃO</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  <strong style={{ color: 'var(--text)' }}>Técnica Cirúrgica</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, marginTop: 4 }}>
                    <span style={{ color: '#00e676' }}>✅ Conforme: Descrição detalhada incluindo tipo de anestesia, via de incisão, achados operatórios, técnica, síntese de planos e descrição do curativo oclusivo pós-cirúrgico.</span>
                    <span style={{ color: '#ff5252' }}>❌ Não Conforme: Técnica incompleta ou ausência completa de descrição operatória.</span>
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                  <strong style={{ color: 'var(--text)' }}>Horários da Cirurgia</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, marginTop: 4 }}>
                    <span style={{ color: '#00e676' }}>✅ Conforme: Horário de início e horário de fim da cirurgia documentados corretamente.</span>
                    <span style={{ color: '#ff5252' }}>❌ Não Conforme: Horários ausentes no registro cirúrgico.</span>
                  </div>
                </div>
                <div>
                  <strong style={{ color: 'var(--text)' }}>OPME (Órteses, Próteses e Materiais Especiais)</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, marginTop: 4 }}>
                    <span style={{ color: '#00e676' }}>✅ Conforme: Descrição e especificação detalhada de materiais especiais implantados ou utilizados.</span>
                    <span style={{ color: 'var(--accent)' }}>🔵 Não se Aplica: Quando o procedimento realizado não envolve o uso de OPME.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção D */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('D')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção D</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Anamnese e Evoluções de Enfermagem</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.D ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.D && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Avaliar a qualidade da admissão e da continuidade da assistência diária prestada pela equipe de Enfermagem, bem como o uso de escalas de risco.</p>

              {/* Subsection 4.1 */}
              <div style={{ marginTop: 20, background: 'var(--bg3)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px 0' }}>4.1 Anamnese de Enfermagem</h5>
                <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 12px 0' }}>Admissão realizada pela equipe de Enfermagem no momento da internação do paciente.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11 }}>
                  {[
                    { c: 'Escalas Assistenciais', val: 'Registro completo da Escala de Braden (risco de LPP) e Escala de Morse (risco de queda).', err: 'Ausência ou preenchimento incorreto de qualquer uma das escalas.' },
                    { c: 'Exame Físico de Enfermagem', val: 'Avaliação detalhada por sistemas corporais, sinais vitais, dispositivos em uso e características de eliminações.', err: 'Exame físico incompleto ou sem descrição sistêmica.' },
                    { c: 'Antecedentes Familiares (AF)', val: 'Registro adequado dos antecedentes de saúde da família.', err: 'Ausência do preenchimento de AF.' }
                  ].map(item => (
                    <div key={item.c} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                      <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>{item.c}</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                        <span style={{ color: '#00e676' }}>✅ Conforme: {item.val}</span>
                        <span style={{ color: '#ff5252' }}>❌ Não Conforme: {item.err}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsection 4.2 */}
              <div style={{ marginTop: 20, background: 'var(--bg3)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px 0' }}>4.2 Evoluções de Enfermagem</h5>
                <p style={{ fontSize: 11, color: 'var(--text2)', margin: '0 0 12px 0' }}>Registros diários do acompanhamento de enfermagem e evolução do plano assistencial.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11 }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <strong style={{ color: 'var(--text)' }}>Evolução Diária</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8, marginTop: 4 }}>
                      <span style={{ color: '#00e676' }}>✅ Conforme: Presença diária de registro de evolução.</span>
                      <span style={{ color: '#ff5252' }}>❌ Não Conforme: Ausência de evolução em algum dia da internação.</span>
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Curativos (Quando houver)</strong>
                    <p style={{ color: 'var(--text2)', fontSize: 10, margin: '4px 0 8px 8px' }}>
                      <strong>Classificação:</strong><br />
                      • <em>Curativo Simples:</em> pós-operatórios simples ou feridas pequenas/superficiais.<br />
                      • <em>Curativo Especial:</em> feridas complexas, lesões profundas ou grande volume de exsudato.<br />
                      • <em>Curativo Grau II:</em> lesões abertas muito extensas ou perda importante de tecido.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
                      <span style={{ color: '#00e676' }}>✅ Conforme: Descrição técnica completa contendo obrigatoriamente <strong>tamanho da lesão, exsudato (volume/aspecto), necrose e aspecto geral</strong> da ferida.</span>
                      <span style={{ color: '#ff5252' }}>❌ Não Conforme: Ausência ou omissão de qualquer critério obrigatório (tamanho, exsudato, necrose ou aspecto).</span>
                      <span style={{ color: 'var(--accent)' }}>🔵 Não se Aplica: Quando o paciente não possuir curativos indicados.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção E */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('E')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção E</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Outras Categorias Profissionais</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.E ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.E && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Avaliar a existência e o rigor técnico dos registros assistenciais das equipes multiprofissionais de saúde acionadas na internação.</p>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CATEGORIAS PROFISSIONAIS ANALISADAS</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Fisioterapia', 'TO (Terapia Ocupacional)', 'Nutrição', 'Psicologia', 'Fonoaudiologia', 'Serviço Social', 'Farmácia'].map(f => (
                  <span key={f} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 10px', borderRadius: 20 }}>{f}</span>
                ))}
              </div>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CRITÉRIOS DE AVALIAÇÃO</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#00e676', fontWeight: 600, whiteSpace: 'nowrap' }}>✅ Conforme:</span>
                  <span style={{ color: 'var(--text2)' }}>Existe o registro da evolução no prontuário, a assistência está devidamente descrita e há registro de condutas terapêuticas.</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#ff5252', fontWeight: 600, whiteSpace: 'nowrap' }}>❌ Não Conforme:</span>
                  <span style={{ color: 'var(--text2)' }}>Registro incompleto, muito genérico ou com ausência total de descrição de evolução e condutas.</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600, whiteSpace: 'nowrap' }}>🔵 Não se Aplica:</span>
                  <span style={{ color: 'var(--text3)' }}>Quando a categoria profissional específica não foi solicitada ou acionada para o atendimento do paciente.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção F */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)', overflow: 'hidden' }}>
          <button onClick={() => toggle('F')} style={{
            width: '100%', background: 'transparent', border: 'none', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)', color: 'var(--accent)', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>Seção F</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Relatório Final</span>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>{openSection.F ? '▲ Recolher' : '▼ Expandir'}</span>
          </button>
          
          {openSection.F && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.005)' }}>
              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 6, fontFamily: 'var(--mono)' }}>OBJETIVO</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>Compilar os dados quantitativos totais e consolidar a nota global de conformidade regulatória do prontuário eletrônico do paciente.</p>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>COMPONENTES AVALIADOS</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Quantidade de registros', 'Procedimentos SIGTAP', 'Conformidades', 'Não conformidades', 'Percentual final'].map(f => (
                  <span key={f} style={{ fontSize: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 10px', borderRadius: 20 }}>{f}</span>
                ))}
              </div>

              <h4 style={{ fontSize: 12, color: 'var(--accent)', marginTop: 16, marginBottom: 8, fontFamily: 'var(--mono)' }}>CÁLCULO DA CONFORMIDADE</h4>
              <div style={{ background: 'var(--bg3)', padding: 14, borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>Fórmula de Conformidade Global</strong>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--bg4)',
                  padding: '8px 12px', borderRadius: 6, display: 'inline-block',
                  color: 'var(--accent)', marginBottom: 12, border: '1px solid var(--border2)'
                }}>
                  Conformidade (%) = [Conformes ÷ (Conformes + Não Conformes)] × 100
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>⚠️ Regra Crítica:</span>
                  <span style={{ color: 'var(--text2)', lineHeight: 1.4 }}>Os itens marcados como <strong>🔵 Não se Aplica</strong> são sumariamente desconsiderados e <strong>não entram</strong> na base de cálculo da nota final do prontuário.</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Grid: Common errors & exceptions */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16, letterSpacing: '-0.02em' }}>Erros Comuns e Exceções Permitidas</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 20,
        marginBottom: 20
      }}>
        
        {/* Box 1: Non-conformities */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#ff5252', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span>⚠️</span> O que comumente gera NÃO CONFORMIDADE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
            <div>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Corpo Clínico Médico:</strong>
              <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Ausência do registro de exame físico na anamnese ou evolução diária;</li>
                <li>Ausência de condutas terapêuticas explícitas;</li>
                <li>Falta de evolução diária para qualquer dia de internação do período;</li>
                <li>Anamnese realizada fora do prazo institucional de 12 horas.</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Equipe de Enfermagem:</strong>
              <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Ausência de preenchimento das Escalas de Braden e Morse;</li>
                <li>Exame físico incompleto ou genérico demais;</li>
                <li>Descrições de curativo sem o detalhamento de tamanho, exsudato, necrose ou aspecto;</li>
                <li>Falta do registro diário de evolução.</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Procedimentos no Bloco Cirúrgico:</strong>
              <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Técnica cirúrgica incompleta (falta descrição de fechamento ou do curativo pós-cirúrgico);</li>
                <li>Ausência de registro dos horários de início e término do ato operatório;</li>
                <li>CID do procedimento cirúrgico ausente.</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Equipe Multiprofissional:</strong>
              <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Ausência de descrição das condutas tomadas;</li>
                <li>Evoluções com descrições demasiadamente superficiais ou repetitivas.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Box 2: Non-applicable */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span>🔵</span> O que comumente gera NÃO SE APLICA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
            <p style={{ color: 'var(--text2)', lineHeight: 1.5, margin: 0 }}>
              Certas exigências e avaliações regulatórias são condicionais. Elas são marcadas como "Não se Aplica" e não penalizam a nota final do prontuário:
            </p>
            <ul style={{ paddingLeft: 16, margin: 0, color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Ausência de OPME:</strong> Quando a cirurgia em questão não envolveu colocação de implantes, próteses ou materiais de custo especial (OPME).</li>
              <li><strong>Ausência de Curativo:</strong> Caso o paciente não tenha feridas ou cirurgias recentes que exijam curativos cirúrgicos ativos.</li>
              <li><strong>Categoria Profissional Não Acionada:</strong> Quando o plano terapêutico do paciente não demandou visitas de equipes como Fisioterapia, Fonoaudiologia, Terapia Ocupacional ou Psicologia durante o período de internamento.</li>
              <li><strong>Terapias e Dispositivos Não Obrigatórios:</strong> Ausência de registros relacionados a certos dispositivos invasivos ou suporte ventilatório nos dias em que o paciente não fez uso de O2 ou acesso venoso profundo.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
