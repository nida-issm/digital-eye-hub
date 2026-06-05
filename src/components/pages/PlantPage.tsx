'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardHead, Stat } from '../ui/Card';
import { IndTag, StatusPill } from '../ui/Badges';
import { Btn, Chip } from '../ui/Buttons';
import { Spark, Bars } from '../charts/Charts';
import Icon from '../ui/Icon';
import { ANOMALIES, EVENTS } from '../../lib/data';
import { indColor, indLabel } from '../../lib/helpers';
import { useDevices }         from '../../lib/hooks/useDevices';
import { usePlantStatus }     from '../../lib/hooks/usePlantStatus';
import { useProduction }      from '../../lib/hooks/useProduction';
import { useDowntime }        from '../../lib/hooks/useDowntime';
import { useCameras }         from '../../lib/hooks/useCameras';
import { useTotalProduction } from '../../lib/hooks/useTotalProduction';
import { useLineAnalytics }   from '../../lib/hooks/useLineAnalytics';
import { useLineHourly }      from '../../lib/hooks/useLineHourly';
import type { PageProps }     from '../../lib/types';

export function PlantPage({ params, navigate }: PageProps) {
  const plant = params?.plant;
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [activeTab, setActiveTab]           = useState<'overview' | 'cameras' | 'lines'>('overview');

  if (!plant) {
    return (
      <div style={{ padding: 40, color: 'var(--muted)' }}>
        No plant selected. <span onClick={() => navigate('map')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Open map</span>
      </div>
    );
  }

  const id    = plant.id;
  const today = new Date().toISOString().split('T')[0];

  const { devices }                                  = useDevices(id);
  const { online }                                   = usePlantStatus(id);
  const { data: prodData, loading: prodLoading }     = useProduction(id);
  const { data: downtime }                           = useDowntime(id);
  const { cameras, loading: camLoading }             = useCameras(id);
  const { data: totals }                             = useTotalProduction(id);
  const { data: lineData,   loading: lineLoading }   = useLineAnalytics(selectedCamera ?? undefined, today);
  const { data: hourlyData, loading: hourlyLoading } = useLineHourly(selectedCamera ?? undefined, today);

  const sparkData = useMemo(() => {
    if (prodData.length > 0) return prodData.slice(-30);
    return Array.from({ length: 30 }, (_, i) => plant.util + Math.sin(i * 0.7 + plant.util * 0.1) * 12);
  }, [prodData, plant.id]);

  const hourlyBars = useMemo(() => {
    if (!hourlyData?.hourly_data?.length) return [];
    return Array.from({ length: 24 }, (_, h) => {
      const pt = hourlyData.hourly_data.find((p) => p.hour === h);
      return pt?.count ?? 0;
    });
  }, [hourlyData]);

  const liveOnlineCams = cameras.length > 0 ? cameras.length
    : devices.length > 0 ? devices.filter((d) => d.status === 'active').length
    : plant.onlineCams;
  const liveTotalCams  = cameras.length > 0 ? cameras.length
    : devices.length > 0 ? devices.length
    : plant.cams;
  const liveStatus     = online === null ? plant.status : online ? 'active' : 'alert';
  const plantAnoms     = ANOMALIES.filter((a) => a.plant.id === plant.id);
  const plantEvents    = EVENTS.filter((e) => e.plant.id === plant.id);

  const statusBorder = liveStatus === 'alert'
    ? 'color-mix(in oklab, var(--sev-critical) 40%, transparent)'
    : 'color-mix(in oklab, var(--sev-positive) 40%, transparent)';
  const statusBg  = liveStatus === 'alert'
    ? 'color-mix(in oklab, var(--sev-critical) 9%, transparent)'
    : 'color-mix(in oklab, var(--sev-positive) 9%, transparent)';
  const statusCol = liveStatus === 'alert' ? 'var(--sev-critical)' : 'var(--sev-positive)';

  const TH: React.CSSProperties = {
    textAlign: 'left', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em',
    textTransform: 'uppercase', color: 'var(--muted)', padding: '10px 16px',
    borderBottom: '1px solid var(--border-strong)', background: 'var(--surface)', whiteSpace: 'nowrap',
  };
  const TD: React.CSSProperties = { padding: '10px 16px', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1480, margin: '0 auto' }} className="fade-up">

      {/* Head */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <IndTag ind={plant.industry} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, padding: '2px 8px', border: `1px solid ${statusBorder}`, background: statusBg, color: statusCol, borderRadius: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusCol, animation: liveStatus === 'active' ? 'pulseDot 2s infinite' : 'none' }} />
              {liveStatus === 'alert' ? 'Inactive' : 'Active'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 27, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.1, margin: 0 }}>{plant.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6 }}>
            {plant.province} · <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{plant.id.slice(0, 8)}…</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn><Icon name="video" size={15} />Live feed</Btn>
          <Btn><Icon name="flag"  size={15} />Flag</Btn>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <Stat label="Today's production"
          value={(totals?.total_daily_production_count ?? 0).toLocaleString()} unit="bags"
          foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>Month: {(totals?.total_monthly_production_count ?? 0).toLocaleString()}</span>} />
        <Stat label="Downtime"
          value={downtime ? `${downtime.downtime_percentage.toFixed(0)}%` : '—'}
          accent={downtime && downtime.downtime_percentage > 50 ? 'var(--sev-critical)' : downtime && downtime.downtime_percentage > 20 ? 'var(--sev-warning)' : undefined}
          foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>{downtime ? `${downtime.downtime_hours}h · ${downtime.downtime_minutes}min` : 'No data'}</span>} />
        <Stat label="Cameras"
          value={`${liveOnlineCams} / ${liveTotalCams}`}
          foot={<span style={{ fontSize: 11, color: liveOnlineCams < liveTotalCams ? 'var(--sev-critical)' : 'var(--muted)' }}>{liveOnlineCams < liveTotalCams ? `${liveTotalCams - liveOnlineCams} offline` : 'all online'}</span>} />
        <Stat label="Selected camera"
          value={selectedCamera ? '1 selected' : 'None'}
          foot={<span style={{ fontSize: 11, color: 'var(--muted)' }}>{selectedCamera ? 'Click Cameras tab to change' : 'Select in Cameras tab'}</span>} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['overview', 'cameras', 'lines'] as const).map((tab) => (
          <Chip key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
            {tab}
            {tab === 'cameras' && cameras.length > 0 && (
              <span style={{ marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10 }}>{cameras.length}</span>
            )}
            {tab === 'lines' && !selectedCamera && (
              <span style={{ marginLeft: 4, fontSize: 10, color: 'var(--faint)' }}>select camera first</span>
            )}
          </Chip>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <CardHead title="Production trend" sub="/ monthly avg"
                tools={prodLoading ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</span> : undefined} />
              <div style={{ padding: 20 }}>
                <Spark data={sparkData} w={600} h={80} color={indColor(plant.industry)} fill full />
              </div>
            </Card>
            <Card>
              <CardHead title="Anomalies" />
              {plantAnoms.length ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr>{['ID', 'Type', 'Confidence', 'Status'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{plantAnoms.map((a) => (
                    <tr key={a.id} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel)')} onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                      <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{a.id}</td>
                      <td style={{ ...TD, fontSize: 12 }}>{a.type.replace(/_/g, ' ')}</td>
                      <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{a.conf.toFixed(2)}</td>
                      <td style={TD}><StatusPill status={a.status} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>No anomalies for this plant.</div>}
            </Card>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Plant details</div>
              {([
                ['Industry',   indLabel(plant.industry)],
                ['Status',     liveStatus === 'active' ? 'Active' : 'Inactive'],
                ['Cameras',    `${liveTotalCams} total`],
                ['Today',      `${(totals?.total_daily_production_count ?? 0).toLocaleString()} bags`],
                ['This month', `${(totals?.total_monthly_production_count ?? 0).toLocaleString()} bags`],
                ['Downtime',   downtime ? `${downtime.downtime_percentage.toFixed(1)}%` : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </Card>
            {downtime && (
              <Card style={{ padding: 20 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Downtime breakdown</div>
                <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
                  {[[`${downtime.downtime_hours}h`, 'Hours'], [`${downtime.downtime_minutes}m`, 'Minutes'], [`${downtime.downtime_percentage.toFixed(0)}%`, 'Of period']].map(([v, l], i, arr) => (
                    <div key={l} style={{ flex: 1, textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500, color: downtime.downtime_percentage > 50 ? 'var(--sev-critical)' : 'var(--sev-warning)' }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 6, background: 'var(--inset)', borderRadius: 3, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${downtime.downtime_percentage}%`, background: downtime.downtime_percentage > 50 ? 'var(--sev-critical)' : 'var(--sev-warning)', borderRadius: 3 }} />
                </div>
              </Card>
            )}
            <Card>
              <CardHead title="Recent events" />
              {plantEvents.length ? plantEvents.slice(0, 4).map((e) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--sev-${e.sev})`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{e.camera} · {e.time}</div>
                  </div>
                </div>
              )) : <div style={{ padding: 20, color: 'var(--muted)', fontSize: 13 }}>No recent events.</div>}
            </Card>
          </div>
        </div>
      )}

      {/* ── CAMERAS ── */}
      {activeTab === 'cameras' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <CardHead title="Camera list" sub={`/ ${cameras.length} cameras`}
              tools={camLoading ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</span> : undefined} />
            {cameras.length > 0 ? (
              <div style={{ maxHeight: 520, overflowY: 'auto' }}>
                {cameras.map((cam) => (
                  <div key={cam.camera_id}
                    onClick={() => { setSelectedCamera(cam.camera_id === selectedCamera ? null : cam.camera_id); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedCamera === cam.camera_id ? 'var(--accent-soft)' : '' }}
                    onMouseEnter={(e) => { if (selectedCamera !== cam.camera_id) e.currentTarget.style.background = 'var(--panel)'; }}
                    onMouseLeave={(e) => { if (selectedCamera !== cam.camera_id) e.currentTarget.style.background = ''; }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--inset)', border: `1px solid ${selectedCamera === cam.camera_id ? 'var(--accent)' : 'var(--border)'}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name="camera" size={13} style={{ color: selectedCamera === cam.camera_id ? 'var(--accent)' : 'var(--muted)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cam.camera_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{cam.camera_id.slice(0, 12)}…</div>
                    </div>
                    <Icon name="chevR" size={13} style={{ color: 'var(--faint)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
                {camLoading ? 'Loading cameras…' : 'No cameras found for this plant.'}
              </div>
            )}
          </Card>
          <Card>
            <CardHead
              title={selectedCamera ? 'Hourly production' : 'Select a camera'}
              sub={selectedCamera ? `/ ${today}` : undefined}
              tools={hourlyLoading ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</span> : undefined}
            />
            {!selectedCamera ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 13 }}>
                Click a camera on the left to view its hourly production chart.
              </div>
            ) : (
              <div style={{ padding: 20 }}>
                {hourlyBars.length > 0 && hourlyBars.some((v) => v > 0) ? (
                  <>
                    <Bars data={hourlyBars} height={140} color={indColor(plant.industry)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--faint)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
                      <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 24 }}>
                      <div style={{ fontSize: 12 }}><span style={{ color: 'var(--muted)' }}>Peak hour: </span><span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{String(hourlyBars.indexOf(Math.max(...hourlyBars))).padStart(2, '0')}:00</span></div>
                      <div style={{ fontSize: 12 }}><span style={{ color: 'var(--muted)' }}>Total today: </span><span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{hourlyBars.reduce((a, b) => a + b, 0).toLocaleString()}</span></div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
                    {hourlyLoading ? 'Loading hourly data…' : 'No production data for this camera today.'}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── LINES ── */}
      {activeTab === 'lines' && (
        <Card>
          <CardHead
            title="Line analytics"
            sub={selectedCamera ? `/ ${today}` : '/ select a camera first'}
            tools={lineLoading ? <span style={{ fontSize: 11, color: 'var(--muted)' }}>Loading…</span> : selectedCamera ? <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{lineData.length} records</span> : undefined}
          />
          {!selectedCamera ? (
            <div style={{ textAlign: 'center', padding: 56, color: 'var(--muted)', fontSize: 13 }}>
              Go to the <span onClick={() => setActiveTab('cameras')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Cameras tab</span> and select a camera to view line analytics.
            </div>
          ) : lineData.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr>{['Camera', 'Camera ID', 'Total count', 'Date'].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {lineData.map((line) => (
                  <tr key={line.camera_id} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel)')} onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                    <td style={{ ...TD, fontWeight: 600 }}>{line.camera_name}</td>
                    <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)' }}>{line.camera_id.slice(0, 12)}…</td>
                    <td style={{ ...TD, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{line.total_count.toLocaleString()}</td>
                    <td style={{ ...TD, fontSize: 12, color: 'var(--muted)' }}>{line.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: 56, color: 'var(--muted)' }}>
              {lineLoading ? 'Loading…' : 'No line analytics for this camera today.'}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
