'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Clock, CheckCircle, Banknote, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BottomSheet } from '@/components/bottom-sheet';

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME ?? 'First Bank of Nigeria';
const ACCOUNT_NUMBER = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '0000000000';
const ACCOUNT_NAME = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? 'Mesho Data Sciences';
const COUNTDOWN_SECONDS = 30 * 60;

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  amount: number;
  reference: string;
  onIHavePaid: () => void;
  submitting: boolean;
}

export function BankTransferModal({ isOpen, onClose, projectTitle, amount, reference, onIHavePaid, submitting }: BankTransferModalProps) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) { if (intervalRef.current) clearInterval(intervalRef.current); setSeconds(COUNTDOWN_SECONDS); return; }
    setSeconds(COUNTDOWN_SECONDS);
    intervalRef.current = setInterval(() => setSeconds(s => { if (s <= 1) { clearInterval(intervalRef.current!); return 0; } return s - 1; }), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isOpen]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const expired = seconds === 0;
  const copy = (text: string, label: string) => navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`));

  const details = [
    { label: 'Bank Name', value: BANK_NAME, copyable: false },
    { label: 'Account Number', value: ACCOUNT_NUMBER, copyable: true },
    { label: 'Account Name', value: ACCOUNT_NAME, copyable: false },
    { label: 'Reference / Narration', value: reference, copyable: true },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2"><Banknote size={20} className="text-accent" /><h2 className="font-bold text-base">Bank Transfer Payment</h2></div>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X size={18} /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${expired ? 'bg-destructive/10 border-destructive/30' : 'bg-accent/10 border-accent/20'}`}>
          <div className="flex items-center gap-2">
            <Clock size={16} className={expired ? 'text-destructive' : 'text-accent'} />
            <span className="text-sm font-medium">{expired ? 'Session expired' : 'Time remaining'}</span>
          </div>
          <span className={`font-mono font-bold text-xl tabular-nums ${expired ? 'text-destructive' : 'text-accent'}`}>{mins}:{secs}</span>
        </div>
        {expired && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl p-3">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <span>Session expired. Close and click <strong>Get This Material</strong> again.</span>
          </div>
        )}
        <div className="clay p-4 text-center rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Amount to Transfer</p>
          <p className="text-3xl font-bold text-accent">₦{amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{projectTitle}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Transfer To</p>
          {details.map(item => (
            <div key={item.label} className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-2.5 gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold font-mono break-all">{item.value}</p>
              </div>
              {item.copyable && (
                <button onClick={() => copy(item.value, item.label)} className="flex-shrink-0 p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                  <Copy size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="bg-muted/30 rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
          ⚠️ Use the <strong className="text-foreground">reference number</strong> as your transfer narration. After sending, tap <strong className="text-foreground">"I Have Paid"</strong>.
        </div>
        <Button size="lg" className="w-full" onClick={onIHavePaid} disabled={submitting || expired}>
          {submitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Submitting...</> : <><CheckCircle size={16} className="mr-2" />I Have Paid</>}
        </Button>
      </div>
    </BottomSheet>
  );
}
