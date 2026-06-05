'use client';

import React, { useState } from 'react';
import { Card, CardHead, Stat } from '../ui/Card';
import { IndTag, SevBadge, StatusPill } from '../ui/Badges';
import { Chip, Btn } from '../ui/Buttons';
import Drawer from '../ui/Drawer';
import Icon from '../ui/Icon';
import { ANOMALIES } from '../../lib/data';
import type { PageProps, Anomaly } from '../../lib/types';

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em',
  textTransform: 'uppercase', color: 'var(--muted)', padding: '10px 16px',
  borderBottom: '1px solid var(--border-strong)', background: 'var(--surface)', whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '11px 16px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

export function AnomaliesPage({ navigate }: PageProps) {
  const [sel, setSel]           = useState<Anomaly | null>(null);
  const [statusFilter, setStatus] = useState('all');

  const list = statusFilter === 'all' ? ANOMALIES : ANOMALIES.filter((a) => a.status === statusFilter);

  const DETECTION_DESC: Record<string, string> = {
    gradual_decline:   'CUSUM (Cumulative Sum) change-point: S(t) = max(0, S(t−1) + (x(t) − μ − k)). Running at daily and weekly aggregation. Change-point confirmed when S(t) exceeds threshold h=5σ.',
    flatline:          'Zero-variance check: identical unit count across 3+ consecutive production days. Real production never produces exact repeats — this signature indicates data fabrication or system malfunction.',
    default:           'Statistical σ-band threshold: 90-day rolling median baseline with ±2σ deviation bands. Anomaly flagged when production breach persists for 2+ consecutive days.',
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Intelligence</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Anomalies</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>Statistical deviations flagged by CUSUM change-detection and σ-band analysis across all monitored plants.</p>
        </div>
        <Btn><Icon name="download" size={15} />Export</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Stat label="Open"                  value={ANOMALIES.filter((a) => a.status === 'open').length}         accent="var(--sev-critical)" foot={null} />
        <Stat label="Under review"          value={ANOMALIES.filter((a) => a.status === 'under_review').length} accent="color-mix(in oklab, var(--sev-warning) 75%, var(--ink))" foot={null} />
        <Stat label="High confidence (≥0.8)" value={ANOMALIES.filter((a) => a.conf >= 0.8).length}              foot={null} />
        <Stat label="Plants affected"       value={new Set(ANOMALIES.map((a) => a.plant.id)).size}              foot={null} />
      </div>

      <Card>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6 }}>
          {['all', 'open', 'under_review', 'resolved'].map((s) => (
            <Chip key={s} active={statusFilter === s} onClick={() => setStatus(s)} style={{ textTransform: 'capitalize' }}>
              {s.replace('_', ' ')}
            </Chip>
          ))}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>{['ID', 'Plant', 'Industry', 'Type', 'Description', 'Confidence', 'Detected', 'Status'].map((h) => <th key={h} style={TH_STYLE}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} onClick={() => setSel(a)} style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{a.id}</td>
                <td style={{ ...TD, fontWeight: 600 }}>{a.plant.name}</td>
                <td style={TD}><IndTag ind={a.plant.industry} /></td>
                <td style={{ ...TD, whiteSpace: 'nowrap', fontSize: 12 }}>{a.type.replace(/_/g, ' ')}</td>
                <td style={{ ...TD, maxWidth: 340, fontSize: 12, color: 'var(--ink-2)' }}>{a.desc}</td>
                <td style={TD}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ height: 4, width: 48, background: 'var(--inset)' }}>
                      <span style={{ display: 'block', height: '100%', width: (a.conf * 100) + '%', background: a.conf >= 0.8 ? 'var(--sev-critical)' : 'var(--sev-warning)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600 }}>{a.conf.toFixed(2)}</span>
                  </div>
                </td>
                <td style={{ ...TD, fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{a.detected}</td>
                <td style={TD}><StatusPill status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Drawer open={!!sel} onClose={() => setSel(null)} width={640}>
        {sel && (
          <>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{sel.id}</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn sm><Icon name="flag" size={13} />Escalate</Btn>
                <button onClick={() => setSel(null)} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid transparent', color: 'var(--ink-2)', cursor: 'pointer' }}><Icon name="close" size={16} /></button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <IndTag ind={sel.plant.industry} /><SevBadge sev={sel.sev} /><StatusPill status={sel.status} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>{sel.type.replace(/_/g, ' ')}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-2)', marginBottom: 24 }}>{sel.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', marginBottom: 24 }}>
                {[['Plant', sel.plant.name], ['Province', sel.plant.province], ['Confidence', sel.conf.toFixed(2)], ['Detected', sel.detected]].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--surface)', padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Detection method</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, padding: 16, background: 'var(--inset)', border: '1px solid var(--border)' }}>
                {DETECTION_DESC[sel.type] ?? DETECTION_DESC.default}
              </div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
