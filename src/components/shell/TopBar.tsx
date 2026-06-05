'use client';

import React from 'react';
import Icon from '../ui/Icon';
import { IconBtn } from '../ui/Buttons';
import type { Route, PageProps } from '../../lib/types';

const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Global Dashboard',
  map:       'Live Map',
  events:    'Event Stream',
  anomalies: 'Anomalies',
  patterns:  'Behavioural Patterns',
  policy:    'Policy Studio',
  reports:   'Reports',
  plant:     'Plant Profile',
};

interface TopBarProps {
  route: Route;
  params: PageProps['params'];
  theme: string;
  onTheme: () => void;
  onToggleNav: () => void;
  onNav: (route: Route) => void;
}

export default function TopBar({ route, params, theme, onTheme, onToggleNav, onNav }: TopBarProps) {
  return (
    <header style={{
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 24px', background: 'var(--surface)',
      borderBottom: '1px solid var(--border)', zIndex: 20,
    }}>
      <IconBtn onClick={onToggleNav} title="Toggle navigation">
        <Icon name="collapse" />
      </IconBtn>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
        <span onClick={() => onNav('dashboard')} style={{ color: 'var(--muted)', cursor: 'pointer' }}>Hub</span>
        <Icon name="chevR" size={13} style={{ color: 'var(--faint)' }} />
        {route === 'plant' ? (
          <>
            <span onClick={() => onNav('map')} style={{ color: 'var(--muted)', cursor: 'pointer' }}>Live Map</span>
            <Icon name="chevR" size={13} style={{ color: 'var(--faint)' }} />
            <span style={{ fontWeight: 600 }}>{params?.plant?.name ?? 'Plant'}</span>
          </>
        ) : (
          <span style={{ fontWeight: 600 }}>{ROUTE_TITLES[route]}</span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--panel)', border: '1px solid var(--border)',
        padding: '6px 12px', flex: '0 1 320px', minWidth: 120, color: 'var(--muted)', cursor: 'text',
      }}>
        <Icon name="search" size={15} />
        <input
          placeholder="Search plants, NTN, events, reports…"
          style={{ border: 'none', background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: 13, width: '100%', outline: 'none' }}
        />
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--faint)', border: '1px solid var(--border)', padding: '0 4px' }}>⌘K</span>
      </div>

      {/* Live pill */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--muted)', padding: '4px 8px', border: '1px solid var(--border)' }}>
        <span style={{ width: 6, height: 6, background: 'var(--sev-positive)' }} />
        LIVE · synced 2m ago
      </span>

      {/* Alerts */}
      <button style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid transparent', color: 'var(--ink-2)', cursor: 'pointer', position: 'relative' }}>
        <Icon name="bell" />
        <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, background: 'var(--sev-critical)' }} />
      </button>

      {/* Theme toggle */}
      <IconBtn onClick={onTheme} title="Toggle theme">
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </IconBtn>
    </header>
  );
}
