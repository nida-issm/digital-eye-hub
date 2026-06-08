import { deGet } from './client';

export interface DECardAnalytics {
  total_cement_bags_today: number;
  total_cement_bags_month: number;
}

export interface DEMonthlyPoint {
  month: number;
  quantity: number;
}

export interface DEGraphsAnalytics {
  AverageMonthlyProductionChart: DEMonthlyPoint[];
}

export interface DETotalAnalytics {
  total_daily_production_count: number;
  total_monthly_production_count: number;
}

export interface DELineAnalyticsItem {
  camera_id: string;
  camera_name: string;
  total_count: number;
  date: string;
}

export interface DELineHourlyPoint {
  hour: number;
  count: number;
}

export interface DELineHourlyAnalytics {
  camera_id: string;
  target_date: string;
  hourly_data: DELineHourlyPoint[];
}

export function getCardAnalytics(params?: {
  industry_id?: string;
  start_date?: string;
  end_date?: string;
}) {
  return deGet<DECardAnalytics>('/api/v1/products/analytics/cards', { params });
}

export function getGraphsAnalytics(params?: {
  industry_id?: string;
  use_aggregation_table?: boolean;
  start_date?: string;
  end_date?: string;
}) {
  return deGet<DEGraphsAnalytics>('/api/v1/products/analytics/graphs', { params });
}

export function getTotalAnalytics(params?: { industry_id?: string }) {
  return deGet<DETotalAnalytics>('/api/v1/products/analytics/total/', { params });
}

export function getLineAnalytics(params: {
  camera_id: string;
  industry_id?: string;
  target_date?: string;
  start_date?: string;
  end_date?: string;
}) {
  return deGet<DELineAnalyticsItem[]>('/api/v1/products/analytics/line/', { params });
}

export function getLineHourlyAnalytics(params: { camera_id: string; target_date: string }) {
  return deGet<DELineHourlyAnalytics>('/api/v1/products/analytics/line/hourly', { params });
}
