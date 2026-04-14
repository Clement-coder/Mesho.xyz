'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  compact?: boolean;
}

export function ShareButton({ title, url, description, compact }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  const waText = `Check out "${title}" on Mesho Data Sciences!\n${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const nativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try { await navigator.share({ title, text: description ?? title, url }); setOpen(false); return; } catch { /* fallback */ }
    }
    copy(e);
  };

  return (
    <div ref={ref} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className={`relative z-10 flex items-center gap-1.5 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ${compact ? 'p-1.5' : 'text-sm px-3 py-2'}`}
        title="Share"
      >
        <Share2 size={compact ? 13 : 15} />
        {!compact && 'Share'}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 z-50 w-52 bg-card border border-border rounded-2xl shadow-xl p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <p className="text-xs font-semibold truncate px-1">{title}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={copy}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-xs font-medium">
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-medium transition-colors">
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
          <button onClick={nativeShare}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-medium transition-colors">
            <Share2 size={13} /> Share via…
          </button>
        </div>
      )}
    </div>
  );
}
