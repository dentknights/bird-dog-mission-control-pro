import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scenesApi } from '@/lib/api';
import type { Scene } from '@/types';

export function useScene(id: string) {
  return useQuery({
    queryKey: ['scene', id],
    queryFn: () => scenesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateScene() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scenesApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episode', variables.episode_id] });
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
  });
}

export function useUpdateScene() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Scene> }) => 
      scenesApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scene', data.id] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useDeleteScene() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: scenesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useGenerateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, config }: { id: string; config?: any }) => 
      scenesApi.generateVideo(id, config),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scene', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}
