'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('All fields are required'); return;
    }
    setLoading(true);
    const { error } = await createClient().from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: 'WhatsApp Chat Support',
      message: form.message.trim(),
    });
    if (error) { toast.error('Failed to send. Please try again.'); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed bottom-24 right-4 z-[61] w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MessageCircle size={18} />
              <span className="font-semibold text-sm">Chat with Support</span>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {sent ? (
            <div className="p-6 text-center">
              <CheckCircle size={36} className="text-[#25D366] mx-auto mb-3" />
              <p className="font-semibold mb-1">Message Sent!</p>
              <p className="text-sm text-muted-foreground mb-4">We'll get back to you shortly.</p>
              <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I just sent a message via the website. My name is ${form.name}.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                <MessageCircle size={16} /> Also chat on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Send us a message and we'll reply via email or WhatsApp.</p>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name" required
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Your email" required
                className="w-full h-9 px-3 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="How can we help you?" rows={3} required
                className="w-full px-3 py-2 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none" />
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                <Send size={15} />{loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
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
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      setPos({
        x: Math.max(8, Math.min(e.clientX - offset.current.x, window.innerWidth - 64)),
        y: Math.max(8, Math.min(window.innerHeight - e.clientY - (56 - offset.current.y), window.innerHeight - 64)),
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, []);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      const t = e.touches[0];
      setPos({
        x: Math.max(8, Math.min(t.clientX - offset.current.x, window.innerWidth - 64)),
        y: Math.max(8, Math.min(window.innerHeight - t.clientY - (56 - offset.current.y), window.innerHeight - 64)),
      });
    };
    const onTouchEnd = () => { dragging.current = false; };
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', onTouchEnd); };
  }, []);

  if (!visible) return null;

  return (
    <>
      {open && <ContactModal onClose={() => setOpen(false)} />}
      <div ref={btnRef}
        onMouseDown={e => { dragging.current = true; hasMoved.current = false; const r = btnRef.current!.getBoundingClientRect(); offset.current = { x: e.clientX - r.left, y: e.clientY - r.top }; e.preventDefault(); }}
        onTouchStart={e => { dragging.current = true; hasMoved.current = false; const t = e.touches[0]; const r = btnRef.current!.getBoundingClientRect(); offset.current = { x: t.clientX - r.left, y: t.clientY - r.top }; }}
        style={{ position: 'fixed', bottom: pos.y, right: pos.x, zIndex: 50, cursor: 'grab' }}
      >
        <button
          onClick={() => { if (!hasMoved.current) setOpen(o => !o); }}
          aria-label="Contact support"
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-colors duration-200 select-none"
        >
          {open ? <X size={24} /> : <MessageCircle size={26} />}
        </button>
      </div>
    </>
  );
};
