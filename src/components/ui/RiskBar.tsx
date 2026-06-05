import React from 'react';
import Icon from './Icon';

export function RiskBar({ value }: { value: number }) {
  const col =
    value > 60 ? 'var(--sev-critical)' :
    value > 40 ? 'var(--sev-warning)'  :
                 'var(--sev-positive)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ height: 6, width: 56, background: 'var(--inset)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: value + '%', background: col }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: col, fontWeight: 600, minWidth: 22 }}>{value}</span>
    </div>
  );
}

export function Delta({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: 11.5,
      color: up ? 'var(--sev-positive)' : 'var(--sev-critical)',
    }}>
      <Icon name={up ? 'arrUp' : 'arrDn'} size={11} />
      {up ? '+' : ''}{value}{suffix}
    </span>
  );
}
