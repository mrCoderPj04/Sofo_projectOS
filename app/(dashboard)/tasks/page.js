'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Columns3,
  ListFilter,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban'); // 'kanban', 'list', 'calendar'
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('HIGH');
  const [newTaskStatus, setNewTaskStatus] = useState('TODO');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    // Default project id from tasks if existing
    const defaultProjId = tasks[0]?.projectId || 'sample-proj';
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        status: newTaskStatus,
        projectId: defaultProjId
      })
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowNewTaskModal(false);
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  };

  const columns = [
    { id: 'BACKLOG', label: 'Backlog', color: 'border-zinc-700' },
    { id: 'TODO', label: 'To Do', color: 'border-indigo-500' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-amber-500' },
    { id: 'REVIEW', label: 'In Review', color: 'border-purple-500' },
    { id: 'TESTING', label: 'Testing', color: 'border-cyan-500' },
    { id: 'DONE', label: 'Completed', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Task Management OS</span>
          </h1>
          <p className="text-xs text-zinc-400">Connected to Projects, Requirements, Problems, and Solutions.</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Switcher */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl space-x-1">
            <button
              onClick={() => setView('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
                view === 'kanban' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
                view === 'list' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-all ${
                view === 'calendar' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button size="sm" onClick={() => setShowNewTaskModal(true)} className="flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* New Task Inline Modal */}
      {showNewTaskModal && (
        <Card className="p-4 bg-zinc-950 border-indigo-500/40 space-y-3">
          <div className="text-xs font-bold text-white">Create New Task</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Task Title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="text-xs"
            />
            <Input
              placeholder="Description..."
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="text-xs"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button size="sm" variant="ghost" onClick={() => setShowNewTaskModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateTask}>Save Task</Button>
          </div>
        </Card>
      )}

      {/* View 1: KANBAN BOARD */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 flex flex-col min-h-[500px]">
                <div className={`border-b-2 ${col.color} pb-2 mb-3 flex items-center justify-between`}>
                  <span className="text-xs font-bold text-zinc-200">{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/40 space-y-2 text-xs transition-all shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-400 text-[11px]">{t.taskId}</span>
                        <Badge variant={t.priority === 'CRITICAL' ? 'danger' : 'default'}>{t.priority}</Badge>
                      </div>
                      <div className="font-semibold text-white leading-snug">{t.title}</div>
                      {t.problem && (
                        <div className="text-[10px] text-rose-400 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="truncate">{t.problem.probId}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>{t.dueDate || 'No due date'}</span>
                        <select
                          className="bg-zinc-950 text-zinc-300 text-[10px] rounded px-1 border border-zinc-800"
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        >
                          {columns.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: LIST VIEW */}
      {view === 'list' && (
        <Card className="p-4 space-y-2">
          <div className="divide-y divide-zinc-800/60">
            {tasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-emerald-400">{t.taskId}</span>
                  <span className="font-semibold text-white">{t.title}</span>
                  {t.problem && <Badge variant="danger">{t.problem.probId}</Badge>}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{t.status}</Badge>
                  <select
                    className="bg-zinc-950 text-zinc-300 text-xs rounded px-2 py-1 border border-zinc-800"
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* View 3: CALENDAR VIEW */}
      {view === 'calendar' && (
        <Card className="p-6 text-center space-y-4">
          <CalendarIcon className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Task Calendar Timeline View</h3>
          <p className="text-xs text-zinc-400">Tasks plotted by targeted due dates.</p>
          <div className="grid grid-cols-7 gap-2 pt-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-bold text-zinc-400">{day}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
