'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CustomSelect } from '../components/custom-select';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone, BookOpen, CheckCircle, Sparkles, UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const countryCodes = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
  ];
  if (!password) return null;
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-destructive', 'bg-yellow-400', 'bg-green-500'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-border'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c, i) => (
          <span key={i} className={`flex items-center gap-1 text-xs ${c.pass ? 'text-green-600' : 'text-muted-foreground'}`}>
            <CheckCircle size={10} />{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', countryCode: '+234', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signupWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Full name is required'); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { setError('Please enter a valid email address'); return; }
    if (!form.password) { setError('Password is required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setIsLoading(true);
    try {
      await signupWithEmail(form.name.trim(), form.email.trim().toLowerCase(), form.password);
      setShowSuccess(true);
    } catch (e: any) {
      const msg = e.message?.includes('already registered') || e.message?.includes('already been registered')
        ? 'An account with this email already exists'
        : e.message?.includes('weak')
        ? 'Password is too weak'
        : 'Sign up failed. Please try again.';
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="clay p-10 max-w-md w-full text-center animate-in zoom-in duration-500">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
              <Sparkles size={36} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={14} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-muted-foreground text-sm mb-1">Welcome to Mesho Data Sciences, <span className="font-semibold text-foreground">{form.name}</span>!</p>
          <p className="text-muted-foreground text-sm mb-7">Check your email to confirm your account, then sign in.</p>
          <Link href="/login"><Button size="lg" className="w-full">Sign In Now</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-accent flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <Image src="/mesho_logo.png" alt="Mesho Data Sciences logo" width={56} height={56} className="rounded-xl object-contain" />
          <span className="font-bold text-lg">Mesho Data Sciences</span>
        </div>
        <div>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">Start your academic journey today.</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Join students and researchers already using Mesho Data Sciences for quality research materials, SPSS training, and professional data analysis support.
          </p>
          <div className="mt-8 space-y-3">
            {['16 academic departments covered', 'Instant material download after payment', 'Professional SPSS data analysts available'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle size={15} className="text-white/60" />{f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2026 Mesho Data Sciences</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Image src="/mesho_logo.png" alt="Mesho logo" width={44} height={44} className="rounded-xl object-contain" />
            <span className="font-bold">Mesho Data Sciences</span>
          </div>
          <div className="mb-7">
            <h1 className="text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-5" role="alert">
              <Lock size={14} />{error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4" noValidate>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="name">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input id="name" type="text" autoComplete="name" placeholder="e.g. Armang Meshak S."
                  value={form.name} onChange={e => set('name', e.target.value)} required
                  className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} required
                  className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(optional)</span></label>
              <div className="flex gap-2">
                <CustomSelect
                  options={countryCodes.map(c => ({ value: c.code, label: c.code, prefix: c.flag }))}
                  value={form.countryCode} onChange={v => set('countryCode', v)}
                  className="w-28 flex-shrink-0"
                />
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input id="phone" type="tel" autoComplete="tel-national" placeholder="8012345678"
                    value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password"
                  value={form.password} onChange={e => set('password', e.target.value)} required
                  className="w-full pl-9 pr-10 h-10 rounded-xl border border-border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" placeholder="Repeat your password"
                  value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required
                  className={`w-full pl-9 pr-10 h-10 rounded-xl border bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring clay-inset ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-destructive' : 'border-border'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide' : 'Show'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 size={16} className="mr-2 animate-spin" />Creating Account...</> : <><UserPlus size={16} className="mr-2" />Create Account</>}
            </Button>
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-2">or</span></div>
            </div>
            <Button type="button" variant="outline" className="w-full" size="lg" onClick={handleGoogleSignUp} disabled={googleLoading}>
              {googleLoading ? <><Loader2 size={16} className="mr-2 animate-spin" />Connecting...</> : <><Image src="/google-icon.svg" alt="Google" width={18} height={18} className="mr-2" />Continue with Google</>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
