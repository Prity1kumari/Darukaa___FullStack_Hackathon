import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useOverview = () => {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => analyticsService.getOverview(),
  });
};

export const useSiteAnalytics = (siteId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'site', siteId],
    queryFn: () => analyticsService.getSiteAnalytics(siteId!),
    enabled: !!siteId,
  });
};

export const useProjectAnalytics = (projectId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'project', projectId],
    queryFn: () => analyticsService.getProjectAnalytics(projectId!),
    enabled: !!projectId,
  });
};

export const useSeedData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analyticsService.seedData(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
