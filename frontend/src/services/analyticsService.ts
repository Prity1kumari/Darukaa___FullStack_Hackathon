import { api } from './api';
import { OverviewKPIs, SiteAnalyticsResponse, ProjectAnalyticsResponse } from '../types';
import { MockDataStore } from './mockDataStore';

export const analyticsService = {
  async getOverview(): Promise<OverviewKPIs> {
    try {
      const response = await api.get<OverviewKPIs>('/analytics/overview');
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving overview KPIs from local demo store:', err?.message);
      return MockDataStore.getOverview();
    }
  },

  async getSiteAnalytics(siteId: string): Promise<SiteAnalyticsResponse> {
    try {
      const response = await api.get<SiteAnalyticsResponse>(`/analytics/site/${siteId}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving site analytics from local demo store:', err?.message);
      return MockDataStore.getSiteAnalytics(siteId);
    }
  },

  async getProjectAnalytics(projectId: string): Promise<ProjectAnalyticsResponse> {
    try {
      const response = await api.get<ProjectAnalyticsResponse>(`/analytics/project/${projectId}`);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, retrieving project analytics from local demo store:', err?.message);
      return MockDataStore.getProjectAnalytics(projectId);
    }
  },

  async seedData(): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/analytics/seed');
      return response.data;
    } catch (err: any) {
      return { message: 'Demo nature projects ready in client environment' };
    }
  },
};
