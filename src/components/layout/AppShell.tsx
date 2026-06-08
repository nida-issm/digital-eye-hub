'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';
import { LoginPage }             from '../pages/LoginPage';
import DashboardPage             from '../pages/DashboardPage';
import { MapPage }               from '../pages/MapPage';
import { EventsPage }            from '../pages/EventsPage';
import { AnomaliesPage }         from '../pages/AnomaliesPage';
import { PatternsPage }          from '../pages/PatternsPage';
import { PolicyPage }            from '../pages/PolicyPage';
import { ReportsPage }           from '../pages/ReportsPage';
import { PlantPage }             from '../pages/PlantPage';
import { useAuthStore }          from '../../store/auth-store';
import type { Route, PageProps } from '../../lib/types';

const PAGES: Record<Route, React.ComponentType<PageProps>> = {
  dashboard: DashboardPage,
  map:       MapPage,
  events:    EventsPage,
  anomalies: AnomaliesPage,
  patterns:  PatternsPage,
  policy:    PolicyPage,
  reports:   ReportsPage,
  plant:     PlantPage,
};

export default function AppShell() {
  const [route,     setRoute]     = useState<Route>('dashboard');
  const [params,    setParams]    = useState<PageProps['params']>({});
  const [collapsed, setCollapsed] = useState(false);
  const [theme,     setTheme]     = useState<string>('dark');
  const [ready,     setReady]     = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { setCredentials, clearAuth } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Always validate credentials from localStorage on mount
    const email    = localStorage.getItem('de-email');
    const password = localStorage.getItem('de-password');
    if (email && password) {
      setCredentials(email);
    } else {
      // No credentials — force logout
      clearAuth();
    }
    setReady(true);
  }, []);

  const { isAuthed } = useAuthStore();

  const navigate = useCallback((r: Route, p: PageProps['params'] = {}) => {
    setRoute(r);
    setParams(p);
    if (pageRef.current) pageRef.current.scrollTop = 0;
  }, []);

  const handleLogin = useCallback(() => {
    const email = localStorage.getItem('de-email');
    if (email) setCredentials(email);
  }, []);

  // Don't render until we've checked localStorage
  if (!ready) return null;

  if (!isAuthed) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const View = PAGES[route] ?? DashboardPage;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: collapsed ? '64px 1fr' : '244px 1fr',
      height: '100vh',
      transition: 'grid-template-columns 0.2s ease',
    }}>
      <Sidebar route={route} collapsed={collapsed} onNav={navigate} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <TopBar
          route={route}
          params={params}
          theme={theme}
          onTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          onToggleNav={() => setCollapsed((c) => !c)}
          onNav={navigate}
        />
        <div
          ref={pageRef}
          style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}
          key={route + (params?.plant?.id ?? '')}
        >
          <View params={params} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
