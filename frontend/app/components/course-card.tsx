'use client';

import React from 'react';
import { Icon } from './icon-wrapper';
import { Badge } from './badge';
import { ChevronRight } from 'lucide-react';

interface CourseCardProps {
  name: string;
  difficulty: string;
  tools: string[];
  icon: string;
  onClick: () => void;
}

export const CourseCard = ({
  name,
  difficulty,
  tools,
  icon,
  onClick,
}: CourseCardProps) => {
  const difficultyColor = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
  } as const;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-card hover:bg-muted border border-border rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-accent cursor-pointer text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <Icon name={icon as any} size={24} className="text-accent" />
        <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-semibold text-sm mb-2 line-clamp-1">{name}</h3>
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={difficultyColor[difficulty as keyof typeof difficultyColor]}>
          {difficulty}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {tools.slice(0, 2).map((tool) => (
          <span key={tool} className="text-xs text-muted-foreground">
            {tool}
            {tools.indexOf(tool) < tools.length - 1 ? ', ' : ''}
          </span>
        ))}
        {tools.length > 2 && (
          <span className="text-xs text-muted-foreground">+{tools.length - 2}</span>
        )}
      </div>
    </button>
  );
};
