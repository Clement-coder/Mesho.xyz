'use client';

import React from 'react';
import { parsePhoneNumber } from '@/lib/phone-utils';
import { Phone } from 'lucide-react';

interface PhoneDisplayProps {
  phone: string | null | undefined;
  className?: string;
}

export function PhoneDisplay({ phone, className = '' }: PhoneDisplayProps) {
  const parsed = parsePhoneNumber(phone);

  if (!parsed.number) {
    return <span className={`text-muted-foreground italic text-xs ${className}`}>No number</span>;
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-sm" title={parsed.code}>{parsed.flag}</span>
      {parsed.code && <span className="text-xs text-muted-foreground font-medium">{parsed.code}</span>}
      <span className="text-sm font-medium">{parsed.number}</span>
    </div>
  );
}

interface DisabledPhoneInputProps {
  phone: string | null | undefined;
  className?: string;
  id?: string;
}

export function DisabledPhoneInput({ phone, className = '', id }: DisabledPhoneInputProps) {
  const parsed = parsePhoneNumber(phone);

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Country Code & Flag Display */}
      <div className="w-28 flex-shrink-0 h-10 rounded-xl border border-border bg-input/60 opacity-60 flex items-center justify-center gap-1.5 cursor-not-allowed">
        <span>{parsed.flag}</span>
        <span className="text-sm text-muted-foreground font-medium">{parsed.code}</span>
      </div>

      {/* Number Display */}
      <div className="relative flex-1">
        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
        <input
          id={id}
          type="text"
          value={parsed.number}
          disabled
          className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-input text-sm focus-visible:outline-none clay-inset transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
