'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const MessageAlert = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
  }[type];

  const borderColor = {
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    info: 'border-blue-200 dark:border-blue-800',
  }[type];

  const textColor = {
    success: 'text-green-700 dark:text-green-400',
    error: 'text-red-700 dark:text-red-400',
    info: 'text-blue-700 dark:text-blue-400',
  }[type];

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor} animate-in slide-in-from-top fade-in duration-300`}
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close alert"
      >
        <X size={18} />
      </button>
    </div>
  );
};
