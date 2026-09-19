import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, Sparkles, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import { formatHectares, formatNumber } from '../../utils/formatters';

interface SitePopupProps {
  properties: {
    id: string;
    project_id: string;
    name: string;
    area: number;
    ecosystem_type: string;
    status: string;
    carbon_score: number;
    biodiversity_score: number;
    vegetation_index: number;
  };
}

export const SitePopup: React.FC<SitePopupProps> = ({ properties }) => {
  const navigate = useNavigate();

  return (
    <div className="p-1 max-w-xs text-slate-100">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h4 className="font-bold text-sm text-white truncate">{properties.name}</h4>
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
          {properties.status}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-3">{properties.ecosystem_type}</p>

      <div className="grid grid-cols-2 gap-2 bg-[#0b1315]/80 p-2 rounded-lg border border-[#1e3237] text-xs mb-3">
        <div>
          <span className="text-[10px] text-slate-400 block">Area</span>
          <span className="font-semibold text-white">{formatHectares(properties.area)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Carbon</span>
          <span className="font-semibold text-emerald-400">
            {formatNumber(properties.carbon_score, 1)} <span className="text-[9px] text-slate-400">tCO2e/ha</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">Biodiversity</span>
          <span className="font-semibold text-teal-400">{formatNumber(properties.biodiversity_score, 1)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">NDVI</span>
          <span className="font-semibold text-lime-400">{formatNumber(properties.vegetation_index, 3)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/sites/${properties.id}`)}
        className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-md shadow-brand-500/20 transition-colors"
      >
        <span>View Analytics</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
