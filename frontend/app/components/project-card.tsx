'use client';

import React from 'react';
import { Badge } from './badge';
import { ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: string;
  price: number;
  onClick: () => void;
}

export const ProjectCard = ({
  title,
  description,
  difficulty,
  price,
  onClick,
}: ProjectCardProps) => {
  const difficultyColor = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
  } as const;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-card hover:bg-muted border border-border rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-accent cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <ChevronRight size={18} className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex items-center justify-between gap-2 mt-3">
        <Badge variant={difficultyColor[difficulty as keyof typeof difficultyColor]}>
          {difficulty}
        </Badge>
        <span className="text-sm font-semibold text-accent">${price}</span>
      </div>
    </button>
  );
};
