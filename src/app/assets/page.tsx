'use client';

import { useState } from 'react';
import { Upload, Image, Music, Video, Trash2, Download, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Asset } from '@/types';

const mockImages: Asset[] = [
  { id: '1', type: 'image', filename: 'character_brenda_ref.jpg', url: '/assets/1.jpg', created_at: '2024-01-15', size: 1024000 },
  { id: '2', type: 'image', filename: 'location_clearlake.jpg', url: '/assets/2.jpg', created_at: '2024-01-16', size: 2048000 },
];

const mockAudio: Asset[] = [
  { id: '3', type: 'audio', filename: 'brenda_voice_sample.mp3', url: '/assets/3.mp3', created_at: '2024-01-17', size: 512000 },
  { id: '4', type: 'audio', filename: 'tweaker_dialogue.wav', url: '/assets/4.wav', created_at: '2024-01-18', size: 1024000 },
];

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${Math.round(kb / 1024)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asset Library</h1>
          <p className="text-[var(--bd-text-secondary)]">
            Manage images, audio, and video assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className={viewMode === 'grid' ? 'bg-[var(--bd-bg-tertiary)]' : ''}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={viewMode === 'list' ? 'bg-[var(--bd-bg-tertiary)]' : ''}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver 
            ? 'border-[var(--bd-cyan)] bg-[var(--bd-cyan)]/5' 
            : 'border-[var(--bd-border-color)]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-[var(--bd-text-muted)] mb-4" />
          <p className="text-[var(--bd-text-secondary)] text-lg mb-2">
            Drop files here to upload
          </p>
          <p className="text-[var(--bd-text-muted)] text-sm">
            Supports images (JPG, PNG), audio (MP3, WAV), and video (MP4)
          </p>
        </CardContent>
      </Card>

      {/* Assets Tabs */}
      <Tabs defaultValue="images">
        <TabsList className="bg-[var(--bd-bg-secondary)] border border-[var(--bd-border-color)]">
          <TabsTrigger 
            value="images"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Image className="h-4 w-4 mr-2" />
            Images
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">{mockImages.length}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="audio"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Music className="h-4 w-4 mr-2" />
            Audio
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">{mockAudio.length}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="video"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Video className="h-4 w-4 mr-2" />
            Video
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">0</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockImages.map((asset) => (
                <Card 
                  key={asset.id}
                  className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] group overflow-hidden"
                >
                  <div className="aspect-square bg-[var(--bd-bg-tertiary)] flex items-center justify-center">
                    <Image className="h-12 w-12 text-[var(--bd-text-muted)]" />
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm text-white truncate">{asset.filename}</p>
                    <p className="text-xs text-[var(--bd-text-muted)]">{formatSize(asset.size)}</p>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-[var(--bd-border-color)]">
                  {mockImages.map((asset) => (
                    <div 
                      key={asset.id}
                      className="flex items-center justify-between p-4 hover:bg-[var(--bd-bg-tertiary)]"
                    >
                      <div className="flex items-center gap-3">
                        <Image className="h-8 w-8 text-[var(--bd-text-muted)]" />
                        <div>
                          <p className="text-white">{asset.filename}</p>
                          <p className="text-xs text-[var(--bd-text-muted)]">
                            {formatSize(asset.size)} • {new Date(asset.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audio" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-[var(--bd-border-color)]">
                {mockAudio.map((asset) => (
                  <div 
                    key={asset.id}
                    className="flex items-center justify-between p-4 hover:bg-[var(--bd-bg-tertiary)]"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="h-8 w-8 text-[var(--bd-purple)]" />
                      <div>
                        <p className="text-white">{asset.filename}</p>
                        <p className="text-xs text-[var(--bd-text-muted)]">
                          {formatSize(asset.size)} • {new Date(asset.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Video className="h-16 w-16 text-[var(--bd-text-muted)] mb-4" />
              <p className="text-[var(--bd-text-muted)]">No videos yet</p>
              <p className="text-sm text-[var(--bd-text-secondary)] mt-2">
                Rendered episodes will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
