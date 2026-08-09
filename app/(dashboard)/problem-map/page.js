'use client';

import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Layers, Sparkles, FolderKanban, AlertTriangle, Lightbulb, CheckSquare, FileCheck2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProblemMapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const proj = data.projects?.[0]; // SOFO Sync
        if (proj) {
          // Construct visual node graph for SOFO Sync
          const initialNodes = [
            {
              id: 'proj-1',
              position: { x: 50, y: 150 },
              data: { label: `📌 PROJECT\n${proj.name}` },
              style: { background: '#1e1b4b', color: '#a5b4fc', border: '1px solid #6366f1', borderRadius: '12px', padding: '12px', fontWeight: 'bold', fontSize: '12px', width: 160 }
            },
            {
              id: 'req-1',
              position: { x: 280, y: 80 },
              data: { label: '📋 REQUIREMENT\nREQ-102: Real-Time Sockets' },
              style: { background: '#111827', color: '#818cf8', border: '1px solid #4f46e5', borderRadius: '12px', padding: '10px', fontSize: '11px', width: 180 }
            },
            {
              id: 'prob-1',
              position: { x: 520, y: 80 },
              data: { label: '⚠️ PROBLEM\nPROB-201: WebSocket Disconnects' },
              style: { background: '#450a0a', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '12px', padding: '10px', fontSize: '11px', width: 190 }
            },
            {
              id: 'cause-1',
              position: { x: 770, y: 80 },
              data: { label: '🔍 5-WHYS ROOT CAUSE\nMissing Heartbeat Service' },
              style: { background: '#451a03', color: '#fcd34d', border: '1px solid #f59e0b', borderRadius: '12px', padding: '10px', fontSize: '11px', width: 190 }
            },
            {
              id: 'sol-1',
              position: { x: 1020, y: 80 },
              data: { label: '💡 SOLUTION\nSOL-301: Heartbeat Protocol' },
              style: { background: '#042f2e', color: '#67e8f9', border: '1px solid #06b6d4', borderRadius: '12px', padding: '10px', fontSize: '11px', width: 180 }
            },
            {
              id: 'task-1',
              position: { x: 1250, y: 30 },
              data: { label: '✅ TASK\nTASK-401: Heartbeat Service' },
              style: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #10b981', borderRadius: '12px', padding: '8px', fontSize: '10px', width: 160 }
            },
            {
              id: 'task-2',
              position: { x: 1250, y: 130 },
              data: { label: '✅ TASK\nTASK-402: Proxy Keep-Alive' },
              style: { background: '#064e3b', color: '#6ee7b7', border: '1px solid #10b981', borderRadius: '12px', padding: '8px', fontSize: '10px', width: 160 }
            }
          ];

          const initialEdges = [
            { id: 'e1-2', source: 'proj-1', target: 'req-1', animated: true, style: { stroke: '#6366f1' } },
            { id: 'e2-3', source: 'req-1', target: 'prob-1', animated: true, style: { stroke: '#ef4444' } },
            { id: 'e3-4', source: 'prob-1', target: 'cause-1', animated: true, style: { stroke: '#f59e0b' } },
            { id: 'e4-5', source: 'cause-1', target: 'sol-1', animated: true, style: { stroke: '#06b6d4' } },
            { id: 'e5-6', source: 'sol-1', target: 'task-1', animated: true, style: { stroke: '#10b981' } },
            { id: 'e5-7', source: 'sol-1', target: 'task-2', animated: true, style: { stroke: '#10b981' } }
          ];

          setNodes(initialNodes);
          setEdges(initialEdges);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Visual Project Problem Map</span>
          </h1>
          <p className="text-xs text-zinc-400">Interactive graph mapping Project → Requirements → Problems → Causes → Solutions → Tasks.</p>
        </div>
        <Badge variant="primary">React Flow Graph Engine</Badge>
      </div>

      {/* Interactive Flow Canvas */}
      <Card className="flex-1 w-full relative overflow-hidden bg-zinc-950 border-zinc-800">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-zinc-500">Loading graph nodes...</div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background color="#27272a" gap={20} size={1} />
            <Controls className="bg-zinc-900 border-zinc-800 text-white fill-white" />
            <MiniMap className="bg-zinc-900 border-zinc-800 rounded-xl" nodeColor="#6366f1" />
          </ReactFlow>
        )}
      </Card>
    </div>
  );
}
