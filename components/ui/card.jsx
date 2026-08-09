'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-800/80 bg-zinc-950/75 backdrop-blur-xl shadow-2xl text-zinc-100 transition-all duration-300 hover:border-[#39FF14]/40 hover:backdrop-blur-2xl hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-5 pb-3 flex flex-col space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('text-lg font-extrabold tracking-tight text-white', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn('p-5 pt-0', className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('p-5 pt-0 flex items-center justify-between border-t border-zinc-800/40 mt-4', className)} {...props}>
      {children}
    </div>
  );
}
