import React from 'react';
import { indColor, indLabel } from '../../lib/helpers';
import type { Industry, Severity } from '../../lib/types';

export function IndDot({ ind, size = 8 }: { ind: Industry; size?: number }) {
  return (
    <span style={{ width: size, height: size, background: indColor(ind), flexShrink: 0, display: 'inline-block' }} />
  );
}

export function IndTag({ ind }: { ind: Industry }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      padding: '2px 7px', border: '1px solid var(--border-strong)',
    }}>
      <IndDot ind={ind} />
      {indLabel(ind)}
    </span>
  );
}

export function SevBadge({ sev, children }: { sev: string; children?: React.ReactNode }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    critical: {
      bg:     'color-mix(in oklab, var(--sev-critical) 9%, transparent)',
      color:  'var(--sev-critical)',
      border: 'color-mix(in oklab, var(--sev-critical) 40%, transparent)',
    },
    warning: {
      bg:     'color-mix(in oklab, var(--sev-warning) 12%, transparent)',
      color:  'color-mix(in oklab, var(--sev-warning) 70%, var(--ink))',
      border: 'color-mix(in oklab, var(--sev-warning) 40%, transparent)',
    },
    info: {
      bg:     'transparent',
      color:  'var(--muted)',
      border: 'var(--border-strong)',
    },
  };
  const s = styles[sev] ?? styles.info;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      padding: '2px 7px', border: `1px solid ${s.border}`,
      background: s.bg, color: s.color,
      textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, background: `var(--sev-${sev})`, flexShrink: 0 }} />
      {children ?? sev}
    </span>
  );
}

type StatusKey = 'open' | 'under_review' | 'resolved' | 'false_positive' | 'flagged' | 'escalated' | 'dismissed' | 'final' | 'draft';

const STATUS_MAP: Record<StatusKey, { sev: string; label: string }> = {
  open:           { sev: 'critical', label: 'Open'           },
  under_review:   { sev: 'warning',  label: 'Under review'   },
  resolved:       { sev: 'info',     label: 'Resolved'       },
  false_positive: { sev: 'info',     label: 'False positive' },
  flagged:        { sev: 'critical', label: 'Flagged'        },
  escalated:      { sev: 'warning',  label: 'Escalated'      },
  dismissed:      { sev: 'info',     label: 'Dismissed'      },
  final:          { sev: 'pos',      label: 'Final'          },
  draft:          { sev: 'info',     label: 'Draft'          },
};

export function StatusPill({ status }: { status: string }) {
  const m = STATUS_MAP[status as StatusKey] ?? { sev: 'info', label: status };

  if (m.sev === 'pos') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11, fontWeight: 600, padding: '2px 7px', whiteSpace: 'nowrap',
        border: 'color-mix(in oklab, var(--sev-positive) 40%, transparent)',
        background: 'color-mix(in oklab, var(--sev-positive) 9%, transparent)',
        color: 'var(--sev-positive)',
      }}>
        <span style={{ width: 6, height: 6, background: 'var(--sev-positive)' }} />
        {m.label}
      </span>
    );
  }

  return <SevBadge sev={m.sev}>{m.label}</SevBadge>;
}
