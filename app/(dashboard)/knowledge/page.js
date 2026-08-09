'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, CheckCircle2, Tag, Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function KnowledgePage() {
  const [tab, setTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [decisions, setDecisions] = useState([]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Knowledge Base & Decision Log</span>
          </h1>
          <p className="text-xs text-zinc-400">Architectural notes, lessons learned, and systemic decision tracking.</p>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={tab === 'articles' ? 'default' : 'outline'}
            onClick={() => setTab('articles')}
          >
            Articles
          </Button>
          <Button
            size="sm"
            variant={tab === 'decisions' ? 'default' : 'outline'}
            onClick={() => setTab('decisions')}
          >
            Decision Log
          </Button>
        </div>
      </div>

      {tab === 'articles' && (
        <div className="space-y-4">
          {articles.length === 0 ? (
            <Card className="p-12 text-center text-zinc-500 text-xs border-dashed border-zinc-800">
              No knowledge articles created yet. Articles can be published within project workspaces.
            </Card>
          ) : (
            articles.map((art) => (
              <Card key={art.id} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{art.category}</Badge>
                </div>
                <h3 className="text-base font-bold text-white">{art.title}</h3>
                <p className="text-xs text-zinc-300 whitespace-pre-line">{art.content}</p>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'decisions' && (
        <div className="space-y-4">
          {decisions.length === 0 ? (
            <Card className="p-12 text-center text-zinc-500 text-xs border-dashed border-zinc-800">
              No architectural decisions logged yet. Decisions are recorded per project workspace.
            </Card>
          ) : (
            decisions.map((dec) => (
              <Card key={dec.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{dec.decId}</span>
                  <span className="text-xs text-zinc-500">{dec.date}</span>
                </div>
                <h3 className="text-base font-bold text-white">{dec.decision}</h3>
                <p className="text-xs text-zinc-300">{dec.reason}</p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
