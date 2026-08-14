'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Code2,
  CheckSquare,
  ArrowUpRight,
  UserCheck,
  TrendingUp,
  Sparkles,
  PlayCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function InProcessWorkingStatusSection({ project }) {
  if (!project) return null;

  const problems = project.problems || [];
  const tasks = project.tasks || [];
  const requirements = project.requirements || [];

  // Filter in-process items
  const activeProblems = problems.filter((p) =>
    ['IDENTIFIED', 'INVESTIGATING', 'ROOT_CAUSE_FOUND', 'SOLUTION_SELECTED', 'IN_PROGRESS', 'TESTING'].includes(p.status)
  );

  const activeTasks = tasks.filter((t) =>
    ['IN_PROGRESS', 'TESTING', 'REVIEW', 'TODO'].includes(t.status)
  );

  const activeReqs = requirements.filter((r) =>
    ['IN_PROGRESS', 'PLANNED', 'IMPLEMENTED'].includes(r.status)
  );

  const totalItems = problems.length + tasks.length + requirements.length;
  const inProcessCount = activeProblems.length + activeTasks.length + activeReqs.length;
  const completedCount =
    problems.filter((p) => ['RESOLVED', 'CLOSED'].includes(p.status)).length +
    tasks.filter((t) => t.status === 'DONE').length +
    requirements.filter((r) => r.status === 'VERIFIED').length;

  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <Card className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950/30 border-indigo-500/40 p-6 space-y-6 shadow-2xl backdrop-blur-xl hover:border-indigo-500/60 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <PlayCircle className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
              <span>In-Process Working Status</span>
            </h2>
            <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-mono text-[10px]">
              {inProcessCount} Active In-Flight Items
            </Badge>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time execution status tracking active problems, tasks, and requirements currently in progress.
          </p>
        </div>

        {/* Progress Gauge */}
        <div className="flex items-center space-x-4 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-medium">Overall Progress</div>
            <div className="text-base font-black text-emerald-400 font-mono">{progressPercentage}%</div>
          </div>
          <div className="w-24 bg-zinc-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Active In-Process Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Active In-Process Problems */}
        <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>In-Process Problems ({activeProblems.length})</span>
            </span>
            <Badge variant="danger" className="text-[9px]">5-Whys Active</Badge>
          </div>

          {activeProblems.length === 0 ? (
            <div className="py-6 text-center text-zinc-500 text-[11px]">Zero open problems in progress.</div>
          ) : (
            activeProblems.map((prob) => (
              <div
                key={prob.id}
                className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 hover:border-rose-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-rose-400">{prob.probId}</span>
                  <Badge variant="outline" className="text-[9px] border-zinc-700 text-zinc-300">
                    {prob.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{prob.title}</div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                  <span>Scope: {prob.environmentScope || 'Backend'}</span>
                  <Link href={`/problems/${prob.id}`}>
                    <span className="text-indigo-400 hover:text-white font-medium flex items-center space-x-0.5">
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 2: Active In-Process Tasks */}
        <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>In-Process Tasks ({activeTasks.length})</span>
            </span>
            <Badge variant="success" className="text-[9px]">Execution</Badge>
          </div>

          {activeTasks.length === 0 ? (
            <div className="py-6 text-center text-zinc-500 text-[11px]">No active tasks currently in progress.</div>
          ) : (
            activeTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-emerald-400">{t.taskId}</span>
                  <Badge variant={t.status === 'IN_PROGRESS' ? 'success' : 'outline'} className="text-[9px]">
                    {t.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{t.title}</div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1">
                  <span>Priority: {t.priority}</span>
                  <span>Est: {t.estimatedHours || 0}h</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 3: Active In-Process Requirements */}
        <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>In-Process Requirements ({activeReqs.length})</span>
            </span>
            <Badge variant="primary" className="text-[9px]">Coverage</Badge>
          </div>

          {activeReqs.length === 0 ? (
            <div className="py-6 text-center text-zinc-500 text-[11px]">All requirements verified or pending planning.</div>
          ) : (
            activeReqs.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-indigo-400">{r.reqId}</span>
                  <Badge variant="primary" className="text-[9px]">{r.status}</Badge>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">{r.title}</div>
                <div className="text-[10px] text-zinc-400 pt-1">
                  <span>Type: {r.type || 'FUNCTIONAL'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
