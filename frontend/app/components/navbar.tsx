'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, FileText, BarChart3, UserCheck, Home } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { LogoutModal } from '@/components/logout-modal';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard');
  const handleLogout = () => { logout(); setShowLogoutModal(false); setMobileMenuOpen(false); };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/departments', label: 'Research Materials', icon: FileText },
    { href: '/training', label: 'SPSS Training', icon: BarChart3 },
    { href: '/hire', label: 'Hire a Data Analyst', icon: UserCheck },
  ];

  const isActive = (href: string) => pathname === href;

  // Dashboard navbar
  if (isDashboard && isAuthenticated) {
    return (
      <>
        {notifOpen && <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setNotifOpen(false)} />}
        <div className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50 flex flex-col transition-transform duration-300 ${notifOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.10)' }} role="dialog" aria-label="Notifications panel">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-accent" aria-hidden="true" />
              <h2 className="font-semibold text-base">Notifications</h2>
            </div>
            <button onClick={() => setNotifOpen(false)} aria-label="Close notifications" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-5 text-center py-12">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bell size={22} className="text-accent" />
            </div>
            <p className="text-sm font-medium mb-1">No notifications yet</p>
            <p className="text-xs text-muted-foreground">We'll notify you about your orders and updates here.</p>
          </div>
        </div>

        <nav className="sticky top-0 z-40 bg-background border-b border-border h-[57px] flex items-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold" aria-label="Go to homepage">
              <Image src="/Mesho_logo.png" alt="Mesho Data Sciences logo" width={32} height={32} className="rounded-xl" />
              <span className="hidden sm:inline text-base">Mesho Data Sciences</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={() => setNotifOpen(true)} aria-label="Open notifications — view your orders and updates" title="Notifications" className="relative w-9 h-9 clay-sm rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                <Bell size={18} aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
              </button>
              <Link href="/profile" aria-label="Profile Settings" title="Manage your account">
                <div className="flex items-center gap-2 clay-sm px-3 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-accent text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
                </div>
              </Link>
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
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <div className="sticky top-0 z-40">
        <nav className="bg-background border-b border-border h-[57px] flex items-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold" aria-label="Mesho Data Sciences home">
              <Image src="/Mesho_logo.png" alt="Mesho Data Sciences logo" width={32} height={32} className="rounded-xl" />
              <span className="hidden sm:inline">Mesho Data Sciences</span>
              <span className="sm:hidden font-bold">Mesho</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} aria-label={link.label}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                >
                  <link.icon size={15} aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 clay-sm px-3 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer" aria-label="Go to your dashboard">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-accent text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" size="sm">Login</Button></Link>
                  <Link href="/signup"><Button size="sm">Sign Up</Button></Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown — rendered below nav, not inside it */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top duration-200" style={{ boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}>
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-xl transition-colors ${isActive(link.href) ? 'bg-accent text-white' : 'text-foreground hover:bg-muted'}`}
                >
                  <link.icon size={16} aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 mt-1 border-t border-border">
                {isAuthenticated ? (
                  <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full bg-transparent">Login</Button></Link>
                    <Link href="/signup" className="flex-1"><Button size="sm" className="w-full">Sign Up</Button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </>
  );
};
