'use client';

import { useState } from 'react';
import { 
  FileText, Plus, Save, Wand2, Scissors, 
  Loader2, Play, BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SceneBreakdown {
  id: string;
  scene_number: number;
  title: string;
  location: string;
  time_of_day: string;
  characters: string[];
  description: string;
}

export default function ScriptBuilderPage() {
  const [script, setScript] = useState({
    title: '',
    content: '',
  });
  const [scenes, setScenes] = useState<SceneBreakdown[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState('');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate scene breakdown
    setTimeout(() => {
      const mockScenes: SceneBreakdown[] = [
        {
          id: '1',
          scene_number: 1,
          title: 'Opening Shot',
          location: 'Clear Lake, Texas',
          time_of_day: 'night',
          characters: ['Brenda', 'Tweaker'],
          description: 'Nighttime establishing shot of the neighborhood',
        },
        {
          id: '2',
          scene_number: 2,
          title: 'The Encounter',
          location: 'Front Yard',
          time_of_day: 'night',
          characters: ['Brenda', 'Tweaker'],
          description: 'Brenda confronts the tweaker',
        },
      ];
      setScenes(mockScenes);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = async () => {
    // Save script logic
    console.log('Saving script:', script);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Script Builder</h1>
          <p className="text-[var(--bd-text-secondary)]">
            Write scripts and break them down into scenes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[var(--bd-border-color)]">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Assist
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Script
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="bg-[var(--bd-bg-secondary)] border border-[var(--bd-border-color)]">
          <TabsTrigger 
            value="editor"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <FileText className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger 
            value="breakdown"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Scissors className="h-4 w-4 mr-2" />
            Scene Breakdown
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Script Title</Label>
                <Input
                  value={script.title}
                  onChange={(e) => setScript({ ...script, title: e.target.value })}
                  className="bd-input mt-2"
                  placeholder="Enter script title..."
                />
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Assign to Episode</Label>
                <Select value={selectedEpisode} onValueChange={setSelectedEpisode}>
                  <SelectTrigger className="bd-input mt-2">
                    <SelectValue placeholder="Select episode..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                    <SelectItem value="ep1">Nighttime in Clear Lake</SelectItem>
                    <SelectItem value="ep2">Bird Dog Meets Tweaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[var(--bd-text-secondary)]">Script Content</Label>
                <Textarea
                  value={script.content}
                  onChange={(e) => setScript({ ...script, content: e.target.value })}
                  className="bd-input mt-2 font-mono text-sm min-h-[500px]"
                  placeholder={`FADE IN:

EXT. CLEAR LAKE, TEXAS - NIGHT

The quiet suburban neighborhood. Streetlights flicker. A dog BARKS in the distance.

BRENDA (V.O.)
Another night in paradise...

CUT TO:

EXT. BRENDA'S FRONT YARD - CONTINUOUS

BRENDA, 40s, stands guard. Eyes sharp. She spots movement.

BRENDA
Who's there? Show yourself!

A FIGURE stumbles from the shadows. The TWEAKER, disheveled, eyes wild.

TWEAKER
I... I just need...`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Scissors className="h-5 w-5 text-[var(--bd-cyan)]" />
                Scene Breakdown
              </CardTitle>
              <Button 
                onClick={handleAnalyze}
                disabled={!script.content || isAnalyzing}
                className="btn-primary"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Auto-Breakdown
              </Button>
            </CardHeader>
            <CardContent>
              {scenes.length === 0 ? (
                <div className="text-center py-12 text-[var(--bd-text-muted)]">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Write your script and click Auto-Breakdown to parse scenes</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4 pr-4">
                    {scenes.map((scene) => (
                      <Card 
                        key={scene.id}
                        className="bg-[var(--bd-bg-tertiary)] border-[var(--bd-border-color)]"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-white">
                              Scene {scene.scene_number}: {scene.title}
                            </CardTitle>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="border-[var(--bd-border-color)]">
                                {scene.time_of_day}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-[var(--bd-cyan)] mb-2">{scene.location}</p>
                          <p className="text-sm text-[var(--bd-text-muted)] mb-3">
                            {scene.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {scene.characters.map((char) => (
                              <Badge 
                                key={char}
                                className="bg-[var(--bd-purple)]/10 text-[var(--bd-purple)] border-[var(--bd-purple)]/20"
                              >
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                  {script.title || 'Untitled Script'}
                </h2>
                <pre className="font-mono text-sm text-[var(--bd-text-secondary)] whitespace-pre-wrap">
                  {script.content || 'Start writing your script in the editor...'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
