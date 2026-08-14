'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  CheckSquare,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Printer,
  Download,
  FileSpreadsheet,
  Terminal,
  Server,
  Code2,
  Layout,
  Laptop,
  FileText,
  X,
  ListChecks
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadProblemsAsExcel } from '@/lib/excel-export';

export default function ProblemDetailWorkspace({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // 5 Whys state
  const [fiveWhys, setFiveWhys] = useState([]);
  const [confirmedRootCause, setConfirmedRootCause] = useState('');
  const [savingRca, setSavingRca] = useState(false);

  // Solutions state
  const [solutions, setSolutions] = useState([]);
  const [newSolTitle, setNewSolTitle] = useState('');
  const [newSolApproach, setNewSolApproach] = useState('');

  // Resolution Action Steps ("kya kya kra" section)
  const [resolutionSteps, setResolutionSteps] = useState([]);
  const [newStepText, setNewStepText] = useState('');
  const [savingSteps, setSavingSteps] = useState(false);

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);

  // AI analysis state
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null);

  const fetchProblem = async () => {
    try {
      const res = await fetch(`/api/problems/${id}`);
      const data = await res.json();
      if (data.problem) {
        setProblem(data.problem);
        setSolutions(data.problem.solutions || []);
        
        // Parse 5-Whys
        if (data.problem.rca) {
          const parsed = JSON.parse(data.problem.rca.fiveWhysData || '[]');
          setFiveWhys(parsed.length > 0 ? parsed : [
            { whyNumber: 1, question: `Why did "${data.problem.title}" occur?`, answer: '' }
          ]);
          setConfirmedRootCause(data.problem.rca.confirmedRootCause || '');
        } else {
          setFiveWhys([{ whyNumber: 1, question: `Why did "${data.problem.title}" occur?`, answer: '' }]);
        }

        // Parse Resolution Action Steps ("kya kya kra")
        try {
          const parsedSteps = typeof data.problem.resolutionSteps === 'string'
            ? JSON.parse(data.problem.resolutionSteps || '[]')
            : (data.problem.resolutionSteps || []);
          setResolutionSteps(Array.isArray(parsedSteps) ? parsedSteps : []);
        } catch (err) {
          setResolutionSteps([]);
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const handleAddWhyStep = () => {
    const nextNum = fiveWhys.length + 1;
    setFiveWhys([
      ...fiveWhys,
      { whyNumber: nextNum, question: `Why (${nextNum})?`, answer: '' }
    ]);
  };

  const handleUpdateWhy = (index, field, value) => {
    const updated = [...fiveWhys];
    updated[index][field] = value;
    setFiveWhys(updated);
  };

  const handleSaveRca = async () => {
    setSavingRca(true);
    await fetch(`/api/problems/${id}/rca`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fiveWhysData: fiveWhys,
        confirmedRootCause
      })
    });
    setSavingRca(false);
    fetchProblem();
  };

  // Add Resolution Action Step ("kya kya kra")
  const handleAddResolutionStep = () => {
    if (!newStepText.trim()) return;
    setResolutionSteps([...resolutionSteps, newStepText.trim()]);
    setNewStepText('');
  };

  const handleRemoveResolutionStep = (index) => {
    setResolutionSteps(resolutionSteps.filter((_, i) => i !== index));
  };

  // Save Resolution Steps & Status
  const handleSaveResolution = async (newStatus) => {
    setSavingSteps(true);
    await fetch(`/api/problems/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resolutionSteps,
        status: newStatus || problem?.status || 'IN_PROGRESS'
      })
    });
    setSavingSteps(false);
    fetchProblem();
  };

  const handleCreateSolution = async () => {
    if (!newSolTitle.trim()) return;
    await fetch('/api/solutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: id,
        title: newSolTitle,
        approach: newSolApproach,
        complexity: 'MEDIUM',
        cost: 'LOW',
        risk: 'LOW',
        impact: 'HIGH',
        pros: ['Eliminates root cause', 'Low performance impact'],
        cons: ['Minor refactoring required']
      })
    });
    setNewSolTitle('');
    setNewSolApproach('');
    fetchProblem();
  };

  const handleSelectSolution = async (solId) => {
    await fetch(`/api/solutions/${solId}/select`, { method: 'POST' });
    fetchProblem();
  };

  const handleAiAnalysis = async () => {
    setAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: id,
          title: problem.title,
          symptoms: problem.symptoms
        })
      });
      const data = await res.json();
      setAiData(data.analysis);
    } catch (err) {
      console.error(err);
    }
    setAiAnalyzing(false);
  };

  // Generate & Download Excel Report (.xlsx / .csv)
  const handleDownloadExcelReport = () => {
    if (!problem) return;
    const problemData = {
      ...problem,
      rca: {
        fiveWhysData: JSON.stringify(fiveWhys),
        confirmedRootCause
      },
      resolutionSteps: JSON.stringify(resolutionSteps)
    };
    downloadProblemsAsExcel([problemData], `${problem.probId}-Systemic-Resolution-Report.csv`);
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500 text-xs">Loading Problem Workspace...</div>;
  }

  if (!problem) {
    return <div className="py-20 text-center text-rose-400 text-xs">Problem not found.</div>;
  }

  const selectedSolution = problem.solutions?.find((s) => s.status === 'SELECTED');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-base font-bold text-rose-400">{problem.probId}</span>
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <Badge variant="danger">{problem.severity}</Badge>
            <Badge variant="outline">{problem.environmentScope || 'Backend'}</Badge>
            <Badge variant={problem.status === 'RESOLVED' ? 'success' : 'primary'}>
              {problem.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">{problem.symptoms}</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Generate & Download Report Button */}
          <Button
            onClick={() => setShowReportModal(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1.5 border-indigo-500/40 text-indigo-300 hover:text-white cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Generate & Download Report</span>
          </Button>

          <Button
            onClick={handleAiAnalysis}
            disabled={aiAnalyzing}
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white flex items-center space-x-1 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{aiAnalyzing ? 'Analyzing...' : 'SOFO AI RCA Assist'}</span>
          </Button>
        </div>
      </div>

      {/* AI Assistance Suggestion Box */}
      {aiData && (
        <Card className="p-4 bg-purple-950/30 border-purple-500/40 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-purple-300 font-bold">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>SOFO AI Problem & 5-Whys Analysis Result</span>
            </span>
            <Badge variant="primary">Heuristic Engine</Badge>
          </div>
          <div className="space-y-1 text-zinc-300">
            <div><span className="font-semibold text-purple-400">Diagnosis: </span>{aiData.diagnosis}</div>
            <div><span className="font-semibold text-purple-400">Likely Root Cause: </span>{aiData.suspectedRootCause}</div>
          </div>
          {aiData.suggestedFiveWhys && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                className="text-[11px] h-7 border-purple-500/40 text-purple-300"
                onClick={() => {
                  setFiveWhys(aiData.suggestedFiveWhys);
                  setConfirmedRootCause(aiData.suspectedRootCause);
                }}
              >
                Apply AI 5-Whys Steps to Form →
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* 5-WHYS MODULE */}
      <Card className="p-6 space-y-5 bg-zinc-950/90 border-indigo-500/30">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Systemic 5-Whys Root Cause Analysis</span>
            </h2>
            <p className="text-xs text-zinc-400">Repeatedly ask "Why?" to drill down from symptoms to the true root cause.</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddWhyStep} className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Why Step</span>
          </Button>
        </div>

        <div className="space-y-3">
          {fiveWhys.map((why, index) => (
            <div key={index} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400">
                <span>WHY #{why.whyNumber || index + 1}</span>
                {fiveWhys.length > 1 && (
                  <button
                    onClick={() => setFiveWhys(fiveWhys.filter((_, i) => i !== index))}
                    className="text-zinc-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Input
                placeholder="Question (e.g. Why did the WebSocket connection drop?)"
                value={why.question}
                onChange={(e) => handleUpdateWhy(index, 'question', e.target.value)}
                className="text-xs bg-zinc-950 font-mono"
              />
              <textarea
                rows={2}
                placeholder="Observed Answer / Evidence..."
                value={why.answer}
                onChange={(e) => handleUpdateWhy(index, 'answer', e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Confirmed Root Cause */}
        <div className="pt-2 space-y-2">
          <label className="text-xs font-bold text-white block">Confirmed Systemic Root Cause</label>
          <textarea
            rows={2}
            placeholder="Synthesized final root cause conclusion..."
            value={confirmedRootCause}
            onChange={(e) => setConfirmedRootCause(e.target.value)}
            className="w-full rounded-lg border border-indigo-500/40 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveRca} disabled={savingRca} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs cursor-pointer">
              {savingRca ? 'Saving 5-Whys...' : 'Save 5-Whys RCA'}
            </Button>
          </div>
        </div>
      </Card>

      {/* RESOLUTION ACTIONS LOG SECTION ("Kya Kya Kra") */}
      <Card className="p-6 space-y-5 bg-zinc-950/90 border-emerald-500/30">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ListChecks className="w-5 h-5 text-emerald-400" />
              <span>Solution Execution Steps & Resolution Summary ("Kya Kya Kra")</span>
            </h2>
            <p className="text-xs text-zinc-400">Record step-by-step resolution actions performed to solve this problem permanently.</p>
          </div>
          <Badge variant={problem.status === 'RESOLVED' ? 'success' : 'warning'}>
            {problem.status === 'RESOLVED' ? 'Resolved ✓' : 'In Progress'}
          </Badge>
        </div>

        {/* Action Steps List */}
        <div className="space-y-2">
          {resolutionSteps.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
              No resolution steps logged yet. Add steps below to document what actions were taken to fix the problem.
            </div>
          ) : (
            resolutionSteps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs space-x-3">
                <div className="flex items-start space-x-3 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-zinc-200 leading-relaxed font-medium">{step}</span>
                </div>
                <button
                  onClick={() => handleRemoveResolutionStep(idx)}
                  className="text-zinc-500 hover:text-rose-400 shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Step Input */}
        <div className="flex space-x-2 pt-2">
          <Input
            placeholder="Add resolution action taken (e.g. Updated heartbeat interval to 45s & deployed fix)..."
            className="text-xs bg-zinc-950"
            value={newStepText}
            onChange={(e) => setNewStepText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddResolutionStep();
              }
            }}
          />
          <Button size="sm" onClick={handleAddResolutionStep} className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 cursor-pointer">
            <Plus className="w-4 h-4 mr-1" />
            <span>Add Action Step</span>
          </Button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <Button
            size="sm"
            onClick={() => handleSaveResolution(problem.status)}
            disabled={savingSteps}
            variant="outline"
            className="text-xs cursor-pointer"
          >
            {savingSteps ? 'Saving...' : 'Save Resolution Log'}
          </Button>

          {problem.status !== 'RESOLVED' && (
            <Button
              size="sm"
              onClick={() => handleSaveResolution('RESOLVED')}
              disabled={savingSteps}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Mark Problem as RESOLVED & Sign-off</span>
            </Button>
          )}
        </div>
      </Card>

      {/* SOLUTIONS MATRIX & COMPARISON */}
      <Card className="p-6 space-y-5 bg-zinc-950/90 border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Side-by-Side Solution Candidate Matrix</span>
            </h2>
            <p className="text-xs text-zinc-400">Propose multiple solutions and select the optimal approach based on trade-offs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solutions.map((sol) => {
            const isSelected = sol.status === 'SELECTED';
            return (
              <div
                key={sol.id}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isSelected
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{sol.solId}</span>
                  <Badge variant={isSelected ? 'success' : 'outline'}>
                    {isSelected ? 'SELECTED SOLUTION' : 'PROPOSED'}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-white">{sol.title}</h3>
                <p className="text-xs text-zinc-300">{sol.approach}</p>

                {!isSelected && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectSolution(sol.id)}
                    className="w-full text-xs border-indigo-500/40 text-indigo-300 hover:text-white cursor-pointer"
                  >
                    Select This Solution →
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Solution Form */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="text-xs font-bold text-white">Propose New Solution Candidate</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Solution Title..."
              value={newSolTitle}
              onChange={(e) => setNewSolTitle(e.target.value)}
              className="text-xs bg-zinc-950"
            />
            <Input
              placeholder="Approach & Trade-offs..."
              value={newSolApproach}
              onChange={(e) => setNewSolApproach(e.target.value)}
              className="text-xs bg-zinc-950"
            />
          </div>
          <Button size="sm" onClick={handleCreateSolution} className="text-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Solution Candidate</span>
          </Button>
        </div>
      </Card>

      {/* REPORT PREVIEW & DOWNLOAD MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Pjsofonic ERP — Systemic Problem Resolution Report</h2>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-1 text-zinc-400 hover:text-white rounded cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Report Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto font-sans text-xs text-zinc-300">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-start">
                <div>
                  <div className="text-xs font-mono font-bold text-rose-400">{problem.probId}</div>
                  <h1 className="text-lg font-bold text-white mt-0.5">{problem.title}</h1>
                  <div className="text-[11px] text-zinc-400 mt-1">Project: {problem.project?.name || 'N/A'}</div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={problem.status === 'RESOLVED' ? 'success' : 'danger'}>{problem.status}</Badge>
                  <div className="text-[10px] text-zinc-500 font-mono">Scope: {problem.environmentScope || 'Backend'}</div>
                </div>
              </div>

              {/* 1. Symptoms */}
              <div className="space-y-1">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">1. Symptoms & Initial Context</h3>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 leading-relaxed">
                  {problem.symptoms || problem.description}
                </div>
              </div>

              {/* 2. 5-Whys */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">2. 5-Whys Root Cause Traversal</h3>
                <div className="space-y-1.5">
                  {fiveWhys.map(w => (
                    <div key={w.whyNumber} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px]">
                      <span className="font-bold text-indigo-300 font-mono">Why #{w.whyNumber}: </span>
                      <span className="text-zinc-300">{w.question}</span>
                      <div className="text-zinc-400 mt-0.5 pl-4 border-l border-zinc-800">Answer: {w.answer || 'N/A'}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                  <span className="font-bold text-indigo-400">Confirmed Root Cause: </span>
                  {confirmedRootCause || 'N/A'}
                </div>
              </div>

              {/* 3. Solution */}
              <div className="space-y-1">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">3. Selected Solution</h3>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  {selectedSolution ? (
                    <div>
                      <div className="font-bold text-white">{selectedSolution.title}</div>
                      <div className="text-zinc-400 mt-1">{selectedSolution.approach}</div>
                    </div>
                  ) : (
                    <div className="text-zinc-500">No solution selected yet.</div>
                  )}
                </div>
              </div>

              {/* 4. Actions Taken */}
              <div className="space-y-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">4. Resolution Actions Taken ("Kya Kya Kra")</h3>
                {resolutionSteps.length === 0 ? (
                  <div className="text-zinc-500">No resolution action steps logged.</div>
                ) : (
                  <div className="space-y-1">
                    {resolutionSteps.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start space-x-2">
                        <span className="font-mono font-bold text-emerald-400">{idx + 1}.</span>
                        <span className="text-zinc-200">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Controls */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <Button variant="outline" onClick={() => setShowReportModal(false)}>
                Close
              </Button>
              <div className="flex space-x-2">
                <Button onClick={() => window.print()} variant="outline" className="flex items-center space-x-1">
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </Button>
                <Button onClick={handleDownloadExcelReport} className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Download Excel Report (.xlsx)</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
