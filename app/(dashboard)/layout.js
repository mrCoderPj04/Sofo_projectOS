'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { CommandPalette } from '@/components/layout/CommandPalette';

export default function DashboardLayout({ children }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    employeeId: 'PJ-ADM-001',
    name: 'Rajkamal (Pjsofonic Admin)',
    email: 'admin@pjsofonic-erp.com',
    role: 'ADMIN',
    department: 'Pjsofonic Executive Suite',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajkamal'
  });

  useEffect(() => {
    // Keyboard shortcut Cmd/Ctrl + K trigger
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Fetch active session user if available
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.error(err));

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex bg-[#090a0f] text-zinc-100 dark overflow-x-hidden">
      {/* Persistent Left Sidebar (Auto-collapses on small screens) */}
      <Sidebar currentUser={currentUser} />

      {/* Main Application Container - Fluid Responsive */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top Header Navigation */}
        <Header
          currentUser={currentUser}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Dynamic Page Content - Auto Adjusting Padding & Max Width */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1920px] mx-auto overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Right-Side Collapsible Sidebar Drawer */}
      <RightSidebar currentUser={currentUser} />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
