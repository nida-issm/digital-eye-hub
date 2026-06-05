'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── Resize hook ──────────────────────────────────────────────────────────────
function useWidth(ref: React.RefObject<HTMLDivElement>) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
}

// ── Sparkline ────────────────────────────────────────────────────────────────
interface SparkProps {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
  full?: boolean;
}

export function Spark({ data, w = 96, h = 28, color = 'var(--muted)', fill = false, strokeWidth = 1.4, full = false }: SparkProps) {
  if (!data?.length) return null;
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 3 - ((v - mn) / rng) * (h - 6),
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={full ? '100%' : w}
      height={h}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {fill && <path d={d + ` L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.1" />}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ── Vertical bar chart ────────────────────────────────────────────────────────
interface BarsProps {
  data: number[];
  height?: number;
  color?: string;
  gap?: number;
}

export function Bars({ data, height = 70, color = 'var(--accent)', gap = 2 }: BarsProps) {
  const ref = useRef<HTMLDivElement>(null!);
  const w = useWidth(ref) || 300;
  const mx = Math.max(...data) || 1;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={height} style={{ display: 'block' }}>
        {data.map((v, i) => {
          const bh = (v / mx) * (height - 2);
          return <rect key={i} x={i * (bw + gap)} y={height - bh} width={bw} height={bh} fill={color} opacity={0.35 + 0.65 * (v / mx)} />;
        })}
      </svg>
    </div>
  );
}

// ── Forecast vs Actual chart ──────────────────────────────────────────────────
interface ForecastChartProps {
  actual: (number | null)[];
  forecast: (number | null)[];
  upper: (number | null)[];
  lower: (number | null)[];
  height?: number;
}

export function ForecastChart({ actual, forecast, upper, lower, height = 280 }: ForecastChartProps) {
  const ref = useRef<HTMLDivElement>(null!);
  const w = useWidth(ref) || 800;
  const h = height;
  const padL = 44, padB = 28, padT = 16, padR = 16;
  const iw = w - padL - padR, ih = h - padT - padB;
  const n = actual.length;

  const all = [...actual, ...upper].filter((v): v is number => v != null);
  const mn = Math.min(...all) * 0.95, mx = Math.max(...all) * 1.05, rng = mx - mn || 1;

  const X = (i: number) => padL + (i / (n - 1)) * iw;
  const Y = (v: number) => padT + ih - ((v - mn) / rng) * ih;

  const line = (arr: (number | null)[]) =>
    arr.map((v, i) => (v == null ? null : [X(i), Y(v)]))
       .filter((p): p is [number, number] => p != null)
       .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1))
       .join(' ');

  const up = upper.map((v, i) => (v == null ? null : [X(i), Y(v)])).filter((p): p is [number, number] => p != null);
  const lo = lower.map((v, i) => (v == null ? null : [X(i), Y(v)])).filter((p): p is [number, number] => p != null).reverse();
  const band = [...up, ...lo].map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ') + ' Z';

  const fIdx = forecast.findIndex((v) => v != null);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={h} style={{ display: 'block' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const v = mn + (rng * i) / 4;
          const y = Y(v);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--grid-line)" strokeWidth="1" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--faint)" fontFamily="var(--font-mono)">{Math.round(v)}</text>
            </g>
          );
        })}
        {fIdx > 0 && (
          <>
            <line x1={X(fIdx)} y1={padT} x2={X(fIdx)} y2={padT + ih} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
            <text x={X(fIdx) + 5} y={padT + 10} fontSize="9.5" fill="var(--muted)" fontFamily="var(--font-mono)" letterSpacing="0.05em">FORECAST</text>
          </>
        )}
        <path d={band} fill="var(--accent)" opacity="0.12" />
        <path d={line(forecast)} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 3" />
        <path d={line(actual)} fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
        {[0, Math.floor(n / 2), n - 1].map((i) => (
          <text key={i} x={X(i)} y={h - 8} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize="10" fill="var(--faint)" fontFamily="var(--font-mono)">
            {i === 0 ? '−120d' : i === n - 1 ? '+30d' : 'today'}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── Radial gauge ──────────────────────────────────────────────────────────────
export function Gauge({ value, size = 132 }: { value: number; size?: number }) {
  const stroke = 9, rad = (size - stroke) / 2, c = 2 * Math.PI * rad;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const col = value > 60 ? 'var(--sev-critical)' : value > 40 ? 'var(--sev-warning)' : 'var(--sev-positive)';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="var(--inset)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke={col} strokeWidth={stroke}
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="butt"
          style={{ transition: 'stroke-dasharray 0.6s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, lineHeight: 1, color: col }}>{value}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>of 100</div>
        </div>
      </div>
    </div>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────
interface HeatmapProps {
  rows: string[];
  cols: string[];
  matrix: number[][];
}

export function Heatmap({ rows, cols, matrix }: HeatmapProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '6px 10px' }} />
            {cols.map((c) => (
              <th key={c} style={{ padding: '6px 8px', fontSize: 10.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rw, ri) => (
            <tr key={rw}>
              <td style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--ink-2)' }}>{rw}</td>
              {cols.map((c, ci) => {
                const v = matrix[ri][ci];
                return (
                  <td key={c} style={{ padding: 3 }}>
                    <div
                      title={`${rw} · ${c}: ${v}`}
                      style={{
                        height: 30, display: 'grid', placeItems: 'center',
                        background: `color-mix(in oklab, var(--sev-critical) ${Math.round((v / 100) * 78)}%, var(--inset))`,
                        color: v > 50 ? 'white' : 'var(--ink-2)',
                        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                        border: '1px solid var(--bg)',
                      }}
                    >
                      {v}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
