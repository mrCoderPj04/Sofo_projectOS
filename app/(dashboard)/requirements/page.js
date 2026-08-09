'use client';

import React, { useEffect, useState } from 'react';
import { FileCheck2, Plus, CheckCircle, Clock, AlertTriangle, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const reqs = [];
        data.projects?.forEach(p => {
          p.requirements?.forEach(r => {
            reqs.push({ ...r, projectName: p.name });
          });
        });
        setRequirements(reqs);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-indigo-400" />
            <span>Requirements System</span>
          </h1>
          <p className="text-xs text-zinc-400">Functional, Non-functional, Technical, Business, Security & Performance coverage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirements.map((req) => (
          <Card key={req.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-400">{req.reqId}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="primary">{req.type}</Badge>
                <Badge variant="outline">{req.status}</Badge>
              </div>
            </div>
            <h3 className="text-base font-bold text-white">{req.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{req.description}</p>
            <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800/60 flex justify-between">
              <span>Project: {req.projectName}</span>
              <span>Due: {req.dueDate || 'N/A'}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
