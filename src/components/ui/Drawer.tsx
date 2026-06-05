'use client';

import React, { useEffect } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}

export default function Drawer({ open, onClose, width = 720, children }: DrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,22,0.45)', zIndex: 100 }}
      />
      <div
        className="slide-in"
        style={{
          position: 'fixed', top: 12, right: 12, bottom: 12,
          width: `min(${width}px, 94vw)`,
          background: 'var(--bg)',
          borderRadius: 18,
          border: '1px solid var(--border-strong)',
          zIndex: 101,
          boxShadow: 'var(--shadow-pop)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </>
  );
}
