'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';

export default function AdminPurchasesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('purchases')
      .select('*, profiles(name, email), projects(title, price)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPurchases(data ?? []); setLoading(false); });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from('purchases').update({ status }).eq('id', id);
    if (error) { toast.error('Update failed'); setUpdating(null); return; }
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    toast.success('Status updated');
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  const totalRevenue = purchases.filter(p => p.status === 'confirmed').reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout title="Purchases" subtitle={`${purchases.length} total • ₦${totalRevenue.toLocaleString()} confirmed revenue`}>
      <div className="clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.profiles?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{p.profiles?.email ?? ''}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="truncate">{p.projects?.title ?? 'Unknown'}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-accent">₦{p.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'confirmed' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} disabled={updating === p.id}
                      className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50">
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="failed">failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {purchases.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No purchases yet</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
