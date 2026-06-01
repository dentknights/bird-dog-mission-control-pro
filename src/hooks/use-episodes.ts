import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { episodesApi } from '@/lib/api';
import { useAppStore } from '@/stores/app-store';
import type { Episode } from '@/types';

export function useEpisodes() {
  const setEpisodes = useAppStore((s) => s.setEpisodes);
  
  return useQuery({
    queryKey: ['episodes'],
    queryFn: async () => {
      const data = await episodesApi.getAll();
      setEpisodes(data);
      return data;
    },
  });
}

export function useEpisode(id: string) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => episodesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  const addEpisode = useAppStore((s) => s.addEpisode);
  
  return useMutation({
    mutationFn: episodesApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  const updateEpisode = useAppStore((s) => s.updateEpisode);
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Episode> }) => 
      episodesApi.update(id, data),
    onSuccess: (data) => {
      updateEpisode(data);
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      queryClient.invalidateQueries({ queryKey: ['episode', data.id] });
    },
  });
}

export function useDeleteEpisode() {
  const queryClient = useQueryClient();
  const removeEpisode = useAppStore((s) => s.removeEpisode);
  
  return useMutation({
    mutationFn: episodesApi.delete,
    onSuccess: (_, id) => {
      removeEpisode(id);
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useRenderEpisode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: episodesApi.render,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}
