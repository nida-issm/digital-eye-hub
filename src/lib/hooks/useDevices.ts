'use client';
import { useState, useEffect } from 'react';
import { getDevices } from '../api/devices';
import type { DEDevice } from '../api/devices';
import { isConfigured } from '../api/client';

export function useDevices(industry_id?: string) {
  const [devices, setDevices] = useState<DEDevice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    setLoading(true);
    getDevices({ industry_id })
      .then((res: DEDevice[]) => setDevices(res))
      .finally(() => setLoading(false));
  }, [industry_id]);

  return { devices, loading };
}
