import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dialogueApi } from '@/lib/api';
import type { Dialogue } from '@/types';

export function useCreateDialogue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dialogueApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scene', variables.scene_id] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useUpdateDialogue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dialogue> }) => 
      dialogueApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scene'] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useDeleteDialogue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dialogueApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scene'] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useGenerateDialogue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: dialogueApi.generate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scene', variables.scene_id] });
      queryClient.invalidateQueries({ queryKey: ['episode'] });
    },
  });
}

export function useGenerateAudio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, voiceId }: { id: string; voiceId?: string }) => 
      dialogueApi.generateAudio(id, voiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scene'] });
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}
