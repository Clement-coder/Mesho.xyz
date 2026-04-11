'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, BookOpen, BarChart3, UserCheck } from 'lucide-react';

const slides = [
  {
    src: '/research-material-acces.jpeg',
    alt: 'Research Material Access',
    icon: BookOpen,
    title: 'Research Material Access',
    desc: 'Browse and download department-specific project topics and full research materials instantly after payment.',
  },
  {
    src: '/data-anylyst-traning.jpeg',
    alt: 'Data Analyst Training',
    icon: BarChart3,
    title: 'SPSS Data Analysis Training',
    desc: 'Structured training programs to master academic data analysis — from data coding to result interpretation.',
  },
  {
    src: '/Hire-Data-anylyst.jpeg',
    alt: 'Hire a Data Analyst',
    icon: UserCheck,
    title: 'Hire a Data Analyst',
    desc: 'Engage qualified academic data analysts for data cleaning, statistical analysis, and report writing support.',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  const go = useCallback((idx: number) => setCurrent((idx + total) % total), [total]);

  const next = () => { setPaused(true); go(current + 1); };
  const prev = () => { setPaused(true); go(current - 1); };
  const goTo = (i: number) => { setPaused(true); go(i); };

  useEffect(() => {
    if (paused) {
      timerRef.current = setTimeout(() => setPaused(false), 5000);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }
  }, [paused, current]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(current + 1), 4000);
    return () => clearInterval(id);
  }, [current, paused, go]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 bg-[#0a0f1e]" role="region" aria-label="Feature highlights carousel">

      {/* Slides */}
      {slides.map((slide, i) => {
        const Icon = slide.icon;
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            {/* Background image */}
            <Image src={slide.src} alt={slide.alt} fill className="object-contain" priority={i === 0} />

            {/* Dark gradient overlay — stronger at bottom for text legibility */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.15) 100%)' }} />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-accent/80 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-white font-bold text-base leading-tight">{slide.title}</h3>
              </div>
              <p className="text-white/80 text-xs leading-relaxed">{slide.desc}</p>
            </div>
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      <button onClick={prev} aria-label="Previous slide" title="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button onClick={next} aria-label="Next slide" title="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      {/* Dot indicators */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}: ${slides[i].title}`}
            title={slides[i].title}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
