'use client';
import { useState, useEffect } from 'react';
import { hubGet, isHubConfigured } from '../api/hub';
import { getIndustries } from '../api/industries';
import { isConfigured } from '../api/client';
import { PLANTS } from '../data';
import type { Plant, Industry } from '../types';

interface HubPlant {
  id: string;
  name: string;
  industry: Industry;
  status: 'active' | 'inactive';
  gps_lat: number | null;
  gps_lng: number | null;
  cameras: number;
  open_anomalies: number;
  operating_company: string | null;
}

function mapHubPlant(p: HubPlant): Plant {
  return {
    id:         p.id,
    name:       p.name,
    industry:   p.industry,
    province:   'Pakistan',
    status:     p.status === 'active' ? 'active' : 'alert',
    risk:       0,
    util:       0,
    cams:       p.cameras,
    onlineCams: 0,
    openAnoms:  p.open_anomalies,
    ntn:        '—',
    declared:   '—',
  };
}

export function usePlants() {
  const [plants, setPlants]   = useState<Plant[]>(PLANTS);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    // Prefer hub backend (has our own Postgres), fall back to DE API
    if (isHubConfigured) {
      setLoading(true);
      hubGet<{ results: HubPlant[]; count: number }>('/api/v1/plants/')
        .then((res) => setPlants(res.results.map(mapHubPlant)))
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    } else if (isConfigured) {
      setLoading(true);
      getIndustries()
        .then((res) => {
          const industryMap: Record<string, Industry> = {
            cement: 'cement', sugar: 'sugar', textile: 'textile', beverages: 'beverages',
          };
          setPlants(res.map((d) => ({
            id: d._id, name: d.industry_name,
            industry: 'cement' as Industry,
            province: 'Pakistan',
            status: d.industry_status === 'active' ? 'active' : 'alert',
            risk: 0, util: 0, cams: d.devices_count,
            onlineCams: 0, openAnoms: 0, ntn: '—', declared: '—',
          })));
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, []);

  return { plants, loading, error };
}
