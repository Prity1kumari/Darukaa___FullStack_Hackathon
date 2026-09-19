import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './chartSetup';
import { defaultChartOptions } from './chartSetup';
import { SiteComparisonMetric } from '../../types';

interface SiteComparisonChartProps {
  sites: SiteComparisonMetric[];
  title?: string;
}

export const SiteComparisonChart: React.FC<SiteComparisonChartProps> = ({
  sites,
  title = 'Site Comparison Breakdown',
}) => {
  const [metricKey, setMetricKey] = useState<'carbon_score' | 'biodiversity_score' | 'area_hectares'>(
    'carbon_score'
  );

  const labels = sites.map((s) => s.site_name);
  const values = sites.map((s) => s[metricKey]);

  const metricColors = {
    carbon_score: {
      border: '#10b981',
      bg: 'rgba(16, 185, 129, 0.4)',
      label: 'Carbon Score (tCO2e/ha)',
    },
    biodiversity_score: {
      border: '#2dd4bf',
      bg: 'rgba(45, 212, 191, 0.4)',
      label: 'Biodiversity Health Index',
    },
    area_hectares: {
      border: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.4)',
      label: 'Protected Area (Hectares)',
    },
  };

  const activeColor = metricColors[metricKey];

  const data = {
    labels,
    datasets: [
      {
        label: activeColor.label,
        data: values,
        backgroundColor: activeColor.bg,
        borderColor: activeColor.border,
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
          <p className="text-[11px] text-slate-400">Benchmarking across project sites</p>
        </div>
        <div className="flex items-center space-x-1 bg-[#0b1315] p-1 rounded-lg border border-[#1e3237]">
          <button
            onClick={() => setMetricKey('carbon_score')}
            className={`px-2 py-1 text-xs rounded font-medium transition-all ${
              metricKey === 'carbon_score'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Carbon
          </button>
          <button
            onClick={() => setMetricKey('biodiversity_score')}
            className={`px-2 py-1 text-xs rounded font-medium transition-all ${
              metricKey === 'biodiversity_score'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Biodiversity
          </button>
          <button
            onClick={() => setMetricKey('area_hectares')}
            className={`px-2 py-1 text-xs rounded font-medium transition-all ${
              metricKey === 'area_hectares'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Area (ha)
          </button>
        </div>
      </div>
      <div className="relative flex-1 min-h-[260px]">
        <Bar data={data} options={defaultChartOptions as any} />
      </div>
    </div>
  );
};
