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
  if (data) return { ...data, email: data.email || fbUser.email || '' };

  // Profile doesn't exist yet — create it (Google sign-up or race condition)
  const name = fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User';
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
  });
  const { data: created } = await supabase.from('profiles').select('*').eq('id', fbUser.uid).single();
  return { ...(created ?? { id: fbUser.uid, name, role: 'user', enrolled_projects: [], wishlist: [], hours_learned: 0, certificates: 0, phone: null, whatsapp: null, profile_picture_url: fbUser.photoURL ?? null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }), email: fbUser.email ?? '' };
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
    // Create profile with phone/whatsapp
    const supabase = createClient();
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
    });
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
