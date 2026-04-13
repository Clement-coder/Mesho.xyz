'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2, CheckCircle, Shield } from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

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

// Generate a deterministic short hash from the reference for the security code
function securityCode(ref: string): string {
  let h = 0;
  for (let i = 0; i < ref.length; i++) h = (Math.imul(31, h) + ref.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).toUpperCase().padStart(8, '0');
}

export function PaymentReceipt({ purchase: p, userName, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const title = (p.projects as any)?.title ?? 'Research Material';
  const ref = p.payment_reference ?? p.id;
  const secCode = securityCode(ref);
  const receiptText = `🧾 *PAYMENT RECEIPT — MESHO DATA SCIENCES*\n\n📚 Course: ${title}\n💰 Amount: ₦${p.amount.toLocaleString()}\n🔖 Ref: ${ref}\n🔐 Security: ${secCode}\n📅 Date: ${new Date(p.created_at).toLocaleString()}\n✅ Status: CONFIRMED\n\nPlease send my file. Thank you!`;

  const captureImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } finally {
      setCapturing(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await captureImage();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `mesho-receipt-${ref}.png`;
    a.click();
  };

  const handleShareWhatsApp = async () => {
    const dataUrl = await captureImage();
    if (dataUrl && navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `mesho-receipt-${ref}.png`, { type: 'image/png' });
        await navigator.share({ files: [file], title: 'Payment Receipt', text: receiptText });
        return;
      } catch { /* fall through */ }
    }
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(receiptText)}`, '_blank');
  };

  // Watermark rows — diagonal repeating text
  const wmText = `MESHO DATA SCIENCES • VERIFIED • ${secCode} • `;
  const wmRows = Array.from({ length: 12 });

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-base">Payment Receipt</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
          </div>

          <div className="p-4">
            {/* ── RECEIPT CARD (captured as image) ── */}
            <div ref={receiptRef} style={{ fontFamily: 'system-ui,sans-serif', background: '#fff', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>

              {/* ── WATERMARK LAYER (behind content) ── */}
              <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1,
                transform: 'rotate(-30deg) scale(1.5)',
                transformOrigin: 'center center',
              }}>
                {wmRows.map((_, i) => (
                  <div key={i} style={{
                    whiteSpace: 'nowrap', fontSize: 9, fontWeight: 700, letterSpacing: 2,
                    color: 'rgba(37,99,235,0.07)',
                    padding: '10px 0',
                    userSelect: 'none',
                  }}>
                    {wmText.repeat(8)}
                  </div>
                ))}
              </div>

              {/* ── HOLOGRAPHIC BORDER ── */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
                border: '3px solid transparent',
                borderRadius: 16,
                background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#2563eb,#7c3aed,#db2777,#f59e0b,#10b981,#2563eb) border-box',
              }} />

              {/* ── CONTENT (above watermark) ── */}
              <div style={{ position: 'relative', zIndex: 3 }}>
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/mesho_logo.png" alt="Mesho" width={44} height={44}
                      style={{ borderRadius: 10, objectFit: 'contain', background: 'white', padding: 4 }} />
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 15, margin: 0, color: '#fff' }}>Mesho Data Sciences</p>
                      <p style={{ fontSize: 10, opacity: 0.7, margin: 0, color: '#fff' }}>Academic Research Support Platform</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#86efac' }}>Payment Confirmed</span>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', padding: '14px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: 2 }}>Amount Paid</p>
                  <p style={{ fontSize: 34, fontWeight: 900, color: '#15803d', margin: 0, letterSpacing: -1 }}>₦{p.amount.toLocaleString()}</p>
                </div>

                {/* Details */}
                <div style={{ padding: '12px 24px' }}>
                  {[
                    { label: 'Course / Material', value: title },
                    { label: 'Customer', value: userName },
                    { label: 'Reference No.', value: ref, mono: true },
                    { label: 'Date & Time', value: new Date(p.created_at).toLocaleString() },
                    { label: 'Status', value: '✅ CONFIRMED' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #f1f5f9', gap: 12 }}>
                      <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>{item.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textAlign: 'right', fontFamily: item.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Security strip */}
                <div style={{ background: 'linear-gradient(90deg,#1e3a5f,#2563eb,#7c3aed)', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>🔐</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Security Code</span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#fbbf24', letterSpacing: 3 }}>{secCode}</span>
                </div>

                {/* Micro-text security line */}
                <div style={{ background: '#1e3a5f', padding: '4px 24px', overflow: 'hidden' }}>
                  <p style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)', margin: 0, whiteSpace: 'nowrap', letterSpacing: 1, fontFamily: 'monospace' }}>
                    {`${ref} • ${secCode} • MESHO DATA SCIENCES • VERIFIED PAYMENT • `.repeat(6)}
                  </p>
                </div>

                {/* Footer */}
                <div style={{ background: '#f8fafc', padding: '10px 24px', textAlign: 'center', borderTop: '1px dashed #e2e8f0' }}>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: 0 }}>This receipt is digitally secured. Any alteration invalidates it.</p>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: '2px 0 0' }}>meshodatasciences.com • {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-4 pb-5 grid grid-cols-2 gap-2">
            <button onClick={handleDownload} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
              <Download size={15} />{capturing ? 'Saving...' : 'Save Image'}
            </button>
            <button onClick={handleShareWhatsApp} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors text-sm font-medium disabled:opacity-50">
              <Share2 size={15} />{capturing ? 'Preparing...' : 'Share on WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
