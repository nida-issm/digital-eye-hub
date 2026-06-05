import type {
  Plant, IndustryRow, KpiData, DigitalEyeEvent,
  Anomaly, Pattern, Report,
} from './types';

export const INDUSTRIES: IndustryRow[] = [
  { key: 'cement',    label: 'Cement',    unit: 'tonnes/day',  total: 25,  monitored: 22,  growth: 3.2,  avgUtil: 71, openAnoms: 2, risk: 38 },
  { key: 'sugar',     label: 'Sugar',     unit: 'tonnes/day',  total: 90,  monitored: 67,  growth: -1.4, avgUtil: 58, openAnoms: 7, risk: 62 },
  { key: 'textile',   label: 'Textile',   unit: 'metres/day',  total: 500, monitored: 312, growth: 5.1,  avgUtil: 83, openAnoms: 4, risk: 29 },
  { key: 'beverages', label: 'Beverages', unit: 'litres/day',  total: 30,  monitored: 28,  growth: 2.8,  avgUtil: 79, openAnoms: 1, risk: 21 },
];

export const KPI: KpiData = {
  nationalOutput: 94.2,
  outputDelta:    2.1,
  monitored:      429,
  openAnoms:      14,
  reviewQueue:    3,
  camsOnline:     847,
  camsTotal:      903,
  complianceRisk: 44,
  activePatterns: 6,
  totalPlants:    { cement: 25, sugar: 90, textile: 500, beverages: 30 },
};

export const EVT_TYPES: Record<string, { label: string; sev: string }> = {
  camera_obstructed:    { label: 'Camera obstructed',    sev: 'critical' },
  line_halted:          { label: 'Line halted',           sev: 'critical' },
  internet_disconnected:{ label: 'Internet disconnected', sev: 'warning'  },
  system_power_off:     { label: 'System power-off',      sev: 'warning'  },
};

export const PLANTS: Plant[] = [
  { id: 'PLT-001', name: 'Lucky Cement – Hub',               industry: 'cement',    province: 'Balochistan', status: 'active', risk: 22, util: 74, cams: 4, onlineCams: 4, openAnoms: 0, ntn: '0412837-2', declared: '6,700 t/day'    },
  { id: 'PLT-002', name: 'D.G. Khan Cement – Chakwal',       industry: 'cement',    province: 'Punjab',      status: 'active', risk: 45, util: 68, cams: 3, onlineCams: 3, openAnoms: 1, ntn: '0312551-7', declared: '4,500 t/day'    },
  { id: 'PLT-003', name: 'Maple Leaf – Daudkhel',            industry: 'cement',    province: 'Punjab',      status: 'alert',  risk: 71, util: 41, cams: 5, onlineCams: 3, openAnoms: 2, ntn: '0298443-1', declared: '3,800 t/day'    },
  { id: 'PLT-004', name: 'Fauji Sugar – Sanghar',            industry: 'sugar',     province: 'Sindh',       status: 'active', risk: 58, util: 61, cams: 6, onlineCams: 6, openAnoms: 3, ntn: '0567821-4', declared: '8,200 t/day'    },
  { id: 'PLT-005', name: 'Al-Noor Sugar – Rahim Yar Khan',   industry: 'sugar',     province: 'Punjab',      status: 'alert',  risk: 79, util: 34, cams: 4, onlineCams: 2, openAnoms: 4, ntn: '0443219-8', declared: '5,100 t/day'    },
  { id: 'PLT-006', name: 'Kohinoor Textile – Faisalabad',    industry: 'textile',   province: 'Punjab',      status: 'active', risk: 18, util: 91, cams: 8, onlineCams: 8, openAnoms: 0, ntn: '0219876-3', declared: '120,000 m/day'  },
  { id: 'PLT-007', name: 'Nishat Mills – Lahore',            industry: 'textile',   province: 'Punjab',      status: 'active', risk: 24, util: 87, cams: 7, onlineCams: 7, openAnoms: 1, ntn: '0331254-9', declared: '95,000 m/day'   },
  { id: 'PLT-008', name: 'Pepsi Beverages – Karachi',        industry: 'beverages', province: 'Sindh',       status: 'active', risk: 15, util: 82, cams: 5, onlineCams: 5, openAnoms: 0, ntn: '0198765-2', declared: '450,000 L/day'  },
];

