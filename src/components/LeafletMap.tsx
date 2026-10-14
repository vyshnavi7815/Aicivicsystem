import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  interactivePicker?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    category: string;
    priority: string;
    status: string;
    address?: string;
  }>;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  interactivePicker = false,
  onLocationSelect,
  markers = [],
  height = '320px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // CartoDB Dark Matter tiles for smart-city aesthetic with fallback
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Handle map click for picker
      if (interactivePicker) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (pickerMarkerRef.current) {
            pickerMarkerRef.current.setLatLng([lat, lng]);
          }
          onLocationSelect?.(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
        });
      }
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const map = mapInstanceRef.current;

    // Interactive picker marker
    if (interactivePicker) {
      const pinIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></span>
            <div class="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      if (!pickerMarkerRef.current) {
        const marker = L.marker(center, { icon: pinIcon, draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onLocationSelect?.(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
        });
        pickerMarkerRef.current = marker;
      } else {
        pickerMarkerRef.current.setLatLng(center);
      }
    }

    // Render multi-markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      markers.forEach((m) => {
        const priorityColors: Record<string, string> = {
          Critical: '#EF4444', // Red
          High: '#F97316', // Orange
          Medium: '#EAB308', // Yellow
          Low: '#10B981', // Green
        };
        const color = priorityColors[m.priority] || '#06B6D4';

        const customMarkerIcon = L.divIcon({
          className: 'custom-report-pin',
          html: `
            <div class="group relative cursor-pointer">
              <div class="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-xs" style="background-color: ${color}">
                ●
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
        });

        const popupContent = `
          <div class="p-2 min-w-[180px] text-slate-800">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-mono font-bold text-cyan-600">${m.id}</span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white" style="background-color: ${color}">
                ${m.priority}
              </span>
            </div>
            <p class="font-bold text-sm leading-tight text-slate-900">${m.title}</p>
            <p class="text-xs text-slate-500 mt-1">${m.address || 'Location on map'}</p>
            <div class="mt-2 pt-1 border-t border-slate-200 flex justify-between items-center text-[11px]">
              <span class="text-slate-600">Status:</span>
              <span class="font-semibold text-cyan-700">${m.status}</span>
            </div>
          </div>
        `;

        const marker = L.marker([m.latitude, m.longitude], { icon: customMarkerIcon });
        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      });
    }

    return () => {
      // Keep map alive or clean up on actual unmount
    };
  }, [center, interactivePicker, markers, onLocationSelect, zoom]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-inner z-0"
    />
  );
};
