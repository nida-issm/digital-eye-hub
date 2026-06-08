export type Industry = 'cement' | 'sugar' | 'textile' | 'beverages';
export type PlantStatus = 'active' | 'alert' | 'inactive';
export type Severity = 'critical' | 'warning' | 'informational';
export type AnomalyStatus = 'open' | 'under_review' | 'resolved' | 'false_positive';
export type PatternStatus = 'flagged' | 'escalated' | 'dismissed';
export type ReportStatus = 'draft' | 'final';
export type AnomalyType = 'sudden_drop' | 'gradual_decline' | 'spike' | 'flatline' | 'seasonal_mismatch';
export type PatternType = 'scheduled_outage' | 'camera_repositioning' | 'system_poweroff' | 'coincident_events' | 'pre_filing_drop';
export type EventType = 'camera_obstructed' | 'line_halted' | 'internet_disconnected' | 'system_power_off';

export interface Plant {
  id: string;
  name: string;
  industry: Industry;
  province: string;
  status: PlantStatus;
  risk: number;
  util: number;
  cams: number;
  onlineCams: number;
  openAnoms: number;
  ntn: string;
  declared: string;
}

export interface IndustryRow {
  key: Industry;
  label: string;
  unit: string;
  total: number;
  monitored: number;
  growth: number;
  avgUtil: number;
  openAnoms: number;
  risk: number;
}

export interface KpiData {
  nationalOutput: number;
  outputDelta: number;
  monitored: number;
  openAnoms: number;
  reviewQueue: number;
  camsOnline: number;
  camsTotal: number;
  complianceRisk: number;
  activePatterns: number;
  totalPlants: Record<Industry, number>;
}

export interface DigitalEyeEvent {
  id: string;
  type: EventType;
  sev: Severity;
  label: string;
  plant: Plant;
  camera: string;
  time: string;
  ts: string;
}

export interface Anomaly {
  id: string;
  plant: Plant;
  type: AnomalyType;
  desc: string;
  conf: number;
  sev: Severity;
  status: AnomalyStatus;
  detected: string;
}

export interface Pattern {
  id: string;
  plant: Plant;
  type: PatternType;
  desc: string;
  occurrences: number;
  timing_var: number;
  status: PatternStatus;
  first: string;
  last: string;
}

export interface Report {
  id: string;
  title: string;
  industry: Industry;
  revenue: string;
  production: string;
  author: string;
  date: string;
  pages: number;
  status: ReportStatus;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  dot?: boolean;
  count?: () => number;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export type Route = 'dashboard' | 'map' | 'events' | 'anomalies' | 'patterns' | 'policy' | 'reports' | 'plant';

export interface PageProps {
  params?: { plant?: Plant; industry?: Industry };
  navigate: (route: Route, params?: PageProps['params']) => void;
}
