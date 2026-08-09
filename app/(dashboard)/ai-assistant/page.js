'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SofoAiAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [approvedSuggestions, setApprovedSuggestions] = useState({});

  const handleAnalyze = async (textToAnalyze) => {
    const queryText = textToAnalyze || prompt;
    if (!queryText.trim()) return;

    setLoading(true);
    setAnalysis(null);
    setApprovedSuggestions({});

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText: queryText })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleToggleApprove = (key) => {
    setApprovedSuggestions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const samplePrompts = [
    "File transfer is very slow during high load",
    "WebSocket connection drops after 30 seconds",
    "Database connection pool exhaustion on API burst"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <span>SOFO AI Assistant</span>
          </h1>
          <p className="text-xs text-zinc-400">Autonomous problem analysis, 5-Whys generation, and task expansion.</p>
        </div>
        <Badge variant="primary">AI Suggestion Mode</Badge>
      </div>

      {/* Input Prompt Console */}
      <Card className="p-4 bg-gradient-to-r from-purple-950/20 via-zinc-900 to-zinc-900 border-purple-500/30 space-y-3">
        <label className="text-xs font-bold text-purple-300 block">Enter Problem or System Behavior to Analyze:</label>
        <div className="flex space-x-2">
          <Input
            placeholder="e.g. File transfer is very slow..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            className="text-xs bg-zinc-950"
          />
          <Button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Analyzing...' : 'Analyze with AI'}</span>
          </Button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] text-zinc-500">Quick Try:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleAnalyze(p);
              }}
              className="text-[10px] px-2 py-1 rounded-lg bg-zinc-800 hover:bg-purple-900/30 hover:text-purple-300 text-zinc-400 transition-colors border border-zinc-700/60"
            >
              "{p}"
            </button>
          ))}
        </div>
      </Card>

      {/* AI Results Output Container */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>AI Suggestion Safety Rule:</strong> All recommendations below are AI-generated suggestions. You must review and click <strong>Approve & Add</strong> before changes are persisted to your project.
            </span>
          </div>

          {/* 1. Possible Causes Breakdown */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>1. Identified Potential Root Causes</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.possibleCauses?.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{c.category}</Badge>
                    <span className="text-[10px] text-amber-400 font-bold">{c.likelihood} Likelihood</span>
                  </div>
                  <div className="font-semibold text-white mt-1">{c.cause}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Generated 5-Whys Chain */}
          <Card className="p-5 space-y-3 border-purple-500/30 bg-purple-950/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>2. AI-Generated 5-Whys Root Cause Chain</span>
              </h3>
              <Button
                size="sm"
                variant={approvedSuggestions['5whys'] ? 'success' : 'outline'}
                onClick={() => handleToggleApprove('5whys')}
                className="text-xs"
              >
                {approvedSuggestions['5whys'] ? '✓ Approved for Problem' : 'Approve 5-Whys Chain'}
              </Button>
            </div>
            <div className="space-y-2">
              {analysis.fiveWhysSuggestion?.map((w, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <div className="font-bold text-amber-400">Why #{w.whyNumber}: {w.question}</div>
                  <div className="text-zinc-300 pl-2 border-l-2 border-indigo-500">{w.answer}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Recommended Solutions */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>3. Recommended Architectural Solutions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.recommendedSolutions?.map((sol, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-sm">{sol.title}</div>
                  <p className="text-zinc-400">{sol.approach}</p>
                  <div className="flex items-center space-x-2 pt-1">
                    <Badge variant="primary">Impact: {sol.impact}</Badge>
                    <Badge variant="outline">Complexity: {sol.complexity}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant={approvedSuggestions[`sol-${i}`] ? 'success' : 'outline'}
                    onClick={() => handleToggleApprove(`sol-${i}`)}
                    className="w-full text-xs mt-2"
                  >
                    {approvedSuggestions[`sol-${i}`] ? '✓ Solution Approved' : 'Approve Solution'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Suggested Investigation & Verification Tasks */}
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>4. Suggested Tasks for Implementation</span>
            </h3>
            <div className="space-y-2">
              {analysis.suggestedTasks?.map((t, i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{t.title}</span>
                    <span className="text-zinc-500 ml-2">({t.estimatedHours} hrs est.)</span>
                  </div>
                  <Button
                    size="sm"
                    variant={approvedSuggestions[`task-${i}`] ? 'success' : 'outline'}
                    onClick={() => handleToggleApprove(`task-${i}`)}
                    className="text-xs"
                  >
                    {approvedSuggestions[`task-${i}`] ? '✓ Task Approved' : 'Approve Task'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
