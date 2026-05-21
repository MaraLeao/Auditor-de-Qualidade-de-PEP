import { useState, useRef, useEffect } from 'react'

const EXAMPLE_INPUT = `[
  {
    "Prontuário": "19.265.867",
    "Atendimento": "1.180.074",
    "Data De Nascimento pact": "18/06/1959",
    "Data da internação": "19/11/2023, 08:45",
    "Data de saída": "21/11/2023, 11:32",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "407.030.034",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Anamnese",
    "criacao_anamnsese": "19/11/2023, 10:48",
    "Descricao do registro": "FICHA DE ADMISSÃO\\n#QPD/HDA: PACIENTE REFERE DOR ABDOMINAL EM HCD...\\n#ANTECEDENTES PESSOAIS: HAS\\n#ANTECEDENTES FAMILIARES: MÃE: CANCER HEPÁTICO\\n#EXAME FÍSICO: EBG, CONSCIENTE, ORIENTADA...\\n#HD: COLELITIASE, HAS\\n#CD: INTERNAMENTO HOSPITALAR",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "COLECISTECTOMIA VIDEOLAPAROSCOPICA",
    "Cid procedimento": "K80.2",
    "Descrição Cirurgica": "1. PACIENTE EM DECÚBITO DORSAL SOB ANESTESIA GERAL...",
    "Data Inicio Cirurgia": "20/11/2023, 11:45",
    "Data Fim Cirurgia": "20/11/2023, 12:12",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Não",
    "Seguiu protoc Cirurgia Segura?": "Não"
  },
  {
    "Prontuário": "19.265.867",
    "Atendimento": "1.180.074",
    "Data De Nascimento pact": "18/06/1959",
    "Data da internação": "19/11/2023, 08:45",
    "Data de saída": "21/11/2023, 11:32",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "407.030.034",
    "Categoria Profissional": "MEDICINA",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "20/11/2023, 14:00",
    "Descricao do registro": "#HD: COLELITÍASE, PÓS-OPERATÓRIO DE COLECISTECTOMIA VIDEOLAPAROSCÓPICA. #EVOLUÇÃO: Paciente no 0 DPO, procedimento sem intercorrências. #EXAME FÍSICO: Abdome plano, FO limpas. #CD: Manter hidratação e analgésicos.",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "COLECISTECTOMIA VIDEOLAPAROSCOPICA",
    "Cid procedimento": "K80.2",
    "Descrição Cirurgica": "...",
    "Data Inicio Cirurgia": "20/11/2023, 11:45",
    "Data Fim Cirurgia": "20/11/2023, 12:12",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Não",
    "Seguiu protoc Cirurgia Segura?": "Não"
  },
  {
    "Prontuário": "19.265.867",
    "Atendimento": "1.180.074",
    "Data De Nascimento pact": "18/06/1959",
    "Data da internação": "19/11/2023, 08:45",
    "Data de saída": "21/11/2023, 11:32",
    "Data de óbito": "",
    "Sexo": "F",
    "Código Sus pact": "407.030.034",
    "Categoria Profissional": "ENFERMAGEM",
    "Tipo do registro": "Evolução",
    "criacao_anamnsese": "21/11/2023, 10:06",
    "Descricao do registro": "EVOLUÇÃO DE ENFERMAGEM - 21/11/2023\\nMOTIVO: COLELITÍASE / 1° DPO COLELAP\\nESTADO GERAL: BOM, CONSCIENTE, ORIENTADA, GLASGOW 15\\nEXAME FÍSICO: Abdome indolor, FO limpas e secas.\\nESCALAS: EVA DOR LEVE, BRADEN BAIXO RISCO, MORSE BAIXO RISCO\\nCONDUTAS: MONITORAR SINAIS VITAIS, ALTA MÉDICA",
    "Especialidade cirurgia": "CIRURGIA GERAL",
    "Procedimento cirurgico Realizado": "COLECISTECTOMIA VIDEOLAPAROSCOPICA",
    "Cid procedimento": "K80.2",
    "Descrição Cirurgica": "...",
    "Data Inicio Cirurgia": "20/11/2023, 11:45",
    "Data Fim Cirurgia": "20/11/2023, 12:12",
    "UF cirurgia": "BLOCO CIRURGICO",
    "Unidade Funcional Internaçao": "8º NORTE",
    "Utilizou O2?": "Sim",
    "Usou Antibiótico Profilático?": "Não",
    "Seguiu protoc Cirurgia Segura?": "Não"
  }
]`

