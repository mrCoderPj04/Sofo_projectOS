'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SolutionsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => setProblems(data.problems || []));
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-cyan-400" />
            <span>Solutions Management</span>
          </h1>
          <p className="text-xs text-zinc-400">Evaluate solution trade-offs, complexity, cost, and risk side-by-side.</p>
        </div>
      </div>

      <div className="space-y-4">
        {problems.map((prob) => (
          <Card key={prob.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-400">{prob.probId}: {prob.title}</span>
              <Link href={`/problems/${prob.id}`}>
                <Button size="sm" variant="outline" className="text-xs">
                  Solution Comparison Matrix →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {prob.solutions?.map((sol) => (
                <div key={sol.id} className={`p-4 rounded-xl border ${sol.status === 'SELECTED' ? 'border-emerald-500 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-950/60'} text-xs space-y-2`}>
                  <div className="flex justify-between font-bold text-white">
                    <span>{sol.title}</span>
                    <Badge variant={sol.status === 'SELECTED' ? 'success' : 'default'}>{sol.status}</Badge>
                  </div>
                  <p className="text-zinc-400">{sol.approach}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
