'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, ShieldCheck, User, Eye, X, Mail, Phone, Calendar, FolderOpen, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';
import { BottomSheet } from '@/components/bottom-sheet';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

function UserModal({ u, onClose }: { u: Profile; onClose: () => void }) {
  const [purchases, setPurchases] = useState<any[]>([]);
  useEffect(() => {
    createClient().from('purchases').select('*, projects(title)').eq('user_id', u.id).order('created_at', { ascending: false })
      .then(({ data }) => setPurchases(data ?? []));
  }, [u.id]);

  const wa = (u.whatsapp || u.phone || '').replace(/\D/g, '');

  return (
    <BottomSheet isOpen onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background">
        <h2 className="font-bold text-base">User Profile</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
      </div>
      <div className="p-5 space-y-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              {u.profile_picture_url
                ? <img src={u.profile_picture_url} className="w-14 h-14 rounded-full object-cover" alt="" />
                : <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center"><User size={24} className="text-accent" /></div>}
              <div>
                <p className="font-bold text-lg">{u.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>{u.role}</span>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: Mail, label: 'Email', value: u.email || '—' },
                { icon: Phone, label: 'WhatsApp', value: u.whatsapp || u.phone || '—' },
                { icon: Calendar, label: 'Joined', value: new Date(u.created_at).toLocaleDateString() },
                { icon: FolderOpen, label: 'Materials Purchased', value: u.enrolled_projects.length },
                { icon: Heart, label: 'Saved Topics', value: u.wishlist.length },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                  <item.icon size={15} className="text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchases */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Purchase History</p>
              {purchases.length === 0
                ? <p className="text-sm text-muted-foreground">No purchases yet</p>
                : <div className="space-y-2">
                  {purchases.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm bg-muted/20 rounded-xl px-3 py-2">
                      <span className="truncate flex-1">{p.projects?.title ?? '—'}</span>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="font-semibold text-accent text-xs">₦{p.amount?.toLocaleString()}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${p.status === 'confirmed' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>}
            </div>

            {/* Contact buttons */}
            <div className="flex gap-2 pt-2 border-t border-border">
              {wa && (
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello ${u.name}, this is Mesho Data Sciences support.`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              )}
              {u.email && (
                <a href={`mailto:${u.email}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted text-foreground py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <Mail size={15} /> Email
                </a>
              )}
            </div>
          </div>
    </BottomSheet>
  );
}

export function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Profile | null>(null);

  useEffect(() => {
    createClient().from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setUsers(data ?? []));
  }, []);

  const toggleRole = async (u: Profile) => {
    if (u.id === me?.id) { toast.error("Can't change your own role"); return; }
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setUpdating(u.id);
    const { error } = await createClient().from('profiles').update({ role: newRole }).eq('id', u.id);
    if (error) { toast.error('Failed'); setUpdating(null); return; }
    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
    toast.success(`${u.name} is now ${newRole}`);
    setUpdating(null);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {viewing && <UserModal u={viewing} onClose={() => setViewing(null)} />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Users</h1>
          <p className="text-muted-foreground text-sm">{users.length} total</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </div>
      <div className="clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.profile_picture_url
                        ? <img src={u.profile_picture_url} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                        : <div className="w-7 h-7 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0"><User size={13} className="text-accent" /></div>}
                      <span className="font-medium truncate max-w-[120px]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{u.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewing(u)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => toggleRole(u)} disabled={updating === u.id || u.id === me?.id}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${u.role === 'admin' ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-accent/30 text-accent hover:bg-accent/10'}`}>
                        <ShieldCheck size={12} />{updating === u.id ? '...' : u.role === 'admin' ? 'Demote' : 'Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No users found</p>}
        </div>
      </div>
    </div>
  );
}
