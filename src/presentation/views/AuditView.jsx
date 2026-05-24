import React, { useState, useRef, useEffect } from 'react';
import { EXAMPLES, EXAMPLE_INPUT } from '../../data/examples.js';
import { simulateAudit } from '../../domain/usecases/SimulateAuditUseCase.js';
import ScoreRing from '../components/ScoreRing.jsx';
import Badge, { statusCfg } from '../components/Badge.jsx';

// Internal Components
function Section({ sec, defaultOpen = false, isMobile }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'var(--bg3)', border: 'none', padding: isMobile ? '10px 12px' : '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)',
          background: 'var(--bg4)', padding: '2px 6px', borderRadius: 5, flexShrink: 0
        }}>
          {sec.id}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span>{sec.titulo}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--text3)',
            background: 'var(--bg4)',
            padding: '2px 6px',
            borderRadius: 6,
            fontFamily: 'var(--mono)',
            whiteSpace: 'nowrap'
          }}>
            {sec.conformes}/{sec.total} ({sec.conformidade}%)
          </span>
        </span>
        <ScoreRing value={sec.conformidade} size={36} stroke={4} />
        <span style={{ color: 'var(--text3)', fontSize: 14, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background: 'var(--bg2)', padding: isMobile ? '10px 8px' : '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sec.subgrupos ? (
            sec.subgrupos.map((sub, sIdx) => (
              <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  fontFamily: 'var(--sans)',
                  marginTop: sIdx > 0 ? 10 : 0,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ width: 3, height: 11, borderRadius: 2, background: 'var(--accent)' }} />
                  {sub.titulo}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sub.itens.map((it, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '1fr auto', gap: 8,
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderLeft: `3px solid ${statusCfg[it.status]?.color || '#00e676'}`,
                      borderRadius: 7, padding: isMobile ? '8px 10px' : '10px 14px',
                    }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{it.item}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', wordBreak: 'break-word' }}>{it.valor}</div>
                        {it.observacao && (
                          <div style={{ fontSize: 10, color: '#ffd740', marginTop: 4, opacity: 0.9 }}>⚠ {it.observacao}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge status={it.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sec.itens.map((it, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 8,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderLeft: `3px solid ${statusCfg[it.status]?.color || '#00e676'}`,
                  borderRadius: 7, padding: isMobile ? '8px 10px' : '10px 14px',
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>{it.item}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', wordBreak: 'break-word' }}>{it.valor}</div>
                    {it.observacao && (
                      <div style={{ fontSize: 10, color: '#ffd740', marginTop: 4, opacity: 0.9 }}>⚠ {it.observacao}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge status={it.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({ r, isMobile }) {
  const [tab, setTab] = useState('secoes');
  const days = r.days || ['15/04', '16/04', '17/04', '18/04'];

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '2px 12px 12px 12px' }}>
      {/* Header score */}
      <div style={{
        padding: isMobile ? '16px 12px' : '24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start',
        gap: isMobile ? '16px' : '24px',
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <ScoreRing value={r.conformidade_geral} size={isMobile ? 100 : 130} stroke={isMobile ? 8 : 10} />
        <div style={{ flex: isMobile ? 'none' : 1, minWidth: isMobile ? '100%' : 200, display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 6 }}>
            prontuário {r.prontuario}
          </div>
          <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, marginBottom: isMobile ? 0 : 12, letterSpacing: '-0.02em' }}>
            Relatório de Auditoria
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {r.secoes.map(s => {
                const color = s.conformidade >= 90 ? '#00e676' : s.conformidade >= 75 ? '#ffd740' : '#ff5252';
                const bg = s.conformidade >= 90 ? '#0d2b1a' : s.conformidade >= 75 ? '#2b2000' : '#2b0d0d';
                return (
                  <div key={s.id} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>Seção {s.id}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600, color }}>{s.conformidade}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[['secoes', 'Seções'], ['quantitativo', 'Quantitativo'], ['nao_conformidades', 'Não Conformidades']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'none', border: 'none', borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab === k ? 'var(--accent)' : 'var(--text2)',
            padding: isMobile ? '10px 8px' : '10px 14px',
            fontSize: isMobile ? 11 : 12,
            fontFamily: 'var(--mono)', cursor: 'pointer',
            transition: 'color 0.15s',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: isMobile ? '12px 8px' : '16px' }}>
        {tab === 'secoes' && (
          <div>
            {r.secoes.map((s, i) => <Section key={s.id} sec={s} defaultOpen={!isMobile && i === 0} isMobile={isMobile} />)}
          </div>
        )}

        {tab === 'quantitativo' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: isMobile ? '6px 8px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Tipo de Registro</th>
                  {days.map(d => <th key={d} style={{ padding: isMobile ? '6px 4px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>{d}</th>)}
                  <th style={{ padding: isMobile ? '6px 4px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Total</th>
                  <th style={{ padding: isMobile ? '6px 8px' : '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Conform.</th>
                </tr>
              </thead>
              <tbody>
                {r.quantitativo.map((row, i) => {
                  const c = row.conformidade >= 90 ? '#00e676' : row.conformidade >= 75 ? '#ffd740' : '#ff5252';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg3)' : 'transparent' }}>
                      <td style={{ padding: isMobile ? '8px 8px' : '10px 12px', color: 'var(--text)' }}>{row.tipo}</td>
                      {days.map(d => (
                        <td key={d} style={{ padding: isMobile ? '8px 4px' : '10px 12px', textAlign: 'center', fontSize: 14 }}>
                          {row[d] ? <span style={{ color: '#00e676' }}>✓</span> : <span style={{ color: 'var(--text3)' }}>—</span>}
                        </td>
                      ))}
                      <td style={{ padding: isMobile ? '8px 4px' : '10px 12px', textAlign: 'center', color: 'var(--text)' }}>{row.total}</td>
                      <td style={{ padding: isMobile ? '8px 8px' : '10px 12px', textAlign: 'center', color: c, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.conformidade}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'nao_conformidades' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {r.nao_conformidades.length === 0
              ? <div style={{ color: '#00e676', fontSize: 13, padding: '16px', textAlign: 'center' }}>✓ Nenhuma não conformidade encontrada</div>
              : r.nao_conformidades.map((nc, i) => (
                <div key={i} style={{ background: '#2b0d0d', border: '1px solid #ff525230', borderLeft: '3px solid #ff5252', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, background: '#ff525220', color: '#ff5252', padding: '2px 8px', borderRadius: 5 }}>
                      Seção {nc.secao}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{nc.item}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{nc.descricao}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ content, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 150;

  let recordCount = 0;
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) recordCount = parsed.length;
  } catch (e) { }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: '12px 12px 2px 12px', padding: '12px 16px',
        maxWidth: isMobile ? '95%' : '80%', width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--mono)' }}>prontuário enviado</span>
          {recordCount > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
              {recordCount} registro{recordCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <pre style={{
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            maxHeight: expanded ? 'none' : (isMobile ? '60px' : '100px'),
            overflowY: 'hidden', margin: 0
          }}>
            {content}
          </pre>
          {!expanded && isLong && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '24px',
              background: 'linear-gradient(to bottom, transparent, var(--bg3))',
              pointerEvents: 'none'
            }} />
          )}
        </div>
        {isLong && (
          <button onClick={() => setExpanded(e => !e)} style={{
            background: 'none', border: 'none', color: 'var(--accent)',
            fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer',
            marginTop: 6, padding: 0, display: 'flex', alignItems: 'center', gap: 4
          }}>
            {expanded ? '▲ recolher' : '▼ expandir prontuário'}
          </button>
        )}
      </div>
    </div>
  );
}

// Main View
export default function AuditView({ initialExampleIndex, clearInitialExample, isMobile }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const isExample = EXAMPLES.some(ex => ex.input === input);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle auto-run on dashboard action
  useEffect(() => {
    if (initialExampleIndex !== null && initialExampleIndex !== undefined) {
      const idx = initialExampleIndex;
      const exampleInput = EXAMPLES[idx]?.input || '';
      setInput(exampleInput);
      setMessages([]);
      setLoading(true);
      
      const timer = setTimeout(() => {
        const result = simulateAudit(exampleInput);
        setMessages([
          { role: 'user', content: exampleInput },
          result
            ? { role: 'assistant', type: 'result', content: result }
            : { role: 'assistant', type: 'error', content: 'JSON inválido. Verifique a estrutura e tente novamente.' }
        ]);
        setLoading(false);
        clearInitialExample(); // reset so it doesn't run on every mount
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [initialExampleIndex, clearInitialExample]);

  function loadExample(index = 0) {
    setInput(EXAMPLES[index]?.input || EXAMPLE_INPUT);
    textareaRef.current?.focus();
  }

  function selectAndRunExample(index) {
    if (loading) return;
    const exampleInput = EXAMPLES[index]?.input || '';
    setInput(exampleInput);
    setMessages([]);
    setLoading(true);
    
    const timer = setTimeout(() => {
      const result = simulateAudit(exampleInput);
      setMessages([
        { role: 'user', content: exampleInput },
        result
          ? { role: 'assistant', type: 'result', content: result }
          : { role: 'assistant', type: 'error', content: 'JSON inválido. Verifique a estrutura e tente novamente.' }
      ]);
      setLoading(false);
    }, 1200);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 2200));
    const result = simulateAudit(text);
    setMessages(prev => [...prev, result
      ? { role: 'assistant', type: 'result', content: result }
      : { role: 'assistant', type: 'error', content: 'JSON inválido. Verifique a estrutura e tente novamente.' }
    ]);
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)', flex: 1, paddingBottom: isMobile ? '80px' : '0' }}>
      
      {/* Scrollable chat body */}
      <div style={{ flex: 1, padding: isMobile ? '12px 10px' : '24px 16px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: isMobile ? '30px 0 20px' : '60px 0 40px' }}>
            <div style={{ fontSize: isMobile ? 36 : 48, marginBottom: 16 }}>📋</div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.03em' }}>
              Auditoria Inteligente de Prontuários
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: isMobile ? 13 : 14, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Selecione um dos prontuários abaixo para iniciar uma auditoria.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginTop: 32 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                {EXAMPLES.map((ex, idx) => (
                  <button key={ex.id} onClick={() => loadExample(idx)} style={{
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    color: 'var(--text)', padding: '12px 20px', borderRadius: 8,
                    fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}>
                    <span>📁</span>
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user') return (
            <UserMessage key={i} content={msg.content} isMobile={isMobile} />
          );
          if (msg.type === 'error') return (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{
                background: '#2b0d0d', border: '1px solid var(--red)',
                borderRadius: '2px 12px 12px 12px', padding: '12px 16px', color: 'var(--red)', fontSize: 13
              }}>
                ⚠ {msg.content}
              </div>
            </div>
          );
          if (msg.type === 'result') return (
            <div key={i} style={{ marginBottom: 24 }}><ResultCard r={msg.content} isMobile={isMobile} /></div>
          );
          return null;
        })}

        {messages.length > 0 && !loading && (
          <div style={{
            marginTop: 20,
            marginBottom: 24,
            padding: '16px 20px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, marginBottom: 12, fontFamily: 'var(--sans)' }}>
              Selecione outro prontuário de exemplo para auditar:
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              {EXAMPLES.map((ex, idx) => (
                <button key={ex.id} onClick={() => selectAndRunExample(idx)} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '10px 16px', borderRadius: 8,
                  fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}>
                  <span>📁</span>
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '2px 12px 12px 12px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                    animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                analisando prontuário — verificando seções A→F...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input panel at the bottom */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: isMobile ? '10px' : '16px', position: 'sticky', bottom: isMobile ? 60 : 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              readOnly={isExample}
              placeholder={isMobile ? 'Cole o JSON do atendimento...' : 'Cole o array JSON com os registros do atendimento...'}
              rows={isMobile ? 3 : 4}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: isExample ? 'var(--text2)' : 'var(--text)',
                cursor: isExample ? 'not-allowed' : 'text',
                fontFamily: 'var(--mono)', fontSize: 12,
                padding: '14px 16px', resize: 'none', lineHeight: 1.6
              }} />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: isMobile ? 4 : 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {input && (
                  <button onClick={() => { setInput(''); setMessages([]); }} style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text3)', padding: '4px 8px', borderRadius: 6,
                    fontSize: 10, fontFamily: 'var(--mono)', cursor: 'pointer'
                  }}>limpar</button>
                )}
                {isExample && (
                  <span style={{
                    color: 'var(--yellow)',
                    fontSize: 10,
                    fontFamily: 'var(--mono)',
                    alignSelf: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    padding: '2px 6px',
                    background: 'var(--yellow2)',
                    border: '1px solid #ffd74020',
                    borderRadius: 4
                  }}>
                    🔒 {isMobile ? 'Exemplo' : 'Exemplo (Leitura)'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
                {!isMobile && <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Ctrl+Enter</span>}
                <button onClick={handleSend} disabled={!input.trim() || loading} style={{
                  background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg4)',
                  border: 'none', color: input.trim() && !loading ? '#000' : 'var(--text3)',
                  padding: isMobile ? '6px 12px' : '7px 18px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.15s', fontFamily: 'var(--sans)'
                }}>
                  {loading ? 'analisando...' : 'Auditar →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
