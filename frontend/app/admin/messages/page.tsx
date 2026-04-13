'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import type { ContactMessage } from '@/lib/types';

export default function AdminMessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setMessages(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const markRead = async (id: string, read: boolean) => {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ read }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
  };

  const toggleExpand = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) await markRead(id, true);
    setExpanded(expanded === id ? null : id);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  const unread = messages.filter(m => !m.read).length;

  return (
    <AdminLayout title="Contact Messages" subtitle={`${messages.length} total • ${unread} unread`}>
      <div className="space-y-3">
        {messages.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm">No messages yet</div>}
        {messages.map(m => (
          <div key={m.id} className={`clay p-4 transition-all ${!m.read ? 'border-l-4 border-l-accent' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-medium">{m.name}</p>
                  {!m.read && <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent text-white">New</span>}
                </div>
                <p className="text-sm text-muted-foreground">{m.email}</p>
                {m.subject && <p className="text-sm font-medium mt-0.5">{m.subject}</p>}
                {expanded !== m.id && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{m.message}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                <button onClick={() => toggleExpand(m.id)} className="text-xs text-accent hover:underline">
                  {expanded === m.id ? 'Less' : 'Read'}
                </button>
                <button onClick={() => markRead(m.id, !m.read)} className="text-xs text-muted-foreground hover:text-foreground">
                  {m.read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
            </div>
            {expanded === m.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 mt-3 text-xs text-accent hover:underline">
                  <Mail size={12} /> Reply via email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
