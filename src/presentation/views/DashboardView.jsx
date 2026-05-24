import React from 'react';
import { simulateAudit } from '../../domain/usecases/SimulateAuditUseCase.js';

export default function DashboardView({ onSelectExample, isMobile, examples }) {
  // Pre-calculate the audited outputs for all examples to get real percentages
  const auditedExamples = examples.map(ex => {
    const auditedOutput = simulateAudit(ex.input, examples);
    return {
      ...ex,
      auditedOutput: auditedOutput || ex.output
    };
  });

  const totalCharts = auditedExamples.length;

  const avgCompliance = Math.round(
    auditedExamples.reduce((acc, ex) => acc + ex.auditedOutput.conformidade_geral, 0) / totalCharts * 10
  ) / 10;

  const minChart = auditedExamples.reduce((prev, current) => {
    return (prev.auditedOutput.conformidade_geral < current.auditedOutput.conformidade_geral) ? prev : current;
  });

  // Calculate average compliance per section dynamically
  const sectionIds = ['A', 'B', 'C', 'D', 'E'];
  const sectionAverages = sectionIds.map(id => {
    let totalScore = 0;
    let count = 0;
    auditedExamples.forEach(ex => {
      const sec = ex.auditedOutput.secoes.find(s => s.id === id);
      if (sec) {
        totalScore += sec.conformidade;
        count++;
      }
    });
    return {
      id,
      name: id === 'A' ? 'Identificação' :
            id === 'B' ? 'Anamnese/Evolução Médica' :
            id === 'C' ? 'Bloco Cirúrgico' :
            id === 'D' ? 'Enfermagem e Escalas' :
            'Equipe Multiprofissional',
      value: count > 0 ? Math.round(totalScore / count * 10) / 10 : 100
    };
  });

  // Calculate recurrent non-conformities dynamically
  const nonConformityCounts = {};
  auditedExamples.forEach(ex => {
    ex.auditedOutput.nao_conformidades.forEach(nc => {
      const parts = nc.item.split(' — ');
      const coreItemName = parts[parts.length - 1];

      if (!nonConformityCounts[coreItemName]) {
        nonConformityCounts[coreItemName] = {
          name: coreItemName,
          secao: nc.secao,
          count: 0
        };
      }
      nonConformityCounts[coreItemName].count += 1;
    });
  });

  const recurrentIssues = Object.values(nonConformityCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);



  return (
    <div style={{ padding: isMobile ? '12px 10px 80px' : '24px 16px' }}>
      {/* Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>📊</span> Painel de Qualidade PEP
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: isMobile ? 13 : 15, marginTop: 8, maxWidth: 640 }}>
          Indicadores consolidados da auditoria clínica institucional e status de conformidade legal.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 32
      }}>
        {/* Metric 1 */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>PRONTUÁRIOS AUDITADOS</div>
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, color: 'var(--accent)' }}>{totalCharts}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>Casos cadastrados na base local</div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>CONFORMIDADE MÉDIA</div>
          <div style={{
            fontSize: 32,
            fontWeight: 700,
            marginTop: 8,
            color: avgCompliance >= 90 ? 'var(--green)' : avgCompliance >= 75 ? 'var(--yellow)' : 'var(--red)'
          }}>{avgCompliance}%</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>Média de todas as seções auditadas</div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>ALERTA DE QUALIDADE</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 14, color: 'var(--text)' }}>
            ⚠️ {minChart.name.split(' (')[0]}
          </div>
          <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 8 }}>
            Menor pontuação registrada ({minChart.auditedOutput.conformidade_geral}%)
          </div>
        </div>
      </div>

      {/* Grid for Section Performance & Charts list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
        gap: 24,
        alignItems: 'start'
      }}>
        {/* Left Column: Stats & Recurrent Issues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section compliance ratings */}
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Conformidade por Seção Regulatória</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sectionAverages.map(sec => {
                const color = sec.value >= 90 ? '#00e676' : sec.value >= 75 ? '#ffd740' : '#ff5252';
                return (
                  <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row', 
                      justifyContent: 'space-between', 
                      alignItems: isMobile ? 'flex-start' : 'center', 
                      gap: isMobile ? 4 : 8,
                      fontSize: isMobile ? 11 : 12 
                    }}>
                      <span style={{ color: 'var(--text2)' }}>Seção {sec.id} — {sec.name}</span>
                      <span style={{ fontWeight: 600, color, alignSelf: isMobile ? 'flex-end' : 'auto' }}>{sec.value}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div style={{ width: '100%', height: 8, background: 'var(--bg4)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${sec.value}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${color}cc, ${color})`,
                        borderRadius: 4,
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recurrent Non-conformities */}
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span> Não Conformidades Mais Recorrentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recurrentIssues.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--green)', padding: '8px 0' }}>
                  ✓ Nenhuma não conformidade identificada nos prontuários da base.
                </div>
              ) : (
                recurrentIssues.map((issue, idx) => (
                  <div key={idx} style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center',
                    justifyContent: 'space-between',
                    gap: isMobile ? 8 : 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                      <span style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 10,
                        background: 'rgba(255, 82, 82, 0.1)',
                        color: 'var(--red)',
                        border: '1px solid rgba(255, 82, 82, 0.2)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap'
                      }}>
                        Seção {issue.secao}
                      </span>
                      <span style={{ 
                        fontSize: isMobile ? 12 : 13, 
                        fontWeight: 500, 
                        color: 'var(--text)', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {issue.name}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10,
                      color: 'var(--text2)',
                      fontFamily: 'var(--mono)',
                      background: 'var(--bg4)',
                      padding: '4px 8px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      alignSelf: isMobile ? 'flex-end' : 'auto',
                      flexShrink: 0
                    }}>
                      {issue.count} ocorrência{issue.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>


        {/* Patients list */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 20
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Casos Disponíveis para Simulação</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {auditedExamples.map((ex, idx) => {
              const score = ex.auditedOutput.conformidade_geral;
              const color = score >= 90 ? 'var(--green)' : score >= 75 ? 'var(--yellow)' : 'var(--red)';
              return (
                <div
                  key={ex.id}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ 
                        fontSize: isMobile ? 12 : 13, 
                        fontWeight: 600, 
                        color: 'var(--text)',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: isMobile ? 'normal' : 'nowrap'
                      }}>{ex.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 4 }}>
                        Atendimento: {ex.auditedOutput.prontuario}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 12,
                      fontWeight: 700,
                      color,
                      background: `${color}10`,
                      padding: '4px 8px',
                      borderRadius: 6
                    }}>
                      {score}%
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectExample(idx)}
                    style={{
                      background: 'var(--bg4)',
                      border: '1px solid var(--border2)',
                      color: 'var(--accent)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 0.15s'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.background = 'rgba(0, 212, 255, 0.05)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'var(--border2)';
                      e.currentTarget.style.background = 'var(--bg4)';
                    }}
                  >
                    Iniciar Auditoria ⚡
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
