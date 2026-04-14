'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
  compact?: boolean;
  /** Ref to the grid/section container this sheet should cover */
  gridRef?: React.RefObject<HTMLElement | null>;
}

function ShareSheet({ title, url, description, onClose, gridRef }: ShareButtonProps & { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => { setCopied(false); onClose(); }, 1500);
  };

  const waText = `Check out "${title}" on Mesho Data Sciences!\n${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const nativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try { await navigator.share({ title, text: description ?? title, url }); onClose(); return; } catch { /* fallback */ }
    }
    copy(e);
  };

  // Get bounding rect of grid container, fall back to full viewport
  const rect = gridRef?.current?.getBoundingClientRect();
  const overlayStyle: React.CSSProperties = rect
    ? { position: 'fixed', top: rect.top, left: rect.left, width: rect.width, height: rect.height, zIndex: 40, overflow: 'hidden', borderRadius: 'inherit' }
    : { position: 'fixed', inset: 0, zIndex: 40 };

  const sheet = (
    <div style={overlayStyle} onClick={e => { e.stopPropagation(); onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 rounded-[inherit]" />
      {/* Sheet slides up from bottom of the container */}
      <div
        className="absolute inset-x-0 bottom-0 bg-background rounded-t-2xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base">Share</h2>
          <button onClick={e => { e.stopPropagation(); onClose(); }} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
        </div>
        <div className="bg-muted/30 rounded-xl px-4 py-3">
          <p className="font-semibold text-sm truncate">{title}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={copy}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => onClose()}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-medium transition-colors">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
        <button onClick={nativeShare}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors">
          <Share2 size={16} /> Share via...
        </button>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(sheet, document.body);
}

export function ShareButton({ title, url, description, compact, gridRef }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        className={`relative z-10 flex items-center gap-1.5 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ${compact ? 'p-1.5' : 'text-sm px-3 py-2'}`}
        title="Share"
      >
        <Share2 size={compact ? 13 : 15} />
        {!compact && 'Share'}
      </button>
      {open && <ShareSheet title={title} url={url} description={description} gridRef={gridRef} onClose={() => setOpen(false)} />}
    </>
  );
}
