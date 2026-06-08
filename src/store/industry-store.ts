import { create } from 'zustand';
import type { Plant } from '../models/types';

interface IndustryState {
  plants:     Plant[];
  loading:    boolean;
  error:      string | null;
  setPlants:  (plants: Plant[]) => void;
  setLoading: (loading: boolean) => void;
  setError:   (error: string | null) => void;
}

export const useIndustryStore = create<IndustryState>((set) => ({
  plants:     [],
  loading:    false,
  error:      null,
  setPlants:  (plants)  => set({ plants }),
  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error }),
}));
