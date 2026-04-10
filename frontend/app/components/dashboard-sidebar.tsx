'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart3, TrendingUp, Settings, LogOut, FolderOpen, Search, Heart } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ activeTab, onTabChange, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: 'enrolled', label: 'My Materials', icon: FolderOpen, desc: 'View purchased research materials' },
    { id: 'all', label: 'All Topics', icon: Search, desc: 'Browse all available project topics' },
    { id: 'wishlist', label: 'Saved', icon: Heart, desc: 'Your saved topics' },
  ];

  const serviceLinks = [
    { href: '/departments', icon: BookOpen, label: 'Research Materials', desc: 'Browse project topics by department' },
    { href: '/training', icon: BarChart3, label: 'SPSS Training', desc: 'Register for data analysis training' },
    { href: '/hire', icon: TrendingUp, label: 'Hire an Analyst', desc: 'Get professional data analysis help' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border fixed top-[57px] left-0 h-[calc(100vh-57px)] bg-card z-20">
      <div className="flex flex-col h-full p-4 pt-5 overflow-y-auto">

        {/* Navigation — only on dashboard */}
        {onTabChange && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Navigation</p>
            <nav className="space-y-0.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={item.desc}
                  aria-label={item.desc}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                    activeTab === item.id ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon size={16} aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Services */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Services</p>
          <nav className="space-y-0.5">
            {serviceLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <button
                  title={link.desc}
                  aria-label={link.desc}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    pathname === link.href ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon size={16} className={pathname === link.href ? 'text-accent' : 'text-accent'} aria-hidden="true" />
                  {link.label}
                </button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom — pushed to end */}
        <div className="mt-auto border-t border-border pt-4 space-y-0.5">
          <Link href="/profile">
            <button
              title="Edit your profile settings"
              aria-label="Profile Settings"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                pathname === '/profile' ? 'bg-accent/10 text-accent' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Settings size={16} aria-hidden="true" />
              Profile Settings
            </button>
          </Link>
          <button
            onClick={onLogout}
            title="Sign out of your account"
            aria-label="Logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm"
          >
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
}
