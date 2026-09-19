import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { Layers, MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteGeoJSONFeatureCollection, GeoJSONPolygon } from '../../types';
import { calculateAreaHectares } from '../../utils/geo';
import { formatHectares } from '../../utils/formatters';

interface MapboxMapProps {
  sitesGeoJSON?: SiteGeoJSONFeatureCollection;
  onPolygonCreated?: (polygon: GeoJSONPolygon, areaHa: number) => void;
  onSiteClick?: (siteId: string) => void;
  selectedProjectId?: string;
}

const CARTO_DARK_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export const MapboxMap: React.FC<MapboxMapProps> = ({
  sitesGeoJSON,
  onPolygonCreated,
  onSiteClick,
  selectedProjectId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const [activeDrawnArea, setActiveDrawnArea] = useState<number | null>(null);
  const [activeDrawnPolygon, setActiveDrawnPolygon] = useState<GeoJSONPolygon | null>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'dark'>('dark');
  const [isFallbackTiles, setIsFallbackTiles] = useState(false);

  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const hasValidToken = !!token && token !== 'pk.your_mapbox_token_here' && token.length > 20;

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (hasValidToken) {
      mapboxgl.accessToken = token;
    } else {
      setIsFallbackTiles(true);
    }

    const initialStyle = hasValidToken
      ? mapStyle === 'satellite'
        ? 'mapbox://styles/mapbox/satellite-streets-v12'
        : 'mapbox://styles/mapbox/dark-v11'
      : (CARTO_DARK_STYLE as any);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [-70.5, -9.15], // Default Amazon Basin
      zoom: 3,
      attributionControl: true,
    });

    // Navigation Controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Setup Mapbox Draw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'simple_select',
    });

    map.addControl(draw, 'top-left');
    drawRef.current = draw;
    mapRef.current = map;

    // Draw Event Listeners
    const updateDrawnArea = () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const latestFeature = data.features[data.features.length - 1];
        if (latestFeature.geometry.type === 'Polygon') {
          const poly = latestFeature.geometry as GeoJSONPolygon;
          const ha = calculateAreaHectares(poly);
          setActiveDrawnArea(ha);
          setActiveDrawnPolygon(poly);
        }
      } else {
        setActiveDrawnArea(null);
        setActiveDrawnPolygon(null);
      }
    };

    map.on('draw.create', updateDrawnArea);
    map.on('draw.update', updateDrawnArea);
    map.on('draw.delete', updateDrawnArea);

    map.on('load', () => {
      // Add source for database sites
      if (!map.getSource('darukaa-sites')) {
        map.addSource('darukaa-sites', {
          type: 'geojson',
          data: sitesGeoJSON || { type: 'FeatureCollection', features: [] },
        });

        // Fill layer
        map.addLayer({
          id: 'darukaa-sites-fill',
          type: 'fill',
          source: 'darukaa-sites',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.35,
          },
        });

        // Outline layer
        map.addLayer({
          id: 'darukaa-sites-outline',
          type: 'line',
          source: 'darukaa-sites',
          paint: {
            'line-color': '#34d399',
            'line-width': 2.5,
          },
        });

        // Click on site polygon
        map.on('click', 'darukaa-sites-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          const props = feature.properties;
          if (!props) return;

          const coordinates = e.lngLat;
          const popupHtml = `
            <div style="padding: 6px; font-family: Inter, sans-serif;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #fff;">${props.name}</div>
              <div style="font-size: 11px; color: #34d399; margin-bottom: 8px;">${props.ecosystem_type} &bull; ${props.status}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #0b1315; padding: 6px; border-radius: 6px; font-size: 11px; margin-bottom: 8px;">
                <div><span style="color:#94a3b8">Area:</span> <strong style="color:#fff">${Number(props.area).toFixed(1)} ha</strong></div>
                <div><span style="color:#94a3b8">Carbon:</span> <strong style="color:#10b981">${Number(props.carbon_score).toFixed(1)}</strong></div>
                <div><span style="color:#94a3b8">Bio Index:</span> <strong style="color:#2dd4bf">${Number(props.biodiversity_score).toFixed(1)}</strong></div>
                <div><span style="color:#94a3b8">NDVI:</span> <strong style="color:#a3e635">${Number(props.vegetation_index).toFixed(3)}</strong></div>
              </div>
              <a href="/sites/${props.id}" style="display: block; text-align: center; background: #10b981; color: #fff; text-decoration: none; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;">Deep Dive Analytics &rarr;</a>
            </div>
          `;

          new mapboxgl.Popup({ offset: 10 })
            .setLngLat(coordinates)
            .setHTML(popupHtml)
            .addTo(map);

          if (onSiteClick) onSiteClick(props.id);
        });

        // Cursor pointer on hover
        map.on('mouseenter', 'darukaa-sites-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'darukaa-sites-fill', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    });

    return () => {
      map.remove();
    };
  }, [hasValidToken]);

  // Update source data whenever sitesGeoJSON changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.isStyleLoaded() && map.getSource('darukaa-sites')) {
      const source = map.getSource('darukaa-sites') as mapboxgl.GeoJSONSource;
      source.setData(sitesGeoJSON || { type: 'FeatureCollection', features: [] });

      // If sites exist, automatically fit bounds around them
      if (sitesGeoJSON && sitesGeoJSON.features.length > 0) {
        try {
          const bbox = turf.bbox(sitesGeoJSON as any);
          map.fitBounds(bbox as [number, number, number, number], {
            padding: 80,
            maxZoom: 13,
            duration: 1500,
          });
        } catch (err) {
          console.warn('Could not fit bounds:', err);
        }
      }
    }
  }, [sitesGeoJSON]);

  // Handle Save Drawn Polygon
  const handleSaveDrawn = () => {
    if (activeDrawnPolygon && onPolygonCreated) {
      onPolygonCreated(activeDrawnPolygon, activeDrawnArea || 0);
      if (drawRef.current) {
        drawRef.current.deleteAll();
      }
      setActiveDrawnArea(null);
      setActiveDrawnPolygon(null);
    }
  };

  // Discard Drawn Polygon
  const handleDiscardDrawn = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
    setActiveDrawnArea(null);
    setActiveDrawnPolygon(null);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-[#1e3237] shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Fallback Banner if using OpenStreetMap/Carto */}
      {isFallbackTiles && (
        <div className="absolute top-3 left-16 z-10 bg-[#121e21]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs text-amber-300 flex items-center space-x-2 shadow-lg">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Carto Dark Basemap active. (Provide VITE_MAPBOX_ACCESS_TOKEN for Mapbox Satellite)</span>
        </div>
      )}

      {/* Live Polygon Drawing Action Bar */}
      {activeDrawnArea !== null && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[#121e21]/95 backdrop-blur-md border border-brand-500/50 rounded-2xl p-4 shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-brand-400 animate-ping" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-brand-400">
                Polygon Delineated
              </p>
              <p className="text-base font-extrabold text-white">
                {formatHectares(activeDrawnArea)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 border-l border-[#1e3237] pl-4">
            <button
              onClick={handleSaveDrawn}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save As Site</span>
            </button>
            <button
              onClick={handleDiscardDrawn}
              className="p-2 rounded-xl bg-[#0b1315] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1e3237] transition-all"
              title="Discard drawing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drawing Instructions overlay */}
      <div className="absolute top-3 left-16 z-10 hidden sm:flex items-center space-x-2 bg-[#121e21]/90 backdrop-blur-md border border-[#1e3237] px-3 py-1.5 rounded-lg text-xs text-slate-300 shadow-md">
        <MapPin className="w-3.5 h-3.5 text-brand-400" />
        <span>Click polygon icon (top-left) to draw boundary on map</span>
      </div>
    </div>
  );
};
