import { deGet } from './client';

export interface DEFactoryOnlineStatus {
  industry_id: string;
  name: string;
  status: 'online' | 'offline';
  last_seen?: string;
}

export interface DEDowntimeAnalytics {
  downtime_hours: number;
  downtime_minutes: number;
  downtime_percentage: number;
}

export function getFactoryOnlineStatus(params: { industry_id: string }) {
  return deGet<DEFactoryOnlineStatus>('/api/v1/machine-details/factory-online-status', { params });
}

export function getDowntimeAnalytics(params: { industry_id: string }) {
  return deGet<DEDowntimeAnalytics>('/api/v1/machine-details/downtime-analytics', { params });
}
