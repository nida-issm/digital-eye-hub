'use client';

import React, { useState } from 'react';
import { Card, CardHead } from '../ui/Card';
import { IndTag, IndDot, StatusPill } from '../ui/Badges';
import { Chip, Btn } from '../ui/Buttons';
import Drawer from '../ui/Drawer';
import Icon from '../ui/Icon';
import { REPORTS } from '../../lib/data';
import { indLabel } from '../../lib/helpers';
import type { PageProps, Report } from '../../lib/types';

const TH: React.CSSProperties = {
  textAlign: 'left', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em',
  textTransform: 'uppercase', color: 'var(--muted)', padding: '10px 16px',
  borderBottom: '1px solid var(--border-strong)', background: 'var(--surface)', whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '11px 16px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

const REPORT_SECTIONS = [
  'Policy lever identified', 'Axioms & assumptions (6)', 'Knowledge graph',
  'Quantitative estimates', 'Diffusion analysis', 'Historical precedents',
  'Data gaps & caveats', 'Recommendation',
];

export function ReportsPage({ navigate }: PageProps) {
  const [ind, setInd] = useState('all');
  const [sel, setSel] = useState<Report | null>(null);

  const list = ind === 'all' ? REPORTS : REPORTS.filter((r) => r.industry === ind);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Policy Intelligence</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Reports</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>Saved policy briefs — each traceable to its axioms, knowledge graph and source data.</p>
        </div>
        <Btn primary onClick={() => navigate('policy')}><Icon name="plus" size={15} />New brief</Btn>
      </div>

      <Card>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'cement', 'sugar', 'textile', 'beverages'] as const).map((k) => (
              <Chip key={k} active={ind === k} onClick={() => setInd(k)}>
                {k !== 'all' && <IndDot ind={k} size={8} />}
                {k === 'all' ? 'All' : indLabel(k)}
              </Chip>
            ))}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{list.length} reports</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr>{['Report', 'Industry', 'Revenue impact', 'Production', 'Author', 'Date', 'Status'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} onClick={() => setSel(r)} style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                <td style={{ ...TD, fontWeight: 600, maxWidth: 360 }}>
                  {r.title}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)', fontWeight: 400 }}>{r.id} · {r.pages} pp.</div>
                </td>
                <td style={TD}><IndTag ind={r.industry} /></td>
                <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.revenue.startsWith('+') ? 'var(--sev-positive)' : 'var(--sev-critical)' }}>{r.revenue}</td>
                <td style={{ ...TD, fontFamily: 'var(--font-mono)' }}>{r.production}</td>
                <td style={TD}>{r.author}</td>
                <td style={{ ...TD, fontSize: 12, color: 'var(--muted)' }}>{r.date}</td>
                <td style={TD}><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Drawer open={!!sel} onClose={() => setSel(null)} width={680}>
        {sel && (
          <>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="report" size={14} style={{ color: 'var(--muted)' }} />{sel.id}
              </h3>
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn sm><Icon name="download" size={13} />PDF</Btn>
                <Btn sm><Icon name="share" size={13} />Share</Btn>
                <button onClick={() => setSel(null)} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid transparent', color: 'var(--ink-2)', cursor: 'pointer' }}><Icon name="close" size={16} /></button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}><IndTag ind={sel.industry} /><StatusPill status={sel.status} /></div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 25, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>{sel.title}</h1>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 22 }}>{sel.author} · {sel.date} · {sel.pages} pages</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', marginBottom: 24 }}>
                {[['Revenue impact', sel.revenue, sel.revenue.startsWith('+') ? 'var(--sev-positive)' : 'var(--sev-critical)'], ['Production impact', sel.production, 'var(--ink)']].map(([k, v, col]) => (
                  <div key={k} style={{ background: 'var(--surface)', padding: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: col }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)' }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>Executive summary</div>
                <p style={{ fontSize: 15.5, lineHeight: 1.65 }}>
                  This brief evaluates the proposed measure against current Digital Eye production data and Pakistan-specific precedents. The layered-multiplier simulation indicates a {sel.revenue.startsWith('+') ? 'net-positive' : 'net-negative'} revenue trajectory with a production response of {sel.production}, concentrated in the {indLabel(sel.industry).toLowerCase()} segment.
                </p>
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 8px' }}>Sections</div>
              {REPORT_SECTIONS.map((s, i) => (
                <div key={s} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--faint)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontWeight: 500 }}>{s}</span>
                  <Icon name="chevR" size={14} style={{ color: 'var(--faint)' }} />
                </div>
              ))}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
