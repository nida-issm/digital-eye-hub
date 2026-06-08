'use client';
import { useState, useEffect } from 'react';
import { hubGet, isHubConfigured } from '../api/hub';
import { getCardAnalytics } from '../api/products';
import { getIndustries } from '../api/industries';
import { isConfigured } from '../api/client';
import { KPI } from '../data';
import type { KpiData } from '../types';

interface HubSummary {
  by_industry: Record<string, number>;
  by_status:   Record<string, number>;
  total_cameras: number;
}

export function useKpi() {
  const [kpi, setKpi]         = useState<KpiData>(KPI);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHubConfigured) {
      setLoading(true);
      Promise.all([
        hubGet<HubSummary>('/api/v1/plants/summary'),
        getCardAnalytics().catch(() => ({ total_cement_bags_today: 0, total_cement_bags_month: 0 })),
      ]).then(([summary, cards]) => {
        const monitored = Object.values(summary.by_industry).reduce((a, b) => a + b, 0);
        setKpi((prev) => ({
          ...prev,
          monitored,
          camsTotal:     summary.total_cameras,
          camsOnline:    summary.by_status['active'] ?? 0,
          nationalOutput: cards.total_cement_bags_today,
        }));
      }).finally(() => setLoading(false));
    } else if (isConfigured) {
      setLoading(true);
      Promise.all([getCardAnalytics(), getIndustries()])
        .then(([cards, industries]) => {
          setKpi((prev) => ({
            ...prev,
            nationalOutput: cards.total_cement_bags_today,
            monitored: industries.length,
            camsTotal: industries.reduce((s, i) => s + i.devices_count, 0),
          }));
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return { kpi, loading };
}
