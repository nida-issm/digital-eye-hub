import React from 'react';

interface BtnProps {
  children: React.ReactNode;
  primary?: boolean;
  sm?: boolean;
  ghost?: boolean;
  danger?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function Btn({ children, primary, sm, ghost, danger, onClick, style, disabled }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontSize: sm ? 12 : 13,
        fontWeight: 600,
        padding: sm ? '5px 12px' : '8px 16px',
        borderRadius: sm ? 8 : 10,
        border: primary
          ? '1px solid var(--accent)'
          : ghost
          ? '1px solid transparent'
          : danger
          ? '1px solid color-mix(in oklab, var(--sev-critical) 40%, var(--border))'
          : '1px solid var(--border-strong)',
        background: primary ? 'var(--accent)' : ghost ? 'transparent' : 'var(--surface)',
        color: primary ? 'var(--accent-ink)' : danger ? 'var(--sev-critical)' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Chip({ children, active, onClick, style }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 500,
        padding: '4px 12px',
        borderRadius: 20,
        border: '1px solid var(--border)',
        background: active ? 'var(--ink)' : 'var(--surface)',
        color: active ? 'var(--surface)' : 'var(--ink-2)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32, height: 32, display: 'grid', placeItems: 'center',
        borderRadius: 8,
        background: 'transparent', border: '1px solid transparent',
        color: 'var(--ink-2)', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
