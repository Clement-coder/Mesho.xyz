'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Add your image filenames to this array as you upload them to /public/carousel/
const slides = [
  { src: '/landing_background.jpeg', alt: 'Academic research support platform' },
  // Add more: { src: '/carousel/slide2.jpg', alt: '...' },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const go = useCallback((idx: number) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const next = () => { setPaused(true); go(current + 1); };
  const prev = () => { setPaused(true); go(current - 1); };
  const goTo = (i: number) => { setPaused(true); go(i); };

  // Resume auto-scroll 5s after manual interaction
  useEffect(() => {
    if (paused) {
      timerRef.current = setTimeout(() => setPaused(false), 5000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [paused, current]);

  // Auto-scroll every 4s
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => go(current + 1), 4000);
    return () => clearInterval(id);
  }, [current, paused, go, total]);

  return (
    <div className="relative w-full h-full min-h-80 rounded-2xl overflow-hidden border border-white/20" aria-label="Image carousel" role="region">
      {/* Slides */}
      <div className="relative w-full h-full min-h-80">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.45)' }} />
          </div>
        ))}
      </div>

      {/* Arrows — only show if more than 1 slide */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            title="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            title="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5" role="tablist" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              title={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
