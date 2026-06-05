import React from 'react';

const ICONS: Record<string, string> = {
  dashboard: 'M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z',
  map:       'M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2zM9 3v16M15 5v16',
  factory:   'M3 21h18M4 21V9l5 3V9l5 3V6l5 3v12M8 21v-4M13 21v-4',
  alert:     'M12 3 2 20h20L12 3zM12 9v5M12 17.5v.5',
  pattern:   'M3 12h3l2-7 4 14 2-7h3l1 3h3',
  policy:    'M12 3 3 8l9 5 9-5-9-5zM3 8v6l9 5 9-5V8M12 13v6',
  report:    'M6 2h9l4 4v16H6zM15 2v4h4M9 12h7M9 16h7M9 8h3',
  search:    'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  download:  'M12 3v12M7 11l5 4 5-4M4 21h16',
  bell:      'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 21a2 2 0 0 0 4 0',
  sun:       'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 1v2M12 21v2M4 4l1.5 1.5M18.5 18.5 20 20M1 12h2M21 12h2M4 20l1.5-1.5M18.5 5.5 20 4',
  moon:      'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
  chevR:     'M9 6l6 6-6 6',
  chevL:     'M15 6l-6 6 6 6',
  chevD:     'M6 9l6 6 6-6',
  chevU:     'M6 15l6-6 6 6',
  arrUp:     'M12 19V5M6 11l6-6 6 6',
  arrDn:     'M12 5v14M6 13l6 6 6-6',
  arrR:      'M5 12h14M13 6l6 6-6 6',
  close:     'M6 6l12 12M18 6 6 18',
  plus:      'M12 5v14M5 12h14',
  check:     'M5 12l5 5L20 6',
  play:      'M7 5l12 7-12 7V5z',
  video:     'M3 6h13v12H3zM16 10l5-3v10l-5-3',
  camera:    'M3 7h4l2-2h6l2 2h4v12H3zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  clock:     'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2',
  pin:       'M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  trend:     'M3 17l6-6 4 4 8-8M21 7h-5M21 7v5',
  settings:  'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.6h4l.3-2.6a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z',
  send:      'M4 12l16-8-7 16-2-6-7-2z',
  sparkle:   'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  collapse:  'M9 4v16M15 9l-3 3 3 3',
  expand:    'M9 4v16M13 9l3 3-3 3',
  refresh:   'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
  more:      'M5 12h.01M12 12h.01M19 12h.01',
  shield:    'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  zap:       'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  share:     'M16 6l-4-4-4 4M12 2v13M20 16v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4',
  flag:      'M5 21V4M5 4h13l-2 4 2 4H5',
  eye:       'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  doc:       'M6 2h9l4 4v16H6zM15 2v4h4',
};

interface IconProps {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ name, size = 17, style, strokeWidth = 1.7, className }: IconProps) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      {d.split('M').filter(Boolean).map((p, i) => (
        <path key={i} d={'M' + p} />
      ))}
    </svg>
  );
}
