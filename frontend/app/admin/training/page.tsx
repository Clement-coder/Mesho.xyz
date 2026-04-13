'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import type { TrainingRegistration } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminTrainingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('training_registrations').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRegistrations(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from('training_registrations').update({ status }).eq('id', id);
    if (error) { toast.error('Update failed'); setUpdating(null); return; }
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    toast.success('Status updated');
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Schedule</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Institution</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{r.email}</p>
                    <p className="text-xs text-muted-foreground">{r.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px]">
                    <span className="truncate block">{r.schedule.replace(/-/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.institution ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} disabled={updating === r.id}
                      className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50">
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrations.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No registrations yet</p>}
        </div>
      </div>
    </div>
  );
}
