'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, Eye, EyeOff, BookOpen, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email'); return; }
    if (!password) { setError('Password is required'); return; }
    setIsLoading(true);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email.trim().toLowerCase() && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.replace('/dashboard');
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <Image src="/mesho_logo.png" alt="Mesho Data Sciences logo" width={64} height={64} className="rounded-xl object-contain" />
          <span className="font-bold text-lg">Mesho Data Sciences</span>
        </div>
        <div>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen size={28} className="text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">Academic research support, simplified.</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Access department-specific project materials, hire qualified data analysts, and master SPSS — all in one platform.
          </p>
        </div>
        <p className="text-white/40 text-xs">© 2026 Mesho Data Sciences</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src="/mesho_logo.png" alt="Mesho logo" width={56} height={56} className="rounded-xl object-contain" />
            <span className="font-bold">Mesho Data Sciences</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-5" role="alert">
              <Lock size={14} aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  list="email-suggestions"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  aria-label="Enter your email address"
                  required
                  className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                />
                <datalist id="email-suggestions">
                  {['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','live.com'].map(d => (
                    <option key={d} value={email.includes('@') ? email.split('@')[0] + '@' + d : ''} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  aria-label="Enter your password"
                  required
                  className="w-full pl-9 pr-10 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading} aria-label="Sign in to your account">
              {isLoading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />Signing In...</>
              ) : (
                <><LogIn size={16} className="mr-2" aria-hidden="true" />Sign In</>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
