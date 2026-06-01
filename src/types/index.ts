// Bird Dog Mission Control - TypeScript Types

export interface Episode {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'script_ready' | 'generating' | 'assembling' | 'complete' | 'error';
  target_duration: number;
  final_video_url?: string | null;
  created_at: string;
  updated_at?: string;
  scenes?: Scene[];
  characters?: Character[];
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  voice_id?: string;
  voice_name?: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'extra';
  reference_photo_url?: string;
  personality_traits?: string[];
  created_at?: string;
}

export interface Scene {
  id: string;
  episode_id: string;
  scene_number: number;
  title?: string;
  location?: string;
  setting_description?: string;
  time_of_day?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight';
  shot_type?: 'extreme_close_up' | 'close_up' | 'medium' | 'long' | 'extreme_long' | 'over_shoulder' | 'two_shot' | 'establishing';
  camera_angle?: 'eye_level' | 'low' | 'high' | 'dutch' | 'overhead' | 'bird_eye';
  camera_movement?: 'static' | 'pan' | 'tilt' | 'dolly' | 'truck' | 'crane' | 'handheld' | 'steadicam';
  lighting_style?: 'natural' | 'studio' | ' noir' | 'high_key' | 'low_key' | 'dramatic' | 'soft' | 'golden_hour';
  mood?: string;
  color_grade?: 'natural' | 'warm' | 'cool' | 'desaturated' | 'high_contrast' | 'noir' | 'vintage';
  target_duration: number;
  video_prompt?: string;
  video_url?: string;
  video_status?: 'pending' | 'generating' | 'complete' | 'error';
  audio_status?: 'pending' | 'generating' | 'complete' | 'error';
  characters_present?: string[];
  dialogue?: Dialogue[];
  created_at?: string;
  updated_at?: string;
}

export interface Dialogue {
  id: string;
  scene_id: string;
  character_id: string;
  character?: Character;
  line_number: number;
  text: string;
  tone?: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'whisper' | 'shout' | 'sarcastic' | 'serious';
  action?: string;
  emotion?: string;
  audio_url?: string;
  audio_status?: 'pending' | 'generated' | 'error';
  created_at?: string;
}

export interface SavedScript {
  id: string;
  episode_id?: string;
  title: string;
  content: string;
  parsed_scenes?: any[];
  created_at: string;
  updated_at?: string;
}

export interface ProductionReport {
  id: string;
  episode_id: string;
  total_scenes: number;
  completed_scenes: number;
  total_duration: number;
  estimated_completion?: string;
  issues?: string[];
  created_at: string;
}

export interface Asset {
  id: string;
  type: 'image' | 'audio' | 'video';
  filename: string;
  url: string;
  size?: number;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface GPUWorker {
  id: string;
  name: string;
  type: 'colab' | 'elevenlabs' | 'n8n';
  status: 'connected' | 'disconnected' | 'busy' | 'error';
  current_job?: string;
  progress?: number;
  last_ping?: string;
}

export interface RenderJob {
  id: string;
  type: 'video' | 'audio' | 'assembly';
  status: 'queued' | 'processing' | 'complete' | 'error';
  episode_id?: string;
  scene_id?: string;
  dialogue_id?: string;
  progress: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface GenerationConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  voice_id?: string;
  style?: string;
  resolution?: '480p' | '720p' | '1080p';
  duration?: number;
}

export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  default_location?: string;
  default_shot_type?: string;
  default_lighting?: string;
}

export interface SystemStatus {
  backend: 'online' | 'offline';
  database: 'connected' | 'disconnected';
  n8n: 'online' | 'offline';
  colab?: 'connected' | 'disconnected';
  elevenlabs?: 'ready' | 'error';
  version: string;
  uptime: number;
}
