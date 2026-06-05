'use client';
import { useState, useEffect } from 'react';
import { getCompanies } from '../api/companies';
import type { DECompany } from '../api/companies';
import { isConfigured } from '../api/client';

export function useCompanies() {
  const [companies, setCompanies] = useState<DECompany[]>([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    setLoading(true);
    getCompanies()
      .then((res) => setCompanies(Array.isArray(res) ? res : []))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  return { companies, loading };
}
