'use client';

import { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Database, 
  Save, Key, Globe, Moon, Sun, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[var(--bd-text-secondary)]">
          Configure your Mission Control preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-[var(--bd-bg-secondary)] border border-[var(--bd-border-color)]">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="account"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="api"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-[var(--bd-bg-tertiary)] data-[state=active]:text-[var(--bd-cyan)]"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-[var(--bd-text-muted)]">
                    Use dark theme throughout the application
                  </p>
                </div>
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-save</Label>
                  <p className="text-sm text-[var(--bd-text-muted)]">
                    Automatically save changes while editing
                  </p>
                </div>
                <Switch 
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                    <SelectTrigger className="bd-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input className="bd-input" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input className="bd-input" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input className="bd-input" placeholder="Brief description..." />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg">Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input className="bd-input" type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input className="bd-input" type="password" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API Key</Label>
                <Input className="bd-input" type="password" placeholder="sk-..." />
              </div>
              <div className="space-y-2">
                <Label>Anthropic API Key</Label>
                <Input className="bd-input" type="password" placeholder="sk-ant-..." />
              </div>
              <div className="space-y-2">
                <Label>ElevenLabs API Key</Label>
                <Input className="bd-input" type="password" placeholder="..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-[var(--bd-bg-card)] border-[var(--bd-border-color)]">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-[var(--bd-text-muted)]">
                    Receive notifications about render jobs
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
