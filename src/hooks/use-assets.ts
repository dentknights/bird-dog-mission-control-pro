import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { Asset } from '@/types';

export function useAssets(type: 'images' | 'audio' | 'video') {
  return useQuery({
    queryKey: ['assets', type],
    queryFn: async () => {
      const { data } = await apiClient.get<Asset[]>(`/api/assets?type=${type}`);
      return data;
    },
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'image' | 'audio' }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post(`/api/assets/upload?type=${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ category, filename }: { category: string; filename: string }) => {
      const { data } = await apiClient.delete(`/api/assets/${category}/${filename}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
