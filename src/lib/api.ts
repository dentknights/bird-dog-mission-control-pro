import axios from 'axios';
import type { 
  Episode, Character, Scene, Dialogue, SavedScript, 
  Asset, GPUWorker, RenderJob, SystemStatus, GenerationConfig 
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for auth if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Episodes API
export const episodesApi = {
  getAll: () => apiClient.get<Episode[]>('/api/episodes').then(r => r.data),
  getById: (id: string) => apiClient.get<Episode>(`/api/episodes/${id}`).then(r => r.data),
  create: (data: Partial<Episode>) => apiClient.post<{ id: string; status: string }>('/api/episodes', data).then(r => r.data),
  update: (id: string, data: Partial<Episode>) => apiClient.put<Episode>(`/api/episodes/${id}`, data).then(r => r.data),
  delete: (id: string) => apiClient.delete<{ status: string }>(`/api/episodes/${id}`).then(r => r.data),
  render: (id: string) => apiClient.post<{ job_id: string }>(`/api/episodes/${id}/render`).then(r => r.data),
};

// Characters API
export const charactersApi = {
  getAll: () => apiClient.get<Character[]>('/api/characters').then(r => r.data),
  getById: (id: string) => apiClient.get<Character>(`/api/characters/${id}`).then(r => r.data),
  create: (data: Partial<Character>) => apiClient.post<{ id: string; status: string }>('/api/characters', data).then(r => r.data),
  update: (id: string, data: Partial<Character>) => apiClient.put<Character>(`/api/characters/${id}`, data).then(r => r.data),
  delete: (id: string) => apiClient.delete<{ status: string }>(`/api/characters/${id}`).then(r => r.data),
};

// Scenes API
export const scenesApi = {
  getById: (id: string) => apiClient.get<Scene>(`/api/scenes/${id}`).then(r => r.data),
  create: (data: Partial<Scene>) => apiClient.post<{ id: string; status: string }>('/api/scenes', data).then(r => r.data),
  update: (id: string, data: Partial<Scene>) => apiClient.put<Scene>(`/api/scenes/${id}`, data).then(r => r.data),
  delete: (id: string) => apiClient.delete<{ status: string }>(`/api/scenes/${id}`).then(r => r.data),
  generateVideo: (id: string, config?: GenerationConfig) => 
    apiClient.post<{ job_id: string }>(`/api/scenes/${id}/generate-video`, config).then(r => r.data),
};

// Dialogue API
export const dialogueApi = {
  create: (data: Partial<Dialogue>) => apiClient.post<{ id: string; status: string }>('/api/dialogue', data).then(r => r.data),
  update: (id: string, data: Partial<Dialogue>) => apiClient.put<Dialogue>(`/api/dialogue/${id}`, data).then(r => r.data),
  delete: (id: string) => apiClient.delete<{ status: string }>(`/api/dialogue/${id}`).then(r => r.data),
  generate: (data: { scene_id: string; character_id: string; key_points: string[] }) => 
    apiClient.post<{ lines: Dialogue[] }>('/api/dialogue/generate', data).then(r => r.data),
  generateAudio: (id: string, voiceId?: string) => 
    apiClient.post<{ job_id: string }>(`/api/dialogue/${id}/generate-audio`, { voice_id: voiceId }).then(r => r.data),
};

// Scripts API
export const scriptsApi = {
  getAll: () => apiClient.get<SavedScript[]>('/api/scripts').then(r => r.data),
  save: (data: { title: string; content: string; episode_id?: string }) => 
    apiClient.post<{ id: string }>('/api/scripts', data).then(r => r.data),
  parse: (content: string) => apiClient.post<{ scenes: any[] }>('/api/scripts/parse', { content }).then(r => r.data),
};

// Assets API
export const assetsApi = {
  list: (type: 'images' | 'audio' | 'video') => 
    apiClient.get<Asset[]>(`/api/assets/${type}`).then(r => r.data),
  upload: (file: File, type: 'image' | 'audio') => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/assets/upload/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  delete: (id: string) => apiClient.delete(`/api/assets/${id}`).then(r => r.data),
};

// System API
export const systemApi = {
  getStatus: () => apiClient.get<SystemStatus>('/api/health').then(r => r.data),
  getWorkers: () => apiClient.get<GPUWorker[]>('/api/status/workers').then(r => r.data),
  getQueue: () => apiClient.get<RenderJob[]>('/api/queue').then(r => r.data),
};

// Export default client for custom requests
export default apiClient;
