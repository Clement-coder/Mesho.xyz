'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart3, TrendingUp, Settings, LogOut, FolderOpen, Search, Heart, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { id: 'enrolled', label: 'My Materials', icon: FolderOpen, desc: 'View purchased research materials' },
    { id: 'all', label: 'All Topics', icon: Search, desc: 'Browse all available project topics' },
    { id: 'wishlist', label: 'Saved', icon: Heart, desc: 'Your saved topics' },
  ];

  const serviceLinks = [
    { href: '/departments', icon: BookOpen, label: 'Research Materials' },
    { href: '/training', icon: BarChart3, label: 'SPSS Training' },
    { href: '/hire', icon: TrendingUp, label: 'Hire an Analyst' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border fixed top-[57px] left-0 h-[calc(100vh-57px)] bg-card z-30">
      <div className="flex flex-col h-full p-4 pt-5 overflow-y-auto">

        {onTabChange && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Navigation</p>
            <nav className="space-y-0.5">
              {navItems.map(item => (
                <button key={item.id} onClick={() => onTabChange(item.id)} title={item.desc}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === item.id ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'}`}>
                  <item.icon size={16} />{item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Services</p>
          <nav className="space-y-0.5">
            {serviceLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${pathname === link.href ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-muted'}`}>
                  <link.icon size={16} className="text-accent" />{link.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        {user?.role === 'admin' && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Admin</p>
            <nav className="space-y-0.5">
              <Link href="/admin">
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${pathname?.startsWith('/admin') ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'}`}>
                  <ShieldCheck size={16} className={pathname?.startsWith('/admin') ? 'text-white' : 'text-accent'} />
                  Admin Panel
                </button>
              </Link>
            </nav>
          </div>
        )}

        <div className="mt-auto border-t border-border pt-4 space-y-0.5">
          <Link href="/profile">
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${pathname === '/profile' ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-muted'}`}>
              <Settings size={16} />Profile Settings
            </button>
          </Link>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm">
            <LogOut size={16} />Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
