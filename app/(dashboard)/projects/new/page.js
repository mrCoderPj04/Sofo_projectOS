'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Target,
  FileCheck2,
  Users,
  Code2,
  Trophy,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  FileCode,
  Footprints,
  Presentation,
  Image as ImageIcon,
  Upload,
  Link2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Software Development',
    priority: 'HIGH',
    status: 'ACTIVE',
    startDate: '2026-08-10',
    targetDate: '2026-10-30',
    goals: ['Sub-100ms real-time sync latency', '99.99% transfer completion rate'],
    requirements: [
      { title: 'QR Code Device Pairing', type: 'FUNCTIONAL', priority: 'HIGH' },
      { title: 'Real-Time WebSocket Protocol', type: 'TECHNICAL', priority: 'CRITICAL' }
    ],
    techStack: ['Next.js 15', 'Node.js', 'PostgreSQL', 'WebSockets', 'Prisma ORM'],
    successCriteria: ['Zero data corruption during binary transfers up to 2GB', '3-second device pairing time'],
    importantDocs: {
      implementationPlan: { title: 'Implementation Plan Document', url: '', fileName: '', kind: 'LINK' },
      walkthrough: { title: 'Walkthrough & Demo Document', url: '', fileName: '', kind: 'LINK' },
      logo: { title: 'Project Logo Asset', url: '', fileName: '', kind: 'LINK' },
      ppt: { title: 'Presentation & Pitch Deck (PPT)', url: '', fileName: '', kind: 'LINK' }
    },
    newGoal: '',
    newTech: '',
    newCriteria: '',
    newReqTitle: ''
  });

  const handleDocChange = (docType, field, value) => {
    setFormData(prev => ({
      ...prev,
      importantDocs: {
        ...prev.importantDocs,
        [docType]: {
          ...prev.importantDocs[docType],
          [field]: value
        }
      }
    }));
  };

  const handleDocFileUpload = (docType, file) => {
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      importantDocs: {
        ...prev.importantDocs,
        [docType]: {
          ...prev.importantDocs[docType],
          fileName: file.name,
          url: URL.createObjectURL(file) || `file://${file.name}`,
          kind: 'FILE'
        }
      }
    }));
  };

  const handleAddGoal = () => {
    if (!formData.newGoal.trim()) return;
    setFormData({
      ...formData,
      goals: [...formData.goals, formData.newGoal.trim()],
      newGoal: ''
    });
  };

  const handleAddTech = () => {
    if (!formData.newTech.trim()) return;
    setFormData({
      ...formData,
      techStack: [...formData.techStack, formData.newTech.trim()],
      newTech: ''
    });
  };

  const handleAddCriteria = () => {
    if (!formData.newCriteria.trim()) return;
    setFormData({
      ...formData,
      successCriteria: [...formData.successCriteria, formData.newCriteria.trim()],
      newCriteria: ''
    });
  };

  const handleAddReq = () => {
    if (!formData.newReqTitle.trim()) return;
    setFormData({
      ...formData,
      requirements: [...formData.requirements, { title: formData.newReqTitle.trim(), type: 'FUNCTIONAL', priority: 'HIGH' }],
      newReqTitle: ''
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          priority: formData.priority,
          status: formData.status,
          startDate: formData.startDate,
          targetDate: formData.targetDate,
          goals: formData.goals,
          techStack: formData.techStack,
          successCriteria: formData.successCriteria,
          requirements: formData.requirements,
          importantDocs: formData.importantDocs
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/projects/${data.project.id}`);
      } else {
        alert(data.error || 'Failed to create project');
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Error creating project');
      setLoading(false);
    }
  };

  const wizardSteps = [
    { num: 1, label: 'Basics', icon: FolderKanban },
    { num: 2, label: 'Goals', icon: Target },
    { num: 3, label: 'Requirements', icon: FileCheck2 },
    { num: 4, label: 'Team', icon: Users },
    { num: 5, label: 'Tech Stack', icon: Code2 },
    { num: 6, label: 'Required Docs', icon: FileCode },
    { num: 7, label: 'Criteria', icon: Trophy },
    { num: 8, label: 'Review', icon: CheckCircle }
  ];

  const docModules = [
    {
      type: 'implementationPlan',
      title: 'Implementation Plan File / Link',
      description: 'Upload Implementation Plan document (.md, .pdf, .docx) or paste URL link.',
      icon: FileCode,
      color: 'text-indigo-400',
      placeholderLink: 'https://docs.pjsofonic.com/implementation-plan'
    },
    {
      type: 'walkthrough',
      title: 'Walkthrough Document / Link',
      description: 'Upload Walkthrough notes/media or paste Walkthrough URL (Loom, YouTube, Docs).',
      icon: Footprints,
      color: 'text-emerald-400',
      placeholderLink: 'https://loom.com/share/walkthrough-demo'
    },
    {
      type: 'logo',
      title: 'Project Logo Image / Link',
      description: 'Upload Project Logo (.png, .svg, .jpg) or paste Logo Image URL link.',
      icon: ImageIcon,
      color: 'text-cyan-400',
      placeholderLink: 'https://assets.pjsofonic.com/logo.png'
    },
    {
      type: 'ppt',
      title: 'Presentation & Pitch Deck (PPT)',
      description: 'Upload presentation file (.pptx, .pdf) or paste Google Slides / Canva deck link.',
      icon: Presentation,
      color: 'text-amber-400',
      placeholderLink: 'https://canva.com/design/presentation-ppt'
    }
  ];

  const validateStep = (currentStep) => {
    if (currentStep === 1 && !formData.name.trim()) {
      alert('Project Name is required!');
      return false;
    }

    if (currentStep === 6) {
      const { implementationPlan, walkthrough, logo, ppt } = formData.importantDocs;
      if (!implementationPlan.url.trim() && !implementationPlan.fileName) {
        alert('Implementation Plan File or Link is required!');
        return false;
      }
      if (!walkthrough.url.trim() && !walkthrough.fileName) {
        alert('Walkthrough File or Link is required!');
        return false;
      }
      if (!logo.url.trim() && !logo.fileName) {
        alert('Project Logo Image File or Link is required!');
        return false;
      }
      if (!ppt.url.trim() && !ppt.fileName) {
        alert('Presentation / PPT File or Link is required!');
        return false;
      }
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white">Create New Project Wizard</h1>
            <Badge variant="primary" className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 8</span>
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Systemic problem-solving framework with mandatory deliverables & document uploads.
          </p>
        </div>
      </div>

      {/* Wizard Step Stepper Progress Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {wizardSteps.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;

          return (
            <button
              key={s.num}
              onClick={() => {
                if (validateStep(step)) setStep(s.num);
              }}
              className={`p-2 rounded-xl text-center flex flex-col items-center justify-center space-y-1 transition-all border cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                  : isDone
                  ? 'bg-zinc-900 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 1: Basic Information</h2>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Project Name *</label>
              <Input
                placeholder="e.g. SOFO Sync"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                placeholder="Core objective of the project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Project Type</label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Priority</label>
                <select
                  className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Completion Date</label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 2: Project Goals</h2>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter a strategic goal..."
                value={formData.newGoal}
                onChange={(e) => setFormData({ ...formData, newGoal: e.target.value })}
              />
              <Button onClick={handleAddGoal} size="sm">Add Goal</Button>
            </div>
            <div className="space-y-2 mt-4">
              {formData.goals.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200">
                  <span>🎯 {g}</span>
                  <button
                    onClick={() => setFormData({ ...formData, goals: formData.goals.filter((_, idx) => idx !== i) })}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 3: Initial Requirements</h2>
            <div className="flex space-x-2">
              <Input
                placeholder="Requirement title..."
                value={formData.newReqTitle}
                onChange={(e) => setFormData({ ...formData, newReqTitle: e.target.value })}
              />
              <Button onClick={handleAddReq} size="sm">Add Req</Button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200">
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">{r.type}</Badge>
                    <span className="font-medium">{r.title}</span>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, requirements: formData.requirements.filter((_, idx) => idx !== i) })}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 4: Team Assignment</h2>
            <p className="text-xs text-zinc-400">Default project owner will be set to current logged in user. You can add additional collaborators once created.</p>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
              <div className="font-semibold text-white">Default Workspace Team:</div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Rajkamal (Lead Architect / Owner)</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Alex Dev (Fullstack Developer)</span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 5: Technology Stack</h2>
            <div className="flex space-x-2">
              <Input
                placeholder="Technology tag (e.g. Next.js, WebSockets)..."
                value={formData.newTech}
                onChange={(e) => setFormData({ ...formData, newTech: e.target.value })}
              />
              <Button onClick={handleAddTech} size="sm">Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.techStack.map((t, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1 flex items-center space-x-1">
                  <span>{t}</span>
                  <button
                    onClick={() => setFormData({ ...formData, techStack: formData.techStack.filter((_, idx) => idx !== i) })}
                    className="ml-1 text-zinc-400 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Mandatory Step 6: Important Docs Module */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>Step 6: Important Required Docs & Deliverables Module</span>
                </h2>
                <p className="text-xs text-zinc-400">All 4 files/links are required before finalizing project creation.</p>
              </div>
              <Badge variant="danger" className="text-[10px]">4 / 4 Required</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docModules.map((doc) => {
                const Icon = doc.icon;
                const docState = formData.importantDocs[doc.type];
                const isProvided = Boolean(docState.fileName || docState.url.trim());

                return (
                  <div
                    key={doc.type}
                    className={`p-4 rounded-xl border space-y-3 transition-all ${
                      isProvided
                        ? 'bg-zinc-900/90 border-emerald-500/40'
                        : 'bg-zinc-950/80 border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${doc.color}`} />
                        <span className="text-xs font-bold text-white">{doc.title}</span>
                      </div>
                      <Badge variant={isProvided ? 'success' : 'danger'} className="text-[9px]">
                        {isProvided ? 'Provided ✓' : '* Required'}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-snug">{doc.description}</p>

                    <div className="space-y-2">
                      {/* Upload File Input */}
                      <div>
                        <input
                          type="file"
                          id={`wizard-file-${doc.type}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDocFileUpload(doc.type, file);
                          }}
                        />
                        <label
                          htmlFor={`wizard-file-${doc.type}`}
                          className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-xs text-zinc-300 cursor-pointer truncate"
                        >
                          <Upload className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{docState.fileName || 'Choose File...' }</span>
                        </label>
                      </div>

                      {/* Or Paste Link Input */}
                      <div className="relative">
                        <Input
                          placeholder={doc.placeholderLink}
                          className="text-xs h-8 bg-zinc-950 font-mono"
                          value={docState.url}
                          onChange={(e) => handleDocChange(doc.type, 'url', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Logo Preview if Logo Provided */}
                    {doc.type === 'logo' && docState.url.startsWith('http') && (
                      <div className="pt-2 flex items-center space-x-2">
                        <img src={docState.url} alt="Logo Preview" className="w-10 h-10 rounded border border-zinc-700 object-cover" />
                        <span className="text-[10px] text-zinc-400">Live Logo Preview</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 7: Success Criteria</h2>
            <div className="flex space-x-2">
              <Input
                placeholder="Measurable metric..."
                value={formData.newCriteria}
                onChange={(e) => setFormData({ ...formData, newCriteria: e.target.value })}
              />
              <Button onClick={handleAddCriteria} size="sm">Add Criteria</Button>
            </div>
            <div className="space-y-2 mt-4">
              {formData.successCriteria.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200">
                  <span>🏆 {c}</span>
                  <button
                    onClick={() => setFormData({ ...formData, successCriteria: formData.successCriteria.filter((_, idx) => idx !== i) })}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Step 8: Final Review & Confirmation</h2>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div><span className="font-bold text-indigo-400">Name:</span> {formData.name || 'Untitled Project'}</div>
              <div><span className="font-bold text-indigo-400">Priority:</span> {formData.priority}</div>
              <div><span className="font-bold text-indigo-400">Timeline:</span> {formData.startDate} → {formData.targetDate}</div>
              <div><span className="font-bold text-indigo-400">Goals:</span> {formData.goals.length} goals added</div>
              <div><span className="font-bold text-indigo-400">Tech Stack:</span> {formData.techStack.join(', ')}</div>
              
              <div className="pt-2 border-t border-zinc-800">
                <div className="font-bold text-emerald-400 mb-1">Required Deliverables Included:</div>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  <li>Implementation Plan: {formData.importantDocs.implementationPlan.fileName || formData.importantDocs.implementationPlan.url}</li>
                  <li>Walkthrough: {formData.importantDocs.walkthrough.fileName || formData.importantDocs.walkthrough.url}</li>
                  <li>Project Logo: {formData.importantDocs.logo.fileName || formData.importantDocs.logo.url}</li>
                  <li>Presentation (PPT): {formData.importantDocs.ppt.fileName || formData.importantDocs.ppt.url}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-800 mt-6">
          <Button
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {step < 8 ? (
            <Button
              onClick={() => {
                if (validateStep(step)) setStep(step + 1);
              }}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1 cursor-pointer"
            >
              <span>{loading ? 'Creating Project...' : '🚀 Finalize & Create Project'}</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
