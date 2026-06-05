'use client';
import { useState, useEffect } from 'react';
import { getCameraDetailsByIndustry } from '../api/devices';
import type { DECameraDetail } from '../api/devices';
import { isConfigured } from '../api/client';

export function useCameras(industry_id?: string) {
  const [cameras, setCameras] = useState<DECameraDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConfigured || !industry_id) return;
    setLoading(true);
    getCameraDetailsByIndustry({ industry_id })
      .then((res) => setCameras(Array.isArray(res) ? res : []))
      .catch(() => setCameras([]))
      .finally(() => setLoading(false));
  }, [industry_id]);

  return { cameras, loading };
}
