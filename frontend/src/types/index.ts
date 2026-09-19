import { GeoJSONPolygon } from './geojson';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface ProjectSummary {
  site_count: number;
  total_area_hectares: number;
  avg_carbon_score: number;
  avg_biodiversity_score: number;
  avg_vegetation_index: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  summary?: ProjectSummary;
}

export interface SiteMetricsSummary {
  latest_carbon_score?: number;
  latest_biodiversity_score?: number;
  latest_vegetation_index?: number;
  latest_canopy_cover?: number;
  latest_soil_moisture?: number;
  last_updated?: string;
}

export interface Site {
  id: string;
  project_id: string;
  name: string;
  polygon_geojson: GeoJSONPolygon;
  area: number;
  ecosystem_type: string;
  status: string;
  created_at: string;
  metrics?: SiteMetricsSummary;
}

export * from './geojson';
export * from './analytics';
