'use client';
import { useState, useEffect } from 'react';
import { getFactoryNotifications } from '../api/industries';
import type { DENotificationDetail } from '../api/industries';
import { isConfigured } from '../api/client';
import { EVENTS } from '../data';
import type { DigitalEyeEvent, Plant } from '../types';

function mapNotification(n: DENotificationDetail, plant: Plant): DigitalEyeEvent {
  const typeMap: Record<string, DigitalEyeEvent['type']> = {
    no_product_count:       'line_halted',
    camera_obstructed:      'camera_obstructed',
    internet_disconnected:  'internet_disconnected',
    system_power_off:       'system_power_off',
  };
  return {
    id:     n._id,
    type:   typeMap[n.notification_type] ?? 'line_halted',
    sev:    n.status === 'active' ? 'warning' : 'informational',
    label:  n.payload.title,
    plant,
    camera: '—',
    time:   new Date(n.timestamp).toLocaleTimeString(),
    ts:     n.timestamp,
  };
}

export function useEvents(plant?: Plant) {
  const [events, setEvents]   = useState<DigitalEyeEvent[]>(EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) return;
    setLoading(true);
    getFactoryNotifications()
      .then((res) => {
        const mapped: DigitalEyeEvent[] = [];
        res.forEach((factory) => {
          const matchedPlant = plant ?? {
            id: factory.industry_id, name: factory.industry_name,
            industry: 'cement', province: 'Pakistan', status: 'active',
            risk: 0, util: 0, cams: 0, onlineCams: 0, openAnoms: 0, ntn: '—', declared: '—',
          } as Plant;
          factory.notification_details.slice(0, 5).forEach((n) => {
            mapped.push(mapNotification(n, matchedPlant));
          });
        });
        setEvents(mapped.slice(0, 20));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [plant?.id]);

  return { events, loading, error };
}
