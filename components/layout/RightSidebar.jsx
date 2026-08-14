'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FolderKanban,
  FileCheck2,
  AlertTriangle,
  CheckSquare,
  Lightbulb,
  Layers,
  BookOpen,
  FolderClosed,
  ShieldAlert,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function RightSidebar({ currentUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Requirements', href: '/requirements', icon: FileCheck2 },
    { name: 'Problems', href: '/problems', icon: AlertTriangle },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Solutions', href: '/solutions', icon: Lightbulb },
    { name: 'Problem Map', href: '/problem-map', icon: Layers },
    { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
    { name: 'Files', href: '/files', icon: FolderClosed },
    { name: 'Risks', href: '/risks', icon: ShieldAlert },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 }
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      {/* Right Edge Collapsible Toggle Tab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-50 p-2.5 rounded-l-2xl bg-zinc-950/90 border-y border-l border-zinc-800 text-zinc-300 hover:text-[#39FF14] hover:border-[#39FF14]/50 shadow-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center space-x-1 group',
          isOpen ? 'bg-indigo-600/30 text-[#39FF14] border-[#39FF14]' : ''
        )}
        title={isOpen ? 'Hide Right Sidebar' : 'Show Right Sidebar'}
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5 text-[#39FF14] group-hover:scale-125 transition-transform" />
        ) : (
          <div className="flex items-center space-x-1.5 px-0.5">
            <SlidersHorizontal className="w-4 h-4 text-[#39FF14] animate-pulse" />
            <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#39FF14]" />
          </div>
        )}
      </button>

      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        />
      )}

      {/* Right-Side Slide-Over Sidebar Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-40 w-72 h-screen bg-zinc-950/90 backdrop-blur-3xl border-l border-zinc-800/80 shadow-2xl flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out text-zinc-100 select-none',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="space-y-4">
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700/80 p-0.5 shadow-md shadow-indigo-500/20">
                <img
                  src="/sofo_Pm.png"
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%2339FF14'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='48' fill='url(%23g)'/%3E%3Ctext x='50' y='62' font-size='42' font-weight='900' text-anchor='middle' fill='%23000' font-family='sans-serif'%3ES%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center space-x-1">
                  <span>Pjsofonic ERP</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-[#39FF14] font-semibold">
                    OS
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium">Right Navigation Drawer</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#39FF14] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Capsule */}
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl flex items-center space-x-3">
            <img
              src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-zinc-700 object-cover shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Pjsofonic Employee'}</div>
              <div className="text-[10px] text-zinc-500 font-mono truncate">{currentUser?.role || 'EMPLOYEE'}</div>
            </div>
          </div>

          {/* SOFO AI Shortcut */}
          <Link
            href="/ai-assistant"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-bold hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>SOFO AI Assistant Workspace</span>
          </Link>

          {/* Module Links */}
          <div className="space-y-1 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              All System Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-indigo-600/20 text-[#39FF14] border border-[#39FF14]/40 font-bold shadow-sm'
                      : 'text-zinc-300 hover:text-[#39FF14] hover:bg-zinc-900/80 hover:border hover:border-[#39FF14]/30'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-[#39FF14]' : 'text-zinc-400 group-hover:text-[#39FF14]')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Sign Out Button */}
        <div className="pt-3 border-t border-zinc-800/80">
          <Button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            variant="outline"
            className="w-full text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-center space-x-2 py-2.5 rounded-2xl cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
