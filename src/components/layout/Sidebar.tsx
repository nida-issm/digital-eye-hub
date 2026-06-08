'use client';

import React from 'react';
import Icon from '../ui/Icon';
import type { NavGroup, Route } from '../../lib/types';
import { KPI } from '../../lib/data';

const NAV: NavGroup[] = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Global Dashboard', icon: 'dashboard' },
  ]},
  { group: 'Command & Control', items: [
    { id: 'map',    label: 'Live Map',      icon: 'map'   },
    { id: 'events', label: 'Event Stream',  icon: 'video', dot: true },
  ]},
  { group: 'Intelligence', items: [
    { id: 'anomalies', label: 'Anomalies',            icon: 'alert',   count: () => KPI.openAnoms      },
    { id: 'patterns',  label: 'Behavioural Patterns', icon: 'pattern', count: () => KPI.activePatterns },
  ]},
  { group: 'Policy Intelligence', items: [
    { id: 'policy',  label: 'Policy Studio', icon: 'policy' },
    { id: 'reports', label: 'Reports',        icon: 'report' },
  ]},
];

interface SidebarProps {
  route: Route;
  collapsed: boolean;
  onNav: (route: Route) => void;
}

export default function Sidebar({ route, collapsed, onNav }: SidebarProps) {
  return (
    <aside style={{
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', minHeight: 0,
      position: 'relative', zIndex: 30,
    }}>
      {/* Brand */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', gap: 12,
        padding: collapsed ? 0 : '0 16px',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{ width: 30, height: 30, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--ink)', color: 'var(--surface)' }}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
          </svg>
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>Digital Eye</span>
            <span style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>Intelligence Hub</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0 24px', minHeight: 0 }}>
        {NAV.map((g) => (
          <div key={g.group} style={{ padding: '16px 16px 8px' }}>
            {!collapsed && (
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', paddingLeft: 8, marginBottom: 2 }}>
                {g.group}
              </div>
            )}
            {g.items.map((it) => {
              const active = route === it.id || (route === 'plant' && it.id === 'map');
              const cnt = it.count ? it.count() : null;
              return (
                <div
                  key={it.id}
                  onClick={() => onNav(it.id as Route)}
                  title={it.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: collapsed ? '9px 0' : '9px 16px',
                    margin: collapsed ? '1px 8px' : '1px 12px',
                    color: active ? 'var(--accent-strong)' : 'var(--ink-2)',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    border: `1px solid ${active ? 'color-mix(in oklab, var(--accent) 22%, transparent)' : 'transparent'}`,
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    position: 'relative', userSelect: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  {active && <span style={{ position: 'absolute', left: -1, top: 0, bottom: 0, width: 2, background: 'var(--accent)' }} />}
                  <Icon name={it.icon} />
                  {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{it.label}</span>}
                  {!collapsed && it.dot && <span style={{ width: 6, height: 6, background: 'var(--sev-critical)', flexShrink: 0 }} />}
                  {!collapsed && cnt != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500, background: active ? 'color-mix(in oklab, var(--accent) 18%, transparent)' : 'var(--panel-2)', color: active ? 'var(--accent-strong)' : 'var(--muted)', padding: '1px 6px' }}>
                      {cnt}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: 30, height: 30, flexShrink: 0, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>
            AK
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, lineHeight: 1.25 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>A. Karim</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>FBR Commissioner</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
