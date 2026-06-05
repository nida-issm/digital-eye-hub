'use client';
import { useState, useEffect } from 'react';
import { getFactoryOnlineStatus } from '../api/machineDetails';
import type { DEFactoryOnlineStatus } from '../api/machineDetails';
import { isConfigured } from '../api/client';

export function usePlantStatus(industry_id?: string, pollMs = 30000) {
  const [online, setOnline]   = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    const run = () => {
      setLoading(true);
      getFactoryOnlineStatus({ industry_id })
        .then((r: DEFactoryOnlineStatus) => setOnline(r.status === 'online'))
        .catch(() => setOnline(null))
        .finally(() => setLoading(false));
    };
    run();
    const iv = setInterval(run, pollMs);
    return () => clearInterval(iv);
  }, [industry_id, pollMs]);

  return { online, loading };
}
