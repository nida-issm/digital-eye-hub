'use client';

import React, { useMemo } from 'react';
import { Card, CardHead, Stat } from '../ui/Card';
import { IndDot } from '../ui/Badges';
import { RiskBar, Delta } from '../ui/RiskBar';
import { Btn } from '../ui/Buttons';
import Icon from '../ui/Icon';
import { Spark, ForecastChart, Gauge, Heatmap } from '../charts/Charts';
import { INDUSTRIES, PLANTS, EVENTS, EVT_TYPES } from '../../lib/data';
import { indColor } from '../../lib/helpers';
import { useKpi } from '../../lib/hooks/useKpi';
import type { PageProps } from '../../lib/types';

const INDUSTRY_SPARKS = INDUSTRIES.map((ir) =>
  Array.from({ length: 14 }, (_, i) => ir.avgUtil + Math.sin(i * 1.3 + ir.avgUtil) * 10)
);

const N = 150, SPLIT = 120;
const ACTUAL   = Array.from({ length: N }, (_, i) => i < SPLIT ? 88 + Math.sin(i / 20) * 8 + Math.sin(i / 7) * 3 : null);
const FORECAST = Array.from({ length: N }, (_, i) => i >= SPLIT - 1 ? 88 + Math.sin(i / 20) * 8 + (i - SPLIT) * 0.05 : null);
const UPPER    = FORECAST.map((v) => (v ? v + 4 : null));
const LOWER    = FORECAST.map((v) => (v ? v - 4 : null));

const LEGEND_ITEMS: Array<{ col: string; lbl: string; dash: boolean; soft: boolean }> = [
  { col: 'var(--ink)',    lbl: 'Actual',      dash: false, soft: false },
  { col: 'var(--accent)', lbl: 'Forecast',    dash: true,  soft: false },
  { col: 'var(--accent)', lbl: '80–95% band', dash: false, soft: true  },
];

