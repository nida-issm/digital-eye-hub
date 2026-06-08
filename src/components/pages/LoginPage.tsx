'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth-store';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { setCredentials }      = useAuthStore();

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      // Verify credentials by attempting auth
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      setCredentials(email);
      // Store credentials in sessionStorage for proxy use
      localStorage.setItem('de-email', email);
      localStorage.setItem('de-password', password);
      onLogin();
    } catch (e) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 380, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'var(--ink)', color: 'var(--surface)', display: 'grid', placeItems: 'center', borderRadius: 8 }}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Digital Eye</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Intelligence Hub</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 500, marginBottom: 8 }}>Sign in</h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 28 }}>Federal Board of Revenue · Analytics Platform</p>

        {error && (
          <div style={{ background: 'color-mix(in oklab, var(--sev-critical) 10%, transparent)', border: '1px solid color-mix(in oklab, var(--sev-critical) 30%, transparent)', color: 'var(--sev-critical)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@issm.ai"
              style={{ width: '100%', padding: '10px 14px', background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', background: 'var(--inset)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '11px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: 'var(--accent-ink)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 12, color: 'var(--faint)', textAlign: 'center' }}>
          FBR · wAI Advanced Industries · ISSM
        </div>
      </div>
    </div>
  );
}
