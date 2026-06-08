'use client';
import { useState, useEffect } from 'react';
import { getLineAnalytics } from '../../api/products';
import type { DELineAnalyticsItem } from '../../api/products';
import { isConfigured } from '../../api/client';

export function useLineAnalytics(camera_id?: string, target_date?: string) {
  const [data, setData]       = useState<DELineAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !camera_id) return;
    setLoading(true);
    getLineAnalytics({ camera_id, target_date })
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [camera_id, target_date]);

  return { data, loading };
}
