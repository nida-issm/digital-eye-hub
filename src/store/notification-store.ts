import { create } from 'zustand';
import type { DigitalEyeEvent } from '../models/types';
import { getFactoryNotifications } from '../api/industries';
import { isConfigured } from '../api/client';
import { EVENTS, PLANTS } from '../lib/data';
import type { Plant } from '../models/types';

function mapNotification(n: any, plant: Plant): DigitalEyeEvent {
  const typeMap: Record<string, DigitalEyeEvent['type']> = {
    no_product_count: 'line_halted',
    camera_obstructed: 'camera_obstructed',
    internet_disconnected: 'internet_disconnected',
    system_power_off: 'system_power_off',
  };
  return {
    id: n._id, type: typeMap[n.notification_type] ?? 'line_halted',
    sev: n.status === 'active' ? 'warning' : 'informational',
    label: n.payload?.title ?? n.notification_type,
    plant, camera: '—',
    time: new Date(n.timestamp).toLocaleTimeString(),
    ts: n.timestamp,
  };
}

interface NotificationState {
  events:      DigitalEyeEvent[];
  unread:      number;
  loading:     boolean;
  initialized: boolean;
  setEvents:   (events: DigitalEyeEvent[]) => void;
  markRead:    () => void;
  fetchEvents: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  events:      EVENTS,
  unread:      0,
  loading:     false,
  initialized: false,
  setEvents:   (events) => set({ events, unread: events.filter((e) => e.sev === 'critical').length }),
  markRead:    () => set({ unread: 0 }),
  fetchEvents: async () => {
    if (get().initialized || !isConfigured) return;
    set({ loading: true });
    try {
      const res = await getFactoryNotifications();
      const mapped: DigitalEyeEvent[] = [];
      res.forEach((factory: any) => {
        const plant = PLANTS.find((p) => p.id === factory.industry_id) ?? {
          id: factory.industry_id, name: factory.industry_name,
          industry: 'cement', province: 'Pakistan', status: 'active',
          risk: 0, util: 0, cams: 0, onlineCams: 0, openAnoms: 0, ntn: '—', declared: '—',
        } as Plant;
        factory.notification_details.slice(0, 5).forEach((n: any) => {
          mapped.push(mapNotification(n, plant));
        });
      });
      set({ events: mapped.slice(0, 20), initialized: true,
        unread: mapped.filter((e) => e.sev === 'critical').length });
    } catch {
      // keep mock data
    } finally {
      set({ loading: false });
    }
  },
}));
