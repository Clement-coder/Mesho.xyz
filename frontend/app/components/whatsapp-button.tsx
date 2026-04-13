'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';

export const WhatsAppButton = () => {
  const [pos, setPos] = useState({ x: 24, y: 24 }); // bottom-left offset
  const [visible, setVisible] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    hasMoved.current = false;
    const rect = btnRef.current!.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      const x = e.clientX - offset.current.x;
      const y = window.innerHeight - e.clientY - (56 - offset.current.y);
      setPos({
        x: Math.max(8, Math.min(x, window.innerWidth - 64)),
        y: Math.max(8, Math.min(y, window.innerHeight - 64)),
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    hasMoved.current = false;
    const t = e.touches[0];
    const rect = btnRef.current!.getBoundingClientRect();
    offset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      hasMoved.current = true;
      const t = e.touches[0];
      const x = t.clientX - offset.current.x;
      const y = window.innerHeight - t.clientY - (56 - offset.current.y);
      setPos({
        x: Math.max(8, Math.min(x, window.innerWidth - 64)),
        y: Math.max(8, Math.min(y, window.innerHeight - 64)),
      });
    };
    const onTouchEnd = () => { dragging.current = false; };
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={btnRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ position: 'fixed', bottom: pos.y, left: pos.x, zIndex: 50, cursor: dragging.current ? 'grabbing' : 'grab' }}
      aria-label="Drag to reposition or click to chat on WhatsApp"
      title="Chat with us on WhatsApp — drag to move"
    >
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (hasMoved.current) e.preventDefault(); }}
        aria-label="Open WhatsApp chat with Mesho Data Sciences"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-colors duration-200 select-none"
        draggable={false}
      >
        <MessageCircle size={26} aria-hidden="true" />
      </a>
    </div>
  );
};
