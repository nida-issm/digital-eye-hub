'use client';
import { useState, useEffect } from 'react';
import { getGraphsAnalytics } from '../api/products';
import type { DEGraphsAnalytics } from '../api/products';
import { isConfigured } from '../api/client';

export function useProduction(industry_id?: string) {
  const [data, setData]       = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    setLoading(true);
    getGraphsAnalytics({ industry_id })
      .then((res: DEGraphsAnalytics) =>
        setData(res.AverageMonthlyProductionChart.map((p) => p.quantity))
      )
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [industry_id]);

  return { data, loading, error };
}
