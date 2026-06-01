import { create } from 'zustand';
import type { Episode, Character, Scene, Dialogue, RenderJob, GPUWorker } from '@/types';

interface AppState {
  // Data
  episodes: Episode[];
  characters: Character[];
  currentEpisode: Episode | null;
  currentScene: Scene | null;
  selectedEpisodeId: string | null;
  selectedSceneId: string | null;
  
  // System
  workers: GPUWorker[];
  queue: RenderJob[];
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  
  // UI State
  activeTab: string;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  
  // Actions
  setEpisodes: (episodes: Episode[]) => void;
  addEpisode: (episode: Episode) => void;
  updateEpisode: (episode: Episode) => void;
  removeEpisode: (id: string) => void;
  setCurrentEpisode: (episode: Episode | null) => void;
  setSelectedEpisodeId: (id: string | null) => void;
  
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  
  setCurrentScene: (scene: Scene | null) => void;
  setSelectedSceneId: (id: string | null) => void;
  
  setWorkers: (workers: GPUWorker[]) => void;
  setQueue: (queue: RenderJob[]) => void;
  
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  episodes: [],
  characters: [],
  currentEpisode: null,
  currentScene: null,
  selectedEpisodeId: null,
  selectedSceneId: null,
  workers: [],
  queue: [],
  isLoading: false,
  error: null,
  sidebarOpen: true,
  activeTab: 'scenes',
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  
  // Episode actions
  setEpisodes: (episodes) => set({ episodes }),
  addEpisode: (episode) => set((state) => ({ 
    episodes: [episode, ...state.episodes] 
  })),
  updateEpisode: (episode) => set((state) => ({
    episodes: state.episodes.map(e => e.id === episode.id ? episode : e),
    currentEpisode: state.currentEpisode?.id === episode.id ? episode : state.currentEpisode
  })),
  removeEpisode: (id) => set((state) => ({
    episodes: state.episodes.filter(e => e.id !== id),
    currentEpisode: state.currentEpisode?.id === id ? null : state.currentEpisode
  })),
  setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
  setSelectedEpisodeId: (id) => set({ selectedEpisodeId: id }),
  
  // Character actions
  setCharacters: (characters) => set({ characters }),
  addCharacter: (character) => set((state) => ({ 
    characters: [character, ...state.characters] 
  })),
  updateCharacter: (character) => set((state) => ({
    characters: state.characters.map(c => c.id === character.id ? character : c)
  })),
  removeCharacter: (id) => set((state) => ({
    characters: state.characters.filter(c => c.id !== id)
  })),
  
  // Scene actions
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setSelectedSceneId: (id) => set({ selectedSceneId: id }),
  
  // System actions
  setWorkers: (workers) => set({ workers }),
  setQueue: (queue) => set({ queue }),
  
  // UI actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsCreateDialogOpen: (isCreateDialogOpen) => set({ isCreateDialogOpen }),
  setIsEditDialogOpen: (isEditDialogOpen) => set({ isEditDialogOpen }),
  clearError: () => set({ error: null }),
}));
