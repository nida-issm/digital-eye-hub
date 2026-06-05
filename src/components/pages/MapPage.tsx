'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHead } from '../ui/Card';
import { IndDot } from '../ui/Badges';
import { Chip } from '../ui/Buttons';
import { INDUSTRIES } from '../../lib/data';
import { indColor, indLabel } from '../../lib/helpers';
import { usePlants }    from '../../lib/hooks/usePlants';
import { useCompanies } from '../../lib/hooks/useCompanies';
import type { PageProps, Industry, Plant } from '../../lib/types';

// Dynamic imports — Leaflet must not run on server
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((m) => m.ZoomControl),
  { ssr: false }
);
const PlantMarkers = dynamic(
  () => import('../PlantMarkers').then((m) => m.PlantMarkers),
  { ssr: false }
);

// Known GPS positions for named plants (fallback until GPS API is live)
const KNOWN_COORDS: Record<string, [number, number]> = {
  'Bestway Chakwal':    [32.93, 72.86],
  'Bestway Farooqia':   [33.58, 71.46],
  'Bestway - KK':       [33.72, 72.35],
  'Bestway Mianwali':   [32.58, 71.54],
  'Attock Cement':      [33.75, 72.36],
  'Cherat Cement':      [33.82, 71.89],
  'DG Khan Cement':     [30.05, 70.63],
  'Lucky Cement':       [29.10, 66.45],
  'Maple Leaf':         [32.87, 73.27],
  'Pioneer Cement':     [32.08, 73.65],
  'Power Cement':       [24.86, 67.01],
  'All Sugar Mills':    [26.25, 68.37],
  'All Sugar Mills 2':  [25.52, 69.01],
  'Dewan Hattar':       [33.92, 72.83],
  'Fauji Cement':       [33.60, 72.98],
  'Kohinoor Textile':   [31.42, 73.09],
  'Nishat Mills':       [31.55, 74.34],
};

// Province centre coords for seeded fallback
const PROVINCE_CENTRES: Record<Industry, [number, number]> = {
  cement:    [32.5, 72.5],
  sugar:     [27.0, 68.5],
  textile:   [31.5, 73.0],
  beverages: [24.9, 67.1],
};

function seededCoord(id: string, industry: Industry): [number, number] {
  const [baseLat, baseLng] = PROVINCE_CENTRES[industry] ?? [30, 70];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return [
    baseLat + ((Math.abs(h % 1000) / 1000) - 0.5) * 4,
    baseLng + ((Math.abs((h >> 8) % 1000) / 1000) - 0.5) * 6,
  ];
}

export function getPlantCoords(plant: Plant): [number, number] {
  const known = Object.entries(KNOWN_COORDS).find(([key]) =>
    plant.name.toLowerCase().includes(key.toLowerCase())
  );
  return known ? known[1] : seededCoord(plant.id, plant.industry);
}

const PROVINCE_LABELS = [
  { label: 'KPK',         x: 311, y: 148 },
  { label: 'PUNJAB',      x: 360, y: 295 },
  { label: 'BALOCHISTAN', x: 128, y: 395 },
  { label: 'SINDH',       x: 248, y: 485 },
];

export function MapPage({ navigate, params }: PageProps) {
  const [filter, setFilter]             = useState<string>(params?.industry ?? 'all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [mounted, setMounted]           = useState(false);
  const { plants, loading }             = usePlants();
  const { companies }                   = useCompanies();

  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => plants.filter((p) => {
    const indMatch = filter === 'all' || p.industry === filter;
    const compMatch = companyFilter === 'all' ||
      companies.find((c) => c._id === companyFilter)?.industries?.some((i) => i._id === p.id);
    return indMatch && compMatch;
  }), [plants, filter, companyFilter, companies]);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Command & Control</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>Live Map</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>All monitored manufacturing plants across Pakistan.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {loading && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</span>}
            {(['all', 'cement', 'sugar', 'textile', 'beverages'] as const).map((k) => (
              <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>
                {k !== 'all' && <IndDot ind={k} size={8} />}
                {k === 'all' ? 'All industries' : indLabel(k)}
              </Chip>
            ))}
          </div>
          {companies.length > 0 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Company:</span>
              <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, padding: '4px 10px', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', borderRadius: 8 }}>
                <option value="all">All companies ({companies.length})</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.industries?.length ?? 0})</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        <Card style={{ overflow: 'hidden' }}>
          <CardHead
            title="Pakistan"
            sub={`· ${filtered.length} plants`}
            tools={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sev-positive)', animation: 'pulseDot 1.8s infinite' }} />
                LIVE feed
              </span>
            }
          />
          <div style={{ height: 580, position: 'relative', borderRadius: '0 0 15px 15px', overflow: 'hidden' }}>
            {mounted && (
              <MapContainer
                center={[30.3753, 69.3451]}
                zoom={6}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
                zoomSnap={0.5}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                  attribution=""
                />
                {filtered.length > 0 && (
                  <PlantMarkers plants={filtered} onPlantClick={(p) => navigate('plant', { plant: p })} />
                )}
                <ZoomControl position="bottomleft" />
              </MapContainer>
            )}
            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 40, left: 16, zIndex: 1000, display: 'flex', gap: 12, flexWrap: 'wrap', background: 'rgba(0,0,0,0.55)', padding: '6px 12px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
              {INDUSTRIES.map((i) => (
                <div key={i.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#fff' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: indColor(i.key) }} />
                  {i.label}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Plant list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 640, overflowY: 'auto' }}>
          {companyFilter !== 'all' && (
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Company</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{companies.find((c) => c._id === companyFilter)?.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{filtered.length} plants monitored</div>
            </Card>
          )}
          {filtered.map((p) => (
            <Card key={p.id} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('plant', { plant: p })}>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <IndDot ind={p.industry} size={8} />
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: p.status === 'alert' ? 'var(--sev-critical)' : 'var(--sev-positive)', animation: p.status === 'alert' ? 'pulseDot 1.6s infinite' : 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>{indLabel(p.industry)}</span>
                  <span style={{ color: 'var(--muted)' }}>Cams: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.cams}</span></span>
                  <span style={{ color: p.status === 'alert' ? 'var(--sev-critical)' : 'var(--sev-positive)', fontWeight: 600 }}>{p.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </Card>
          ))}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: 24, color: 'var(--muted)', fontSize: 13, textAlign: 'center' }}>No plants for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
}
