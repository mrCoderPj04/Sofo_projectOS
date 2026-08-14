'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Sparkles,
  LogOut,
  SlidersHorizontal,
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
  Settings
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header({ onOpenCommandPalette, currentUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-950/85 backdrop-blur-2xl border-b border-zinc-800/80 text-zinc-100 select-none shadow-xl shadow-black/30">
      {/* Left Branding & Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-xl">
        {/* Mobile Brand Logo - Round Circle */}
        <Link href="/dashboard" className="md:hidden flex items-center space-x-2 shrink-0 group">
          <div className="w-8 h-8 rounded-full p-0.5 bg-zinc-900 border border-zinc-700/80 group-hover:border-[#39FF14] transition-all shadow-md">
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
          <span className="text-xs font-black text-white group-hover:text-[#39FF14] transition-colors">ProjectOS</span>
        </Link>

        {/* Command Palette Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 text-zinc-400 text-xs hover:border-[#39FF14]/60 hover:text-white transition-all cursor-pointer shadow-inner group backdrop-blur-xl"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-zinc-500 group-hover:text-[#39FF14] transition-colors" />
            <span className="truncate">Search modules, projects or problems...</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <kbd className="px-2 py-0.5 rounded-lg bg-zinc-850 border border-zinc-750 text-[10px] font-mono text-zinc-400 group-hover:text-[#39FF14] group-hover:border-[#39FF14]/30">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Control Bar */}
      <div className="flex items-center space-x-2.5 ml-3">
        {/* SOFO AI Shortcut Button */}
        <button
          onClick={() => router.push('/ai-assistant')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-zinc-900 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.35)] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="hidden sm:inline">SOFO AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14]/50 relative transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#39FF14] text-black text-[9px] font-extrabold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in duration-150 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <span className="text-xs font-bold text-white">Notifications</span>
              </div>
              <div className="space-y-1.5 mt-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-zinc-500 text-xs font-medium">No new notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl border bg-zinc-900/60 border-zinc-800/80 text-zinc-400 text-xs">
                      <div className="font-semibold text-zinc-200">{n.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-zinc-800/80">
          <img
            src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-zinc-700 object-cover shadow-sm"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">{currentUser?.name || 'Pjsofonic Employee'}</div>
            <div className="text-[10px] text-zinc-500 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
              <span>{currentUser?.role || 'EMPLOYEE'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer rounded-lg hover:bg-rose-500/10"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
