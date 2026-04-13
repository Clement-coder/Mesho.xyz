'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';
const ACCENT = '#3b82f6';
const NAVY  = '#1e3a5f';

interface ReceiptProps {
  purchase: {
    id: string;
    amount: number;
    payment_reference: string | null;
    status: string;
    created_at: string;
    projects?: { title?: string } | null;
  };
  userName: string;
  onClose: () => void;
}

function securityCode(ref: string): string {
  let h = 0;
  for (let i = 0; i < ref.length; i++) h = (Math.imul(31, h) + ref.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).toUpperCase().padStart(8, '0');
}

export function PaymentReceipt({ purchase: p, userName, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const title = (p.projects as any)?.title ?? 'Research Material';
  const ref   = p.payment_reference ?? p.id;
  const sec   = securityCode(ref);
  const receiptText = `🧾 *PAYMENT RECEIPT — MESHO DATA SCIENCES*\n\n📚 Course: ${title}\n💰 Amount: ₦${p.amount.toLocaleString()}\n🔖 Ref: ${ref}\n🔐 Code: ${sec}\n📅 Date: ${new Date(p.created_at).toLocaleString()}\n✅ Status: CONFIRMED\n\nPlease send my file. Thank you!`;

  const capture = async () => {
    if (!receiptRef.current) return null;
    setCapturing(true);
    try {
      const h2c = (await import('html2canvas')).default;
      const c = await h2c(receiptRef.current, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff', logging: false });
      return c.toDataURL('image/png');
    } finally { setCapturing(false); }
  };

  const download = async () => {
    const url = await capture();
    if (!url) return;
    const a = document.createElement('a');
    a.href = url; a.download = `mesho-receipt-${ref}.png`; a.click();
  };

  const share = async () => {
    const url = await capture();
    if (url && navigator.share) {
      try {
        const blob = await (await fetch(url)).blob();
        await navigator.share({ files: [new File([blob], `mesho-receipt-${ref}.png`, { type: 'image/png' })], text: receiptText });
        return;
      } catch { /* fallback */ }
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(receiptText)}`, '_blank');
  };

  const rows = [
    { label: 'Course / Material', value: title },
    { label: 'Customer',          value: userName },
    { label: 'Reference No.',     value: ref,  mono: true },
    { label: 'Date & Time',       value: new Date(p.created_at).toLocaleString() },
    { label: 'Status',            value: 'CONFIRMED ✓', green: true },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">

          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-base">Payment Receipt</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
          </div>

          {/* ── RECEIPT (captured) ── */}
          <div className="p-4">
            <div ref={receiptRef} style={{ fontFamily: 'system-ui,sans-serif', background: '#fff', borderRadius: 14, overflow: 'hidden', position: 'relative', border: `2px solid ${ACCENT}` }}>

              {/* Watermark — diagonal, subtle */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                overflow: 'hidden', opacity: 1,
              }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: `${i * 11 - 5}%`,
                    left: '-20%',
                    width: '140%',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: `rgba(59,130,246,0.06)`,
                    whiteSpace: 'nowrap',
                    transform: 'rotate(-25deg)',
                    userSelect: 'none',
                  }}>
                    {'MESHO DATA SCIENCES • VERIFIED • ' + sec + ' • '}
                    {'MESHO DATA SCIENCES • VERIFIED • ' + sec + ' • '}
                    {'MESHO DATA SCIENCES • VERIFIED • ' + sec + ' • '}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2 }}>

                {/* Header — solid navy, no gradient */}
                <div style={{ background: NAVY, padding: '18px 20px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/mesho_logo.png" alt="Mesho" width={38} height={38}
                      style={{ borderRadius: 8, objectFit: 'contain', background: '#fff', padding: 3 }} />
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 13, margin: 0, color: '#fff' }}>Mesho Data Sciences</p>
                      <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Academic Research Support Platform</p>
                    </div>
                  </div>
                  {/* Accent divider */}
                  <div style={{ height: 2, background: ACCENT, borderRadius: 2, marginBottom: 10 }} />
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#86efac', margin: 0, letterSpacing: 1 }}>✅ PAYMENT CONFIRMED</p>
                </div>

                {/* Amount — clean white with accent text */}
                <div style={{ padding: '14px 20px', borderBottom: `1px solid #e2e8f0`, textAlign: 'center', background: '#f8fafc' }}>
                  <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 2 }}>Amount Paid</p>
                  <p style={{ fontSize: 30, fontWeight: 900, color: ACCENT, margin: 0, letterSpacing: -1 }}>₦{p.amount.toLocaleString()}</p>
                </div>

                {/* Details rows */}
                <div style={{ padding: '4px 20px 8px' }}>
                  {rows.map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #f1f5f9', gap: 10 }}>
                      <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{item.label}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, textAlign: 'right', wordBreak: 'break-all',
                        fontFamily: (item as any).mono ? 'monospace' : 'inherit',
                        color: (item as any).green ? '#16a34a' : '#0f172a',
                      }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Security bar — solid accent, no gradient */}
                <div style={{ background: ACCENT, padding: '7px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>🔐 Security Code</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 4 }}>{sec}</span>
                </div>

                {/* Micro-text strip */}
                <div style={{ background: NAVY, padding: '3px 20px', overflow: 'hidden' }}>
                  <p style={{ fontSize: 5.5, color: 'rgba(255,255,255,0.25)', margin: 0, whiteSpace: 'nowrap', letterSpacing: 1, fontFamily: 'monospace' }}>
                    {(`${ref} • ${sec} • MESHO DATA SCIENCES • VERIFIED PAYMENT • `).repeat(8)}
                  </p>
                </div>

                {/* Footer */}
                <div style={{ padding: '8px 20px', textAlign: 'center', background: '#f8fafc' }}>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: 0 }}>This receipt is digitally secured. Any alteration invalidates it.</p>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: '1px 0 0' }}>meshodatasciences.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-4 pb-5 grid grid-cols-2 gap-2">
            <button onClick={download} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
              <Download size={15} />{capturing ? 'Saving...' : 'Save Image'}
            </button>
            <button onClick={share} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors text-sm font-medium disabled:opacity-50">
              <Share2 size={15} />{capturing ? 'Preparing...' : 'Share on WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
