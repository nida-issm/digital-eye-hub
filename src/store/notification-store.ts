import { create } from 'zustand';
import type { DigitalEyeEvent } from '../models/types';

interface NotificationState {
  events:     DigitalEyeEvent[];
  unread:     number;
  setEvents:  (events: DigitalEyeEvent[]) => void;
  markRead:   () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  events:    [],
  unread:    0,
  setEvents: (events) => set({ events, unread: events.filter((e) => e.sev === 'critical').length }),
  markRead:  () => set({ unread: 0 }),
}));
