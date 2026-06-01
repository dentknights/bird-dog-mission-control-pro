import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { SystemStatus, GPUWorker, RenderJob } from '@/types';

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system', 'status'],
    queryFn: async () => {
      const { data } = await apiClient.get<SystemStatus>('/api/system/status');
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

export function useWorkers() {
  return useQuery({
    queryKey: ['system', 'workers'],
    queryFn: async () => {
      const { data } = await apiClient.get<GPUWorker[]>('/api/status/workers');
      return data;
    },
    refetchInterval: 5000,
  });
}

export function useQueue() {
  return useQuery({
    queryKey: ['system', 'queue'],
    queryFn: async () => {
      const { data } = await apiClient.get<RenderJob[]>('/api/queue');
      return data;
    },
    refetchInterval: 3000,
  });
}

export function useBatchOperations() {
  const queryClient = useQueryClient();
  
  const startBatch = useMutation({
    mutationFn: async (config: {
      episodes: string;
      operations: string[];
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      parallel_workers?: number;
    }) => {
      const { data } = await apiClient.post('/api/batch/start', config);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'queue'] });
    },
  });

  const pauseBatch = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/batch/pause');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'queue'] });
    },
  });

  const cancelBatch = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/batch/cancel');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'queue'] });
    },
  });

  return { startBatch, pauseBatch, cancelBatch };
}

export function useSystemActions() {
  const queryClient = useQueryClient();

  const clearCache = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/system/clear-cache');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system'] });
    },
  });

  const restartWorkers = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/system/restart-workers');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system'] });
    },
  });

  const backup = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/api/system/backup');
      return data;
    },
  });

  return { clearCache, restartWorkers, backup };
}
