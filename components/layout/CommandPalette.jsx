'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FolderKanban, AlertTriangle, CheckSquare, BookOpen, Layers, X, Sparkles } from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const quickActions = [
      { id: 'act-new-pj', type: 'Action', title: 'Create New Project Wizard', href: '/projects/new', icon: FolderKanban },
      { id: 'act-ai', type: 'SOFO AI', title: 'Launch SOFO AI Workspace', href: '/ai-assistant', icon: Sparkles },
      { id: 'act-prob', type: 'Module', title: 'View Problem Resolution Pipeline', href: '/problems', icon: AlertTriangle },
      { id: 'act-task', type: 'Module', title: 'Open Task Kanban Board', href: '/tasks', icon: CheckSquare },
      { id: 'act-map', type: 'Module', title: 'Open Visual Project Problem Map', href: '/problem-map', icon: Layers }
    ];

    if (!query.trim()) {
      setResults(quickActions);
      return;
    }

    const filtered = quickActions.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  const handleSelect = (href) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 mx-4">
        <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-950/60">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            type="text"
            className="w-full h-14 bg-transparent text-sm focus:outline-none text-zinc-100 placeholder:text-zinc-500"
            placeholder="Search projects, modules, actions... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No matching modules or actions found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Quick Navigation & Search
              </div>
              {results.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/10 hover:border hover:border-indigo-500/20 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-zinc-800/80 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 text-zinc-400">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-200 group-hover:text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-zinc-500">{item.type}</div>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 group-hover:text-indigo-400">Jump to →</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">↑↓</kbd>
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px]">↵</kbd>
            <span>Select</span>
          </div>
          <span>Pjsofonic ERP Command Center</span>
        </div>
      </div>
    </div>
  );
}
