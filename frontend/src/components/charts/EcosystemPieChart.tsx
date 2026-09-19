import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartSetup';
import { defaultChartOptions } from './chartSetup';

interface EcosystemPieChartProps {
  breakdown: Record<string, number>;
  title?: string;
}

export const EcosystemPieChart: React.FC<EcosystemPieChartProps> = ({
  breakdown,
  title = 'Ecosystem Land Classification',
}) => {
  const labels = Object.keys(breakdown);
  const values = Object.values(breakdown);

  const colors = [
    { bg: 'rgba(16, 185, 129, 0.7)', border: '#10b981' },
    { bg: 'rgba(45, 212, 191, 0.7)', border: '#2dd4bf' },
    { bg: 'rgba(59, 130, 246, 0.7)', border: '#3b82f6' },
    { bg: 'rgba(234, 179, 8, 0.7)', border: '#eab308' },
    { bg: 'rgba(168, 85, 247, 0.7)', border: '#a855f7' },
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length].bg),
        borderColor: labels.map((_, i) => colors[i % colors.length].border),
        borderWidth: 1.5,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
          padding: 14,
        },
      },
      tooltip: defaultChartOptions.plugins.tooltip,
    },
    cutout: '65%',
  };

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg flex flex-col h-full">
      <h4 className="text-sm font-bold text-white tracking-wide mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 mb-4">Hectares monitored by biome</p>
      <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
        <Doughnut data={data} options={doughnutOptions} />
      </div>
    </div>
  );
};
