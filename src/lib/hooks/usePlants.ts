'use client';
import { useState, useEffect } from 'react';
import { getIndustries } from '../api/industries';
import type { DEIndustry } from '../api/industries';
import { isConfigured } from '../api/client';
import { PLANTS } from '../data';
import type { Plant } from '../types';

function mapDEIndustryToPlant(d: DEIndustry): Plant {
  const name = d.industry_name.toLowerCase();
  const industry = name.includes('sugar') ? 'sugar'
    : name.includes('textile') || name.includes('mills') ? 'textile'
    : name.includes('bever') ? 'beverages'
    : 'cement';
  return {
    id:         d._id,
    name:       d.industry_name,
    industry,
    province:   'Pakistan',
    status:     d.industry_status === 'active' ? 'active' : 'alert',
    risk:       0,
    util:       0,
    cams:       d.devices_count,
    onlineCams: d.industry_status === 'active' ? d.devices_count : 0,
    openAnoms:  0,
    ntn:        '—',
    declared:   '—',
  };
}

export function usePlants() {
  const [plants, setPlants]   = useState<Plant[]>(PLANTS);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) return;
    setLoading(true);
    getIndustries()
      .then((res) => setPlants(res.map(mapDEIndustryToPlant)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { plants, loading, error };
}
