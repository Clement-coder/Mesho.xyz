'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Search, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const toggleRole = async (targetUser: Profile) => {
    if (targetUser.id === user?.id) { toast.error("You can't change your own role"); return; }
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setUpdating(targetUser.id);
    const supabase = createClient();
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', targetUser.id);
    if (error) { toast.error('Failed to update role'); setUpdating(null); return; }
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u));
    toast.success(`${targetUser.name} is now ${newRole}`);
    setUpdating(null);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u as any).email?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 h-9 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      <div className="clay overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Materials</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {u.profile_picture_url ? (
                          <img src={u.profile_picture_url} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <User size={14} className="text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.enrolled_projects.length}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleRole(u)} disabled={updating === u.id || u.id === user.id}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${u.role === 'admin' ? 'border-destructive/30 text-destructive hover:bg-destructive/10' : 'border-accent/30 text-accent hover:bg-accent/10'}`}>
                      <ShieldCheck size={12} />
                      {updating === u.id ? 'Updating...' : u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
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
