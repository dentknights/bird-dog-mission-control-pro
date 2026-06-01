'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, Play, Save, Loader2,
  Film, Users, MessageSquare, Settings, ChevronRight
} from 'lucide-react';
import { useEpisode } from '@/hooks/use-episodes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
  const [activeTab, setActiveTab] = useState('scenes');

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
                <Button size="sm" variant="outline" className="border-[var(--bd-border-color)]">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-2">
                    {episode.scenes?.map((scene, index) => (
                      <div
                        key={scene.id}
                        className="p-3 rounded-lg border border-[var(--bd-border-color)] bg-[var(--bd-bg-tertiary)] hover:border-[var(--bd-cyan)]/30 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {index + 1}. {scene.title || `Scene ${index + 1}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                        <div className="text-xs text-[var(--bd-text-muted)] mt-1">
                          {scene.location || 'No location'} • {scene.target_duration}s
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                            Video: {scene.video_status || 'pending'}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                            Audio: {scene.audio_status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {!episode.scenes?.length && (
                      <div className="text-center py-8 text-[var(--bd-text-muted)]">
                        <p>No scenes yet</p>
                        <Button size="sm" variant="outline" className="mt-2 border-[var(--bd-border-color)]">
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
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center h-full text-[var(--bd-text-muted)]">
                  <Film className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg">Select a scene to edit</p>
                  <p className="text-sm mt-2">Or create a new scene to get started</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Characters</CardTitle>
              <Button className="btn-primary">
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
    </div>
  );
}
