'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { IndTag, StatusPill } from '../ui/Badges';
import Icon from '../ui/Icon';
import { PATTERNS } from '../../lib/data';
import type { PageProps } from '../../lib/types';

const PATTERN_ICON: Record<string, string> = {
  scheduled_outage:     'clock',
  camera_repositioning: 'camera',
  pre_filing_drop:      'trend',
  system_poweroff:      'zap',
  coincident_events:    'layers',
};

export function PatternsPage({ navigate }: PageProps) {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Intelligence</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Behavioural Patterns</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>
            Recurring temporal sequences detected by PrefixSpan sequential pattern mining. Flagged when a pattern repeats ≥3 times with &lt;20% timing variance.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PATTERNS.map((pat) => (
          <Card key={pat.id}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--inset)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name={PATTERN_ICON[pat.type] ?? 'pattern'} size={16} style={{ color: 'var(--muted)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{pat.plant.name}</span>
                      <IndTag ind={pat.plant.industry} />
                      <StatusPill status={pat.status} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{pat.desc}</div>
                  </div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: 'var(--sev-critical)' }}>{pat.occurrences}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>occurrences</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
                <span style={{ color: 'var(--muted)' }}>Pattern: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pat.type.replace(/_/g, ' ')}</span></span>
                <span style={{ color: 'var(--muted)' }}>Timing variance: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{pat.timing_var}%</span></span>
                <span style={{ color: 'var(--muted)' }}>First seen: <span style={{ color: 'var(--ink)' }}>{pat.first}</span></span>
                <span style={{ color: 'var(--muted)' }}>Last: <span style={{ color: 'var(--ink)' }}>{pat.last}</span></span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
