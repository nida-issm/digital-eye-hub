import { create } from 'zustand';
import type { Plant } from '../models/types';
import { hubGet, isHubConfigured } from '../api/hub';
import { getIndustries } from '../api/industries';
import { isConfigured } from '../api/client';
import { PLANTS } from '../lib/data';
import type { Industry } from '../models/types';

interface HubPlant {
  id: string; name: string; industry: Industry;
  status: 'active' | 'inactive'; gps_lat: number | null;
  gps_lng: number | null; cameras: number; open_anomalies: number;
}

function mapHubPlant(p: HubPlant): Plant {
  return {
    id: p.id, name: p.name, industry: p.industry,
    province: 'Pakistan',
    status: p.status === 'active' ? 'active' : 'alert',
    risk: 0, util: 0, cams: p.cameras,
    onlineCams: 0, openAnoms: p.open_anomalies, ntn: '—', declared: '—',
  };
}

interface IndustryState {
  plants:      Plant[];
  loading:     boolean;
  error:       string | null;
  initialized: boolean;
  setPlants:   (plants: Plant[]) => void;
  setLoading:  (loading: boolean) => void;
  setError:    (error: string | null) => void;
  fetchPlants: () => Promise<void>;
}

export const useIndustryStore = create<IndustryState>((set, get) => ({
  plants:      PLANTS,
  loading:     false,
  error:       null,
  initialized: false,
  setPlants:   (plants)  => set({ plants }),
  setLoading:  (loading) => set({ loading }),
  setError:    (error)   => set({ error }),
  fetchPlants: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      if (isHubConfigured) {
        const res = await hubGet<{ results: HubPlant[] }>('/api/v1/plants/');
        set({ plants: res.results.map(mapHubPlant), initialized: true });
      } else if (isConfigured) {
        const res = await getIndustries();
        set({
          plants: res.map((d) => ({
            id: d._id, name: d.industry_name, industry: 'cement' as Industry,
            province: 'Pakistan',
            status: d.industry_status === 'active' ? 'active' : 'alert',
            risk: 0, util: 0, cams: d.devices_count,
            onlineCams: 0, openAnoms: 0, ntn: '—', declared: '—',
          })),
          initialized: true,
        });
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      set({ loading: false });
    }
  },
}));
