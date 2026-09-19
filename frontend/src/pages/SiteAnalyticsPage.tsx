import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Trees,
  Shield,
  Sparkles,
  Activity,
  Droplets,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';
import { CarbonTrendChart } from '../components/charts/CarbonTrendChart';
import { BiodiversityChart } from '../components/charts/BiodiversityChart';
import { VegetationIndexChart } from '../components/charts/VegetationIndexChart';
import { useSiteAnalytics } from '../hooks/useAnalytics';
import { formatHectares, formatNumber, formatDate, formatMonth } from '../utils/formatters';

export const SiteAnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: analytics, isLoading, error } = useSiteAnalytics(id);

  if (isLoading) {
    return <Loader label="Loading site telemetry and environmental timeseries..." className="min-h-[60vh]" />;
  }

  if (error || !analytics) {
    return (
      <div className="bg-[#121e21] border border-[#1e3237] rounded-2xl p-10 text-center max-w-lg mx-auto mt-12">
        <h3 className="text-base font-bold text-white mb-2">Site Telemetry Unavailable</h3>
        <p className="text-xs text-slate-400 mb-6">
          Could not retrieve metrics for this geographical site. Ensure the site exists and has environmental records.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const current = analytics.current_metrics;
  const stats = analytics.summary_stats;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121e21] border border-[#1e3237] p-5 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-[#0b1315] hover:bg-[#1e3237] text-slate-300 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {analytics.site_name}
              </h1>
              <Badge variant="emerald">{analytics.ecosystem_type}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
              <span>Protected Parcel</span>
              <span>&bull;</span>
              <span>{formatHectares(analytics.area_hectares)}</span>
              <span>&bull;</span>
              <span>SRID 4326</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to={`/map?site=${analytics.site_id}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#0b1315] hover:bg-[#1e3237] text-slate-200 border border-[#1e3237] rounded-xl text-xs font-bold transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Locate on Map</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Carbon Density"
          value={formatNumber(current.carbon_score, 1)}
          unit="tCO2e/ha"
          change={stats.carbon_change_pct}
          changeLabel="over 24 mo"
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          title="Biodiversity Score"
          value={formatNumber(current.biodiversity_score, 1)}
          unit="/ 100"
          change={stats.biodiversity_change_pct}
          changeLabel="over 24 mo"
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatCard
          title="NDVI Vegetation Vigour"
          value={formatNumber(current.vegetation_index, 3)}
          change={stats.vegetation_change_pct}
          changeLabel="over 24 mo"
          icon={<Activity className="w-5 h-5" />}
        />
        <StatCard
          title="Canopy Cover"
          value={formatNumber(current.canopy_cover, 1)}
          unit="%"
          subtitle={`Soil Moisture: ${formatNumber(current.soil_moisture, 1)}%`}
          icon={<Trees className="w-5 h-5" />}
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[360px]">
          <CarbonTrendChart trends={analytics.trends} isArea={true} />
        </div>
        <div className="h-[360px]">
          <BiodiversityChart trends={analytics.trends} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="h-[340px]">
          <VegetationIndexChart trends={analytics.trends} />
        </div>
      </div>

      {/* Monthly Measurements Data Table */}
      <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Monthly Ecological Telemetry History
            </h3>
            <p className="text-xs text-slate-400">
              Verified timeseries measurements generated from multi-spectral remote sensing
            </p>
          </div>
          <span className="text-[10px] text-slate-400">
            Total Records: {analytics.trends.length}
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#0b1315] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e3237]">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Date Recorded</th>
                <th className="py-3 px-4">Carbon Density (tCO2e/ha)</th>
                <th className="py-3 px-4">Biodiversity Index</th>
                <th className="py-3 px-4">NDVI (Vegetation)</th>
                <th className="py-3 px-4">Canopy Cover</th>
                <th className="py-3 px-4">Soil Moisture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3237]/60 text-slate-200 font-mono text-[11px]">
              {analytics.trends
                .slice()
                .reverse()
                .map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#18292c]/50 transition-colors font-sans">
                    <td className="py-3 px-4 font-bold text-white">
                      {formatMonth(row.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(row.timestamp)}</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold font-mono">
                      {formatNumber(row.carbon_score, 2)}
                    </td>
                    <td className="py-3 px-4 text-teal-400 font-semibold font-mono">
                      {formatNumber(row.biodiversity_score, 1)}
                    </td>
                    <td className="py-3 px-4 text-lime-400 font-semibold font-mono">
                      {formatNumber(row.vegetation_index, 3)}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {formatNumber(row.canopy_cover, 1)}%
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-mono">
                      {formatNumber(row.soil_moisture, 1)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
