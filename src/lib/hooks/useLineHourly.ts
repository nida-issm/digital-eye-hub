'use client';
import { useState, useEffect } from 'react';
import { getLineHourlyAnalytics } from '../api/products';
import type { DELineHourlyAnalytics } from '../api/products';
import { isConfigured } from '../api/client';

export function useLineHourly(camera_id?: string, target_date?: string) {
  const [data, setData]       = useState<DELineHourlyAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const date = target_date ?? new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isConfigured || !camera_id) return;
    setLoading(true);
    getLineHourlyAnalytics({ camera_id, target_date: date })
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [camera_id, date]);

  return { data, loading };
}
