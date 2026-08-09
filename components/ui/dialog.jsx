'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 p-6 space-y-4">
        <button
          onClick={() => onOpenChange && onOpenChange(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, ...props }) {
  return <div className={cn('space-y-3', className)} {...props}>{children}</div>;
}

export function DialogHeader({ className, children, ...props }) {
  return <div className={cn('space-y-1', className)} {...props}>{children}</div>;
}

export function DialogTitle({ className, children, ...props }) {
  return <h2 className={cn('text-lg font-bold text-white', className)} {...props}>{children}</h2>;
}

export function DialogDescription({ className, children, ...props }) {
  return <p className={cn('text-xs text-zinc-400', className)} {...props}>{children}</p>;
}
