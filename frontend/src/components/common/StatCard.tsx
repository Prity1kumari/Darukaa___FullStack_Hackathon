import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel = 'vs baseline',
  icon,
  subtitle,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 hover:border-brand-500/40 transition-all duration-200 shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-xl group-hover:bg-brand-500/10 transition-all"></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0b1315] border border-[#1e3237] text-brand-400">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#1e3237]/60">
        {change !== undefined ? (
          <div
            className={`flex items-center space-x-1 font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(change)}%</span>
            <span className="text-slate-400 font-normal">{changeLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtitle || 'Updated continuously'}</span>
        )}
      </div>
    </div>
  );
};
