'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ currentUser }) {
  const pathname = usePathname();

  const mainNav = [
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

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 z-40 text-zinc-300 select-none hidden md:flex">
      <div>
        {/* Logo Section - Perfect Round Circle Shape */}
        <div className="h-16 px-5 flex items-center border-b border-zinc-800/80">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <img
              src="/sofo_Pm.png"
              alt="SOFO Logo"
              className="w-9 h-9 rounded-full object-cover bg-zinc-900 border border-zinc-700/80 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:border-[#39FF14] transition-all"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%2339FF14'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='48' fill='url(%23g)'/%3E%3Ctext x='50' y='62' font-size='42' font-weight='900' text-anchor='middle' fill='%23000' font-family='sans-serif'%3ES%3C/text%3E%3C/svg%3E";
              }}
            />
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white flex items-center space-x-1.5 group-hover:text-[#39FF14] transition-colors">
                <span>Pjsofonic</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30 group-hover:border-[#39FF14] group-hover:text-[#39FF14]">
                  ERP
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 font-medium">Enterprise Project OS</div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Workspace Navigation
          </div>

          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-indigo-600/15 text-[#39FF14] border border-[#39FF14]/40 shadow-[0_0_10px_rgba(57,255,20,0.15)] font-bold'
                    : 'text-zinc-400 hover:text-[#39FF14] hover:bg-zinc-900/80 hover:border hover:border-[#39FF14]/30'
                )}
              >
                <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-[#39FF14]' : 'text-zinc-400 group-hover:text-[#39FF14]')} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 pb-1">
            <div className="border-t border-zinc-800/60 my-2" />
          </div>

          {/* AI Assistant Navigation */}
          <Link
            href="/ai-assistant"
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group',
              pathname === '/ai-assistant'
                ? 'bg-purple-600/20 text-[#39FF14] border border-[#39FF14]/50 shadow-[0_0_12px_rgba(57,255,20,0.2)]'
                : 'text-zinc-300 hover:bg-purple-950/30 hover:text-[#39FF14] hover:border hover:border-[#39FF14]/40'
            )}
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-[#39FF14] animate-pulse" />
              <span>SOFO AI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono group-hover:text-[#39FF14]">
              v1.0
            </span>
          </Link>

          <div className="pt-2 pb-1">
            <div className="border-t border-zinc-800/60 my-2" />
          </div>

          {/* Settings */}
          <Link
            href="/settings"
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group',
              pathname === '/settings'
                ? 'bg-zinc-800 text-[#39FF14] border border-[#39FF14]/40'
                : 'text-zinc-400 hover:text-[#39FF14] hover:bg-zinc-900/80 hover:border hover:border-[#39FF14]/30'
            )}
          >
            <Settings className="w-4 h-4 text-zinc-400 group-hover:text-[#39FF14]" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Bottom Profile & Workspace Switcher */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-[#39FF14]/50 transition-all cursor-pointer group">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img
              src="/sofo_Pm.png"
              alt="Workspace Logo"
              className="w-7 h-7 rounded-full object-cover bg-zinc-950 border border-zinc-700/80 p-0.5 group-hover:border-[#39FF14]"
            />
            <div className="truncate text-left">
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-[#39FF14] truncate">Pjsofonic ERP Systems</div>
              <div className="text-[10px] text-zinc-500 truncate">{currentUser?.email || 'admin@pjsofonic-erp.com'}</div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-zinc-500 group-hover:text-[#39FF14] flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
