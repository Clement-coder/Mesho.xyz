'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { AdminLayout } from '../_components/admin-layout';
import { toast } from 'sonner';
import { Mail, MessageCircle, Send, X } from 'lucide-react';
import type { ContactMessage, ChatMessage } from '@/lib/types';

function ChatThread({ userId, userName, onClose }: { userId: string; userName: string; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = useRef(createClient()).current;

  const scrollBottom = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

  useEffect(() => {
    supabase.from('chat_messages').select('*').eq('user_id', userId).order('created_at')
      .then(({ data }) => { setMessages(data ?? []); scrollBottom(); });
    supabase.from('chat_messages').update({ read_by_admin: true })
      .eq('user_id', userId).eq('sender', 'user').eq('read_by_admin', false).then(() => {});

    const channel = supabase.channel(`admin-chat-${userId}`, { config: { broadcast: { self: false } } })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${userId}` },
        (p) => {
          const msg = p.new as ChatMessage;
          if (msg.sender === 'user') { setMessages(prev => [...prev, msg]); scrollBottom(); }
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`, user_id: userId, user_name: userName, user_email: '',
      sender: 'admin', message: msg, read_by_admin: true, read_by_user: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setText('');
    scrollBottom();
    inputRef.current?.focus();
    const { data, error } = await supabase.from('chat_messages').insert({
      user_id: userId, user_name: userName, user_email: '',
      sender: 'admin', message: msg, read_by_admin: true, read_by_user: false,
    }).select().single();
    if (error) setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    else if (data) setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col" style={{ height: '500px' }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">User</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-muted/10">
          {messages.map(m => (
            <div key={m.id} className={`flex items-end gap-2 ${m.sender === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
              {m.sender === 'user'
                ? <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-[10px] flex-shrink-0">{userName.charAt(0).toUpperCase()}</div>
                : <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><MessageCircle size={12} className="text-white" /></div>}
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.sender === 'admin' ? 'bg-accent text-white rounded-br-sm' : 'bg-background border border-border rounded-bl-sm shadow-sm'}`}>
                <p className="break-words">{m.message}</p>
                <p className={`text-[10px] mt-0.5 ${m.sender === 'admin' ? 'text-white/60 text-right' : 'text-muted-foreground'}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="flex gap-2 p-3 border-t border-border bg-background flex-shrink-0">
          <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} placeholder="Reply to user..." autoFocus
            className="flex-1 h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          <button type="submit" disabled={!text.trim()}
            className="w-9 h-9 bg-accent hover:bg-accent/90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'contact' | 'chat'>('chat');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [chatUsers, setChatUsers] = useState<{ user_id: string; user_name: string; user_email: string; unread: number; last: string; lastMsg: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chatThread, setChatThread] = useState<{ userId: string; userName: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();
    Promise.all([
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('chat_messages').select('*').order('created_at', { ascending: false }),
    ]).then(([cm, chat]) => {
      setMessages(cm.data ?? []);
      // Group chat messages by user
      const byUser: Record<string, any> = {};
      for (const m of (chat.data ?? [])) {
        if (!byUser[m.user_id]) byUser[m.user_id] = { user_id: m.user_id, user_name: m.user_name, user_email: m.user_email, unread: 0, last: m.created_at, lastMsg: m.message };
        if (m.sender === 'user' && !m.read_by_admin) byUser[m.user_id].unread++;
        if (m.created_at > byUser[m.user_id].last) { byUser[m.user_id].last = m.created_at; byUser[m.user_id].lastMsg = m.message; }
      }
      setChatUsers(Object.values(byUser).sort((a, b) => b.last.localeCompare(a.last)));
      setLoading(false);
    });
  }, [user]);

  const markRead = async (id: string, read: boolean) => {
    await createClient().from('contact_messages').update({ read }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read } : m));
  };

  const toggleExpand = async (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) await markRead(id, true);
    setExpanded(expanded === id ? null : id);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  const unreadContact = messages.filter(m => !m.read).length;
  const unreadChat = chatUsers.reduce((a, u) => a + u.unread, 0);

  return (
    <AdminLayout title="Messages" subtitle="Contact forms and live chat">
      {chatThread && <ChatThread userId={chatThread.userId} userName={chatThread.userName} onClose={() => setChatThread(null)} />}

      {/* Tab switcher */}
      <div className="clay p-1 flex gap-1 mb-5 w-fit">
        {[
          { id: 'chat', label: 'Live Chat', icon: MessageCircle, badge: unreadChat },
          { id: 'contact', label: 'Contact Forms', icon: Mail, badge: unreadContact },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}>
            <t.icon size={14} />{t.label}
            {t.badge > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? 'bg-white text-accent' : 'bg-yellow-500 text-white'}`}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Live Chat tab */}
      {tab === 'chat' && (
        <div className="space-y-2">
          {chatUsers.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm"><MessageCircle size={28} className="mx-auto mb-2 opacity-30" />No chat messages yet</div>}
          {chatUsers.map(u => (
            <div key={u.user_id} className={`clay p-4 flex items-center justify-between gap-3 ${u.unread > 0 ? 'border-l-4 border-l-accent' : ''}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm">{u.user_name}</p>
                  {u.unread > 0 && <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">{u.unread} new</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{u.lastMsg}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{new Date(u.last).toLocaleString()}</p>
              </div>
              <button onClick={() => setChatThread({ userId: u.user_id, userName: u.user_name })}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors flex-shrink-0">
                <MessageCircle size={13} /> Reply
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contact forms tab */}
      {tab === 'contact' && (
        <div className="space-y-3">
          {messages.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm"><Mail size={28} className="mx-auto mb-2 opacity-30" />No contact messages yet</div>}
          {messages.map(m => (
            <div key={m.id} className={`clay p-4 ${!m.read ? 'border-l-4 border-l-accent' : ''}`}>
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
                  <button onClick={() => toggleExpand(m.id)} className="text-xs text-accent hover:underline">{expanded === m.id ? 'Less' : 'Read'}</button>
                  <button onClick={() => markRead(m.id, !m.read)} className="text-xs text-muted-foreground hover:text-foreground">{m.read ? 'Unread' : 'Mark read'}</button>
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
      )}
    </AdminLayout>
  );
}
