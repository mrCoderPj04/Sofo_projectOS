'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  AlertTriangle,
  CheckSquare,
  Lightbulb,
  Calendar,
  FolderClosed,
  BookOpen,
  Users,
  BarChart3,
  Activity,
  Settings,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Layers,
  FileCode,
  PlayCircle
} from 'lucide-react';
import { ProjectArtifactsSection } from '@/components/projects/ProjectArtifactsSection';
import { InProcessWorkingStatusSection } from '@/components/projects/InProcessWorkingStatusSection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProjectWorkspacePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states for adding items inline
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (data.project) {
        setProject(data.project);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateProblem = async () => {
    if (!newProbTitle.trim()) return;
    await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: id,
        title: newProbTitle,
        severity: 'HIGH',
        priority: 'HIGH'
      })
    });
    setNewProbTitle('');
    fetchProject();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProject((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-500 text-sm">Loading project workspace...</div>;
  }

  if (!project) {
    return <div className="py-20 text-center text-rose-400 text-sm">Project not found.</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'in-process', label: 'In-Process Working Status', icon: PlayCircle },
    { id: 'artifacts', label: 'Artifacts & Deliverables', icon: FileCode },
    { id: 'requirements', label: 'Requirements', icon: FileCheck2, count: project.requirements?.length },
    { id: 'problems', label: 'Problems', icon: AlertTriangle, count: project.problems?.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: project.tasks?.length },
    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'files', label: 'Files', icon: FolderClosed, count: project.files?.length },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, count: project.knowledge?.length },
    { id: 'team', label: 'Team', icon: Users, count: project.members?.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Project Header Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700/80 p-1 flex items-center justify-center shrink-0 shadow-lg">
              <img
                src={project.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(project.name)}`}
                alt="Project Logo"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(project.name)}`;
                }}
              />
            </div>
            <h1 className="text-2xl font-black text-white">{project.name}</h1>
            <div className="flex items-center space-x-1.5 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Status:</span>
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-6 text-xs font-bold font-mono rounded bg-zinc-900 px-2 text-indigo-300 border border-indigo-500/40 focus:outline-none cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="IN_PROCESS">IN PROCESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <Badge
              variant={
                project.health?.status === 'GREEN'
                  ? 'success'
                  : project.health?.status === 'YELLOW'
                  ? 'warning'
                  : 'danger'
              }
            >
              {project.health?.badgeLabel || 'Healthy'} ({project.health?.score}%)
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">{project.description}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/problem-map?projectId=${id}`}>
            <Button variant="secondary" className="flex items-center space-x-2 text-xs">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Project Problem Map</span>
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="default" className="flex items-center space-x-2 text-xs bg-purple-600 hover:bg-purple-500">
              <Sparkles className="w-4 h-4" />
              <span>SOFO AI Assist</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Workspace Tabs Header */}
      <div className="flex items-center space-x-1 border-b border-zinc-800/80 overflow-x-auto pb-0.5 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-t-lg'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: In-Process Working Status */}
      {activeTab === 'in-process' && (
        <InProcessWorkingStatusSection project={project} />
      )}

      {/* Tab: Artifacts & Deliverables */}
      {activeTab === 'artifacts' && (
        <ProjectArtifactsSection projectId={id} />
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <InProcessWorkingStatusSection project={project} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
            {/* Health Explanation Banner */}
            <Card className="p-4 bg-zinc-900/80 border-indigo-500/20">
              <div className="text-xs space-y-1">
                <div className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Project Health Score: {project.health?.score}%</span>
                </div>
                <p className="text-zinc-300">{project.health?.explanation}</p>
              </div>
            </Card>

            {/* Core Problems Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Project Problems & 5-Whys Pipeline</span>
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Log new problem..."
                    className="h-8 text-xs w-48"
                    value={newProbTitle}
                    onChange={(e) => setNewProbTitle(e.target.value)}
                  />
                  <Button size="sm" className="h-8 text-xs" onClick={handleCreateProblem}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.problems?.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">No problems logged for this project yet.</div>
                ) : (
                  project.problems?.map((prob) => (
                    <div key={prob.id} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-rose-400">{prob.probId}</span>
                          <Badge variant="danger">{prob.severity}</Badge>
                          <Badge variant="outline">{prob.status.replace(/_/g, ' ')}</Badge>
                        </div>
                        <div className="text-xs font-semibold text-white">{prob.title}</div>
                      </div>
                      <Link href={`/problems/${prob.id}`}>
                        <Button size="sm" variant="secondary" className="text-xs flex items-center space-x-1">
                          <span>5-Whys Analysis</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Requirements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center space-x-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-400" />
                  <span>Requirements Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.requirements?.map((req) => (
                  <div key={req.id} className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-indigo-400 mr-2">{req.reqId}</span>
                      <span className="text-zinc-200 font-medium">{req.title}</span>
                    </div>
                    <Badge variant="primary">{req.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column Metadata */}
          <div className="space-y-6">
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-zinc-400">Project Metadata</h3>
              <div className="text-xs space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Type:</span>
                  <span className="font-medium text-white">{project.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Priority:</span>
                  <span className="font-medium text-amber-400">{project.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Start Date:</span>
                  <span>{project.startDate || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Date:</span>
                  <span>{project.targetDate || 'N/A'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-zinc-400">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {JSON.parse(project.techStack || '[]').map((tech, idx) => (
                  <Badge key={idx} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )}

      {/* Tab 2: Requirements */}
      {activeTab === 'requirements' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Project Requirements & Coverage Matrix</h2>
            <Link href="/requirements">
              <Button size="sm" variant="default">Manage Requirements →</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {project.requirements?.map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-indigo-400">{req.reqId}</span>
                    <span className="font-bold text-white text-sm">{req.title}</span>
                    <Badge variant="primary">{req.type}</Badge>
                  </div>
                  <Badge variant="outline">{req.status}</Badge>
                </div>
                <p className="text-zinc-400">{req.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Problems */}
      {activeTab === 'problems' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Systemic Problem Register</h2>
            <Link href="/problems">
              <Button size="sm">Log New Problem</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {project.problems?.map((prob) => (
              <div key={prob.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-rose-400">{prob.probId}</span>
                    <span className="font-bold text-white">{prob.title}</span>
                  </div>
                  <Link href={`/problems/${prob.id}`}>
                    <Button size="sm" variant="secondary" className="text-xs">
                      Open 5-Whys Workspace →
                    </Button>
                  </Link>
                </div>
                <p className="text-zinc-400">{prob.symptoms}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Tasks */}
      {activeTab === 'tasks' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Tasks Connected to Solutions</h2>
            <Link href="/tasks">
              <Button size="sm">Open Kanban & Calendar Board →</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {project.tasks?.map((t) => (
              <div key={t.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400 mr-2">{t.taskId}</span>
                  <span className="text-white font-medium">{t.title}</span>
                </div>
                <Badge variant="outline">{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Solutions */}
      {activeTab === 'solutions' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Evaluated Solutions & Comparison Matrix</h2>
          <div className="space-y-3">
            {project.problems?.map((prob) => (
              <div key={prob.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-bold text-indigo-400">{prob.probId}: {prob.title}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {prob.solutions?.map((sol) => (
                    <div key={sol.id} className={`p-3 rounded-lg border ${sol.status === 'SELECTED' ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                      <div className="flex justify-between font-bold text-white mb-1">
                        <span>{sol.title}</span>
                        <Badge variant={sol.status === 'SELECTED' ? 'success' : 'default'}>{sol.status}</Badge>
                      </div>
                      <div className="text-zinc-400 text-[11px]">{sol.approach}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 6: Timeline */}
      {activeTab === 'timeline' && (
        <Card className="p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-white">Project Timeline & Milestones</h2>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
            Start Date: <span className="font-bold text-white">{project.startDate}</span> → Target Completion: <span className="font-bold text-white">{project.targetDate}</span>
          </div>
        </Card>
      )}

      {/* Tab 7: Files */}
      {activeTab === 'files' && (
        <Card className="p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Project Storage & Linked Artifacts</h2>
          <Link href="/files">
            <Button size="sm">Open File Explorer →</Button>
          </Link>
        </Card>
      )}

      {/* Tab 8: Knowledge */}
      {activeTab === 'knowledge' && (
        <Card className="p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Knowledge Base & Architectural Notes</h2>
          <Link href="/knowledge">
            <Button size="sm">Open Knowledge Base →</Button>
          </Link>
        </Card>
      )}

      {/* Tab 9: Team */}
      {activeTab === 'team' && (
        <Card className="p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Project Team & RBAC Roles</h2>
          <div className="space-y-2">
            {project.members?.map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={m.user.avatarUrl} className="w-7 h-7 rounded-full" alt="User" />
                  <span className="font-bold text-white">{m.user.name}</span>
                </div>
                <Badge variant="primary">{m.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 10: Analytics */}
      {activeTab === 'analytics' && (
        <Card className="p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Project Quality & Resolution Metrics</h2>
          <Link href="/analytics">
            <Button size="sm">Full Analytics Dashboard →</Button>
          </Link>
        </Card>
      )}

      {/* Tab 11: Activity */}
      {activeTab === 'activity' && (
        <Card className="p-6 space-y-3 text-xs">
          <h2 className="text-sm font-bold text-white">Activity Log</h2>
          {project.activities?.map((act) => (
            <div key={act.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-white">{act.userName}</span> {act.action}: {act.details}
            </div>
          ))}
        </Card>
      )}

      {/* Tab 12: Settings */}
      {activeTab === 'settings' && (
        <Card className="p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">Project Settings</h2>
          <Button variant="danger" size="sm">Archive Project</Button>
        </Card>
      )}
    </div>
  );
}
