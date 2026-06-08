'use client';
import { useEffect } from 'react';
import { useNotificationStore } from '../../store/notification-store';

export function useEvents() {
  const { events, loading, fetchEvents } = useNotificationStore();
  useEffect(() => { fetchEvents(); }, []);
  return { events, loading, error: null };
}
