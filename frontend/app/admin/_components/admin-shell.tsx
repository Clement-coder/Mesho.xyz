'use client';

import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, FolderOpen, UserCheck, BookOpen, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export type AdminTab = 'overview' | 'users' | 'purchases' | 'projects' | 'hire' | 'training' | 'messages';

export const adminTabs: { id: AdminTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'overview',   label: 'Overview',       icon: LayoutDashboard, color: 'text-accent' },
  { id: 'users',      label: 'Users',          icon: Users,           color: 'text-blue-500' },
  { id: 'purchases',  label: 'Purchases',      icon: ShoppingCart,    color: 'text-green-500' },
  { id: 'projects',   label: 'Projects',       icon: FolderOpen,      color: 'text-purple-500' },
  { id: 'hire',       label: 'Hire Requests',  icon: UserCheck,       color: 'text-orange-500' },
  { id: 'training',   label: 'Training',       icon: BookOpen,        color: 'text-teal-500' },
  { id: 'messages',   label: 'Messages',       icon: MessageCircle,   color: 'text-pink-500' },
];

interface AdminShellProps {
  active: AdminTab;
  onTab: (t: AdminTab) => void;
  badges?: Partial<Record<AdminTab, number>>;
  children: React.ReactNode;
}

export function AdminShell({ active, onTab, badges = {}, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border fixed top-[57px] left-0 h-[calc(100vh-57px)] bg-card z-30 p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Admin Panel</p>
        <nav className="flex-1 space-y-0.5">
          {adminTabs.map(t => {
            const Icon = t.icon;
            const badge = badges[t.id];
            return (
              <button key={t.id} onClick={() => onTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${active === t.id ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'}`}>
                <Icon size={16} className={active === t.id ? 'text-white' : t.color} />
                {t.label}
                {badge ? (
                  <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${active === t.id ? 'bg-white text-accent' : 'bg-yellow-500 text-white'}`}>{badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors mt-2 border-t border-border pt-3">
          <ArrowLeft size={15} /> User Dashboard
        </Link>
      </aside>

      {/* Mobile top tabs */}
      <div className="md:hidden fixed top-[57px] left-0 right-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-accent font-medium">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <span className="text-muted-foreground text-xs ml-auto">Admin Panel</span>
        </div>
        <div className="flex overflow-x-auto gap-1 px-2 py-2">
          {adminTabs.map(t => {
            const Icon = t.icon;
            const badge = badges[t.id];
            return (
              <button key={t.id} onClick={() => onTab(t.id)}
                className={`relative flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${active === t.id ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                <Icon size={16} />
                {t.label.split(' ')[0]}
                {badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-[57px] md:pt-0">
        <div className="md:hidden h-24" />{/* spacer for mobile tabs + back row */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
