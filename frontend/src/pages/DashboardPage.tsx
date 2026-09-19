import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Shield, Sparkles, Activity, MapPin, ArrowRight, Plus } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';
import { CarbonTrendChart } from '../components/charts/CarbonTrendChart';
import { BiodiversityChart } from '../components/charts/BiodiversityChart';
import { EcosystemPieChart } from '../components/charts/EcosystemPieChart';
import { SiteComparisonChart } from '../components/charts/SiteComparisonChart';
import { useOverview, useProjectAnalytics } from '../hooks/useAnalytics';
import { useProjects } from '../hooks/useProjects';
import { useSites } from '../hooks/useSites';
import { formatHectares, formatNumber } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();

  // Load first project's detailed analytics for aggregate charts if available
  const activeProjectId = projects[0]?.id;
  const { data: projectAnalytics } = useProjectAnalytics(activeProjectId);

  if (overviewLoading || projectsLoading || sitesLoading) {
    return <Loader label="Loading geospatial analytics intelligence..." className="min-h-[60vh]" />;
  }

  const kpis = overview || {
    total_projects: projects.length,
    total_sites: sites.length,
    total_area_hectares: sites.reduce((sum, s) => sum + s.area, 0),
    total_carbon_sequestered: 0,
    average_biodiversity_score: 82.4,
    average_vegetation_index: 0.78,
  };

  // Build ecosystem breakdown if not provided by projectAnalytics
  const ecosystemBreakdown = projectAnalytics?.ecosystem_breakdown || {
    'Tropical Rainforest': 5240,
    'Mangrove': 1550,
    'Peatland': 2230,
    'Temperate Forest': 780,
    'Savannah': 3450,
  };

  // Build site comparison data
  const siteComparisons = projectAnalytics?.site_comparisons || sites.map((s) => ({
    site_id: s.id,
    site_name: s.name,
    area_hectares: s.area,
    ecosystem_type: s.ecosystem_type,
    carbon_score: s.metrics?.latest_carbon_score || 140,
    biodiversity_score: s.metrics?.latest_biodiversity_score || 80,
    vegetation_index: s.metrics?.latest_vegetation_index || 0.75,
  }));

  // Build monthly trends
  const trends = projectAnalytics?.aggregate_trends?.map((t) => ({
    timestamp: `${t.month}-01T00:00:00Z`,
    carbon_score: t.avg_carbon_score,
    biodiversity_score: t.avg_biodiversity_score,
    vegetation_index: t.avg_vegetation_index,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121e21] border border-[#1e3237] p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Live Geospatial Monitoring
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Carbon & Biodiversity Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Consolidated telemetry across {kpis.total_projects} active conservation initiatives and {kpis.total_sites} verified parcel boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/map"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Interactive Map</span>
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0b1315] hover:bg-[#1e3237] text-slate-200 border border-[#1e3237] rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4 text-brand-400" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Land Area"
          value={formatHectares(kpis.total_area_hectares)}
          change={8.4}
          changeLabel="new parcels added"
          icon={<Trees className="w-5 h-5" />}
        />
        <StatCard
          title="Total Carbon Sequestered"
          value={formatNumber(kpis.total_carbon_sequestered, 0)}
          unit="tCO2e"
          change={12.6}
          changeLabel="annual gain"
          icon={<Shield className="w-5 h-5" />}
        />
        <StatCard
          title="Mean Biodiversity Index"
          value={formatNumber(kpis.average_biodiversity_score, 1)}
          unit="/ 100"
          change={4.2}
          changeLabel="species recovery"
          icon={<Sparkles className="w-5 h-5" />}
        />
        <StatCard
          title="Vegetation Health (NDVI)"
          value={formatNumber(kpis.average_vegetation_index, 3)}
          change={3.1}
          changeLabel="canopy vigor"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* Primary Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[360px]">
          <CarbonTrendChart trends={trends} isArea={true} />
        </div>
        <div className="h-[360px]">
          <BiodiversityChart trends={trends} />
        </div>
      </div>

      {/* Secondary Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[380px]">
          <SiteComparisonChart sites={siteComparisons} />
        </div>
        <div className="h-[380px]">
          <EcosystemPieChart breakdown={ecosystemBreakdown} />
        </div>
      </div>

      {/* Monitored Sites Summary Table */}
      <div className="bg-[#121e21] border border-[#1e3237] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Monitored Geographical Sites
            </h3>
            <p className="text-xs text-slate-400">
              Direct PostGIS spatial geometries and latest sensor snapshot
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1315]/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#1e3237]">
              <tr>
                <th className="py-3 px-4">Site Name</th>
                <th className="py-3 px-4">Ecosystem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Carbon Density</th>
                <th className="py-3 px-4">Biodiversity</th>
                <th className="py-3 px-4">NDVI</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3237]/60 text-slate-200">
              {sites.slice(0, 6).map((site) => (
                <tr key={site.id} className="hover:bg-[#18292c]/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>{site.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{site.ecosystem_type}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={site.status === 'Active' ? 'emerald' : 'teal'}>
                      {site.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{formatHectares(site.area)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">
                    {formatNumber(site.metrics?.latest_carbon_score, 1)} tCO2e/ha
                  </td>
                  <td className="py-3.5 px-4 text-teal-400 font-bold">
                    {formatNumber(site.metrics?.latest_biodiversity_score, 1)}
                  </td>
                  <td className="py-3.5 px-4 text-lime-400 font-bold">
                    {formatNumber(site.metrics?.latest_vegetation_index, 3)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/map?site=${site.id}`}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-[#0b1315] hover:bg-[#1e3237] text-slate-300 transition-colors"
                      >
                        Map
                      </Link>
                      <Link
                        to={`/sites/${site.id}`}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-colors"
                      >
                        Analytics
                      </Link>
                    </div>
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
