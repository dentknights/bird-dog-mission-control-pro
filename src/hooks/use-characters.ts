import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { charactersApi } from '@/lib/api';
import { useAppStore } from '@/stores/app-store';
import type { Character } from '@/types';

export function useCharacters() {
  const setCharacters = useAppStore((s) => s.setCharacters);
  
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const data = await charactersApi.getAll();
      setCharacters(data);
      return data;
    },
  });
}

export function useCharacter(id: string) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => charactersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  const addCharacter = useAppStore((s) => s.addCharacter);
  
  return useMutation({
    mutationFn: charactersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  const updateCharacter = useAppStore((s) => s.updateCharacter);
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Character> }) => 
      charactersApi.update(id, data),
    onSuccess: (data) => {
      updateCharacter(data);
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['character', data.id] });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  const removeCharacter = useAppStore((s) => s.removeCharacter);
  
  return useMutation({
    mutationFn: charactersApi.delete,
    onSuccess: (_, id) => {
      removeCharacter(id);
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
}
