'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, X, Send, Headphones } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import type { ChatMessage } from '@/lib/types';

function UserAvatar({ src, name, size = 28 }: { src?: string | null; name: string; size?: number }) {
  return src
    ? <img src={src} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover flex-shrink-0 ring-2 ring-white" />
    : <div style={{ width: size, height: size, fontSize: size * 0.4 }} className="rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white font-bold ring-2 ring-white">
        {name.charAt(0).toUpperCase()}
      </div>;
}

function SupportAvatar({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm">
      <Headphones size={Math.round(size * 0.45)} className="text-white" />
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
    supabase.from('chat_messages').select('*').eq('user_id', userId).order('created_at')
      .then(({ data }) => { setMessages(data ?? []); scrollBottom(); });
    supabase.from('chat_messages').update({ read_by_user: true })
      .eq('user_id', userId).eq('sender', 'admin').eq('read_by_user', false).then(() => {});

    const channel = supabase.channel(`chat-user-${userId}`, { config: { broadcast: { self: false } } })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${userId}` },
        (payload) => {
          const msg = payload.new as ChatMessage;
          if (msg.sender === 'admin') { setMessages(prev => [...prev, msg]); scrollBottom(); }
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`, user_id: userId, user_name: userName, user_email: userEmail,
      sender: 'user', message: msg, read_by_admin: false, read_by_user: true,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setText('');
    scrollBottom();
    inputRef.current?.focus();
    const { data, error } = await supabase.from('chat_messages').insert({
      user_id: userId, user_name: userName, user_email: userEmail,
      sender: 'user', message: msg, read_by_admin: false, read_by_user: true,
    }).select().single();
    if (error) setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    else if (data) setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
  };

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="fixed bottom-24 right-4 z-[61] w-[calc(100vw-2rem)] max-w-[360px] animate-in slide-in-from-bottom-4 fade-in duration-200"
        style={{ height: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-border">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <SupportAvatar size={38} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Mesho Support</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                <span className="text-white/70 text-xs">Online — typically replies fast</span>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Date chip */}
          <div className="bg-[#ECE5DD] dark:bg-muted/30 flex-shrink-0 flex justify-center py-2">
            <span className="text-[10px] text-muted-foreground bg-white/80 dark:bg-muted px-2 py-0.5 rounded-full shadow-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 bg-[#ECE5DD] dark:bg-muted/20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center pb-4">
                <div className="bg-white dark:bg-card rounded-2xl px-4 py-3 shadow-sm max-w-[80%]">
                  <SupportAvatar size={36} />
                  <p className="text-sm font-medium mt-2">Hi {userName}! 👋</p>
                  <p className="text-xs text-muted-foreground mt-1">How can we help you today? Send us a message and we'll reply shortly.</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => {
              const isUser = m.sender === 'user';
              const showAvatar = i === 0 || messages[i - 1]?.sender !== m.sender;
              return (
                <div key={m.id} className={`flex items-end gap-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}>
                  {showAvatar
                    ? isUser
                      ? <UserAvatar src={user?.profile_picture_url} name={userName} size={24} />
                      : <SupportAvatar size={24} />
                    : <div className="w-6 flex-shrink-0" />}
                  <div className={`max-w-[72%] px-3 py-2 shadow-sm text-sm ${isUser
                    ? 'bg-[#DCF8C6] dark:bg-[#25D366]/30 text-foreground rounded-2xl rounded-br-sm'
                    : 'bg-white dark:bg-card text-foreground rounded-2xl rounded-bl-sm'}`}>
                    <p className="leading-snug break-words">{m.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isUser && <span className="ml-1 text-[#53bdeb]">✓✓</span>}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex items-center gap-2 px-3 py-2.5 bg-[#F0F0F0] dark:bg-card border-t border-border flex-shrink-0">
            <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
              placeholder="Type a message" autoFocus
              className="flex-1 h-9 px-4 rounded-full border-0 bg-white dark:bg-input text-sm focus:outline-none shadow-sm" />
            <button type="submit" disabled={!text.trim()}
              className="w-9 h-9 bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0 shadow-sm">
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
