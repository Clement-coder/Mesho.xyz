'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max height as a CSS value, default '85vh' */
  maxHeight?: string;
}

export function BottomSheet({ isOpen, onClose, children, maxHeight = '85vh' }: BottomSheetProps) {
  const [visible, setVisible] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
      setVisible(true);
    } else {
      setTranslateY(600);
      const t = setTimeout(() => setVisible(false), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const onDragStart = (clientY: number) => {
    startY.current = clientY;
    dragging.current = true;
  };

  const onDragMove = useCallback((clientY: number) => {
    if (!dragging.current) return;
    const dy = clientY - startY.current;
    if (dy > 0) setTranslateY(dy);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (translateY > 100) {
      onClose();
    } else {
      setTranslateY(0);
    }
  }, [translateY, onClose]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => onDragMove(e.touches[0].clientY);
  const onTouchEnd = () => onDragEnd();

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => onDragStart(e.clientY);
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => onDragMove(e.clientY);
    const onMouseUp = () => onDragEnd();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onDragMove, onDragEnd]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background"
        style={{
          borderRadius: '20px 20px 0 0',
          maxHeight,
          transform: `translateY(${translateY}px)`,
          transition: dragging.current ? 'none' : 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
