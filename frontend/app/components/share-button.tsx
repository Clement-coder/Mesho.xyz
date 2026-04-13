'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react';
import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from 'sonner';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

interface ShareSheetProps {
  title: string;
  url: string;
  description?: string;
}

function ShareSheet({ title, url, description, onClose }: ShareSheetProps & { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const waText = `Check out "${title}" on Mesho Data Sciences!\n${url}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: description ?? title, url }); return; } catch { /* fallback */ }
    }
    copy();
  };

  return (
    <BottomSheet isOpen onClose={onClose} maxHeight="45vh">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-bold text-base">Share</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-muted/30 rounded-xl px-4 py-3">
          <p className="font-semibold text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{url}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={copy}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-medium transition-colors">
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
        <button onClick={nativeShare}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-medium transition-colors">
          <Share2 size={16} /> Share via...
        </button>
      </div>
    </BottomSheet>
  );
}

export function ShareButton({ title, url, description }: ShareSheetProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title="Share this page"
      >
        <Share2 size={15} /> Share
      </button>
      {open && <ShareSheet title={title} url={url} description={description} onClose={() => setOpen(false)} />}
    </>
  );
}
