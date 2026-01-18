'use client';

import React from 'react';
import { Icon } from './icon-wrapper';
import { ChevronRight } from 'lucide-react';

interface DepartmentCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export const DepartmentCard = ({
  name,
  description,
  icon,
  color,
  onClick,
}: DepartmentCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group w-full h-full text-left bg-card hover:bg-muted border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-accent cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon name={icon as any} size={28} style={{ color }} />
        </div>
        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-semibold text-base mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
    </button>
  );
};
