'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import type { ChatMessage } from '@/lib/types';

function Avatar({ src, name, size = 28 }: { src?: string | null; name: string; size?: number }) {
  return src
    ? <img src={src} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover flex-shrink-0" />
    : <div style={{ width: size, height: size }} className="rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent font-bold text-xs">
        {name.charAt(0).toUpperCase()}
      </div>;
}

function SupportAvatar({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 flex-shrink-0">
      <MessageCircle size={size * 0.5} className="text-white" />
    </div>
  );
}

function ChatWidget({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient()).current;
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id ?? 'guest';
  const userName = user?.name ?? 'Guest';
  const userEmail = user?.email ?? '';

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  useEffect(() => {
    // Load history
    supabase.from('chat_messages').select('*').eq('user_id', userId).order('created_at')
      .then(({ data }) => { setMessages(data ?? []); scrollBottom(); });

    // Mark admin messages read
    supabase.from('chat_messages').update({ read_by_user: true })
      .eq('user_id', userId).eq('sender', 'admin').eq('read_by_user', false).then(() => {});

    // Realtime — listen for NEW messages from admin
    const channel = supabase.channel(`chat-user-${userId}`, { config: { broadcast: { self: false } } })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const msg = payload.new as ChatMessage;
        // Only add if it's from admin (user messages are added optimistically)
        if (msg.sender === 'admin') {
          setMessages(prev => [...prev, msg]);
          scrollBottom();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;

    // Optimistic update — show immediately
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      user_id: userId, user_name: userName, user_email: userEmail,
      sender: 'user', message: msg,
      read_by_admin: false, read_by_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setText('');
    scrollBottom();
    inputRef.current?.focus();

    // Persist to DB
    const { data, error } = await supabase.from('chat_messages').insert({
      user_id: userId, user_name: userName, user_email: userEmail,
      sender: 'user', message: msg, read_by_admin: false, read_by_user: true,
    }).select().single();

    if (error) {
      // Remove optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } else if (data) {
      // Replace optimistic with real record
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed bottom-24 right-4 z-[61] w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-bottom-4 duration-200"
        style={{ height: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="bg-background border border-border rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <SupportAvatar size={32} />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">Mesho Support</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-muted/10">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <SupportAvatar size={40} />
                <p className="text-xs text-muted-foreground mt-3">Hi {userName}! 👋<br />How can we help you today?</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex items-end gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.sender === 'admin'
                  ? <SupportAvatar size={24} />
                  : <Avatar src={user?.profile_picture_url} name={userName} size={24} />}
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.sender === 'user'
                  ? 'bg-[#25D366] text-white rounded-br-sm'
                  : 'bg-background border border-border text-foreground rounded-bl-sm shadow-sm'}`}>
                  <p className="leading-snug break-words">{m.message}</p>
                  <p className={`text-[10px] mt-0.5 ${m.sender === 'user' ? 'text-white/60 text-right' : 'text-muted-foreground'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 p-3 border-t border-border bg-background flex-shrink-0">
            <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
              placeholder="Type a message..." autoFocus
              className="flex-1 h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
            <button type="submit" disabled={!text.trim()}
              className="w-9 h-9 bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export const WhatsAppButton = () => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      setPos({ x: Math.max(8, Math.min(window.innerWidth - 64, e.clientX - offset.current.x)), y: Math.max(8, Math.min(window.innerHeight - 64, window.innerHeight - e.clientY - (56 - offset.current.y))) });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  if (!visible) return null;

  return (
    <>
      {open && <ChatWidget onClose={() => setOpen(false)} />}
      <div ref={btnRef}
        onMouseDown={e => { dragging.current = true; hasMoved.current = false; const r = btnRef.current!.getBoundingClientRect(); offset.current = { x: e.clientX - r.left, y: e.clientY - r.top }; e.preventDefault(); }}
        style={{ position: 'fixed', bottom: pos.y, right: pos.x, zIndex: 50 }}>
        <button onClick={() => { if (!hasMoved.current) setOpen(o => !o); }}
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 select-none">
          {open ? <X size={24} /> : <MessageCircle size={26} />}
        </button>
      </div>
    </>
  );
};
