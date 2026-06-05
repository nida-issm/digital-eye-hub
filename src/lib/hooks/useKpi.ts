'use client';
import { useState, useEffect } from 'react';
import { getCardAnalytics } from '../api/products';
import { getIndustries } from '../api/industries';
import type { DECardAnalytics } from '../api/products';
import type { DEIndustry } from '../api/industries';
import { isConfigured } from '../api/client';
import { KPI } from '../data';
import type { KpiData } from '../types';

export function useKpi() {
  const [kpi, setKpi]         = useState<KpiData>(KPI);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    setLoading(true);
    Promise.all([
      getCardAnalytics(),
      getIndustries(),
    ] as [Promise<DECardAnalytics>, Promise<DEIndustry[]>])
      .then(([cards, industries]) => {
        const monitored  = industries.length;
        const camsOnline = industries.filter((i) => i.industry_status === 'active').length;
        const total      = cards.total_cement_bags_today;
        setKpi((prev) => ({
          ...prev,
          nationalOutput: total,
          monitored,
          camsOnline,
          camsTotal: industries.reduce((s, i) => s + i.devices_count, 0),
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  return { kpi, loading };
}
