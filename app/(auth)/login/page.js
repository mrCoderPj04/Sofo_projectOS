'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, KeyRound, ArrowRight, AlertCircle, Building2, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Access Denied: Account is not authorized as a Team Leader in EMS/ERP.');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error to EMS/ERP authentication backend API.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-zinc-100 dark selection:bg-[#39FF14] selection:text-black">
      <div className="w-full max-w-md space-y-4">
        {/* Top Header Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-zinc-950 p-0.5 mx-auto shadow-2xl shadow-indigo-500/20 border border-zinc-800 hover:border-[#39FF14] transition-all flex items-center justify-center group">
            <img src="/sofo_Pm.png" alt="Logo" className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center space-x-1.5 pt-1">
            <span>SOFO ProjectOS</span>
          </h1>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 bg-zinc-950/90 border-zinc-800 space-y-5 shadow-2xl backdrop-blur-xl hover:border-[#39FF14]/30 transition-all">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed text-center font-medium animate-in fade-in duration-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-zinc-200 block mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Team Leader Employee ID / Email</span>
                </span>
              </label>
              <Input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. PJ-TL-101 or teamlead@pjsofonic.com"
                required
                className="text-xs bg-zinc-950 font-mono focus:border-[#39FF14]"
              />
            </div>

            <div>
              <label className="font-semibold text-zinc-200 block mb-1.5 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your EMS/ERP password"
                required
                className="text-xs bg-zinc-950 focus:border-[#39FF14]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-[#39FF14] hover:text-black text-white text-xs font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Verifying Team Leader Authorization...' : 'Sign In as Team Leader'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </Card>

        {/* Footer info */}
        <div className="text-center text-[11px] text-zinc-500">
          SOFO ProjectOS • Pjsofonic Enterprise Operating System
        </div>
      </div>
    </div>
  );
}
