'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 text-xs">
      <div className="text-center space-y-2">
        <div>Redirecting to Pjsofonic ERP Login Portal...</div>
        <div className="text-zinc-500">Registration is managed exclusively via Pjsofonic ERP Central Administration.</div>
      </div>
    </div>
  );
}
