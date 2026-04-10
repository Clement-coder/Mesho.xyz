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

export const DepartmentCard = ({ name, description, icon, color, onClick }: DepartmentCardProps) => (
  <button
    onClick={onClick}
    className="group w-full h-full text-left clay clay-hover p-6 transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
        <Icon name={icon as any} size={28} style={{ color }} />
      </div>
      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent mt-1" />
    </div>
    <h3 className="font-semibold text-base mb-2">{name}</h3>
    <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
  </button>
);
