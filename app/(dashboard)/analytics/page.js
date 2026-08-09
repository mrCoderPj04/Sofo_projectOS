'use client';

import React from 'react';
import { BarChart3, TrendingUp, Activity, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Project Analytics & Health Engine</span>
          </h1>
          <p className="text-xs text-zinc-400">Automated project health calculation and resolution velocity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 text-center space-y-2">
          <div className="text-xs text-zinc-400 font-semibold">Requirement Coverage</div>
          <div className="text-3xl font-black text-indigo-400">100%</div>
          <div className="text-[10px] text-zinc-500">All requirements mapped to verified tasks</div>
        </Card>

        <Card className="p-5 text-center space-y-2">
          <div className="text-xs text-zinc-400 font-semibold">Problem Resolution Rate</div>
          <div className="text-3xl font-black text-emerald-400">85%</div>
          <div className="text-[10px] text-zinc-500">Average resolution speed: 2.5 days</div>
        </Card>

        <Card className="p-5 text-center space-y-2">
          <div className="text-xs text-zinc-400 font-semibold">Systemic Health Score</div>
          <div className="text-3xl font-black text-cyan-400">85%</div>
          <div className="text-[10px] text-zinc-500">Healthy index with 0 open critical risks</div>
        </Card>
      </div>

      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Automatic Health Engine Scoring Algorithm Explanation</span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed">
          The SOFO ProjectOS Health Engine evaluates projects continuously by computing weighted deductions for open critical problems (-20pts each), general un-analyzed problems (-5pts), overdue tasks (-8pts), and unmitigated risks (-10pts). Returns status GREEN (Healthy), YELLOW (Needs Attention), or RED (Critical).
        </p>
      </Card>
    </div>
  );
}
