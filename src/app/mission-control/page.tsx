'use client';

import { useState } from 'react';
import { 
  Rocket, Cpu, Mic, Play, Settings, AlertTriangle, 
  CheckCircle, Loader2, Zap, Film, Volume2, Package,
  Terminal, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function MissionControlPage() {
  const [activeTab, setActiveTab] = useState('batch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[10:23:45] System ready',
    '[10:24:12] GPU worker connected',
    '[10:25:03] Queue initialized',
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  const handleBatchVideo = () => {
    setIsProcessing(true);
    addLog('Starting batch video generation...');
    setTimeout(() => {
      addLog('Batch complete: 3 videos generated');
      setIsProcessing(false);
    }, 3000);
  };

  const handleBatchAudio = () => {
    setIsProcessing(true);
    addLog('Starting batch audio generation...');
    setTimeout(() => {
      addLog('Batch complete: 5 audio files generated');
      setIsProcessing(false);
    }, 3000);
  };

  const handleFinalAssembly = () => {
    setIsProcessing(true);
    addLog('Starting final assembly...');
    setTimeout(() => {
      addLog('Assembly complete: Episode rendered');
      setIsProcessing(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
        <p className="text-[var(--bd-text-secondary)]">
          Advanced controls for batch processing and system configuration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[var(--bd-bg-secondary)] border border-[var(--bd-border-color)]">
          <TabsTrigger 
            value="batch"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Play className="h-4 w-4 mr-2" />
            Batch Operations
          </TabsTrigger>
          <TabsTrigger 
            value="ai"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Cpu className="h-4 w-4 mr-2" />
            AI Models
          </TabsTrigger>
          <TabsTrigger 
            value="voice"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </TabsTrigger>
          <TabsTrigger 
            value="system"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batch" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <CardHeader>
                <CardTitle className="text-sm uppercase text-[var(--bd-text-muted)]">
                  Batch Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-400">Warning</span>
                  </div>
                  <p className="text-xs text-[var(--bd-text-muted)]">
                    Batch operations will process multiple scenes. Ensure all settings are correct.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)] text-sm">Episodes to Process</Label>
                  <Select defaultValue="current">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="current">Current Episode Only</SelectItem>
                      <SelectItem value="all">All Episodes</SelectItem>
                      <SelectItem value="drafts">Draft Episodes</SelectItem>
                      <SelectItem value="ready">Ready to Render</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="lg:col-span-2 bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-[var(--bd-cyan)]" />
                  Render Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Generate Videos */}
                <div className="flex items-center justify-between p-4 bg-[var(--bd-bg-tertiary)] rounded-lg border border-[var(--bd-border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Film className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Generate All Videos</div>
                      <div className="text-sm text-[var(--bd-text-muted)]">
                        Create video for all pending scenes
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBatchVideo}
                    disabled={isProcessing}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
                  </Button>
                </div>

                {/* Generate Audio */}
                <div className="flex items-center justify-between p-4 bg-[var(--bd-bg-tertiary)] rounded-lg border border-[var(--bd-border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Generate All Audio</div>
                      <div className="text-sm text-[var(--bd-text-muted)]">
                        Synthesize voice for all dialogue
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBatchAudio}
                    disabled={isProcessing}
                    className="bg-purple-500 hover:bg-purple-400 text-black"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
                  </Button>
                </div>

                {/* Final Assembly */}
                <div className="flex items-center justify-between p-4 bg-[var(--bd-bg-tertiary)] rounded-lg border border-[var(--bd-border-color)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Final Assembly</div>
                      <div className="text-sm text-[var(--bd-text-muted)]">
                        Combine all assets into final video
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleFinalAssembly}
                    disabled={isProcessing}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black"
                  >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Panel */}
            <Card className="lg:col-span-3 bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
              <CardHeader>
                <CardTitle className="text-sm uppercase text-[var(--bd-text-muted)]">
                  Log Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40 bg-black/30 rounded-lg p-4 font-mono text-sm">
                  {logs.map((log, i) => (
                    <div key={i} className="text-[var(--bd-text-muted)] mb-1">
                      {log}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[var(--bd-cyan)]" />
                AI Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">LLM Provider</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="local">Local (Ollama)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Temperature</Label>
                  <Input type="number" defaultValue={0.7} step={0.1} min={0} max={2} className="bd-input" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mic className="h-5 w-5 text-[var(--bd-purple)]" />
                Voice Synthesis Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">TTS Provider</Label>
                  <Select defaultValue="elevenlabs">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="openai">OpenAI TTS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Model</Label>
                  <Select defaultValue="multilingual-v2">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="multilingual-v2">Multilingual v2</SelectItem>
                      <SelectItem value="turbo-v2.5">Turbo v2.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Stability</Label>
                  <Input type="number" defaultValue={0.5} step={0.1} min={0} max={1} className="bd-input" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5 text-[var(--bd-cyan)]" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">API Base URL</Label>
                  <Input defaultValue="http://100.98.72.30:3456" className="bd-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Colab Worker URL</Label>
                  <Input placeholder="https://xxx.ngrok-free.app" className="bd-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">n8n Webhook URL</Label>
                  <Input defaultValue="http://100.98.72.30:5678/webhook/bird-dog" className="bd-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)]">Default Video Resolution</Label>
                  <Select defaultValue="720p">
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
