import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 dark">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h1 className="text-2xl font-black text-white">404 - Page Not Found</h1>
        <p className="text-xs text-zinc-400">
          The requested page does not exist or has been moved within Pjsofonic ProjectOS.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
