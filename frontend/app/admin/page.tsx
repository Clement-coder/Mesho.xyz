'use client';
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { AdminShell, type AdminTab } from './_components/admin-shell';
import { AdminOverview } from './_components/tab-overview';
import { AdminUsers } from './_components/tab-users';
import { PurchasesContent } from './purchases/page';

// Lazy-load remaining tabs
const AdminProjects  = lazy(() => import('./projects/page').then(m => ({ default: m.default })));
const AdminHire      = lazy(() => import('./hire-requests/page').then(m => ({ default: m.default })));
const AdminTraining  = lazy(() => import('./training/page').then(m => ({ default: m.default })));
const AdminMessages  = lazy(() => import('./messages/page').then(m => ({ default: m.default })));

const Spinner = () => <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  if (isLoading) return <Spinner />;
  if (!user || user.role !== 'admin') return null;

  return (
    <AdminShell active={tab} onTab={setTab}>
      <Suspense fallback={<Spinner />}>
        {tab === 'overview'  && <AdminOverview onTab={setTab} />}
        {tab === 'users'     && <AdminUsers />}
        {tab === 'purchases' && <PurchasesContent />}
        {tab === 'projects'  && <AdminProjects />}
        {tab === 'hire'      && <AdminHire />}
        {tab === 'training'  && <AdminTraining />}
        {tab === 'messages'  && <AdminMessages />}
      </Suspense>
    </AdminShell>
  );
}
