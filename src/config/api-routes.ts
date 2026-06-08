// Centralized API endpoint definitions
// Base URLs are set in .env.local

export const DE_AUTH_ROUTES = {
  LOGIN:          '/auth/login',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const DE_API_ROUTES = {
  INDUSTRIES:              '/api/v1/industries/',
  INDUSTRY_BY_ID:          (id: string) => `/api/v1/industries/${id}`,
  NOTIFICATIONS:           '/api/v1/industries/notifications-per-factory',
  COMPANIES:               '/api/v1/companies/',
  DEVICES:                 '/api/v1/devices/',
  CAMERA_DETAILS:          '/api/v1/devices/camera-details/by-industry',
  CARD_ANALYTICS:          '/api/v1/products/analytics/cards',
  GRAPHS_ANALYTICS:        '/api/v1/products/analytics/graphs',
  TOTAL_ANALYTICS:         '/api/v1/products/analytics/total/',
  LINE_ANALYTICS:          '/api/v1/products/analytics/line/',
  LINE_HOURLY_ANALYTICS:   '/api/v1/products/analytics/line/hourly',
  FACTORY_ONLINE_STATUS:   '/api/v1/machine-details/factory-online-status',
  DOWNTIME_ANALYTICS:      '/api/v1/machine-details/downtime-analytics',
} as const;

export const HUB_API_ROUTES = {
  PLANTS:           '/api/v1/plants/',
  PLANT_BY_ID:      (id: string) => `/api/v1/plants/${id}`,
  PLANTS_SUMMARY:   '/api/v1/plants/summary',
  ANOMALIES:        '/api/v1/anomalies/',
  ANOMALY_STATUS:   (id: string) => `/api/v1/anomalies/${id}/status`,
  EVENTS:           '/api/v1/events/',
  PATTERNS:         '/api/v1/patterns/',
  PATTERN_STATUS:   (id: string) => `/api/v1/patterns/${id}/status`,
  INGESTION_SYNC:   '/api/v1/ingestion/trigger-sync',
} as const;
