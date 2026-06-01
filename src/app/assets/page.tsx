'use client';

import { useState, useRef } from 'react';
import { Upload, Image, Music, Video, Trash2, Download, Grid, List, Loader2 } from 'lucide-react';
import { useAssets, useUploadAsset, useDeleteAsset } from '@/hooks/use-assets';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Asset } from '@/types';

export default function AssetsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: images, isLoading: imagesLoading } = useAssets('images');
  const { data: audio, isLoading: audioLoading } = useAssets('audio');
  const { data: videos, isLoading: videosLoading } = useAssets('video');
  const uploadAsset = useUploadAsset();
  const deleteAsset = useDeleteAsset();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'image' | 'audio') => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      uploadAsset.mutate({ file, type });
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      uploadAsset.mutate({ file, type });
    });
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
        onDrop={(e) => handleDrop(e, 'image')}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,audio/*,video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
        />
        <CardContent className="flex flex-col items-center justify-center py-12 cursor-pointer">
          {uploadAsset.isPending ? (
            <Loader2 className="h-12 w-12 text-[var(--bd-cyan)] animate-spin mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-[var(--bd-text-muted)] mb-4" />
          )}
          <p className="text-[var(--bd-text-secondary)] text-lg mb-2">
            {uploadAsset.isPending ? 'Uploading...' : 'Drop files here to upload'}
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
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">{images?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="audio"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Music className="h-4 w-4 mr-2" />
            Audio
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">{audio?.length || 0}</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="video"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Video className="h-4 w-4 mr-2" />
            Video
            <Badge className="ml-2 bg-[var(--bd-bg-tertiary)]">{videos?.length || 0}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          {imagesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images?.map((asset) => (
                <Card 
                  key={asset.id}
                  className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)] group overflow-hidden"
                >
                  <div className="aspect-square bg-[var(--bd-bg-tertiary)] flex items-center justify-center">
                    {asset.url ? (
                      <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="h-12 w-12 text-[var(--bd-text-muted)]" />
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm text-white truncate">{asset.filename}</p>
                    <p className="text-xs text-[var(--bd-text-muted)]">{formatSize(asset.size)}</p>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={asset.url} 
                        download
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-[var(--bd-bg-tertiary)]"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-400"
                        onClick={() => deleteAsset.mutate({ category: 'images', filename: asset.filename })}
                        disabled={deleteAsset.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!images?.length && (
                <div className="col-span-full text-center py-12 text-[var(--bd-text-muted)]">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No images yet</p>
                </div>
              )}
            </div>
          ) : (
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-[var(--bd-border-color)]">
                  {images?.map((asset) => (
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
                        <a 
                          href={asset.url} 
                          download
                          className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--bd-bg-tertiary)]"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400"
                          onClick={() => deleteAsset.mutate({ category: 'images', filename: asset.filename })}
                          disabled={deleteAsset.isPending}
                        >
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
          {audioLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
            </div>
          ) : (
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-[var(--bd-border-color)]">
                  {audio?.map((asset) => (
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
                        <a 
                          href={asset.url} 
                          download
                          className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--bd-bg-tertiary)]"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400"
                          onClick={() => deleteAsset.mutate({ category: 'audio', filename: asset.filename })}
                          disabled={deleteAsset.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!audio?.length && (
                    <div className="text-center py-12 text-[var(--bd-text-muted)]">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No audio files yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          {videosLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--bd-cyan)]" />
            </div>
          ) : (
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              {videos?.length ? (
                <ScrollArea className="h-[400px]">
                  <div className="divide-y divide-[var(--bd-border-color)]">
                    {videos.map((asset) => (
                      <div 
                        key={asset.id}
                        className="flex items-center justify-between p-4 hover:bg-[var(--bd-bg-tertiary)]"
                      >
                        <div className="flex items-center gap-3">
                          <Video className="h-8 w-8 text-[var(--bd-cyan)]" />
                          <div>
                            <p className="text-white">{asset.filename}</p>
                            <p className="text-xs text-[var(--bd-text-muted)]">
                              {formatSize(asset.size)} • {new Date(asset.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <a 
                            href={asset.url} 
                            download
                            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-[var(--bd-bg-tertiary)]"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-400"
                            onClick={() => deleteAsset.mutate({ category: 'video', filename: asset.filename })}
                            disabled={deleteAsset.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <Video className="h-16 w-16 text-[var(--bd-text-muted)] mb-4" />
                  <p className="text-[var(--bd-text-muted)]">No videos yet</p>
                  <p className="text-sm text-[var(--bd-text-secondary)] mt-2">
                    Rendered episodes will appear here
                  </p>
                </CardContent>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
