'use client';

import React from 'react';
import { Settings, User, Shield, HardDrive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          <span>Workspace & System Settings</span>
        </h1>
        <p className="text-xs text-zinc-400">Configure storage provider adapters, RBAC roles, and API integrations.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>Storage Abstraction Adapter Configuration</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Storage Provider</label>
            <select className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-white">
              <option value="local">LocalStorageAdapter (Built-in Public Uploads)</option>
              <option value="s3">Amazon S3 Adapter</option>
              <option value="supabase">Supabase Storage Adapter</option>
              <option value="cloudinary">Cloudinary Adapter</option>
            </select>
          </div>
          <Button size="sm">Save Storage Provider</Button>
        </div>
      </Card>

      <Card className="p-5 space-y-3 text-xs">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Access Control (RBAC) Hierarchy</span>
        </h2>
        <div className="space-y-2 text-zinc-300">
          <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex justify-between">
            <span>OWNER</span>
            <span className="text-zinc-400">Full administrative access</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex justify-between">
            <span>PROJECT_MANAGER</span>
            <span className="text-zinc-400">Projects + Problems + Tasks + Analytics</span>
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 flex justify-between">
            <span>DEVELOPER</span>
            <span className="text-zinc-400">Assigned Tasks + Problems + Solutions</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
