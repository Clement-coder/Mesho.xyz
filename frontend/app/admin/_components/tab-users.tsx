'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';

export function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

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
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
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
                    <button onClick={() => toggleRole(u)} disabled={updating === u.id || u.id === me?.id}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${u.role === 'admin' ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-accent/30 text-accent hover:bg-accent/10'}`}>
                      <ShieldCheck size={12} />{updating === u.id ? '...' : u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
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