export default function DashboardPage({ navigate }: PageProps) {
  const { kpi, loading: kpiLoading } = useKpi();
  const provinces = ['Punjab', 'Sindh', 'KP', 'Balochistan'];

  const matrix = useMemo(() => INDUSTRIES.map((ir) =>
    provinces.map((pr) => {
      const ps = PLANTS.filter((p) => p.industry === ir.key && p.province === pr);
      return ps.length ? Math.round(ps.reduce((s, p) => s + p.risk, 0) / ps.length) : 15 + Math.floor(ir.risk * 0.4);
    })
  ), []);

  const evtDist = Object.entries(EVT_TYPES)
    .map(([t, v]) => ({ t, label: v.label, n: EVENTS.filter((e) => e.type === t).length, sev: v.sev }))
    .sort((a, b) => b.n - a.n);
  const evtMax = Math.max(...evtDist.map((e) => e.n)) || 1;

  const totalRegistered = Object.values(kpi.totalPlants).reduce((a: number, b: number) => a + b, 0);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Federal Board of Revenue · National Monitoring</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Global Dashboard</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6, maxWidth: '70ch' }}>Aggregate production, compliance risk and anomaly intelligence across cement, sugar, textile and beverage manufacturing.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'inline-flex', border: '1px solid var(--border)', background: 'var(--panel)', borderRadius: 8 }}>
            {['Day', 'Week', 'Month', 'Quarter'].map((t, i) => (
              <button key={t} style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: i === 2 ? 'var(--ink)' : 'var(--muted)', padding: '5px 11px', background: i === 2 ? 'var(--surface)' : 'transparent', border: 'none', borderRight: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer', borderRadius: i === 0 ? '8px 0 0 8px' : i === 3 ? '0 8px 8px 0' : 0 }}>{t}</button>
            ))}
          </div>
          <Btn><Icon name="download" size={15} />Export brief</Btn>
        </div>
      </div>

      {/* KPI strip — live data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Stat label="National output (idx)" value={kpiLoading ? '—' : kpi.nationalOutput} foot={<Delta value={kpi.outputDelta} />} />
        <Stat label="Plants monitored"      value={kpiLoading ? '—' : kpi.monitored}      foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>of {totalRegistered} registered</span>} />
        <Stat label="Open anomalies"        value={kpiLoading ? '—' : kpi.openAnoms}      accent="var(--sev-critical)" foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>{kpi.reviewQueue} under review</span>} />
        <Stat label="Camera uptime"         value={kpiLoading ? '—' : Math.round(kpi.camsOnline / kpi.camsTotal * 100) + '%'} foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>{kpi.camsOnline} / {kpi.camsTotal} online</span>} />
      </div>

      {/* Forecast + risk */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>
        <Card>
          <CardHead
            title="National production — forecast vs. actual"
            sub="/ indexed, all industries"
            tools={
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {LEGEND_ITEMS.map(({ col, lbl, dash, soft }) => (
                  <span key={lbl} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--muted)' }}>
                    {soft
                      ? <span style={{ width: 14, height: 10, background: col, opacity: 0.18 }} />
                      : <span style={{ width: 14, height: 0, borderTop: `2px ${dash ? 'dashed' : 'solid'} ${col}` }} />}
                    {lbl}
                  </span>
                ))}
              </div>
            }
          />
          <div style={{ padding: 20 }}>
            <ForecastChart actual={ACTUAL} forecast={FORECAST} upper={UPPER} lower={LOWER} height={220} />
            <div style={{ display: 'flex', gap: 24, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              {[['Model', 'Prophet · per-plant ensemble'], ['Horizon', '30 days fwd'], ['MAPE', '11.4%'], ['Retrained', '3 days ago']].map(([k, v]) => (
                <div key={k} style={{ fontSize: 12 }}><span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.02em' }}>{k}: </span><span style={{ fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
          </div>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardHead title="Compliance risk" tools={<span style={{ fontSize: 11.5, color: 'var(--muted)' }}>national</span>} />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flex: 1 }}>
            <Gauge value={kpi.complianceRisk} />
            <div style={{ width: '100%' }}>
              {INDUSTRIES.map((ir) => (
                <div key={ir.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <IndDot ind={ir.key} />
                  <span style={{ fontSize: 12.5, flex: 1 }}>{ir.label}</span>
                  <RiskBar value={ir.risk} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Industry rollup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 12px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Industry segments</div>
        <span onClick={() => navigate('map')} style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>Open Live Map →</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {INDUSTRIES.map((ir, idx) => (
          <Card key={ir.key} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IndDot ind={ir.key} size={10} /><span style={{ fontWeight: 600, fontSize: 14 }}>{ir.label}</span></div>
                <Delta value={ir.growth} />
              </div>
              <Spark data={INDUSTRY_SPARKS[idx]} w={200} h={52} color={indColor(ir.key)} fill />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                {([['Avg. utilisation', ir.avgUtil + '%', false], ['Monitored', `${ir.monitored} / ${ir.total}`, false], ['Open anomalies', String(ir.openAnoms), ir.openAnoms > 1], ['Risk index', String(ir.risk), ir.risk > 55]] as [string, string, boolean][]).map(([k, v, warn]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.02em', marginBottom: 1 }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: warn ? 'var(--sev-critical)' : 'var(--ink)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Capacity unit · {ir.unit}</span>
              <span onClick={() => navigate('map', { industry: ir.key })} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>View plants <Icon name="arrR" size={13} /></span>
            </div>
          </Card>
        ))}
      </div>

      {/* Heatmap + event distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <Card>
          <CardHead title="Anomaly risk heatmap" sub="/ industry × province" tools={<span style={{ fontSize: 11.5, color: 'var(--muted)' }}>darker = higher risk</span>} />
          <div style={{ padding: 20 }}>
            <Heatmap rows={INDUSTRIES.map((i) => i.label)} cols={provinces} matrix={matrix} />
          </div>
        </Card>
        <Card>
          <CardHead title="Event distribution" sub="/ last 24h" tools={<span onClick={() => navigate('events')} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>All events</span>} />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {evtDist.map((e) => (
              <div key={e.t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12.5, width: 130, flexShrink: 0 }}>{e.label}</span>
                <div style={{ height: 10, flex: 1, background: 'var(--inset)', border: '1px solid var(--border)', overflow: 'hidden', borderRadius: 4 }}>
                  <span style={{ display: 'block', height: '100%', width: (e.n / evtMax * 100) + '%', background: EVT_TYPES[e.t].sev === 'critical' ? 'var(--sev-critical)' : 'var(--sev-warning)' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, width: 18, textAlign: 'right' }}>{e.n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
