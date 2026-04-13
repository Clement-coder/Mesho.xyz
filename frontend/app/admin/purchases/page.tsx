'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, MessageCircle, Mail, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

function RejectModal({ onConfirm, onClose }: { onConfirm: (reason: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState('');
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-background border border-border rounded-2xl w-full max-w-sm shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Reject Payment</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Provide a reason so the user knows what went wrong.</p>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Payment not received, wrong amount, wrong reference..."
            className="w-full px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none mb-4"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
            <Button size="sm" onClick={() => { if (!reason.trim()) { toast.error('Please provide a reason'); return; } onConfirm(reason.trim()); }}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white border-0">
              Reject
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminPurchasesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('pending');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('purchases')
      .select('*, projects(title, price)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('purchases fetch error:', error);
        setPurchases(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const confirmPayment = async (p: any) => {
    setUpdating(p.id);
    const supabase = createClient();
    const { error } = await supabase.from('purchases').update({ status: 'confirmed' }).eq('id', p.id);
    if (error) { toast.error('Update failed'); setUpdating(null); return; }
    // Add project to user's enrolled_projects
    const { data: profile } = await supabase.from('profiles').select('enrolled_projects').eq('id', p.user_id).single();
    if (profile) {
      const updated = Array.from(new Set([...(profile.enrolled_projects ?? []), p.project_id]));
      await supabase.from('profiles').update({ enrolled_projects: updated }).eq('id', p.user_id);
    }
    setPurchases(prev => prev.map(x => x.id === p.id ? { ...x, status: 'confirmed' } : x));
    toast.success('Payment confirmed — user can now access the material');
    setUpdating(null);
  };

  const rejectPayment = async (id: string, reason: string) => {
    setUpdating(id);
    const supabase = createClient();
    const { error } = await supabase.from('purchases').update({ status: 'failed', rejection_reason: reason }).eq('id', id);
    if (error) { toast.error('Update failed'); setUpdating(null); return; }
    setPurchases(prev => prev.map(x => x.id === id ? { ...x, status: 'failed', rejection_reason: reason } : x));
    toast.success('Payment rejected');
    setRejectTarget(null);
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  const filtered = filter === 'all' ? purchases : purchases.filter(p => p.status === filter);
  const totalRevenue = purchases.filter(p => p.status === 'confirmed').reduce((s: number, p: any) => s + p.amount, 0);
  const pendingCount = purchases.filter(p => p.status === 'pending').length;

  const whatsappNumber = (p: any): string => {
    const raw = p.user_whatsapp || '';
    return raw.replace(/\D/g, '');
  };

  return (
    <AdminLayout
      title="Purchases"
      subtitle={`${purchases.length} total • ₦${totalRevenue.toLocaleString()} confirmed revenue${pendingCount > 0 ? ` • ${pendingCount} pending verification` : ''}`}
    >
      {/* Filter tabs */}
      <div className="clay p-1 flex gap-1 mb-5 w-fit overflow-x-auto">
        {(['all', 'pending', 'confirmed', 'failed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-accent text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            {f}{f === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="clay p-8 text-center text-muted-foreground text-sm">No purchases found</div>
        )}

        {filtered.map((p: any) => {
          const wa = whatsappNumber(p);
          const userName = p.user_name || 'Unknown';
          const userEmail = p.user_email || '';
          const isExpanded = expanded === p.id;

          return (
            <div key={p.id} className={`clay p-4 transition-all ${p.status === 'pending' ? 'border-l-4 border-l-yellow-400' : p.status === 'confirmed' ? 'border-l-4 border-l-green-400' : 'border-l-4 border-l-red-400'}`}>
              {/* Row summary */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-sm">{userName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.projects?.title ?? 'Unknown project'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-accent text-sm">₦{p.amount?.toLocaleString()}</span>
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-4 animate-in fade-in duration-200">
                  {/* User info */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">User Info</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground text-xs">Name</span><p className="font-medium">{userName}</p></div>
                      <div><span className="text-muted-foreground text-xs">Email</span><p className="font-medium truncate">{userEmail || '—'}</p></div>
                      <div><span className="text-muted-foreground text-xs">WhatsApp / Phone</span><p className="font-medium">{p.user_whatsapp || '—'}</p></div>
                      <div><span className="text-muted-foreground text-xs">Reference</span><p className="font-mono text-xs">{p.payment_reference || '—'}</p></div>
                    </div>
                  </div>

                  {p.rejection_reason && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 text-sm">
                      <span className="font-medium text-destructive">Rejection reason: </span>
                      <span className="text-muted-foreground">{p.rejection_reason}</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {p.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => confirmPayment(p)} disabled={updating === p.id}
                          className="bg-green-600 hover:bg-green-700 text-white border-0 gap-1.5">
                          <CheckCircle size={14} />
                          {updating === p.id ? 'Confirming...' : 'Confirm Payment'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRejectTarget(p.id)} disabled={updating === p.id}
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5">
                          <XCircle size={14} /> Reject
                        </Button>
                      </>
                    )}

                    {/* Contact buttons — always visible */}
                    {wa && (
                      <a
                        href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello ${userName}, regarding your purchase of "${p.projects?.title ?? 'research material'}" on Mesho Data Sciences (Ref: ${p.payment_reference ?? ''}).`)}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 gap-1.5">
                          <MessageCircle size={14} /> WhatsApp User
                        </Button>
                      </a>
                    )}
                    {userEmail && (
                      <a href={`mailto:${userEmail}?subject=${encodeURIComponent(`Your Mesho Purchase — ${p.projects?.title ?? ''}`)}&body=${encodeURIComponent(`Hello ${userName},\n\nRegarding your purchase of "${p.projects?.title ?? ''}" (Ref: ${p.payment_reference ?? ''}).\n\n`)}`}>
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Mail size={14} /> Email User
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rejectTarget && (
        <RejectModal
          onConfirm={reason => rejectPayment(rejectTarget, reason)}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
