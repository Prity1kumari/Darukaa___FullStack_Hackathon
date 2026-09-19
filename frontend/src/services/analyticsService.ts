import { api } from './api';
import { OverviewKPIs, SiteAnalyticsResponse, ProjectAnalyticsResponse } from '../types';

export const analyticsService = {
  async getOverview(): Promise<OverviewKPIs> {
    const response = await api.get<OverviewKPIs>('/analytics/overview');
    return response.data;
  },

  async getSiteAnalytics(siteId: string): Promise<SiteAnalyticsResponse> {
    const response = await api.get<SiteAnalyticsResponse>(`/analytics/site/${siteId}`);
    return response.data;
  },

  async getProjectAnalytics(projectId: string): Promise<ProjectAnalyticsResponse> {
    const response = await api.get<ProjectAnalyticsResponse>(`/analytics/project/${projectId}`);
    return response.data;
  },

  async seedData(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/analytics/seed');
    return response.data;
  },
};
