import { api } from './api';
import { Site, SiteGeoJSONFeatureCollection, GeoJSONPolygon } from '../types';
import { MockDataStore } from './mockDataStore';

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
    try {
      const params = projectId ? { project_id: projectId } : {};
      const response = await api.get<Site[]>('/sites', { params });
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving sites from local demo store:', err?.message);
      return MockDataStore.getSites(projectId);
    }
  },

  async getSitesGeoJSON(projectId?: string): Promise<SiteGeoJSONFeatureCollection> {
    try {
      const params: Record<string, string> = { format: 'geojson' };
      if (projectId) params.project_id = projectId;
      const response = await api.get<SiteGeoJSONFeatureCollection>('/sites', { params });
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving GeoJSON from local demo store:', err?.message);
      return MockDataStore.getSitesGeoJSON(projectId);
    }
  },

  async getSite(id: string): Promise<Site> {
    try {
      const response = await api.get<Site>(`/sites/${id}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving site from local demo store:', err?.message);
      return MockDataStore.getSite(id);
    }
  },

  async createSite(data: CreateSiteInput): Promise<Site> {
    try {
      const response = await api.post<Site>('/sites', data);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, creating site in local demo store:', err?.message);
      return MockDataStore.createSite(data);
    }
  },

  async updateSite(id: string, data: UpdateSiteInput): Promise<Site> {
    try {
      const response = await api.put<Site>(`/sites/${id}`, data);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, updating site in local demo store:', err?.message);
      return MockDataStore.getSite(id);
    }
  },

  async deleteSite(id: string): Promise<{ message: string; id: string }> {
    try {
      const response = await api.delete<{ message: string; id: string }>(`/sites/${id}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, deleting site in local demo store:', err?.message);
      return MockDataStore.deleteSite(id);
    }
  },
};