const EXAMPLE_OUTPUT = {
  prontuario: "19.265.867",
  conformidade_geral: 90.7,
  secoes: [
    {
      id: "A",
      titulo: "Identificação do Atendimento",
      conformidade: 100,
      total: 8,
      conformes: 8,
      itens: [
        { item: "Prontuário", valor: "19.265.867", status: "conforme" },
        { item: "Data de Nascimento", valor: "18/06/1959", status: "conforme" },
        { item: "Idade", valor: "64 anos", status: "conforme" },
        { item: "Especialidade da Internação", valor: "Cirurgia Geral", status: "conforme" },
        { item: "Período da Internação", valor: "19/11/2023 08:45 → 21/11/2023 11:32", status: "conforme" },
        { item: "Diagnóstico / CID", valor: "Colelitíase sintomática, HAS", status: "conforme" },
        { item: "Especialidade da Cirurgia", valor: "Cirurgia Geral", status: "conforme" },
        { item: "Unidade Funcional", valor: "8º Norte", status: "conforme" },
      ]
    },
    {
      id: "B",
      titulo: "Anamneses e Evoluções Médicas",
      conformidade: 91.6,
      total: 12,
      conformes: 11,
      itens: [
        { item: "HDA (Anamnese)", valor: "Presente", status: "conforme" },
        { item: "HD / CID (Anamnese)", valor: "Colelitíase, HAS", status: "conforme" },
        { item: "Antecedentes Pessoais", valor: "HAS", status: "conforme" },
        { item: "Antecedentes Familiares", valor: "Mãe: câncer hepático", status: "conforme" },
        { item: "Exame Físico (Anamnese)", valor: "Presente e completo", status: "conforme" },
        { item: "Conduta Terapêutica", valor: "Presente", status: "conforme" },
        { item: "Criação Anamnese ≤ 12h", valor: "10h48 (2h03 após admissão)", status: "conforme" },
        { item: "HD / CID (Evolução 20/11)", valor: "Colelitíase PO", status: "conforme" },
        { item: "Exame Físico (Evolução 20/11)", valor: "Presente", status: "conforme" },
        { item: "Conduta (Evolução 20/11)", valor: "Presente", status: "conforme" },
        { item: "HD / CID (Evolução 21/11)", valor: "2º DPO", status: "conforme" },
        { item: "Frequência diária das evoluções", valor: "Ausente no 3º dia", status: "nao_conforme", observacao: "Evolução médica ausente no 3º dia de internação" },
      ]
    },
    {
      id: "C",
      titulo: "Cirurgia",
      conformidade: 87.5,
      total: 8,
      conformes: 7,
      itens: [
        { item: "Especialidade da Cirurgia", valor: "Cirurgia Geral", status: "conforme" },
        { item: "Unidade Funcional", valor: "Bloco Cirúrgico", status: "conforme" },
        { item: "Data da Cirurgia", valor: "20/11/2023", status: "conforme" },
        { item: "Início da Cirurgia", valor: "11:45", status: "conforme" },
        { item: "Fim da Cirurgia", valor: "12:12", status: "conforme" },
        { item: "CID do Procedimento", valor: "Ausente no registro", status: "nao_conforme", observacao: "CID K80.2 consta no campo estruturado mas não foi inserido na descrição cirúrgica" },
        { item: "Descrição do Procedimento", valor: "Colecistectomia videolaparoscópica", status: "conforme" },
        { item: "Técnica Cirúrgica", valor: "Presente e detalhada", status: "conforme" },
      ]
    },
    {
      id: "D",
      titulo: "Anamnese e Evoluções de Enfermagem",
      conformidade: 93.75,
      total: 14,
      conformes: 13,
      itens: [
        { item: "Motivo Internação / HD (Anamnese Enf.)", valor: "Colelitíase / COLELAP", status: "conforme" },
        { item: "Antecedentes Pessoais / Comorbidades", valor: "HAS", status: "conforme" },
        { item: "Antecedentes Familiares (Anamnese Enf.)", valor: "Ausente", status: "nao_conforme", observacao: "AF não foi registrado na anamnese de enfermagem" },
        { item: "Exame Físico (Anamnese Enf.)", valor: "Presente", status: "conforme" },
        { item: "Escala de Braden (Anamnese)", valor: "Baixo risco", status: "conforme" },
        { item: "Escala de Morse (Anamnese)", valor: "Baixo risco", status: "conforme" },
        { item: "Conduta (Anamnese Enf.)", valor: "Presente", status: "conforme" },
        { item: "Criação Anamnese Enf. ≤ 12h", valor: "Dentro do prazo", status: "conforme" },
        { item: "Motivo / HD (Evolução Enf.)", valor: "Presente", status: "conforme" },
        { item: "Exame Físico Completo (Evolução)", valor: "Presente e detalhado", status: "conforme" },
        { item: "Condutas Realizadas (Evolução)", valor: "Presente", status: "conforme" },
        { item: "Escala de Braden (Evolução)", valor: "Baixo risco", status: "conforme" },
        { item: "Escala de Morse (Evolução)", valor: "Baixo risco", status: "conforme" },
        { item: "Frequência diária das evoluções", valor: "19, 20 e 21/11 ✓", status: "conforme" },
      ]
    },
    {
      id: "E",
      titulo: "Outras Categorias Profissionais",
      conformidade: 100,
      total: 1,
      conformes: 1,
      itens: [
        { item: "Serviço Social (20/11)", valor: "Registro conforme", status: "conforme" },
      ]
    },
  ],
  quantitativo: [
    { tipo: "Anamnese Médica", "19/11": true, "20/11": false, "21/11": false, total: 1, conformidade: 100 },
    { tipo: "Anamnese Enfermagem", "19/11": true, "20/11": false, "21/11": false, total: 1, conformidade: 87.5 },
    { tipo: "Evolução Médica", "19/11": false, "20/11": true, "21/11": false, total: 1, conformidade: 50 },
    { tipo: "Evolução Enfermagem", "19/11": true, "20/11": true, "21/11": true, total: 3, conformidade: 100 },
    { tipo: "Serviço Social", "19/11": false, "20/11": true, "21/11": false, total: 1, conformidade: 100 },
  ],
  nao_conformidades: [
    { secao: "B", item: "Evolução Médica Diária", descricao: "Evolução médica ausente no 3º dia de internação" },
    { secao: "C", item: "CID do Procedimento Cirúrgico", descricao: "CID ausente na descrição cirúrgica" },
    { secao: "D", item: "Antecedentes Familiares — Anamnese de Enfermagem", descricao: "AF não registrado pela equipe de enfermagem" },
  ]
}

