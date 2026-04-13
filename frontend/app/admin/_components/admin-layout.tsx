'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const adminNav = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/purchases', label: 'Purchases' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/hire-requests', label: 'Hire Requests' },
  { href: '/admin/training', label: 'Training' },
  { href: '/admin/messages', label: 'Messages' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-4 overflow-x-auto">
        <span className="text-sm font-semibold text-accent whitespace-nowrap flex items-center gap-1.5">
          <AlertCircle size={15} /> Admin Panel
        </span>
        <div className="flex gap-1">
          {adminNav.map(nav => (
            <Link key={nav.href} href={nav.href}>
              <span className={`text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${pathname === nav.href ? 'bg-accent text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                {nav.label}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/dashboard" className="ml-auto text-xs text-accent hover:underline whitespace-nowrap">← User Dashboard</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
