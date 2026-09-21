import React from 'react';

export const statusCfg = {
  conforme: { label: 'Conforme', color: '#00e676', bg: '#0d2b1a', border: '#00e67630' },
  nao_conforme: { label: 'Não Conforme', color: '#ff5252', bg: '#2b0d0d', border: '#ff525230' },
  nao_se_aplica: { label: 'Não se aplica', color: '#00d4ff', bg: '#002538', border: '#00d4ff30' },
  nao_aplicavel: { label: 'Não se aplica', color: '#00d4ff', bg: '#002538', border: '#00d4ff30' },
};

export default function Badge({ status }) {
  const c = statusCfg[status] || statusCfg.conforme;
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontSize: 11,
      padding: '3px 9px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1
    }}>
      {c.label}
    </span>
  );
}
