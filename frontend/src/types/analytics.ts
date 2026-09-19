export interface MetricTrendPoint {
  timestamp: string;
  carbon_score: number;
  biodiversity_score: number;
  vegetation_index: number;
  canopy_cover?: number;
  soil_moisture?: number;
}

export interface SiteAnalyticsResponse {
  site_id: string;
  site_name: string;
  area_hectares: number;
  ecosystem_type: string;
  current_metrics: {
    carbon_score: number;
    biodiversity_score: number;
    vegetation_index: number;
    canopy_cover?: number;
    soil_moisture?: number;
    last_measured?: string;
  };
  trends: MetricTrendPoint[];
  summary_stats: {
    carbon_change_pct?: number;
    biodiversity_change_pct?: number;
    vegetation_change_pct?: number;
    records_count?: number;
    first_recorded?: string;
    latest_recorded?: string;
  };
}

export interface SiteComparisonMetric {
  site_id: string;
  site_name: string;
  area_hectares: number;
  ecosystem_type: string;
  carbon_score: number;
  biodiversity_score: number;
  vegetation_index: number;
}

export interface ProjectAnalyticsResponse {
  project_id: string;
  project_name: string;
  total_area_hectares: number;
  total_sites: number;
  aggregate_trends: {
    month: string;
    avg_carbon_score: number;
    avg_biodiversity_score: number;
    avg_vegetation_index: number;
  }[];
  site_comparisons: SiteComparisonMetric[];
  ecosystem_breakdown: Record<string, number>;
}

export interface OverviewKPIs {
  total_projects: number;
  total_sites: number;
  total_area_hectares: number;
  total_carbon_sequestered: number;
  average_biodiversity_score: number;
  average_vegetation_index: number;
}
