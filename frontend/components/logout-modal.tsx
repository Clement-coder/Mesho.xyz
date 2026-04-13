'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { BottomSheet } from '@/components/bottom-sheet';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="40vh">
      <div className="px-6 pb-8 pt-2 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
            <LogOut size={18} className="text-destructive" />
          </div>
          <div>
            <h2 className="font-bold text-base">Confirm Logout</h2>
            <p className="text-xs text-muted-foreground">You'll need to sign in again.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1">Logout</Button>
        </div>
      </div>
    </BottomSheet>
  );
}