export const EVENTS: DigitalEyeEvent[] = [
  { id: 'EVT-001', type: 'camera_obstructed',     sev: 'critical', label: 'Camera obstructed',     plant: PLANTS[2], camera: 'CAM-03', time: '14 min ago',  ts: '2026-06-03 11:41' },
  { id: 'EVT-002', type: 'line_halted',            sev: 'critical', label: 'Line halted',           plant: PLANTS[4], camera: 'CAM-01', time: '38 min ago',  ts: '2026-06-03 11:17' },
  { id: 'EVT-003', type: 'internet_disconnected',  sev: 'warning',  label: 'Internet disconnected', plant: PLANTS[1], camera: 'CAM-02', time: '1h 12m ago',  ts: '2026-06-03 10:43' },
  { id: 'EVT-004', type: 'system_power_off',       sev: 'warning',  label: 'System power-off',      plant: PLANTS[3], camera: 'CAM-04', time: '2h 5m ago',   ts: '2026-06-03 09:50' },
  { id: 'EVT-005', type: 'camera_obstructed',      sev: 'critical', label: 'Camera obstructed',     plant: PLANTS[0], camera: 'CAM-01', time: '3h 22m ago',  ts: '2026-06-03 08:33' },
  { id: 'EVT-006', type: 'internet_disconnected',  sev: 'warning',  label: 'Internet disconnected', plant: PLANTS[5], camera: 'CAM-06', time: '4h 55m ago',  ts: '2026-06-03 07:00' },
];

export const ANOMALIES: Anomaly[] = [
  { id: 'ANM-031', plant: PLANTS[4], type: 'sudden_drop',       desc: 'Production fell 68% below 90-day median for 4 consecutive days',     conf: 0.91, sev: 'critical', status: 'open',         detected: '2026-05-30' },
  { id: 'ANM-029', plant: PLANTS[2], type: 'gradual_decline',   desc: 'CUSUM change-point detected: 30-day declining at 8.2%/month',         conf: 0.78, sev: 'warning',  status: 'under_review', detected: '2026-05-28' },
  { id: 'ANM-027', plant: PLANTS[3], type: 'seasonal_mismatch', desc: 'Sugar mill operating at 34% during peak crushing season',             conf: 0.85, sev: 'critical', status: 'open',         detected: '2026-05-27' },
  { id: 'ANM-024', plant: PLANTS[1], type: 'flatline',          desc: 'Identical count (2,847 bags) reported for 5 consecutive days',        conf: 0.96, sev: 'critical', status: 'open',         detected: '2026-05-25' },
  { id: 'ANM-021', plant: PLANTS[6], type: 'spike',             desc: 'Production exceeded +2σ without declared capacity expansion',         conf: 0.62, sev: 'warning',  status: 'open',         detected: '2026-05-24' },
];

export const PATTERNS: Pattern[] = [
  { id: 'PAT-012', plant: PLANTS[4], type: 'scheduled_outage',      desc: 'Internet disconnects every Mon/Wed/Fri 22:00–02:00 (±18 min variance)', occurrences: 9, timing_var: 12, status: 'escalated', first: '2026-04-15', last: '2026-05-31' },
  { id: 'PAT-010', plant: PLANTS[2], type: 'camera_repositioning',  desc: 'Camera angle shifts off production line Mon morning, resets Friday night', occurrences: 6, timing_var: 8,  status: 'flagged',   first: '2026-04-22', last: '2026-05-27' },
  { id: 'PAT-008', plant: PLANTS[3], type: 'pre_filing_drop',       desc: 'Production drops sharply 6–8 days before FBR quarterly filing deadline',   occurrences: 3, timing_var: 19, status: 'flagged',   first: '2026-02-20', last: '2026-05-22' },
];

export const REPORTS: Report[] = [
  { id: 'RPT-019', title: 'Impact of 15% Import Duty on Clinker on Domestic Cement Production',    industry: 'cement',    revenue: '+PKR 4.2B', production: '+7.3%',  author: 'A. Karim', date: '2026-05-28', pages: 14, status: 'final' },
  { id: 'RPT-017', title: 'FED Reduction on Beverages (13% → 10%): Revenue and Volume Analysis',  industry: 'beverages', revenue: '-PKR 1.8B', production: '+11.2%', author: 'S. Ahmed', date: '2026-05-20', pages: 11, status: 'final' },
  { id: 'RPT-015', title: '5% Regulatory Duty on Raw Cotton Imports: Textile Export Sensitivity', industry: 'textile',   revenue: '+PKR 2.1B', production: '-3.8%',  author: 'A. Karim', date: '2026-05-12', pages: 18, status: 'draft' },
];

// Map plant IDs to approximate SVG positions on schematic Pakistan map
export const PLANT_POSITIONS: Record<string, [number, number]> = {
  'PLT-001': [18, 72],
  'PLT-002': [28, 48],
  'PLT-003': [30, 50],
  'PLT-004': [55, 68],
  'PLT-005': [32, 52],
  'PLT-006': [33, 42],
  'PLT-007': [30, 44],
  'PLT-008': [62, 75],
};
