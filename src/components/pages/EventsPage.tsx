'use client';

import React, { useState } from 'react';
import { Card, CardHead } from '../ui/Card';
import { SevBadge, IndDot } from '../ui/Badges';
import { Chip, Btn } from '../ui/Buttons';
import Icon from '../ui/Icon';
import { EVT_TYPES } from '../../lib/data';
import { indLabel } from '../../lib/helpers';
import { useEvents } from '../../lib/hooks/useEvents';
import type { PageProps } from '../../lib/types';

export function EventsPage({ navigate }: PageProps) {
  const [sev, setSev]   = useState('all');
  const [type, setType] = useState('all');
  const { events, loading } = useEvents();

  const list = events.filter((e) =>
    (sev === 'all' || e.sev === sev) &&
    (type === 'all' || e.type === type)
  );

  const critN  = events.filter((e) => e.sev === 'critical').length;
  const warnN  = events.filter((e) => e.sev === 'warning').length;
  const typeCounts = Object.entries(EVT_TYPES).map(([t, v]) => ({
    t, label: v.label, n: events.filter((e) => e.type === t).length, sev: v.sev,
  }));
  const evtMax = Math.max(...typeCounts.map((c) => c.n)) || 1;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Command & Control</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Event Stream</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>Real-time operational triggers — camera obstructions, line halts, outages and power-offs.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--muted)', padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: loading ? 'var(--sev-warning)' : 'var(--sev-positive)' }} />
            {loading ? 'Loading…' : 'LIVE · SSE connected'}
          </span>
          <Btn><Icon name="settings" size={15} />Configure alerts</Btn>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <Card>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'critical', 'warning', 'informational'].map((s) => (
                <Chip key={s} active={sev === s} onClick={() => setSev(s)} style={{ textTransform: 'capitalize' }}>{s}</Chip>
              ))}
            </div>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, padding: '5px 10px', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', borderRadius: 8 }}>
              <option value="all">All types</option>
              {Object.entries(EVT_TYPES).map(([t, v]) => <option key={t} value={t}>{v.label}</option>)}
            </select>
          </div>
          <div>
            {list.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = 'var(--panel)')}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = '')}>
                <div style={{ width: 64, height: 40, background: 'var(--inset)', border: '1px solid var(--border)', position: 'relative', flexShrink: 0, overflow: 'hidden', borderRadius: 6 }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, var(--panel) 0 6px, transparent 6px 12px)', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><Icon name="play" size={13} style={{ color: 'var(--muted)' }} /></div>
                </div>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--sev-${e.sev})`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap' }}>{e.label}</span>
                    <SevBadge sev={e.sev} />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                    {e.plant.name} · <IndDot ind={e.plant.industry} size={7} /> {indLabel(e.plant.industry)} · <span style={{ fontFamily: 'var(--font-mono)' }}>{e.camera}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.time}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{e.ts.split(' ')[1] ?? e.ts}</div>
                </div>
                <Btn sm onClick={(ev) => { ev.stopPropagation(); navigate('plant', { plant: e.plant }); }}>Plant</Btn>
              </div>
            ))}
            {!list.length && !loading && <div style={{ textAlign: 'center', padding: 56, color: 'var(--muted)', fontSize: 14 }}>No events match these filters.</div>}
            {loading && <div style={{ textAlign: 'center', padding: 56, color: 'var(--muted)', fontSize: 14 }}>Loading events…</div>}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {[[critN, 'Critical', 'var(--sev-critical)'], [warnN, 'Warning', 'color-mix(in oklab, var(--sev-warning) 75%, var(--ink))'], [events.length, 'Total 24h', 'var(--ink)']].map(([n, label, col], i, arr) => (
                <div key={String(label)} style={{ flex: 1, textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: col as string }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.02em' }}>{label}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="By event type" />
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {typeCounts.sort((a, b) => b.n - a.n).map((c) => (
                <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, width: 110, flexShrink: 0 }}>{c.label}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--inset)', border: '1px solid var(--border)', overflow: 'hidden', borderRadius: 3 }}>
                    <span style={{ display: 'block', height: '100%', width: (c.n / evtMax * 100) + '%', background: `var(--sev-${c.sev})` }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 16, textAlign: 'right' }}>{c.n}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Pipeline</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>Events arrive via signed webhook (HMAC), reconciled every 5 minutes by watermark pull. Each event references three clips retrieved through short-lived signed URLs.</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
