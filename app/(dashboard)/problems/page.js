'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  Server,
  Code2,
  Layout,
  Laptop,
  X,
  Sparkles,
  FileCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { downloadProblemsAsExcel } from '@/lib/excel-export';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    symptoms: '',
    environmentScope: 'Backend', // Terminal, Server, Backend, Frontend, Localhost
    severity: 'HIGH',
    priority: 'HIGH',
    projectId: ''
  });

  const fetchData = async () => {
    try {
      const [probRes, projRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/projects')
      ]);
      const probData = await probRes.json();
      const projData = await projRes.json();

      setProblems(probData.problems || []);
      setProjects(projData.projects || []);
      if (projData.projects?.length > 0) {
        setForm(prev => ({ ...prev, projectId: projData.projects[0].id }));
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) {
      alert('Please enter a problem title and select a project.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setForm({
          title: '',
          description: '',
          symptoms: '',
          environmentScope: 'Backend',
          severity: 'HIGH',
          priority: 'HIGH',
          projectId: projects[0]?.id || ''
        });
        fetchData();
      } else {
        alert(data.error || 'Failed to log problem');
      }
    } catch (err) {
      alert('Error creating problem');
    }
    setSubmitting(false);
  };

  const getEnvBadge = (scope) => {
    switch (scope) {
      case 'Terminal':
        return <Badge variant="outline" className="flex items-center space-x-1 border-purple-500/40 text-purple-300"><Terminal className="w-3 h-3" /><span>Terminal</span></Badge>;
      case 'Server':
        return <Badge variant="outline" className="flex items-center space-x-1 border-amber-500/40 text-amber-300"><Server className="w-3 h-3" /><span>Server</span></Badge>;
      case 'Backend':
        return <Badge variant="outline" className="flex items-center space-x-1 border-indigo-500/40 text-indigo-300"><Code2 className="w-3 h-3" /><span>Backend</span></Badge>;
      case 'Frontend':
        return <Badge variant="outline" className="flex items-center space-x-1 border-cyan-500/40 text-cyan-300"><Layout className="w-3 h-3" /><span>Frontend</span></Badge>;
      case 'Localhost':
        return <Badge variant="outline" className="flex items-center space-x-1 border-emerald-500/40 text-emerald-300"><Laptop className="w-3 h-3" /><span>Localhost</span></Badge>;
      default:
        return <Badge variant="outline">{scope || 'Backend'}</Badge>;
    }
  };

  const handleDownloadAllReports = () => {
    if (problems.length === 0) {
      alert('No problems logged in system to export.');
      return;
    }
    downloadProblemsAsExcel(problems, 'Pjsofonic-All-Systemic-Problem-Reports.csv');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span>Problem Resolution OS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Systemic Problem Logging, 5-Whys Root Cause Analysis, Solution Action Logs & Excel Spreadsheet Export.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleDownloadAllReports}
            disabled={problems.length === 0}
            variant="outline"
            className="flex items-center space-x-1.5 border-emerald-500/40 text-emerald-300 hover:text-white cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download All Reports (Excel)</span>
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Log New Problem</span>
          </Button>
        </div>
      </div>

      {/* Problem Cards List or Empty State */}
      <div className="space-y-3">
        {problems.length === 0 ? (
          <Card className="p-12 text-center text-zinc-500 text-xs border-dashed border-zinc-800 space-y-3">
            <AlertTriangle className="w-10 h-10 text-zinc-600 mx-auto" />
            <div>No problems currently logged in Pjsofonic ProjectOS.</div>
            <Button size="sm" onClick={() => setShowModal(true)} className="text-xs">
              <Plus className="w-4 h-4 mr-1" />
              <span>Log Problem Now</span>
            </Button>
          </Card>
        ) : (
          problems.map((prob) => (
            <Card key={prob.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/80 hover:border-zinc-700 transition-all">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400">{prob.probId}</span>
                  <Badge variant={prob.severity === 'CRITICAL' ? 'danger' : 'warning'}>{prob.severity} Severity</Badge>
                  {getEnvBadge(prob.environmentScope)}
                  <Badge variant={prob.status === 'RESOLVED' ? 'success' : 'outline'}>{prob.status.replace(/_/g, ' ')}</Badge>
                </div>
                <h3 className="text-base font-bold text-white">{prob.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">{prob.symptoms || prob.description}</p>
                {prob.project && (
                  <div className="text-[11px] text-zinc-500 font-medium">Project: {prob.project.name}</div>
                )}
              </div>
              <Link href={`/problems/${prob.id}`}>
                <Button size="sm" variant="default" className="text-xs flex items-center space-x-1 shrink-0 cursor-pointer">
                  <span>Open Resolution Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          ))
        )}
      </div>

      {/* Log New Problem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">Log Systemic Problem</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-zinc-400 hover:text-white rounded cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Target Project *</label>
                <select
                  className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100"
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Target Project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Problem Title *</label>
                <Input
                  placeholder="e.g. WebSocket Connection Timeout under Load"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="text-xs bg-zinc-950"
                />
              </div>

              {/* Environment Scope Selector */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">Environment / Source Scope *</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'Terminal', label: 'Terminal', icon: Terminal },
                    { id: 'Server', label: 'Server', icon: Server },
                    { id: 'Backend', label: 'Backend', icon: Code2 },
                    { id: 'Frontend', label: 'Frontend', icon: Layout },
                    { id: 'Localhost', label: 'Localhost', icon: Laptop }
                  ].map(item => {
                    const ScopeIcon = item.icon;
                    const isSelected = form.environmentScope === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setForm({ ...form, environmentScope: item.id })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <ScopeIcon className="w-4 h-4" />
                        <span className="text-[10px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">Observed Symptoms & Context</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Describe failure logs, stack trace, or terminal error output..."
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Severity</label>
                  <select
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100"
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Priority</label>
                  <select
                    className="w-full h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-100"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-rose-600 hover:bg-rose-500 text-white">
                  {submitting ? 'Logging...' : 'Submit Problem'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
