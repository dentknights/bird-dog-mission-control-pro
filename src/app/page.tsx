'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Rocket, Cpu, Mic, Workflow, 
  Loader2, Clock, CheckCircle, AlertCircle, Film 
} from 'lucide-react';
import { useEpisodes } from '@/hooks/use-episodes';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useCreateEpisode } from '@/hooks/use-episodes';

const statusIcons = {
  draft: Clock,
  script_ready: CheckCircle,
  generating: Loader2,
  assembling: Loader2,
  complete: CheckCircle,
  error: AlertCircle,
};

const statusColors = {
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  script_ready: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  generating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assembling: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Dashboard() {
  const { data: episodes, isLoading } = useEpisodes();
  const createEpisode = useCreateEpisode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    target_duration: 60,
  });

  const stats = {
    total: episodes?.length || 0,
    complete: episodes?.filter((e) => e.status === 'complete').length || 0,
    generating: episodes?.filter((e) => e.status === 'generating' || e.status === 'assembling').length || 0,
    scenes: episodes?.reduce((acc, e) => acc + (e.scenes?.length || 0), 0) || 0,
  };

  const handleCreate = async () => {
    await createEpisode.mutateAsync(newEpisode);
    setIsDialogOpen(false);
    setNewEpisode({ title: '', description: '', target_duration: 60 });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[var(--bd-text-secondary)]">
          Overview of your video production pipeline
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover">
          <CardContent className="p-6">
            <p className="text-[var(--bd-text-muted)] text-sm">Total Episodes</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover">
          <CardContent className="p-6">
            <p className="text-[var(--bd-text-muted)] text-sm">Complete</p>
            <p className="text-4xl font-bold text-emerald-400 mt-2">{stats.complete}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover">
          <CardContent className="p-6">
            <p className="text-[var(--bd-text-muted)] text-sm">Generating</p>
            <p className="text-4xl font-bold text-amber-400 mt-2">{stats.generating}</p>
          </CardContent>
        </Card>
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover">
          <CardContent className="p-6">
            <p className="text-[var(--bd-text-muted)] text-sm">Total Scenes</p>
            <p className="text-4xl font-bold text-[var(--bd-cyan)] mt-2">{stats.scenes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Episodes Panel */}
        <Card className="lg:col-span-2 bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Film className="h-5 w-5 text-[var(--bd-cyan)]" />
              Episodes
            </CardTitle>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Episode
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--bd-cyan)]" />
              </div>
            ) : episodes?.length === 0 ? (
              <div className="text-center py-12 text-[var(--bd-text-muted)]">
                <p>No episodes yet. Create your first episode!</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-4">
                  {episodes?.map((episode) => {
                    const StatusIcon = statusIcons[episode.status as keyof typeof statusIcons] || Clock;
                    return (
                      <Link
                        key={episode.id}
                        href={`/episodes/${episode.id}`}
                        className="flex items-center justify-between p-4 rounded-lg bg-[var(--bd-bg-tertiary)] border border-[var(--bd-border-color)] hover:border-[var(--bd-cyan)]/30 transition-all card-hover"
                      >
                        <div>
                          <h3 className="font-semibold text-white">{episode.title}</h3>
                          <p className="text-sm text-[var(--bd-text-muted)]">
                            {new Date(episode.created_at).toLocaleDateString()} • {episode.target_duration}s target
                          </p>
                        </div>
                        <Badge className={`${statusColors[episode.status as keyof typeof statusColors]} border`}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${(episode.status === 'generating' || episode.status === 'assembling') ? 'animate-spin' : ''}`} />
                          {episode.status}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* GPU Workers */}
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[var(--bd-purple)]" />
                GPU Workers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bd-bg-tertiary)]">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">Colab GPU</div>
                  <div className="text-sm text-[var(--bd-text-muted)]">Not connected</div>
                </div>
                <Progress value={0} className="w-16 h-1" />
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bd-bg-tertiary)]">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Mic className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">ElevenLabs Voice</div>
                  <div className="text-sm text-emerald-400">Ready</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bd-bg-tertiary)]">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Workflow className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">n8n Workflows</div>
                  <div className="text-sm text-[var(--bd-text-muted)]">Checking...</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Render Queue */}
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--bd-cyan)]" />
                Render Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bd-bg-tertiary)]">
                <div className="w-2 h-2 rounded-full bg-[var(--bd-text-muted)]" />
                <span className="text-[var(--bd-text-muted)]">Queue is empty</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Episode Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Episode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Episode Title</Label>
              <Input
                value={newEpisode.title}
                onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., The Great Hail Storm"
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Description</Label>
              <Textarea
                value={newEpisode.description}
                onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })}
                className="bd-input mt-2"
                placeholder="Brief description of the episode..."
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Target Duration (seconds)</Label>
              <Input
                type="number"
                min={10}
                max={300}
                value={newEpisode.target_duration}
                onChange={(e) => setNewEpisode({ ...newEpisode, target_duration: parseInt(e.target.value) })}
                className="bd-input mt-2"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={!newEpisode.title || createEpisode.isPending}
              className="w-full btn-primary"
            >
              {createEpisode.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Episode
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
