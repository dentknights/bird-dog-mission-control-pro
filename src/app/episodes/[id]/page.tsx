'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, Play, Save, Loader2, Video, Mic, Wand2,
  Film, Users, MessageSquare, Settings, ChevronRight, X, Edit2
} from 'lucide-react';
import { useEpisode, useUpdateEpisode } from '@/hooks/use-episodes';
import { useCreateScene, useDeleteScene, useGenerateVideo } from '@/hooks/use-scenes';
import { useCreateDialogue, useDeleteDialogue, useGenerateAudio } from '@/hooks/use-dialogue';
import { useCharacters } from '@/hooks/use-characters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Scene, Dialogue } from '@/types';
import apiClient from '@/lib/api';

const statusColors = {
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  script_ready: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  generating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assembling: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function EpisodeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: episode, isLoading } = useEpisode(id as string);
  const { data: characters } = useCharacters();
  const [activeTab, setActiveTab] = useState('scenes');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  
  // Dialog states
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [isDialogueDialogOpen, setIsDialogueDialogOpen] = useState(false);
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);
  
  // Form states
  const [newScene, setNewScene] = useState({
    title: '',
    location: '',
    setting_description: '',
    target_duration: 5,
    characters_present: [] as string[],
  });
  
  const [newDialogue, setNewDialogue] = useState({
    character_id: '',
    text: '',
    tone: 'neutral' as const,
    action: '',
  });
  
  // Mutations
  const createScene = useCreateScene();
  const deleteScene = useDeleteScene();
  const generateVideo = useGenerateVideo();
  const createDialogue = useCreateDialogue();
  const deleteDialogue = useDeleteDialogue();
  const generateAudio = useGenerateAudio();
  const updateEpisode = useUpdateEpisode();

  const handleCreateScene = async () => {
    if (!id) return;
    await createScene.mutateAsync({
      ...newScene,
      episode_id: id as string,
    });
    setIsSceneDialogOpen(false);
    setNewScene({ title: '', location: '', setting_description: '', target_duration: 5, characters_present: [] });
  };

  const handleCreateDialogue = async () => {
    if (!selectedScene) return;
    await createDialogue.mutateAsync({
      ...newDialogue,
      scene_id: selectedScene.id,
    });
    setIsDialogueDialogOpen(false);
    setNewDialogue({ character_id: '', text: '', tone: 'neutral', action: '' });
  };

  const handleAddCharacterToEpisode = async (characterId: string) => {
    if (!episode || !id) return;
    await apiClient.post(`/api/episodes/${id}/characters`, { character_id: characterId });
    setIsCharacterDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--bd-text-muted)]">Episode not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/episodes')}
        >
          Back to Episodes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/episodes')}
            className="text-[var(--bd-text-secondary)] hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{episode.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${statusColors[episode.status as keyof typeof statusColors]} text-xs border`}>
                {episode.status}
              </Badge>
              <span className="text-sm text-[var(--bd-text-muted)]">
                {episode.scenes?.length || 0} scenes • {episode.target_duration}s target
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[var(--bd-border-color)]">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="btn-primary">
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[var(--bd-bg-secondary)] border border-[var(--bd-border-color)]">
          <TabsTrigger 
            value="scenes" 
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Film className="h-4 w-4 mr-2" />
            Scenes
          </TabsTrigger>
          <TabsTrigger 
            value="characters"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Users className="h-4 w-4 mr-2" />
            Characters
          </TabsTrigger>
          <TabsTrigger 
            value="dialogue"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Dialogue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenes" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scene List */}
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Scenes</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-[var(--bd-border-color)]"
                  onClick={() => setIsSceneDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-2">
                    {episode.scenes?.map((scene, index) => (
                      <div
                        key={scene.id}
                        onClick={() => setSelectedScene(scene)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedScene?.id === scene.id 
                            ? 'border-[var(--bd-cyan)] bg-[var(--bd-cyan)]/10' 
                            : 'border-[var(--bd-border-color)] bg-[var(--bd-bg-tertiary)] hover:border-[var(--bd-cyan)]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {index + 1}. {scene.title || `Scene ${index + 1}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteScene.mutate(scene.id);
                            }}
                            disabled={deleteScene.isPending}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                        <div className="text-xs text-[var(--bd-text-muted)] mt-1">
                          {scene.location || 'No location'} • {scene.target_duration}s
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              scene.video_status === 'complete' 
                                ? 'border-emerald-500 text-emerald-400' 
                                : scene.video_status === 'generating'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-zinc-600 text-zinc-400'
                            }`}
                          >
                            Video: {scene.video_status || 'pending'}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              scene.audio_status === 'complete' 
                                ? 'border-emerald-500 text-emerald-400' 
                                : scene.audio_status === 'generating'
                                ? 'border-amber-500 text-amber-400'
                                : 'border-zinc-600 text-zinc-400'
                            }`}
                          >
                            Audio: {scene.audio_status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {!episode.scenes?.length && (
                      <div className="text-center py-8 text-[var(--bd-text-muted)]">
                        <p>No scenes yet</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2 border-[var(--bd-border-color)]"
                          onClick={() => setIsSceneDialogOpen(true)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Scene
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Scene Editor */}
            <Card className="lg:col-span-2 bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              {selectedScene ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedScene.title || 'Untitled Scene'}</h3>
                      <p className="text-sm text-[var(--bd-text-muted)]">{selectedScene.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--bd-border-color)]"
                        onClick={() => generateVideo.mutate({ id: selectedScene.id })}
                        disabled={generateVideo.isPending}
                      >
                        {generateVideo.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Video className="h-4 w-4 mr-2" />
                        )}
                        Generate Video
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-[var(--bd-text-secondary)]">Location</Label>
                      <p className="text-white mt-1">{selectedScene.location || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-[var(--bd-text-secondary)]">Duration</Label>
                      <p className="text-white mt-1">{selectedScene.target_duration}s</p>
                    </div>
                  </div>
                  
                  {selectedScene.setting_description && (
                    <div className="mb-6">
                      <Label className="text-[var(--bd-text-secondary)]">Description</Label>
                      <p className="text-white mt-1 text-sm">{selectedScene.setting_description}</p>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white">Dialogue</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[var(--bd-border-color)]"
                      onClick={() => setIsDialogueDialogOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Line
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedScene.dialogue?.map((line: Dialogue, i: number) => (
                      <div key={line.id} className="p-3 rounded-lg bg-[var(--bd-bg-tertiary)] border border-[var(--bd-border-color)]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {line.character?.name || 'Unknown'}
                              </Badge>
                              {line.tone && (
                                <span className="text-xs text-[var(--bd-text-muted)]">({line.tone})</span>
                              )}
                            </div>
                            <p className="text-white text-sm">{line.text}</p>
                            {line.action && (
                              <p className="text-xs text-[var(--bd-text-muted)] mt-1 italic">{line.action}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => generateAudio.mutate({ id: line.id })}
                              disabled={generateAudio.isPending}
                            >
                              {generateAudio.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Mic className="h-3 w-3 text-[var(--bd-purple)]" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400"
                              onClick={() => deleteDialogue.mutate(line.id)}
                              disabled={deleteDialogue.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {line.audio_url && (
                          <audio controls className="w-full mt-2 h-8" src={line.audio_url} />
                        )}
                      </div>
                    ))}
                    {!selectedScene.dialogue?.length && (
                      <p className="text-center py-4 text-[var(--bd-text-muted)] text-sm">
                        No dialogue yet. Click "Add Line" to create.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center h-full text-[var(--bd-text-muted)]">
                    <Film className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">Select a scene to edit</p>
                    <p className="text-sm mt-2">Or create a new scene to get started</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Characters</CardTitle>
              <Button 
                className="btn-primary"
                onClick={() => setIsCharacterDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </CardHeader>
            <CardContent>
              {episode.characters?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {episode.characters.map((char) => (
                    <div
                      key={char.id}
                      className="p-4 rounded-lg border border-[var(--bd-border-color)] bg-[var(--bd-bg-tertiary)] flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-[var(--bd-cyan)]/10 flex items-center justify-center text-[var(--bd-cyan)] font-bold">
                        {char.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{char.name}</h4>
                        <p className="text-sm text-[var(--bd-text-muted)]">{char.role || 'No role'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--bd-text-muted)]">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No characters in this episode yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-[var(--bd-border-color)]"
                    onClick={() => setIsCharacterDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Character
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dialogue" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-[var(--bd-text-muted)]">
                <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg">Select a scene to edit dialogue</p>
                <p className="text-sm mt-2">Dialogue is managed per scene</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Create Scene Dialog */}
      <Dialog open={isSceneDialogOpen} onOpenChange={setIsSceneDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Scene</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Scene Title</Label>
              <Input
                value={newScene.title}
                onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., Opening at the Shop"
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Location</Label>
              <Input
                value={newScene.location}
                onChange={(e) => setNewScene({ ...newScene, location: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., Hail Lions PDR Shop"
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Description</Label>
              <Textarea
                value={newScene.setting_description}
                onChange={(e) => setNewScene({ ...newScene, setting_description: e.target.value })}
                className="bd-input mt-2"
                placeholder="What happens in this scene..."
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Target Duration (seconds)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={newScene.target_duration}
                onChange={(e) => setNewScene({ ...newScene, target_duration: parseInt(e.target.value) || 5 })}
                className="bd-input mt-2"
              />
            </div>
            <Button
              onClick={handleCreateScene}
              disabled={!newScene.title || createScene.isPending}
              className="w-full btn-primary"
            >
              {createScene.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Scene
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialogue Dialog */}
      <Dialog open={isDialogueDialogOpen} onOpenChange={setIsDialogueDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add Dialogue Line</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Character</Label>
              <Select
                value={newDialogue.character_id}
                onValueChange={(v) => setNewDialogue({ ...newDialogue, character_id: v || '' })}
              >
                <SelectTrigger className="bd-input mt-2">
                  <SelectValue placeholder="Select character" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                  {episode?.characters?.map((char) => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Line</Label>
              <Textarea
                value={newDialogue.text}
                onChange={(e) => setNewDialogue({ ...newDialogue, text: e.target.value })}
                className="bd-input mt-2"
                placeholder="What does the character say..."
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Tone</Label>
              <Select
                value={newDialogue.tone}
                onValueChange={(v) => setNewDialogue({ ...newDialogue, tone: (v as typeof newDialogue.tone) || 'neutral' })}
              >
                <SelectTrigger className="bd-input mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="angry">Angry</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="sarcastic">Sarcastic</SelectItem>
                  <SelectItem value="whisper">Whisper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Action/Stage Direction</Label>
              <Input
                value={newDialogue.action}
                onChange={(e) => setNewDialogue({ ...newDialogue, action: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., scratches head nervously"
              />
            </div>
            <Button
              onClick={handleCreateDialogue}
              disabled={!newDialogue.character_id || !newDialogue.text || createDialogue.isPending}
              className="w-full btn-primary"
            >
              {createDialogue.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Line
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Character Dialog */}
      <Dialog open={isCharacterDialogOpen} onOpenChange={setIsCharacterDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add Character to Episode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-[var(--bd-text-muted)]">
              Select characters to include in this episode:
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {characters
                ?.filter((char) => !episode?.characters?.some((ec) => ec.id === char.id))
                .map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bd-bg-tertiary)] border border-[var(--bd-border-color)] cursor-pointer hover:border-[var(--bd-cyan)]/30"
                    onClick={() => handleAddCharacterToEpisode(char.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--bd-cyan)]/10 flex items-center justify-center text-[var(--bd-cyan)] font-bold">
                        {char.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{char.name}</p>
                        <p className="text-xs text-[var(--bd-text-muted)]">{char.role || 'No role'}</p>
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-[var(--bd-cyan)]" />
                  </div>
                ))}
              {!characters?.filter((char) => !episode?.characters?.some((ec) => ec.id === char.id)).length && (
                <p className="text-center py-4 text-[var(--bd-text-muted)]">
                  All available characters are already in this episode.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
