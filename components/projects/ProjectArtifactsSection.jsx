'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Link2,
  Presentation,
  Image as ImageIcon,
  Footprints,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FileCode,
  Sparkles,
  Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProjectArtifactsSection({ projectId }) {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCategory, setUploadingCategory] = useState(null);

  // Form states per section
  const [inputs, setInputs] = useState({
    IMPLEMENTATION_PLAN: { title: '', linkUrl: '', file: null },
    WALKTHROUGH: { title: '', linkUrl: '', file: null },
    PRESENTATION_PPT: { title: '', linkUrl: '', file: null },
    PROJECT_LOGO: { title: '', linkUrl: '', file: null }
  });

  const fetchArtifacts = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/artifacts`);
      const data = await res.json();
      setArtifacts(data.artifacts || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchArtifacts();
  }, [projectId]);

  const handleInputChange = (category, field, value) => {
    setInputs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  // Upload physical file
  const handleFileUpload = async (category) => {
    const sectionInput = inputs[category];
    if (!sectionInput.file) {
      alert('Please select a file to upload');
      return;
    }

    setUploadingCategory(category);
    const formData = new FormData();
    formData.append('file', sectionInput.file);
    formData.append('category', category);
    formData.append('title', sectionInput.title || sectionInput.file.name);

    try {
      const res = await fetch(`/api/projects/${projectId}/artifacts`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleInputChange(category, 'file', null);
        handleInputChange(category, 'title', '');
        fetchArtifacts();
      } else {
        alert(data.error || 'Failed to upload file');
      }
    } catch (e) {
      alert('Upload error');
    }
    setUploadingCategory(null);
  };

  // Save pasted link URL
  const handleLinkSave = async (category) => {
    const sectionInput = inputs[category];
    if (!sectionInput.linkUrl.trim()) {
      alert('Please paste a valid web URL link');
      return;
    }

    setUploadingCategory(category);
    try {
      const res = await fetch(`/api/projects/${projectId}/artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title: sectionInput.title.trim() || `${category.replace(/_/g, ' ')} Link`,
          url: sectionInput.linkUrl.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        handleInputChange(category, 'linkUrl', '');
        handleInputChange(category, 'title', '');
        fetchArtifacts();
      } else {
        alert(data.error || 'Failed to save link');
      }
    } catch (e) {
      alert('Save link error');
    }
    setUploadingCategory(null);
  };

  const handleDelete = async (artifactId) => {
    if (!confirm('Are you sure you want to remove this artifact?')) return;
    await fetch(`/api/projects/${projectId}/artifacts?artifactId=${artifactId}`, {
      method: 'DELETE'
    });
    fetchArtifacts();
  };

  const sections = [
    {
      category: 'IMPLEMENTATION_PLAN',
      title: 'Implementation Plan',
      description: 'Upload Implementation Plan (.md, .pdf, .docx) or paste Implementation Plan URL link.',
      icon: FileCode,
      color: 'text-indigo-400',
      badgeColor: 'primary'
    },
    {
      category: 'WALKTHROUGH',
      title: 'Walkthrough & Demo',
      description: 'Upload Walkthrough documentation/media or paste Walkthrough URL (Loom, YouTube, Docs).',
      icon: Footprints,
      color: 'text-emerald-400',
      badgeColor: 'success'
    },
    {
      category: 'PRESENTATION_PPT',
      title: 'Presentation & Pitch Deck (PPT)',
      description: 'Upload presentation files (.pptx, .pdf) or paste Google Slides / Canva deck link.',
      icon: Presentation,
      color: 'text-amber-400',
      badgeColor: 'warning'
    },
    {
      category: 'PROJECT_LOGO',
      title: 'Project Logo & Branding Assets',
      description: 'Upload Project Logo (.png, .svg, .jpg) or paste Logo Image URL link.',
      icon: ImageIcon,
      color: 'text-cyan-400',
      badgeColor: 'secondary'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Project Artifacts, Files & Links Repository</span>
          </h2>
          <p className="text-xs text-zinc-400">Dedicated upload & link pasting sections for Implementation Plan, Walkthrough, PPT, and Logo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const sectionArtifacts = artifacts.filter(a => a.category === sec.category);
          const currentInput = inputs[sec.category];
          const isUploading = uploadingCategory === sec.category;

          return (
            <Card key={sec.category} className="p-5 space-y-4 bg-zinc-950/80 border-zinc-800 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${sec.color}`} />
                    <h3 className="text-sm font-bold text-white">{sec.title}</h3>
                  </div>
                  <Badge variant={sec.badgeColor}>{sectionArtifacts.length} items</Badge>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{sec.description}</p>

                {/* List of uploaded/pasted items for this section */}
                <div className="space-y-2 pt-1">
                  {sectionArtifacts.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                      No {sec.title.toLowerCase()} uploaded or linked yet.
                    </div>
                  ) : (
                    sectionArtifacts.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs transition-all hover:border-zinc-700">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          {item.category === 'PROJECT_LOGO' && item.url.startsWith('http') ? (
                            <img src={item.url} alt="Logo" className="w-8 h-8 rounded object-cover border border-zinc-700 shrink-0" />
                          ) : (
                            <div className="p-2 rounded bg-zinc-800 text-zinc-300 shrink-0">
                              {item.kind === 'LINK' ? <Link2 className="w-4 h-4 text-cyan-400" /> : <Upload className="w-4 h-4 text-indigo-400" />}
                            </div>
                          )}
                          <div className="truncate">
                            <div className="font-semibold text-white truncate">{item.title}</div>
                            <div className="text-[10px] text-zinc-500 font-mono truncate">{item.kind === 'LINK' ? item.url : `File (${Math.round((item.fileSize || 0) / 1024)} KB)`}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-zinc-800 text-indigo-400 hover:text-indigo-300 transition-colors"
                            title="Open Link/File"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upload & Link Pasting Control Form */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                <Input
                  placeholder="Title / Label (optional)..."
                  className="text-xs h-8 bg-zinc-900"
                  value={currentInput.title}
                  onChange={(e) => handleInputChange(sec.category, 'title', e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* File Upload Trigger */}
                  <div className="space-y-1">
                    <input
                      type="file"
                      id={`file-${sec.category}`}
                      className="hidden"
                      onChange={(e) => handleInputChange(sec.category, 'file', e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor={`file-${sec.category}`}
                      className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-xs text-zinc-300 cursor-pointer truncate"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{currentInput.file ? currentInput.file.name : 'Choose File...'}</span>
                    </label>
                    {currentInput.file && (
                      <Button
                        size="sm"
                        onClick={() => handleFileUpload(sec.category)}
                        disabled={isUploading}
                        className="w-full text-xs h-7 bg-indigo-600 hover:bg-indigo-500"
                      >
                        {isUploading ? 'Uploading...' : 'Upload File'}
                      </Button>
                    )}
                  </div>

                  {/* Paste Link Trigger */}
                  <div className="space-y-1">
                    <Input
                      placeholder="Paste URL link..."
                      className="text-xs h-8 bg-zinc-900"
                      value={currentInput.linkUrl}
                      onChange={(e) => handleInputChange(sec.category, 'linkUrl', e.target.value)}
                    />
                    {currentInput.linkUrl.trim() && (
                      <Button
                        size="sm"
                        onClick={() => handleLinkSave(sec.category)}
                        disabled={isUploading}
                        className="w-full text-xs h-7 bg-cyan-600 hover:bg-cyan-500"
                      >
                        {isUploading ? 'Saving...' : 'Save Link'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
