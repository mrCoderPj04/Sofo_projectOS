'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  AlertTriangle,
  CheckSquare,
  Activity,
  ArrowUpRight,
  Plus,
  Sparkles,
  Clock,
  ChevronRight,
  Layers,
  Building2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;

  let totalTasks = 0;
  let completedTasks = 0;
  let openProblems = 0;
  let criticalProblems = 0;
  let overdueTasks = 0;

  projects.forEach((p) => {
    if (p.metrics) {
      totalTasks += p.metrics.totalTasks || 0;
      completedTasks += p.metrics.completedTasks || 0;
      openProblems += p.metrics.openProblems || 0;
      criticalProblems += p.metrics.criticalProblems || 0;
      overdueTasks += p.metrics.overdueTasks || 0;
    }
  });

  const mainProject = projects[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Pjsofonic ERP — Project OS</h1>
            <Badge variant="primary" className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Production Active</span>
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Don't just manage work. <span className="text-indigo-400 font-semibold">Solve problems.</span> Pjsofonic ERP Systemic Problem Resolution.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/projects/new">
            <Button variant="default" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalProjects}</div>
          <div className="text-[10px] text-zinc-500 mt-1">{activeProjects} active</div>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Open Problems</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{openProblems}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Requiring 5-Whys analysis</div>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Critical Problems</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-500">{criticalProblems}</div>
          <div className="text-[10px] text-zinc-500 mt-1">High impact severity</div>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Task Completion</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">{completedTasks} of {totalTasks} tasks done</div>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Overdue Tasks</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{overdueTasks}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Past deadline</div>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800/80 p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Health Index</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {mainProject ? `${mainProject.health?.score || 100}%` : '100%'}
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Auto health engine</div>
        </Card>
      </div>

      {/* Main Intelligent Project Health Section or Clean Empty State */}
      {mainProject ? (
        <Card className="border-indigo-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-indigo-950/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono uppercase text-indigo-400 tracking-wider font-semibold">Active Project</span>
                <Badge
                  variant={
                    mainProject.health?.status === 'GREEN'
                      ? 'success'
                      : mainProject.health?.status === 'YELLOW'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {mainProject.health?.badgeLabel || 'Healthy'}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>{mainProject.name}</span>
                <span className="text-xs text-zinc-500 font-normal">({mainProject.type})</span>
              </h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                {mainProject.description}
              </p>
              <div className="pt-2 text-xs text-indigo-300/90 flex items-start space-x-2 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20">
                <Activity className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-indigo-400">Health Engine Insight: </span>
                  {mainProject.health?.explanation}
                </div>
              </div>
            </div>

            {/* Health Score Gauge */}
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 min-w-48 text-center">
              <div className="text-3xl font-black text-indigo-400">{mainProject.health?.score}%</div>
              <div className="text-xs font-medium text-zinc-300 mt-1">Health Score</div>
              <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${mainProject.health?.score}%` }}
                />
              </div>
              <Link href={`/projects/${mainProject.id}`} className="mt-3 w-full">
                <Button variant="outline" size="sm" className="w-full text-xs flex items-center justify-center space-x-1">
                  <span>Open Project</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-zinc-800 bg-zinc-950/40">
          <FolderKanban className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Projects in Pjsofonic ERP System</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Get started by launching the Project Creation Wizard to add your first enterprise project.
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="default" className="text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Launch Project Creation Wizard</span>
            </Button>
          </Link>
        </Card>
      )}

      {/* Grid of Core Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Problem Resolution Pipeline</span>
                </CardTitle>
                <CardDescription>Problems requiring 5-Whys root cause analysis.</CardDescription>
              </div>
              <Link href="/problems">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {openProblems === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs">Zero active problems. System running clean!</div>
              ) : (
                mainProject?.problems?.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-rose-400">{prob.probId}</span>
                        <Badge variant="danger">{prob.severity}</Badge>
                      </div>
                      <div className="text-sm font-semibold text-white">{prob.title}</div>
                    </div>
                    <Link href={`/problems/${prob.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs flex items-center space-x-1">
                        <span>Analyze 5-Whys</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Pjsofonic ERP Systemic Workflow</span>
              </CardTitle>
              <CardDescription>Project → Requirement → Problem → 5-Whys → Solution → Tasks → Verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-indigo-400 font-bold">1. Project</div>
                  <div className="text-[10px] text-zinc-500">Requirements</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-rose-400 font-bold">2. Problem</div>
                  <div className="text-[10px] text-zinc-500">Symptoms</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-amber-400 font-bold">3. 5-Whys</div>
                  <div className="text-[10px] text-zinc-500">Root Cause</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-cyan-400 font-bold">4. Solution</div>
                  <div className="text-[10px] text-zinc-500">Comparison</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-emerald-400 font-bold">5. Tasks</div>
                  <div className="text-[10px] text-zinc-500">Verified Result</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-b from-purple-950/30 via-zinc-900 to-zinc-900 border-purple-500/30 p-5">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-bold text-white text-sm">SOFO AI Assistant</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              Autonomous problem analysis, 5-Whys suggestions, and task expansion.
            </p>
            <Link href="/ai-assistant">
              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs">
                Launch SOFO AI Workspace →
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
