import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteService, CreateSiteInput, UpdateSiteInput } from '../services/siteService';

export const useSites = (projectId?: string) => {
  return useQuery({
    queryKey: ['sites', { projectId }],
    queryFn: () => siteService.getSites(projectId),
  });
};

export const useSitesGeoJSON = (projectId?: string) => {
  return useQuery({
    queryKey: ['sites-geojson', { projectId }],
    queryFn: () => siteService.getSitesGeoJSON(projectId),
  });
};

export const useSite = (id?: string) => {
  return useQuery({
    queryKey: ['site', id],
    queryFn: () => siteService.getSite(id!),
    enabled: !!id,
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSiteInput) => siteService.createSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['sites-geojson'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteInput }) =>
      siteService.updateSite(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['sites-geojson'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => siteService.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['sites-geojson'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
  });
};
