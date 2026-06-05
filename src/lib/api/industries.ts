import { deGet } from './client';

export interface DEIndustry {
  _id: string;
  industry_name: string;
  industry_status: 'active' | 'inactive';
  devices_count: number;
  device_health_last_record: string | null;
  company_id: string;
}

export interface DENotificationDetail {
  _id: string;
  messageId: string;
  type: string;
  notification_type: string;
  status: string;
  timestamp: string;
  event_id: string | null;
  payload: { title: string; body: string };
}

export interface DEFactoryNotification {
  industry_id: string;
  industry_name: string;
  notification_count: number;
  notification_details: DENotificationDetail[];
}

export function getIndustries(params?: {
  search?: string;
  industry_status?: string;
  sector?: string;
  cluster_id?: string;
  company_id?: string;
}) {
  return deGet<DEIndustry[]>('/api/v1/industries/', { params });
}

export function getIndustryById(id: string) {
  return deGet<DEIndustry>(`/api/v1/industries/${id}`);
}

export function getFactoryNotifications(params?: { industry_id?: string }) {
  return deGet<DEFactoryNotification[]>('/api/v1/industries/notifications-per-factory', { params });
}
