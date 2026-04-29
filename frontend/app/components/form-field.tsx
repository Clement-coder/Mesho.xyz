'use client';

import React from 'react';
import { LucideIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  error?: string;
  success?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, icon: Icon, error, success, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-muted-foreground" aria-hidden="true" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {children}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? <AlertCircle size={15} className="text-destructive" aria-hidden="true" /> : <CheckCircle2 size={15} className="text-green-500" aria-hidden="true" />}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle size={11} aria-hidden="true" />{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

// Styled input with left icon
interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: boolean;
}

export function IconInput({ icon: Icon, error, className = '', ...props }: IconInputProps) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${props.disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'} pointer-events-none`} aria-hidden="true" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-4 h-10 rounded-xl border ${error ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-ring'} bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 clay-inset transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      />
    </div>
  );
}

// Styled textarea
interface IconTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function StyledTextarea({ error, className = '', ...props }: IconTextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-destructive' : 'border-border'} bg-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none clay-inset transition-colors ${className}`}
    />
  );
}
