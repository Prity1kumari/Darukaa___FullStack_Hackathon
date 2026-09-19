import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup';
import { defaultChartOptions } from './chartSetup';
import { MetricTrendPoint } from '../../types';
import { formatMonth } from '../../utils/formatters';

interface CarbonTrendChartProps {
  trends: MetricTrendPoint[];
  title?: string;
  isArea?: boolean;
}

export const CarbonTrendChart: React.FC<CarbonTrendChartProps> = ({
  trends,
  title = 'Carbon Sequestration Trend (tCO2e/ha)',
  isArea = true,
}) => {
  const labels = trends.map((t) => formatMonth(t.timestamp));
  const values = trends.map((t) => t.carbon_score);

  const data = {
    labels,
    datasets: [
      {
        label: 'Carbon Density (tCO2e/ha)',
        data: values,
        borderColor: '#10b981',
        backgroundColor: isArea ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
        fill: isArea,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#0b1315',
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
    ],
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Monthly PostGIS
        </span>
      </div>
      <div className="relative flex-1 min-h-[260px]">
        <Line data={data} options={defaultChartOptions as any} />
      </div>
    </div>
  );
};
