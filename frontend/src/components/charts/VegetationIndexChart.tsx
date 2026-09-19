import React from 'react';
import { Line } from 'react-chartjs-2';
import './chartSetup';
import { defaultChartOptions } from './chartSetup';
import { MetricTrendPoint } from '../../types';
import { formatMonth } from '../../utils/formatters';

interface VegetationIndexChartProps {
  trends: MetricTrendPoint[];
  title?: string;
}

export const VegetationIndexChart: React.FC<VegetationIndexChartProps> = ({
  trends,
  title = 'Vegetation Density Index (NDVI)',
}) => {
  const labels = trends.map((t) => formatMonth(t.timestamp));
  const ndviValues = trends.map((t) => t.vegetation_index);

  const data = {
    labels,
    datasets: [
      {
        label: 'NDVI (Canopy Vigour)',
        data: ndviValues,
        borderColor: '#84cc16',
        backgroundColor: 'rgba(132, 204, 22, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#84cc16',
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
        min: 0.0,
        max: 1.0,
      },
    },
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/30">
          Remote Sensing NDVI
        </span>
      </div>
      <div className="relative flex-1 min-h-[260px]">
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
};
