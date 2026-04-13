'use client';

import React from 'react';
import { Icon } from './icon-wrapper';
import { ArrowRight, Share2 } from 'lucide-react';
import { ShareButton } from './share-button';

interface DepartmentCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  href?: string;
}

export const DepartmentCard = ({ name, description, icon, color, onClick, href }: DepartmentCardProps) => (
  <div className="group w-full h-full clay clay-hover transition-all duration-300 relative">
    <button
      onClick={onClick}
      aria-label={`Browse ${name}`}
      className="w-full text-left p-5 cursor-pointer block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon name={icon as any} size={24} style={{ color }} />
        </div>
        <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${color}18` }}>
          <ArrowRight size={13} style={{ color }} />
        </div>
      </div>
      <h3 className="font-semibold text-sm mb-1 leading-snug">{name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
      <div className="mt-4 h-0.5 w-8 rounded-full opacity-60 group-hover:w-full transition-all duration-500" style={{ backgroundColor: color }} />
    </button>
    {/* Share button — always visible on mobile, hover on desktop */}
    <div className="absolute bottom-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      <ShareButton
        title={`${name} — Mesho Data Sciences`}
        url={href ?? (typeof window !== 'undefined' ? window.location.origin + '/departments' : '')}
        description={description}
        compact
      />
    </div>
  </div>
);
