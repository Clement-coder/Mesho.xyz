'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/auth-context';
import type { ChatMessage } from '@/lib/types';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

function ChatWidget({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const userId = user?.id ?? 'guest';
  const userName = user?.name ?? 'Guest';
  const userEmail = user?.email ?? '';

  useEffect(() => {
    // Load existing messages
    supabase.from('chat_messages').select('*')
      .eq('user_id', userId).order('created_at')
      .then(({ data }) => setMessages(data ?? []));

    // Mark unread admin messages as read
    supabase.from('chat_messages').update({ read_by_user: true })
      .eq('user_id', userId).eq('sender', 'admin').eq('read_by_user', false).then(() => {});

    // Realtime subscription
    const channel = supabase.channel(`chat-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `user_id=eq.${userId}` },
        (payload) => setMessages(prev => [...prev, payload.new as ChatMessage]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    await supabase.from('chat_messages').insert({
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      sender: 'user',
      message: text.trim(),
      read_by_admin: false,
      read_by_user: true,
    });
    setText('');
    setSending(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed bottom-24 right-4 z-[61] w-[calc(100vw-2rem)] max-w-sm flex flex-col animate-in slide-in-from-bottom-4 duration-300"
        style={{ height: '420px' }}>
        <div className="bg-background border border-border rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold text-sm">Support Chat</span>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle size={28} className="text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-xs text-muted-foreground">Send a message to start chatting with support.</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.sender === 'user'
                  ? 'bg-[#25D366] text-white rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'}`}>
                  {m.sender === 'admin' && <p className="text-xs font-semibold mb-0.5 opacity-70">Support</p>}
                  <p className="leading-snug">{m.message}</p>
                  <p className={`text-[10px] mt-1 ${m.sender === 'user' ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 p-3 border-t border-border flex-shrink-0">
            <input value={text} onChange={e => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
            <button type="submit" disabled={!text.trim() || sending}
              className="w-9 h-9 bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
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
