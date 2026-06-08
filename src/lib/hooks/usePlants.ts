'use client';
import { useEffect } from 'react';
import { useIndustryStore } from '../../store/industry-store';

export function usePlants() {
  const { plants, loading, error, fetchPlants } = useIndustryStore();
  useEffect(() => { fetchPlants(); }, []);
  return { plants, loading, error };
}
