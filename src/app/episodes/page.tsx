'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Loader2, Clock, CheckCircle, 
  Film, Users, ChevronRight, Pencil, Trash2
} from 'lucide-react';
import { useEpisodes, useCreateEpisode, useUpdateEpisode, useDeleteEpisode } from '@/hooks/use-episodes';
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
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const statusIcons = {
  draft: Clock,
  script_ready: CheckCircle,
  generating: Loader2,
  assembling: Loader2,
  complete: CheckCircle,
  error: () => null,
};

const statusColors = {
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  script_ready: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  generating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assembling: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function EpisodesPage() {
  const { data: episodes, isLoading } = useEpisodes();
  const createEpisode = useCreateEpisode();
  const updateEpisode = useUpdateEpisode();
  const deleteEpisode = useDeleteEpisode();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any>(null);
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    target_duration: 60,
  });

  const handleCreate = async () => {
    await createEpisode.mutateAsync(newEpisode);
    setIsDialogOpen(false);
    setNewEpisode({ title: '', description: '', target_duration: 60 });
  };

  const handleEdit = (episode: any) => {
    setEditingEpisode(episode);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingEpisode) return;
    await updateEpisode.mutateAsync({
      id: editingEpisode.id,
      data: {
        title: editingEpisode.title,
        description: editingEpisode.description,
        target_duration: editingEpisode.target_duration,
      },
    });
    setIsEditDialogOpen(false);
    setEditingEpisode(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Episodes</h1>
          <p className="text-[var(--bd-text-secondary)]">
            Manage your video episodes
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Episode
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
        </div>
      ) : episodes?.length === 0 ? (
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Film className="h-16 w-16 text-[var(--bd-text-muted)] mb-4" />
            <p className="text-[var(--bd-text-muted)] mb-4">No episodes yet</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Episode
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {episodes?.map((episode) => {
              const StatusIcon = statusIcons[episode.status as keyof typeof statusIcons] || Clock;
              return (
                <Card 
                  key={episode.id}
                  className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Link href={`/episodes/${episode.id}`} className="flex-1">
                        <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[var(--bd-cyan)] transition-colors">
                          {episode.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Badge className={`${statusColors[episode.status as keyof typeof statusColors]} text-xs border shrink-0 mr-2`}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${(episode.status === 'generating' || episode.status === 'assembling') ? 'animate-spin' : ''}`} />
                          {episode.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-[var(--bd-text-muted)] hover:text-[var(--bd-cyan)] opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEdit(episode)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-[var(--bd-text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEpisode.mutate(episode.id)}
                          disabled={deleteEpisode.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <Link href={`/episodes/${episode.id}`}>
                      <p className="text-sm text-[var(--bd-text-muted)] line-clamp-2 mb-4">
                        {episode.description || 'No description'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-[var(--bd-text-muted)]">
                        <span>{new Date(episode.created_at).toLocaleDateString()}</span>
                        <span>{episode.target_duration}s target</span>
                      </div>
                      
                      {(episode.scenes?.length || episode.characters?.length) ? (
                        <div className="mt-4 pt-3 border-t border-[var(--bd-border-color)] flex items-center gap-4">
                          {episode.scenes && episode.scenes.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-[var(--bd-text-muted)]">
                              <Film className="h-3 w-3" />
                              {episode.scenes.length} scenes
                            </span>
                          )}
                          {episode.characters && episode.characters.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-[var(--bd-text-muted)]">
                              <Users className="h-3 w-3" />
                              {episode.characters.length} characters
                            </span>
                          )}
                        </div>
                      ) : null}
                      
                      <div className="mt-3 flex items-center text-[var(--bd-cyan)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit Episode
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}

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

      {/* Edit Episode Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Episode</DialogTitle>
          </DialogHeader>
          {editingEpisode && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Episode Title</Label>
                <Input
                  value={editingEpisode.title}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                  className="bd-input mt-2"
                  placeholder="e.g., The Great Hail Storm"
                />
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Description</Label>
                <Textarea
                  value={editingEpisode.description || ''}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, description: e.target.value })}
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
                  value={editingEpisode.target_duration || 60}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, target_duration: parseInt(e.target.value) })}
                  className="bd-input mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={!editingEpisode.title || updateEpisode.isPending}
                  className="flex-1 btn-primary"
                >
                  {updateEpisode.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Pencil className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bd-input"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
