import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 15,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface CardHeadProps {
  title: React.ReactNode;
  sub?: React.ReactNode;
  tools?: React.ReactNode;
}

export function CardHead({ title, sub, tools }: CardHeadProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, padding: '12px 20px', borderBottom: '1px solid var(--border)',
      borderRadius: '15px 15px 0 0',
    }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
        {title}
        {sub && <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 400 }}>{sub}</span>}
      </h3>
      {tools && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{tools}</div>}
    </div>
  );
}

interface StatProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  foot?: React.ReactNode;
  accent?: string;
}

export function Stat({ label, value, unit, foot, accent }: StatProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 15, padding: 20, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: accent ?? 'var(--ink)' }}>
        {value}
        {unit && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--muted)', fontWeight: 500, marginLeft: 4, letterSpacing: 0 }}>{unit}</span>}
      </div>
      {foot && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>{foot}</div>}
    </div>
  );
}

export function PageShell({ eyebrow, title, sub, actions, children }: {
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{eyebrow}</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>{title}</h1>
          {sub && <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6, maxWidth: '70ch' }}>{sub}</p>}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
