'use client';

import { useState, useEffect } from 'react';
import { 
  Rocket, Cpu, Mic, Play, Settings, AlertTriangle, 
  CheckCircle, Loader2, Zap, Film, Volume2, Package,
  Terminal, Activity, Pause, XCircle, RefreshCw
} from 'lucide-react';
import { useSystemStatus, useWorkers, useQueue, useBatchOperations } from '@/hooks/use-system';
import { useEpisodes } from '@/hooks/use-episodes';
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
import apiClient from '@/lib/api';

export default function MissionControlPage() {
  const [activeTab, setActiveTab] = useState('batch');
  const [logs, setLogs] = useState<string[]>([
    '[10:23:45] System ready',
    '[10:24:12] GPU worker connected',
    '[10:25:03] Queue initialized',
  ]);
  
  // Batch config
  const [batchConfig, setBatchConfig] = useState({
    episodes: 'current',
    operations: ['video'] as string[],
    priority: 'normal' as const,
    parallel_workers: 2,
  });
  
  // Real data
  const { data: systemStatus } = useSystemStatus();
  const { data: workers } = useWorkers();
  const { data: queue } = useQueue();
  const { data: episodes } = useEpisodes();
  const { startBatch, pauseBatch, cancelBatch } = useBatchOperations();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  const handleStartBatch = async () => {
    try {
      addLog('Starting batch operations...');
      await startBatch.mutateAsync(batchConfig);
      addLog('Batch job started successfully');
    } catch (error: any) {
      addLog(`Error: ${error.message || 'Failed to start batch'}`);
    }
  };

  const handlePauseBatch = async () => {
    try {
      await pauseBatch.mutateAsync();
      addLog('Batch operations paused');
    } catch (error: any) {
      addLog(`Error: ${error.message || 'Failed to pause batch'}`);
    }
  };

  const handleCancelBatch = async () => {
    try {
      await cancelBatch.mutateAsync();
      addLog('Batch operations cancelled');
    } catch (error: any) {
      addLog(`Error: ${error.message || 'Failed to cancel batch'}`);
    }
  };

  // Auto-refresh logs from queue
  useEffect(() => {
    if (queue?.length) {
      const processing = queue.filter(j => j.status === 'processing');
      if (processing.length > 0) {
        addLog(`Processing ${processing.length} jobs in queue`);
      }
    }
  }, [queue]);

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
                  Batch Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)] text-sm">Episodes to Process</Label>
                  <Select 
                    value={batchConfig.episodes}
                    onValueChange={(v) => setBatchConfig({ ...batchConfig, episodes: v || 'current' })}
                  >
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
                
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)] text-sm">Priority</Label>
                  <Select 
                    value={batchConfig.priority}
                    onValueChange={(v) => setBatchConfig({ ...batchConfig, priority: (v as typeof batchConfig.priority) || 'normal' })}
                  >
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--bd-text-secondary)] text-sm">Parallel Workers</Label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={10}
                    value={batchConfig.parallel_workers}
                    onChange={(e) => setBatchConfig({ ...batchConfig, parallel_workers: parseInt(e.target.value) || 1 })}
                    className="bd-input"
                  />
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-400">Warning</span>
                  </div>
                  <p className="text-xs text-[var(--bd-text-muted)]">
                    Batch operations will process multiple scenes. Ensure all settings are correct.
                  </p>
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
                    onClick={handleStartBatch}
                    disabled={startBatch.isPending}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black"
                  >
                    {startBatch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
                  </Button>
                </div>

                {/* Queue Status */}
                <div className="p-4 bg-[var(--bd-bg-tertiary)] rounded-lg border border-[var(--bd-border-color)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-white">Queue Status</div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--bd-bg-secondary)]">
                        {queue?.length || 0} jobs
                      </Badge>
                    </div>
                  </div>
                  
                  {queue && queue.length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {queue.slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--bd-text-muted)] truncate">{job.id.slice(0, 8)}...</span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                job.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                                job.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                                job.status === 'error' ? 'bg-red-500/20 text-red-400' :
                                'bg-zinc-500/20 text-zinc-400'
                              }
                            >
                              {job.status}
                            </Badge>
                            {job.progress > 0 && (
                              <span className="text-xs text-[var(--bd-text-muted)]">{job.progress}%</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--bd-text-muted)]">No jobs in queue</p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[var(--bd-border-color)]"
                      onClick={handlePauseBatch}
                      disabled={pauseBatch.isPending}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={handleCancelBatch}
                      disabled={cancelBatch.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
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
