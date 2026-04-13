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

async function fetchProfile(uid: string, email?: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
  if (!data) return null;
  return { ...data, email: email ?? '' };
}

async function upsertProfile(uid: string, name: string, email: string, phone: string, photoURL?: string) {
  const supabase = createClient();
  await supabase.from('profiles').upsert({
    id: uid,
    name,
    phone: phone || null,
    whatsapp: phone || null,
    profile_picture_url: photoURL ?? null,
  }, { onConflict: 'id', ignoreDuplicates: true });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = await fetchProfile(fbUser.uid, fbUser.email ?? '');
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (name: string, email: string, password: string, phone: string) => {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(fbUser);
    await upsertProfile(fbUser.uid, name, email, phone, fbUser.photoURL ?? undefined);
  };

  const loginWithGoogle = async () => {
    const { user: fbUser } = await signInWithPopup(auth, googleProvider);
    await upsertProfile(
      fbUser.uid,
      fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User',
      fbUser.email ?? '',
      '',
      fbUser.photoURL ?? undefined,
    );
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;
    const profile = await fetchProfile(firebaseUser.uid, firebaseUser.email ?? '');
    setUser(profile);
  };

  const changePassword = async (newPassword: string) => {
    if (!firebaseUser) throw new Error('Not authenticated');
    await updatePassword(firebaseUser, newPassword);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
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
