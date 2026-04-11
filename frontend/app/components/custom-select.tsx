'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  prefix?: string; // e.g. flag emoji
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  title?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = 'Select...', className = '', ...props }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} aria-label={props['aria-label']} title={props.title}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl border border-border bg-input text-sm clay-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-1.5 truncate">
          {selected ? (
            <>
              {selected.prefix && <span>{selected.prefix}</span>}
              <span>{selected.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={15} className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full clay bg-card border border-border rounded-xl overflow-hidden"
          style={{ boxShadow: 'var(--clay-shadow)' }}
        >
          <div className="max-h-52 overflow-y-auto py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted ${opt.value === value ? 'text-accent font-medium' : 'text-foreground'}`}
              >
                <span className="flex items-center gap-2">
                  {opt.prefix && <span>{opt.prefix}</span>}
                  {opt.label}
                </span>
                {opt.value === value && <Check size={14} className="text-accent flex-shrink-0" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
