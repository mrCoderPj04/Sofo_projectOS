'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RisksPage() {
  const [risks, setRisks] = useState([]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span>Risk Register & Matrix</span>
          </h1>
          <p className="text-xs text-zinc-400">Proactive risk identification, mitigation strategies, and severity tracking.</p>
        </div>
      </div>

      <div className="space-y-3">
        {risks.length === 0 ? (
          <Card className="p-12 text-center text-zinc-500 text-xs border-dashed border-zinc-800">
            Zero active risks logged. Risks can be logged within project workspaces.
          </Card>
        ) : (
          risks.map((r) => (
            <Card key={r.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{r.riskId}</span>
                <Badge variant="danger">{r.severity} Severity</Badge>
              </div>
              <h3 className="text-base font-bold text-white">{r.title}</h3>
              <p className="text-xs text-zinc-400">{r.description}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
