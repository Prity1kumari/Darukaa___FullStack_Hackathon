import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Filter, Plus, ChevronRight, Trees, Sparkles, Layers } from 'lucide-react';
import { MapboxMap } from '../components/map/MapboxMap';
import { SiteCreateModal } from '../components/projects/SiteCreateModal';
import { useProjects } from '../hooks/useProjects';
import { useSites, useSitesGeoJSON } from '../hooks/useSites';
import { GeoJSONPolygon } from '../types';
import { formatHectares, formatNumber } from '../utils/formatters';

export const MapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeProjectParam = searchParams.get('project') || '';
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjectParam);

  const { data: projects = [] } = useProjects();
  const { data: sitesGeoJSON, refetch: refetchSitesGeoJSON } = useSitesGeoJSON(
    selectedProjectId || undefined
  );
  const { data: sites = [] } = useSites(selectedProjectId || undefined);

  // Modal for saving drawn polygon
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [drawnPolygon, setDrawnPolygon] = useState<GeoJSONPolygon | null>(null);
  const [drawnAreaHa, setDrawnAreaHa] = useState<number>(0);

  const handleProjectFilter = (projId: string) => {
    setSelectedProjectId(projId);
    if (projId) {
      setSearchParams({ project: projId });
    } else {
      setSearchParams({});
    }
  };

  const handlePolygonCreated = (polygon: GeoJSONPolygon, areaHa: number) => {
    setDrawnPolygon(polygon);
    setDrawnAreaHa(areaHa);
    setIsSiteModalOpen(true);
  };

  const handleSiteClick = (siteId: string) => {
    // User can click on polygon popup to navigate to analytics
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-3">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121e21] border border-[#1e3237] px-4 py-2.5 rounded-xl shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Geospatial Polygon Explorer
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive boundaries, area calculation, and carbon telemetry
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectFilter(e.target.value)}
            className="bg-[#0b1315] border border-[#1e3237] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setDrawnPolygon(null);
              setIsSiteModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-brand-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Site</span>
          </button>
        </div>
      </div>

      {/* Main Map Area with Floating Sites Drawer */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-[#1e3237] shadow-xl flex">
        {/* Fullscreen Map Canvas */}
        <div className="flex-1 h-full">
          <MapboxMap
            sitesGeoJSON={sitesGeoJSON}
            onPolygonCreated={handlePolygonCreated}
            onSiteClick={handleSiteClick}
            selectedProjectId={selectedProjectId}
          />
        </div>

        {/* Floating Sites Sidebar (Collapsible) */}
        <div className="hidden xl:flex flex-col w-72 bg-[#121e21]/95 backdrop-blur-md border-l border-[#1e3237] p-4 overflow-y-auto z-10">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1e3237]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sites In View ({sites.length})
            </span>
            <span className="text-[10px] text-brand-400 font-semibold">PostGIS SRID 4326</span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
            {sites.map((site) => (
              <div
                key={site.id}
                onClick={() => navigate(`/sites/${site.id}`)}
                className="p-3 bg-[#0b1315]/80 hover:bg-[#18292c] border border-[#1e3237] hover:border-brand-500/50 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                    {site.name}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{site.ecosystem_type}</p>

                <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-[#1e3237]/60 text-[10px]">
                  <div>
                    <span className="text-slate-500">Area:</span>{' '}
                    <span className="font-semibold text-slate-200">
                      {formatHectares(site.area)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Carbon:</span>{' '}
                    <span className="font-semibold text-emerald-400">
                      {formatNumber(site.metrics?.latest_carbon_score, 1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Site Creation Modal */}
      <SiteCreateModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        defaultProjectId={selectedProjectId || projects[0]?.id}
        initialPolygon={drawnPolygon}
        onCreated={() => {
          refetchSitesGeoJSON();
        }}
      />
    </div>
  );
};
