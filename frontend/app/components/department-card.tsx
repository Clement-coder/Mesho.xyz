'use client';

import React from 'react';
import { Icon } from './icon-wrapper';
import { ArrowRight } from 'lucide-react';

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
    aria-label={`Browse ${name} — ${description}`}
    title={`View project topics for ${name}`}
    className="group w-full h-full text-left clay clay-hover p-5 transition-all duration-300 cursor-pointer"
  >
    {/* Icon badge */}
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
        aria-hidden="true"
      >
        <Icon name={icon as any} size={24} style={{ color }} />
      </div>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: `${color}18` }}
        aria-hidden="true"
      >
        <ArrowRight size={13} style={{ color }} />
      </div>
    </div>

    {/* Name */}
    <h3 className="font-semibold text-sm mb-1 leading-snug">{name}</h3>

    {/* Description as icon label */}
    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>

    {/* Color accent bar */}
    <div
      className="mt-4 h-0.5 w-8 rounded-full opacity-60 group-hover:w-full transition-all duration-500"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  </button>
);
