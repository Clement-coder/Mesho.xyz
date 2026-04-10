'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, FileText, BarChart3, UserCheck, Home, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { LogoutModal } from '@/components/logout-modal';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile');

  const handleLogout = () => { logout(); setShowLogoutModal(false); setMobileMenuOpen(false); };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/departments', label: 'Research Materials', icon: FileText },
    { href: '/training', label: 'SPSS Training', icon: BarChart3 },
    { href: '/hire', label: 'Hire an Analyst', icon: UserCheck },
  ];

  const isActive = (href: string) => pathname === href;

  // Dashboard navbar — minimal: logo + notification + avatar
  if (isDashboard && isAuthenticated) {
    return (
      <>
        <nav className="sticky top-0 z-40 bg-background border-b border-border" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 font-bold text-xl" aria-label="Go to Mesho Data Sciences homepage">
                <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-sm">M</div>
                <span className="hidden sm:inline">Mesho Data Sciences</span>
              </Link>

              {/* Right: notification + avatar */}
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    aria-label="View notifications"
                    title="Notifications"
                    className="w-9 h-9 clay-sm rounded-xl flex items-center justify-center hover:bg-muted transition-colors relative"
                  >
                    <Bell size={18} className="text-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" aria-label="New notifications" />
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-72 clay z-50 p-4">
                      <p className="text-sm font-semibold mb-3">Notifications</p>
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No new notifications
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar + name */}
                <Link href="/profile" aria-label="Go to your profile settings" title="Profile Settings">
                  <div className="flex items-center gap-2 clay-sm px-3 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-accent text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      </>
    );
  }

  // Public navbar
  return (
    <>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      <nav className="sticky top-0 z-40 bg-background border-b border-border" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl" aria-label="Mesho Data Sciences home">
              <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-sm">M</div>
              <span>Mesho Data Sciences</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon size={15} aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 clay-sm px-3 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer" aria-label="Go to your dashboard">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-accent text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" aria-label="Login to your account">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" aria-label="Create a new account">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-1 animate-in slide-in-from-top duration-300">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-colors ${
                    isActive(link.href) ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <link.icon size={16} aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">Login</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button size="sm" className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
};
