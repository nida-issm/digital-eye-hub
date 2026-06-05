'use client';

import React, { useState } from 'react';
import { Card, CardHead } from '../ui/Card';
import { Btn } from '../ui/Buttons';
import Icon from '../ui/Icon';
import type { PageProps } from '../../lib/types';

const EXAMPLE_QUERIES = [
  'What would happen if we impose a 15% import duty on clinker to protect local cement production?',
  'What is the impact of reducing FED on beverages from 13% to 10% on production volumes and government revenue?',
  'What would happen to textile exports if we impose a 5% regulatory duty on raw cotton imports?',
];

const STEPS = [
  'Extracting axioms…',
  'Building knowledge graph…',
  'Acquiring data…',
  'Running simulation…',
  'Generating report…',
];

export function PolicyPage({ navigate }: PageProps) {
  const [query, setQuery]       = useState('');
  const [thinking, setThinking] = useState(false);
  const [done, setDone]         = useState(false);
  const [step, setStep]         = useState(0);

  const handleSubmit = () => {
    if (!query.trim()) return;
    setDone(false);
    setThinking(true);
    setStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setStep(s);
      if (s >= STEPS.length) { clearInterval(iv); setThinking(false); setDone(true); }
    }, 900);
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Policy Intelligence</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Policy Studio</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>Ask a natural-language policy question. The engine extracts axioms, builds a knowledge graph, simulates impact, and generates a report traceable to every assumption.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ padding: 20 }}>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What would happen if we impose a 15% import duty on clinker?"
                style={{ width: '100%', minHeight: 88, border: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink)', resize: 'none', outline: 'none', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Searches Digital Eye production data + FBR precedents + internet</span>
                <Btn primary onClick={handleSubmit}><Icon name="send" size={14} />Simulate</Btn>
              </div>
            </div>
          </Card>

          {thinking && (
            <Card style={{ padding: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Reasoning</div>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ width: 16, height: 16, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                    {i < step
                      ? <Icon name="check" size={14} style={{ color: 'var(--sev-positive)' }} />
                      : i === step
                      ? <span style={{ width: 8, height: 8, background: 'var(--accent)' }} />
                      : <span style={{ width: 8, height: 8, border: '1px solid var(--border-strong)' }} />}
                  </span>
                  <span style={{ fontSize: 13, color: i < step ? 'var(--muted)' : i === step ? 'var(--ink)' : 'var(--faint)' }}>{s}</span>
                </div>
              ))}
            </Card>
          )}

          {done && (
            <Card>
              <CardHead title="Simulation result" tools={<Btn sm onClick={() => navigate('reports')}><Icon name="report" size={13} />Save report</Btn>} />
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 14, lineHeight: 1.65, fontFamily: 'var(--font-serif)', color: 'var(--ink-2)', marginBottom: 20 }}>
                  A 15% import duty on clinker would protect approximately 22 monitored cement plants from import-price pressure, with projected domestic production increase of +7.3% over 12 months. Revenue impact is net positive at PKR +4.2B annually, concentrated in Punjab and Sindh clusters.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', marginBottom: 20 }}>
                  {[['Revenue impact', '+PKR 4.2B', 'var(--sev-positive)'], ['Production', '+7.3%', 'var(--ink)'], ['Employment', '+2,400 jobs', 'var(--ink)']].map(([k, v, col]) => (
                    <div key={k} style={{ background: 'var(--surface)', padding: 16 }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k}</div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, color: col }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Data gaps surfaced</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', padding: 12, background: 'var(--inset)', border: '1px dashed var(--border-strong)' }}>
                  FBR TTS ratio data not yet provisioned — revenue estimate based on declared production × industry benchmark margin. Confidence: 0.71.
                </div>
              </div>
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Example queries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXAMPLE_QUERIES.map((q, i) => (
                <div key={i} onClick={() => setQuery(q)} style={{ fontSize: 12.5, color: 'var(--ink-2)', padding: 12, background: 'var(--inset)', border: '1px solid var(--border)', cursor: 'pointer', lineHeight: 1.5 }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  {q}
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Simulation engine</div>
            {[['Model', 'Polis layered multiplier'], ['Formula', 'k · (1 − TCI) · D_eff'], ['Data', 'Digital Eye + FBR + internet'], ['Scope', 'Pakistan-specific']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
