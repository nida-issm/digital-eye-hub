'use client';

import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { renderToString } from 'react-dom/server';
import { indColor, indLabel } from '../lib/helpers';
import type { Plant } from '../lib/types';
import { getPlantCoords } from './pages/MapPage';

// Fix Leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getMarkerHtml(plant: Plant): string {
  const color     = indColor(plant.industry);
  const isInactive = plant.status === 'alert';
  const pulse = !isInactive ? `
    <div style="position:absolute;inset:0;border-radius:50%;background:${color};animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite;opacity:0.35;"></div>
  ` : '';

  return `
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0;}}</style>
    <div style="position:relative;width:32px;height:40px;display:flex;flex-direction:column;align-items:center;">
      <div style="position:relative;width:28px;height:28px;">
        ${pulse}
        <div style="
          position:relative;z-index:1;
          width:28px;height:28px;border-radius:50%;
          background:${color};
          border:2.5px solid rgba(255,255,255,0.9);
          box-shadow:0 3px 10px rgba(0,0,0,0.4);
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.15s;
        ">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 22h20M4 22V9l5 3V9l5 3V6l5 3v13M8 22v-4M13 22v-4"/>
          </svg>
        </div>
      </div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid ${color};margin-top:-2px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3));"></div>
    </div>
  `;
}

function createPlantIcon(plant: Plant) {
  return L.divIcon({
    html: getMarkerHtml(plant),
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `
      <div style="
        width:44px;height:44px;border-radius:50%;
        background:rgba(30,40,60,0.92);
        border:2px solid rgba(255,255,255,0.2);
        backdrop-filter:blur(8px);
        box-shadow:0 4px 16px rgba(0,0,0,0.5);
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        color:white;font-family:monospace;
      ">
        <span style="font-size:14px;font-weight:700;line-height:1;">${count}</span>
        <span style="font-size:8px;opacity:0.7;letter-spacing:0.05em;">PLANTS</span>
      </div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

interface PlantMarkersProps {
  plants: Plant[];
  onPlantClick: (plant: Plant) => void;
}

export function PlantMarkers({ plants, onPlantClick }: PlantMarkersProps) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      zoomToBoundsOnClick
      disableClusteringAtZoom={10}
      iconCreateFunction={createClusterIcon}
    >
      {plants.map((plant) => {
        const coords = getPlantCoords(plant);
        return (
          <Marker
            key={plant.id}
            position={coords}
            icon={createPlantIcon(plant)}
            eventHandlers={{ click: () => onPlantClick(plant) }}
          >
            <Tooltip direction="top" offset={[0, -42]} opacity={1}>
              <div style={{ fontFamily: 'sans-serif', minWidth: 160, padding: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{plant.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{indLabel(plant.industry)} · {plant.province}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                  <span>Cams: <strong>{plant.cams}</strong></span>
                  <span style={{ color: plant.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    {plant.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}
