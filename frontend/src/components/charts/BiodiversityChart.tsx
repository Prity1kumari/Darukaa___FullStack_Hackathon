import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup';
import { defaultChartOptions } from './chartSetup';
import { MetricTrendPoint } from '../../types';
import { formatMonth } from '../../utils/formatters';

interface BiodiversityChartProps {
  trends: MetricTrendPoint[];
  title?: string;
}

export const BiodiversityChart: React.FC<BiodiversityChartProps> = ({
  trends,
  title = 'Biodiversity Health Index (0 - 100)',
}) => {
  const labels = trends.map((t) => formatMonth(t.timestamp));
  const bioValues = trends.map((t) => t.biodiversity_score);

  const data = {
    labels,
    datasets: [
      {
        label: 'Biodiversity Health Index',
        data: bioValues,
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#2dd4bf',
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales.y,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
          Species Richness
        </span>
      </div>
      <div className="relative flex-1 min-h-[260px]">
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
};
