'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  RefreshCw,
  Search,
  Building2,
  Crown,
  ChevronRight,
  AlertTriangle,
  CheckSquare,
  Activity,
  Layers,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setLoading(false);
    }
  };

  const handleSyncErp = async () => {
    setSyncing(true);
    setSyncMsg('Syncing active projects from Pjsofonic ERP Backend...');
    try {
      const res = await fetch('/api/projects/sync', { method: 'POST' });
      const data = await res.json();
      setSyncMsg(data.message || 'ERP Project Synchronization complete.');
      await loadProjects();
    } catch (err) {
      setSyncMsg('ERP Sync failed or backend unreached.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(''), 4000);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <FolderKanban className="w-6 h-6 text-indigo-400" />
              <span>Pjsofonic Enterprise Projects</span>
            </h1>
            <Badge variant="primary" className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <Crown className="w-3.5 h-3.5" />
              <span>Team Leader Workspace</span>
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage enterprise projects, mandatory deliverable documents, and systemic 5-Whys problem resolution pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSyncErp}
            disabled={syncing}
            variant="outline"
            className="flex items-center space-x-2 text-xs border-emerald-500/40 hover:border-[#39FF14] text-emerald-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing ERP...' : 'Fetch ERP Projects'}</span>
          </Button>
          <Link href="/projects/new">
            <Button variant="default" className="flex items-center space-x-2 text-xs">
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {syncMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center animate-in fade-in duration-200">
          {syncMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name or description..."
            className="pl-9 text-xs bg-zinc-900 border-zinc-800 focus:border-[#39FF14]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-medium">Filter Status:</span>
          {['ALL', 'ACTIVE', 'IN_PROCESS', 'DONE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st === 'IN_PROCESS' ? 'IN PROCESS' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-zinc-500 text-xs space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <div>Loading enterprise projects...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border-dashed border-zinc-800 bg-zinc-950/40">
          <FolderKanban className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Projects Found</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              No projects match your filter criteria. Sync from Pjsofonic ERP or launch the project creation wizard.
            </p>
          </div>
          <div className="flex justify-center space-x-3">
            <Button onClick={handleSyncErp} variant="outline" className="text-xs border-emerald-500/40 text-emerald-400">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              <span>Fetch Projects from Pjsofonic ERP</span>
            </Button>
            <Link href="/projects/new">
              <Button variant="default" className="text-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Launch Project Creation Wizard</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-zinc-950/90 border-zinc-800/80 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xl backdrop-blur-xl group"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider border-zinc-700 text-zinc-300">
                    {project.type}
                  </Badge>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="h-6 text-[10px] font-bold font-mono rounded bg-zinc-900 px-1.5 text-indigo-300 border border-indigo-500/40 focus:outline-none cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="IN_PROCESS">IN PROCESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>{project.name}</span>
                </CardTitle>

                <CardDescription className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {project.description || 'Enterprise project under Pjsofonic management.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-zinc-500">Tasks</div>
                    <div className="font-bold text-emerald-400">
                      {project.metrics?.completedTasks || 0}/{project.metrics?.totalTasks || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500">Problems</div>
                    <div className="font-bold text-amber-400">
                      {project.metrics?.openProblems || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500">Health</div>
                    <div className="font-bold text-cyan-400">
                      {project.health?.score || 100}%
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <Link href={`/projects/${project.id}`} className="block">
                  <Button
                    variant="secondary"
                    className="w-full text-xs font-semibold py-2.5 rounded-xl hover:bg-[#39FF14] hover:text-black transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Open Project Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
