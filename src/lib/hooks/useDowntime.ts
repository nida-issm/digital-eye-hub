'use client';
import { useState, useEffect } from 'react';
import { getDowntimeAnalytics } from '../api/machineDetails';
import type { DEDowntimeAnalytics } from '../api/machineDetails';
import { isConfigured } from '../api/client';

export function useDowntime(industry_id?: string) {
  const [data, setData]       = useState<DEDowntimeAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    setLoading(true);
    getDowntimeAnalytics({ industry_id })
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [industry_id]);

  return { data, loading };
}
