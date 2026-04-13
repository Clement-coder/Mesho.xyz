'use client';

import React from 'react';
import { Icon } from './icon-wrapper';
import { Badge } from './badge';
import { ChevronRight } from 'lucide-react';
import { ShareButton } from './share-button';

interface CourseCardProps {
  name: string;
  difficulty: string;
  tools: string[];
  icon: string;
  onClick: () => void;
  href?: string;
}

export const CourseCard = ({ name, difficulty, tools, icon, onClick, href }: CourseCardProps) => {
  const difficultyColor = { Beginner: 'success', Intermediate: 'info', Advanced: 'warning', Undergraduate: 'info', Postgraduate: 'warning' } as const;

  return (
    <div className="group w-full clay clay-hover transition-all duration-300 relative">
      <button onClick={onClick} className="w-full text-left p-5 cursor-pointer block">
        <div className="flex items-start justify-between mb-3">
          <Icon name={icon as any} size={24} className="text-accent" />
          <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="font-semibold text-sm mb-2 line-clamp-1 pr-6">{name}</h3>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={difficultyColor[difficulty as keyof typeof difficultyColor] ?? 'info'}>{difficulty}</Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {tools.slice(0, 2).map((tool, i) => (
            <span key={tool} className="text-xs text-muted-foreground">{tool}{i < Math.min(tools.length, 2) - 1 ? ',' : ''}</span>
          ))}
          {tools.length > 2 && <span className="text-xs text-muted-foreground">+{tools.length - 2}</span>}
        </div>
      </button>
      {/* Share — always visible on mobile */}
      <div className="absolute bottom-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <ShareButton
          title={`${name} — Mesho Data Sciences`}
          url={href ?? (typeof window !== 'undefined' ? window.location.href : '')}
          compact
        />
      </div>
    </div>
  );
};
