'use client';

import React from 'react';
import { Badge } from './badge';
import { ChevronRight, Share2 } from 'lucide-react';
import { ShareButton } from './share-button';

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: string;
  price: number;
  onClick: () => void;
  href?: string;
}

export const ProjectCard = ({ title, description, difficulty, price, onClick, href }: ProjectCardProps) => {
  const difficultyColor = { Beginner: 'success', Intermediate: 'info', Advanced: 'warning', Undergraduate: 'info', Postgraduate: 'warning' } as const;

  return (
    <div className="group w-full clay clay-hover transition-all duration-300 relative">
      <button onClick={onClick} className="w-full text-left p-5 cursor-pointer block">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-3">
          <Badge variant={difficultyColor[difficulty as keyof typeof difficultyColor] ?? 'info'}>{difficulty}</Badge>
          <span className="text-sm font-bold text-accent">₦{price.toLocaleString()}</span>
        </div>
      </button>
      {/* Share button */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ShareButton
          title={title}
          url={href ?? (typeof window !== 'undefined' ? window.location.href : '')}
          description={description}
          compact
        />
      </div>
    </div>
  );
};
