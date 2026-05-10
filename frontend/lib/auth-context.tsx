'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createClient } from '@/utils/supabase/client';
import type { Profile } from '@/lib/types';

interface AuthContextType {
  user: Profile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function ensureProfile(fbUser: FirebaseUser): Promise<Profile> {
  const supabase = createClient();
  // Try to fetch existing profile
  const { data } = await supabase.from('profiles').select('*').eq('id', fbUser.uid).single();
  if (data) {
    // If the profile exists but has no referred_by yet, apply any stored referral code now
    if (!data.referred_by) {
      const referredBy = typeof window !== 'undefined' ? localStorage.getItem('mesho_ref') : null;
      if (referredBy) {
        // Validate: code must exist and must not be the user's own code
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id, referral_code')
          .eq('referral_code', referredBy)
          .neq('id', fbUser.uid)   // block self-referral
          .maybeSingle();
        if (referrer) {
          await supabase.from('profiles').update({ referred_by: referredBy }).eq('id', fbUser.uid);
          // Record signup row (ignore conflict — may already exist)
          await supabase.from('referral_signups').upsert({
            referrer_code: referredBy,
            referrer_id: referrer.id,
            referee_id: fbUser.uid,
            referee_name: data.name,
            referee_email: data.email || fbUser.email || '',
            completed: false,
          }, { onConflict: 'referrer_id,referee_id', ignoreDuplicates: true });
        }
        if (typeof window !== 'undefined') localStorage.removeItem('mesho_ref');
        return { ...data, referred_by: referredBy, email: data.email || fbUser.email || '' };
      }
    }
    return { ...data, email: data.email || fbUser.email || '' };
  }

  // Profile doesn't exist yet — create it (Google sign-up or race condition)
  const name = fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User';
  const referredBy = typeof window !== 'undefined' ? localStorage.getItem('mesho_ref') : null;

  // Validate referral code: must exist and not be the user's own
  let validReferrer: { id: string } | null = null;
  if (referredBy) {
    const { data: ref } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referredBy)
      .neq('id', fbUser.uid)
      .maybeSingle();
    validReferrer = ref ?? null;
  }

  await supabase.from('profiles').insert({
    id: fbUser.uid,
    name,
    email: fbUser.email ?? '',
    phone: null,
    whatsapp: null,
    profile_picture_url: fbUser.photoURL ?? null,
    role: 'user',
    enrolled_projects: [],
    wishlist: [],
    hours_learned: 0,
    certificates: 0,
    referred_by: validReferrer ? referredBy : null,
  });

  // Record referral signup row
  if (validReferrer && referredBy) {
    await supabase.from('referral_signups').upsert({
      referrer_code: referredBy,
      referrer_id: validReferrer.id,
      referee_id: fbUser.uid,
      referee_name: name,
      referee_email: fbUser.email ?? '',
      completed: false,
    }, { onConflict: 'referrer_id,referee_id', ignoreDuplicates: true });
  }

  if (referredBy && typeof window !== 'undefined') localStorage.removeItem('mesho_ref');
  const { data: created } = await supabase.from('profiles').select('*').eq('id', fbUser.uid).single();
  return { ...(created ?? { id: fbUser.uid, name, role: 'user', enrolled_projects: [], wishlist: [], hours_learned: 0, certificates: 0, phone: null, whatsapp: null, profile_picture_url: fbUser.photoURL ?? null, referral_code: null, referred_by: validReferrer ? referredBy : null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }), email: fbUser.email ?? '' };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = await ensureProfile(fbUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // Returns after Firebase auth AND profile is loaded in state
  const waitForUser = (): Promise<void> =>
    new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        unsub();
        if (fbUser) {
          const profile = await ensureProfile(fbUser);
          setFirebaseUser(fbUser);
          setUser(profile);
        }
        resolve();
      });
    });

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    await waitForUser();
  };

  const signupWithEmail = async (name: string, email: string, password: string, phone: string) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(fbUser);
    const supabase = createClient();
    const referredBy = typeof window !== 'undefined' ? localStorage.getItem('mesho_ref') : null;

    // Validate referral code: must exist and not be the user's own
    let validReferrer: { id: string } | null = null;
    if (referredBy) {
      const { data: ref } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referredBy)
        .neq('id', fbUser.uid)
        .maybeSingle();
      validReferrer = ref ?? null;
    }

    await supabase.from('profiles').insert({
      id: fbUser.uid,
      name,
      email,
      phone: phone || null,
      whatsapp: phone || null,
      profile_picture_url: fbUser.photoURL ?? null,
      role: 'user',
      enrolled_projects: [],
      wishlist: [],
      hours_learned: 0,
      certificates: 0,
      referred_by: validReferrer ? referredBy : null,
    });

    // Record referral signup row so referrer sees this person immediately
    if (validReferrer && referredBy) {
      await supabase.from('referral_signups').upsert({
        referrer_code: referredBy,
        referrer_id: validReferrer.id,
        referee_id: fbUser.uid,
        referee_name: name,
        referee_email: email,
        completed: false,
      }, { onConflict: 'referrer_id,referee_id', ignoreDuplicates: true });
    }

    if (referredBy && typeof window !== 'undefined') localStorage.removeItem('mesho_ref');
    // Sign out immediately — user must verify email first
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const { user: fbUser } = await signInWithPopup(auth, googleProvider);
    // Merge: if a profile with same email already exists under a different UID, adopt it
    const supabase = createClient();
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', fbUser.email ?? '').neq('id', fbUser.uid).single();
    if (existing) {
      // Update the old profile's id to the new Firebase UID
      await supabase.from('profiles').update({ id: fbUser.uid, profile_picture_url: fbUser.photoURL ?? null }).eq('id', existing.id);
    }
    await waitForUser();
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;
    const profile = await ensureProfile(firebaseUser);
    setUser(profile);
  };

  const changePassword = async (newPassword: string) => {
    if (!firebaseUser) throw new Error('Not authenticated');
    await updatePassword(firebaseUser, newPassword);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">Loading account details</p>
          <p className="text-xs text-muted-foreground">Fetching your profile and preferences…</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAuthenticated: !!user, isLoading, loginWithEmail, signupWithEmail, loginWithGoogle, logout, refreshUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
