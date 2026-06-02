'use client';

import { useState } from 'react';
import { Plus, Loader2, Users, Mic, Trash2, Pencil } from 'lucide-react';
import { useCharacters, useCreateCharacter, useDeleteCharacter, useUpdateCharacter } from '@/hooks/use-characters';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Character } from '@/types';

const roleColors: Record<string, string> = {
  protagonist: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  antagonist: 'bg-red-500/10 text-red-400 border-red-500/20',
  supporting: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  extra: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const getRoleColor = (role?: string) => {
  if (!role) return roleColors.supporting;
  const normalizedRole = role.toLowerCase().trim();
  if (roleColors[normalizedRole]) return roleColors[normalizedRole];
  // Fallback for invalid roles - use description-based color
  if (normalizedRole.includes('antagonist') || normalizedRole.includes('villain')) return roleColors.antagonist;
  if (normalizedRole.includes('protagonist') || normalizedRole.includes('main')) return roleColors.protagonist;
  return roleColors.supporting;
};

export default function CharactersPage() {
  const { data: characters, isLoading } = useCharacters();
  const createCharacter = useCreateCharacter();
  const deleteCharacter = useDeleteCharacter();
  const updateCharacter = useUpdateCharacter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    description: '',
    role: 'supporting' as const,
    voice_name: '',
    personality_traits: [] as string[],
  });

  const handleCreate = async () => {
    await createCharacter.mutateAsync(newCharacter);
    setIsDialogOpen(false);
    setNewCharacter({
      name: '',
      description: '',
      role: 'supporting',
      voice_name: '',
      personality_traits: [],
    });
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCharacter) return;
    await updateCharacter.mutateAsync({
      id: editingCharacter.id,
      data: {
        name: editingCharacter.name,
        description: editingCharacter.description,
        role: editingCharacter.role,
        voice_name: editingCharacter.voice_name,
        personality_traits: editingCharacter.personality_traits,
      },
    });
    setIsEditDialogOpen(false);
    setEditingCharacter(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
          <p className="text-[var(--bd-text-secondary)]">
            Manage your cast of characters
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Character
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
        </div>
      ) : characters?.length === 0 ? (
        <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Users className="h-16 w-16 text-[var(--bd-text-muted)] mb-4" />
            <p className="text-[var(--bd-text-muted)] mb-4">No characters yet</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Character
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters?.map((character) => (
            <Card 
              key={character.id} 
              className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] card-hover group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--bd-cyan)]/20 to-[var(--bd-purple)]/20 flex items-center justify-center text-[var(--bd-cyan)] font-bold text-lg">
                      {character.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{character.name}</CardTitle>
                      <Badge 
                        className={`${getRoleColor(character.role)} text-xs border mt-1`}
                      >
                        {character.role || 'supporting'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-[var(--bd-text-muted)] hover:text-[var(--bd-cyan)]"
                      onClick={() => handleEdit(character)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-[var(--bd-text-muted)] hover:text-red-400"
                      onClick={() => deleteCharacter.mutate(character.id)}
                      disabled={deleteCharacter.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {character.description && (
                  <p className="text-sm text-[var(--bd-text-muted)] line-clamp-2 mb-3">
                    {character.description}
                  </p>
                )}
                
                {character.voice_name && (
                  <div className="flex items-center gap-2 text-sm text-[var(--bd-text-secondary)]">
                    <Mic className="h-4 w-4 text-[var(--bd-purple)]" />
                    {character.voice_name}
                  </div>
                )}

                {character.personality_traits && character.personality_traits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {character.personality_traits.map((trait, i) => (
                      <Badge 
                        key={i} 
                        variant="outline"
                        className="text-xs border-[var(--bd-border-color)] text-[var(--bd-text-muted)]"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Character Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Character</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Character Name</Label>
              <Input
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., Brenda the Bird Dog"
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Role</Label>
              <Select
                value={newCharacter.role}
                onValueChange={(v) => setNewCharacter({ ...newCharacter, role: v as any })}
              >
                <SelectTrigger className="bd-input mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                  <SelectItem value="protagonist">Protagonist</SelectItem>
                  <SelectItem value="antagonist">Antagonist</SelectItem>
                  <SelectItem value="supporting">Supporting</SelectItem>
                  <SelectItem value="extra">Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Description</Label>
              <Textarea
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                className="bd-input mt-2"
                placeholder="Character description, background, personality..."
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[var(--bd-text-secondary)]">Voice Name (ElevenLabs)</Label>
              <Input
                value={newCharacter.voice_name}
                onChange={(e) => setNewCharacter({ ...newCharacter, voice_name: e.target.value })}
                className="bd-input mt-2"
                placeholder="e.g., Rachel, Adam, Bella"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={!newCharacter.name || createCharacter.isPending}
              className="w-full btn-primary"
            >
              {createCharacter.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Character
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Character</DialogTitle>
          </DialogHeader>
          {editingCharacter && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Character Name</Label>
                <Input
                  value={editingCharacter.name}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                  className="bd-input mt-2"
                  placeholder="e.g., Brenda the Bird Dog"
                />
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Role</Label>
                <Select
                  value={editingCharacter.role || 'supporting'}
                  onValueChange={(v) => setEditingCharacter({ ...editingCharacter, role: v as any })}
                >
                  <SelectTrigger className="bd-input mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                    <SelectItem value="protagonist">Protagonist</SelectItem>
                    <SelectItem value="antagonist">Antagonist</SelectItem>
                    <SelectItem value="supporting">Supporting</SelectItem>
                    <SelectItem value="extra">Extra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Description</Label>
                <Textarea
                  value={editingCharacter.description || ''}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, description: e.target.value })}
                  className="bd-input mt-2"
                  placeholder="Character description, background, personality..."
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Voice Name (ElevenLabs)</Label>
                <Input
                  value={editingCharacter.voice_name || ''}
                  onChange={(e) => setEditingCharacter({ ...editingCharacter, voice_name: e.target.value })}
                  className="bd-input mt-2"
                  placeholder="e.g., Rachel, Adam, Bella"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={!editingCharacter.name || updateCharacter.isPending}
                  className="flex-1 btn-primary"
                >
                  {updateCharacter.isPending ? (
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
