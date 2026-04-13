'use client';

import React from 'react';
import { X } from 'lucide-react';
import { BottomSheet } from '@/components/bottom-sheet';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SlideModal = ({ isOpen, onClose, title, children }: SlideModalProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </BottomSheet>
  );
};
