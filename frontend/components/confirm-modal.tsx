'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { BottomSheet } from '@/components/bottom-sheet';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="40vh">
      <div className="px-6 pb-8 pt-2 space-y-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-accent/10'}`}>
            <AlertTriangle size={18} className={variant === 'destructive' ? 'text-destructive' : 'text-accent'} />
          </div>
          <div>
            <h2 className="font-bold text-base">{title}</h2>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>{cancelLabel}</Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Please wait...</>
              : confirmLabel}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
