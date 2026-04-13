'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';
import type { HireRequest } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminHireRequestsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('hire_requests').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRequests(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from('hire_requests').update({ status }).eq('id', id);
    if (error) { toast.error('Update failed'); setUpdating(null); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    toast.success('Status updated');
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <AdminLayout title="Hire Requests" subtitle={`${requests.length} total requests`}>
      <div className="space-y-3">
        {requests.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm">No hire requests yet</div>}
        {requests.map(r => (
          <div key={r.id} className="clay p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-medium">{r.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{r.type === 'analyst' ? 'Data Analyst' : 'Researcher'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.email} • {r.phone}</p>
                <p className="text-sm text-muted-foreground">Dept: {r.department}{r.topic ? ` • Topic: ${r.topic}` : ''}</p>
                {r.deadline && <p className="text-xs text-muted-foreground mt-0.5">Deadline: {new Date(r.deadline).toLocaleDateString()}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} disabled={updating === r.id}
                  className="text-xs border border-border rounded-lg px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50">
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="text-xs text-accent hover:underline whitespace-nowrap">
                  {expanded === r.id ? 'Less' : 'More'}
                </button>
              </div>
            </div>
            {expanded === r.id && (
              <div className="mt-3 pt-3 border-t border-border text-sm space-y-1.5">
                {r.services && r.services.length > 0 && <p><span className="font-medium">Services:</span> {r.services.join(', ')}</p>}
                {r.research_type && <p><span className="font-medium">Research Type:</span> {r.research_type}</p>}
                {r.institution && <p><span className="font-medium">Institution:</span> {r.institution}</p>}
                {r.details && <p><span className="font-medium">Details:</span> {r.details}</p>}
                <p className="text-xs text-muted-foreground">Submitted: {new Date(r.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
