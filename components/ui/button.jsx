'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-[0.98] cursor-pointer';

    const variants = {
      default: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/30',
      secondary: 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 shadow-sm',
      outline: 'border border-zinc-700/80 bg-transparent hover:bg-zinc-800/60 text-zinc-200',
      ghost: 'bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20',
      success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-sm',
      sm: 'h-8 px-3 text-xs rounded-md',
      lg: 'h-11 px-6 text-base rounded-xl',
      icon: 'h-9 w-9 p-0 rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
