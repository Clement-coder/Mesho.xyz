'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, FileText, BarChart3, UserCheck, Home, CheckCircle, XCircle, MessageSquare, Gift, Users, BellOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { LogoutModal } from '@/components/logout-modal';
import { createClient } from '@/utils/supabase/client';
import type { Notification } from '@/lib/types';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setNotifications(data ?? []));

    const channel = supabase.channel(`notif-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => setNotifications(prev => [payload.new as Notification, ...prev]))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    await createClient().from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotifClick = async (n: Notification) => {
    if (!n.read) {
      await createClient().from('notifications').update({ read: true }).eq('id', n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
    if (n.link) router.push(n.link);
    setNotifOpen(false);
  };

  const isDashboard = pathname?.startsWith('/dashboard');
  const handleLogout = async () => { await logout(); setShowLogoutModal(false); setMobileMenuOpen(false); };

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
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent/10 rounded-xl flex items-center justify-center">
                <Bell size={16} className="text-accent" />
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">Notifications</h2>
                {unreadCount > 0 && <p className="text-[10px] text-muted-foreground">{unreadCount} unread</p>}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-accent hover:text-accent/80 font-medium px-2 py-1 rounded-lg hover:bg-accent/10 transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={() => setNotifOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <BellOff size={24} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-1">All caught up</p>
                <p className="text-xs text-muted-foreground leading-relaxed">You have no notifications yet. We'll alert you about payments, referrals, and messages.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {notifications.map(n => {
                  const iconMap: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
                    payment_confirmed: { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' },
                    payment_rejected: { icon: XCircle, bg: 'bg-red-100', color: 'text-red-500' },
                    message: { icon: MessageSquare, bg: 'bg-blue-100', color: 'text-blue-600' },
                    referral_signup: { icon: Users, bg: 'bg-accent/10', color: 'text-accent' },
                    referral_completed: { icon: Gift, bg: 'bg-amber-100', color: 'text-amber-600' },
                    general: { icon: Bell, bg: 'bg-accent/10', color: 'text-accent' },
                  };
                  const { icon: Icon, bg, color } = iconMap[n.type] ?? iconMap.general;
                  return (
                    <button key={n.id} onClick={() => handleNotifClick(n)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-accent/[0.04]' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                          <Icon size={15} className={color} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <p className={`text-xs font-semibold leading-tight truncate ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <nav className="sticky top-0 z-40 bg-background border-b border-border h-[57px] flex items-center" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold" aria-label="Go to homepage">
              <Image src="/mesho_logo.png" alt="Mesho Data Sciences logo" width={56} height={56} className="rounded-xl object-contain" />
              <span className="hidden sm:inline text-base">Mesho Data Sciences</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={() => setNotifOpen(true)} aria-label="Notifications" className="relative w-9 h-9 clay-sm rounded-xl flex items-center justify-center hover:bg-muted transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <Link href="/profile" aria-label="Profile Settings" title="Manage your account">
                <div className="flex items-center gap-2 clay-sm px-2 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarImage src={user?.profile_picture_url ?? ''} alt={user?.name} />
                    <AvatarFallback className="bg-accent text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
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
              <Image src="/mesho_logo.png" alt="Mesho Data Sciences logo" width={56} height={56} className="rounded-xl object-contain" />
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
                  <div className="flex items-center gap-2 clay-sm px-2 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer" aria-label="Go to your dashboard">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarImage src={user?.profile_picture_url ?? ''} alt={user?.name} />
                      <AvatarFallback className="bg-accent text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" size="sm">Login</Button></Link>
                  <Link href="/signup"><Button size="sm">Sign Up</Button></Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && (
                <Link href="/dashboard">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profile_picture_url ?? ''} alt={user?.name} />
                    <AvatarFallback className="bg-accent text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
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
