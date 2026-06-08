'use client';
import { useState, useEffect } from 'react';
import { getTotalAnalytics } from '../../api/products';
import type { DETotalAnalytics } from '../../api/products';
import { isConfigured } from '../../api/client';

export function useTotalProduction(industry_id?: string) {
  const [data, setData]       = useState<DETotalAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    setLoading(true);
    getTotalAnalytics({ industry_id })
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [industry_id]);

  return { data, loading };
}
