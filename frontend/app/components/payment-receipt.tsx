'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2, CheckCircle } from 'lucide-react';

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

export function PaymentReceipt({ purchase: p, userName, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const title = (p.projects as any)?.title ?? 'Research Material';
  const receiptText = `🧾 *PAYMENT RECEIPT — MESHO DATA SCIENCES*\n\n📚 Course: ${title}\n💰 Amount: ₦${p.amount.toLocaleString()}\n🔖 Ref: ${p.payment_reference ?? '—'}\n📅 Date: ${new Date(p.created_at).toLocaleString()}\n✅ Status: CONFIRMED\n\nPlease send my file. Thank you!`;

  const captureImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
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
    a.download = `mesho-receipt-${p.payment_reference ?? p.id}.png`;
    a.click();
  };

  const handleShareWhatsApp = async () => {
    // Try Web Share API first (mobile)
    const dataUrl = await captureImage();
    if (dataUrl && navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `mesho-receipt-${p.payment_reference}.png`, { type: 'image/png' });
        await navigator.share({ files: [file], title: 'Payment Receipt', text: receiptText });
        return;
      } catch { /* fall through to WhatsApp link */ }
    }
    // Fallback: open WhatsApp with text receipt
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(receiptText)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}>

          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-base">Payment Receipt</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
          </div>

          {/* Receipt card — this gets captured */}
          <div className="p-4">
            <div ref={receiptRef} className="bg-white rounded-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>
              {/* Header band */}
              <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }} className="px-6 py-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/mesho_logo.png" alt="Mesho" width={40} height={40} style={{ borderRadius: 10, objectFit: 'contain', background: 'white', padding: 3 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>Mesho Data Sciences</p>
                    <p style={{ fontSize: 10, opacity: 0.75, margin: 0 }}>Academic Research Support Platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Payment Confirmed</span>
                </div>
              </div>

              {/* Amount spotlight */}
              <div style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', padding: '16px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Amount Paid</p>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#15803d', margin: 0 }}>₦{p.amount.toLocaleString()}</p>
              </div>

              {/* Details */}
              <div style={{ padding: '16px 24px' }}>
                {[
                  { label: 'Course / Material', value: title },
                  { label: 'Customer', value: userName },
                  { label: 'Reference No.', value: p.payment_reference ?? '—', mono: true },
                  { label: 'Date & Time', value: new Date(p.created_at).toLocaleString() },
                  { label: 'Status', value: '✅ CONFIRMED' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f1f5f9', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#64748b', flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', textAlign: 'right', fontFamily: item.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ background: '#f8fafc', padding: '12px 24px', textAlign: 'center', borderTop: '1px dashed #e2e8f0' }}>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Thank you for choosing Mesho Data Sciences</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0' }}>meshodatasciences.com</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-4 pb-5 grid grid-cols-2 gap-2">
            <button onClick={handleDownload} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50">
              <Download size={15} />{capturing ? 'Saving...' : 'Save Image'}
            </button>
            <button onClick={handleShareWhatsApp} disabled={capturing}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors text-sm font-medium disabled:opacity-50">
              <Share2 size={15} /> Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