function simulateAudit(jsonText) {
  try { JSON.parse(jsonText) } catch { return null }
  return EXAMPLE_OUTPUT
}

const statusCfg = {
  conforme: { label: 'Conforme', color: '#00e676', bg: '#0d2b1a', border: '#00e67630' },
  nao_conforme: { label: 'Não Conforme', color: '#ff5252', bg: '#2b0d0d', border: '#ff525230' },
  nao_se_aplica: { label: 'N/A', color: '#8892a4', bg: '#1c2330', border: '#8892a430' },
}

function ScoreRing({ value, size = 120, stroke = 9 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const color = value >= 90 ? '#00e676' : value >= 75 ? '#ffd740' : '#ff5252'

  const valFontSize = size >= 120 ? 24 : size >= 90 ? 18 : 9
  const labelVisible = size >= 90

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1c2330" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: valFontSize, fontWeight: 600, color, whiteSpace: 'nowrap' }}>{value}%</span>
        {labelVisible && <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>geral</span>}
      </div>
    </div>
  )
}

function Badge({ status }) {
  const c = statusCfg[status] || statusCfg.conforme
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: 11, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
    }}>
      {c.label}
    </span>
  )
}

function Section({ sec, defaultOpen = false, isMobile }) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

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
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{sec.titulo}</span>
        <ScoreRing value={sec.conformidade} size={36} stroke={4} />
        <span style={{ color: 'var(--text3)', fontSize: 14, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background: 'var(--bg2)', padding: isMobile ? '10px 8px' : '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
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
  )
}

