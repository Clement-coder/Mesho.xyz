'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, Eye, EyeOff, BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const BG_IMAGES = [
  '/research-material-acces.jpg',
  '/data-anylyst-traning.jpg',
  '/Hire-Data-anylyst.jpg',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => setBgIndex(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error('Please enter a valid email'); return; }
    if (!password) { toast.error('Password is required'); return; }
    setIsLoading(true);
    try {
      await loginWithEmail(email.trim().toLowerCase(), password);
      toast.success('Welcome back!');
      router.replace('/dashboard');
    } catch (e: any) {
      const msg = e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found'
        ? 'Invalid email or password'
        : e.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Sign in failed. Please try again.';
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try { await loginWithGoogle(); }
    catch { toast.error('Google sign-in failed. Please try again.'); setGoogleLoading(false); }
  };

  const goToSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeaving(true);
    setTimeout(() => router.push('/signup'), 400);
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(60px) scale(0.97); } to { opacity:1; transform:translateX(0) scale(1); } }
        @keyframes slideOutLeft { from { opacity:1; transform:translateX(0) scale(1); } to { opacity:0; transform:translateX(-60px) scale(0.97); } }
        .page-enter { animation: slideInRight 0.4s cubic-bezier(.22,1,.36,1) both; }
        .page-leave { animation: slideOutLeft 0.4s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
      <div className={`min-h-screen flex ${leaving ? 'page-leave' : 'page-enter'}`}>
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
          {BG_IMAGES.map((src, i) => (
            <Image key={src} src={src} alt="" fill className="object-cover transition-opacity duration-1000" style={{ opacity: i === bgIndex ? 1 : 0 }} priority={i === 0} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-accent/60" />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3 leading-tight">Academic research support, simplified.</h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Access department-specific project materials, hire qualified data analysts, and master SPSS — all in one platform.
            </p>
          </div>
          <p className="relative z-10 text-white/40 text-xs">© 2026 Mesho Data Sciences</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <Image src="/mesho_logo.png" alt="Mesho logo" width={44} height={44} className="rounded-xl object-contain" />
              <span className="font-bold">Mesho Data Sciences</span>
            </div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-9 pr-10 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                <div className="relative">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="sr-only peer" />
                  <div className="w-4 h-4 rounded border border-border bg-input peer-checked:bg-accent peer-checked:border-accent transition-colors flex items-center justify-center">
                    {rememberMe && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <><Loader2 size={16} className="mr-2 animate-spin" />Signing In...</> : <><LogIn size={16} className="mr-2" />Sign In</>}
              </Button>
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-2">or</span></div>
              </div>
              <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogleSignIn} disabled={googleLoading}>
                {googleLoading ? <><Loader2 size={16} className="mr-2 animate-spin" />Connecting...</> : <><Image src="/google-icon.svg" alt="Google" width={18} height={18} className="mr-2" />Continue with Google</>}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <a href="/signup" onClick={goToSignup} className="text-accent font-medium hover:underline cursor-pointer">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
