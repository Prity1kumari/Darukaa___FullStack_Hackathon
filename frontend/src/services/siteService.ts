import { api } from './api';
import { Site, SiteGeoJSONFeatureCollection, GeoJSONPolygon } from '../types';

export interface CreateSiteInput {
  project_id: string;
  name: string;
  ecosystem_type?: string;
  status?: string;
  polygon: GeoJSONPolygon;
  area?: number;
}

export interface UpdateSiteInput {
  name?: string;
  ecosystem_type?: string;
  status?: string;
  polygon?: GeoJSONPolygon;
  area?: number;
}

export const siteService = {
  async getSites(projectId?: string): Promise<Site[]> {
    const params = projectId ? { project_id: projectId } : {};
    const response = await api.get<Site[]>('/sites', { params });
    return response.data;
  },

  async getSitesGeoJSON(projectId?: string): Promise<SiteGeoJSONFeatureCollection> {
    const params: Record<string, string> = { format: 'geojson' };
    if (projectId) params.project_id = projectId;
    const response = await api.get<SiteGeoJSONFeatureCollection>('/sites', { params });
    return response.data;
  },

  async getSite(id: string): Promise<Site> {
    const response = await api.get<Site>(`/sites/${id}`);
    return response.data;
  },

  async createSite(data: CreateSiteInput): Promise<Site> {
    const response = await api.post<Site>('/sites', data);
    return response.data;
  },

  async updateSite(id: string, data: UpdateSiteInput): Promise<Site> {
    const response = await api.put<Site>(`/sites/${id}`, data);
    return response.data;
  },

  async deleteSite(id: string): Promise<{ message: string; id: string }> {
    const response = await api.delete<{ message: string; id: string }>(`/sites/${id}`);
    return response.data;
  },
};