function ResultCard({ r, isMobile }) {
  const [tab, setTab] = useState('secoes')
  const days = ['19/11', '20/11', '21/11']

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
                const color = s.conformidade >= 90 ? '#00e676' : s.conformidade >= 75 ? '#ffd740' : '#ff5252'
                const bg = s.conformidade >= 90 ? '#0d2b1a' : s.conformidade >= 75 ? '#2b2000' : '#2b0d0d'
                return (
                  <div key={s.id} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', marginBottom: 2 }}>Seção {s.id}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600, color }}>{s.conformidade}%</div>
                  </div>
                )
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
                  const c = row.conformidade >= 90 ? '#00e676' : row.conformidade >= 75 ? '#ffd740' : '#ff5252'
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
                  )
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
  )
}

function UserMessage({ content, isMobile }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > 150

  let recordCount = 0
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) recordCount = parsed.length
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
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 600 : false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 600)
    const handleResize = () => setIsMobile(window.innerWidth < 600)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  function loadExample() {
    setInput(EXAMPLE_INPUT)
    textareaRef.current?.focus()
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 2200))
    const result = simulateAudit(text)
    setMessages(prev => [...prev, result
      ? { role: 'assistant', type: 'result', content: result }
      : { role: 'assistant', type: 'error', content: 'JSON inválido. Verifique a estrutura e tente novamente.' }
    ])
    setLoading(false)
  }

  function handleKey(e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend() }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        borderBottom: '1px solid var(--border)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg2)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent) 0%, #0066aa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17
        }}>⚕</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Auditor de Prontuários</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>CFM · LGPD · RDC 63/2011</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', boxShadow: '0 0 6px #00e676' }} />
          <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>sistema ativo</span>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : '24px 16px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: isMobile ? '30px 0 20px' : '60px 0 40px' }}>
            <div style={{ fontSize: isMobile ? 36 : 48, marginBottom: 16 }}>📋</div>
            <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.03em' }}>
              Auditoria Inteligente de Prontuários
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: isMobile ? 13 : 14, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Cole o array JSON com os registros do atendimento. A IA analisará todas as seções — identificação, anamneses, cirurgia e enfermagem.
            </p>
            <button onClick={loadExample} style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--text2)', padding: '10px 20px', borderRadius: 8,
              fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
              onMouseOut={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)' }}>
              carregar exemplo →
            </button>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === 'user') return (
            <UserMessage key={i} content={msg.content} isMobile={isMobile} />
          )
          if (msg.type === 'error') return (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{
                background: '#2b0d0d', border: '1px solid var(--red)',
                borderRadius: '2px 12px 12px 12px', padding: '12px 16px', color: 'var(--red)', fontSize: 13
              }}>
                ⚠ {msg.content}
              </div>
            </div>
          )
          if (msg.type === 'result') return (
            <div key={i} style={{ marginBottom: 24 }}><ResultCard r={msg.content} isMobile={isMobile} /></div>
          )
          return null
        })}

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
      </main>

      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: isMobile ? '10px' : '16px', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              readOnly={input === EXAMPLE_INPUT}
              placeholder={isMobile ? 'Cole o JSON do atendimento...' : 'Cole o array JSON com os registros do atendimento...'}
              rows={isMobile ? 3 : 4}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: input === EXAMPLE_INPUT ? 'var(--text2)' : 'var(--text)',
                cursor: input === EXAMPLE_INPUT ? 'not-allowed' : 'text',
                fontFamily: 'var(--mono)', fontSize: 12,
                padding: '14px 16px', resize: 'none', lineHeight: 1.6
              }} />
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', gap: isMobile ? 4 : 8 }}>
                <button onClick={loadExample} style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text2)', padding: isMobile ? '5px 8px' : '5px 12px', borderRadius: 6,
                  fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer', transition: 'all 0.15s'
                }}
                  onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
                  onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)' }}>
                  exemplo
                </button>
                {input && (
                  <button onClick={() => setInput('')} style={{
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text3)', padding: isMobile ? '5px 8px' : '5px 12px', borderRadius: 6,
                    fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer'
                  }}>limpar</button>
                )}
                {input === EXAMPLE_INPUT && (
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
  )
}
