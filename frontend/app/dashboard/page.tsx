'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '../components/project-card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { BookOpen, BarChart3, Award, FolderOpen, Search, Heart, UserCircle, CreditCard, Clock, CheckCircle, XCircle, ChevronLeft, MessageCircle, ShieldCheck } from 'lucide-react';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';
import { createClient } from '@/utils/supabase/client';
import type { Project, Purchase } from '@/lib/types';

const statusIcon = { pending: Clock, confirmed: CheckCircle, failed: XCircle };
const statusColor = { pending: 'text-yellow-600 bg-yellow-50', confirmed: 'text-green-600 bg-green-50', failed: 'text-red-600 bg-red-50' };

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'all' | 'wishlist' | 'payments'>('enrolled');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [purchases, setPurchases] = useState<(Purchase & { projects?: Project })[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  // Refresh user on mount so role/profile changes take effect
  useEffect(() => { refreshUser(); }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('projects').select('*').order('title'),
      // Fetch all purchases visible to this client, filter by user_id client-side
      // This works regardless of RLS since 07_fixes.sql opens select
      supabase.from('purchases').select('*, projects(*)').order('created_at', { ascending: false }),
    ]).then(([{ data: projs, error: projErr }, { data: allPurch, error: purchErr }]) => {
      if (projErr) console.error('projects error:', projErr);
      if (purchErr) console.error('purchases error:', purchErr);
      // Filter to this user's purchases client-side
      const purch = (allPurch ?? []).filter((p: any) => p.user_id === user.id);
      console.log('user.id:', user.id, 'all purchases:', allPurch?.length, 'mine:', purch.length);
      setAllProjects(projs ?? []);
      setPurchases(purch);
      setLoading(false);
    });
  }, [user]);

  const enrolledProjects = allProjects.filter(p => user?.enrolled_projects.includes(p.id));
  const wishlistProjects = allProjects.filter(p => user?.wishlist.includes(p.id));
  const displayedProjects = activeTab === 'enrolled' ? enrolledProjects : activeTab === 'wishlist' ? wishlistProjects : allProjects;
  const pendingCount = purchases.filter(p => p.status === 'pending').length;

  const handleLogout = () => { logout(); setShowLogoutModal(false); };

  const stats = [
    { icon: FolderOpen, label: 'Purchased Materials', value: enrolledProjects.length, desc: 'Research materials you own' },
    { icon: CreditCard, label: 'Pending Payments', value: pendingCount, desc: 'Awaiting admin confirmation' },
    { icon: Award, label: 'Completed Projects', value: user?.certificates ?? 0, desc: 'Projects fully completed' },
  ];

  const tabs = [
    { id: 'enrolled', label: 'My Materials', icon: FolderOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: pendingCount },
    { id: 'all', label: 'All Topics', icon: Search },
    { id: 'wishlist', label: 'Saved', icon: Heart },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <DashboardSidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as any)} onLogout={() => setShowLogoutModal(true)} />

        <main className="flex-1 md:ml-64 px-4 sm:px-6 py-6 pb-24 md:pb-6">
          {/* Welcome header */}
          <div className="clay p-4 mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={user?.profile_picture_url ?? ''} alt={user?.name} />
                <AvatarFallback className="text-base bg-accent text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold leading-tight truncate">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground text-xs mt-0.5">Manage your research materials and track your academic progress.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="clay p-4 sm:p-5 cursor-pointer" title={stat.desc}
                onClick={() => i === 1 ? setActiveTab('payments') : undefined}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 bg-accent/10 rounded-xl flex items-center justify-center">
                    <stat.icon size={18} className="text-accent" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Tabs — hidden on mobile (use bottom nav instead) */}
          <div className="hidden sm:flex clay p-1 gap-1 mb-5 w-full overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                <tab.icon size={15} />{tab.label}
                {(tab as any).badge > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white text-accent' : 'bg-yellow-500 text-white'}`}>
                    {(tab as any).badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Payments tab */}
          {activeTab === 'payments' && (
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">My Payments</h2>
                <span className="text-xs text-muted-foreground">{purchases.length} total</span>
              </div>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="clay h-24 animate-pulse rounded-2xl" />)
              ) : purchases.length === 0 ? (
                <div className="clay p-10 text-center">
                  <CreditCard size={36} className="text-accent mx-auto mb-3 opacity-60" />
                  <p className="font-semibold mb-1">No payments yet</p>
                  <p className="text-muted-foreground text-sm mb-5">Browse research materials and make your first purchase.</p>
                  <Link href="/departments"><Button><BookOpen size={16} className="mr-2" />Browse Materials</Button></Link>
                </div>
              ) : purchases.map(p => {
                const Icon = statusIcon[p.status];
                const borderColor = p.status === 'confirmed' ? 'border-l-green-400' : p.status === 'failed' ? 'border-l-red-400' : 'border-l-yellow-400';
                return (
                  <div key={p.id} className={`clay p-4 border-l-4 ${borderColor}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm leading-tight">{(p as any).projects?.title ?? 'Research Material'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="font-bold text-accent">₦{p.amount.toLocaleString()}</span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status]}`}>
                          <Icon size={10} />{p.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl px-3 py-2 text-xs text-muted-foreground font-mono mb-3">
                      Ref: {p.payment_reference ?? '—'}
                    </div>
                    {p.status === 'pending' && (
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-700">
                        <Clock size={13} className="flex-shrink-0 mt-0.5" />
                        <span><strong>Awaiting verification</strong> — Admin will confirm your bank transfer and send your material shortly.</span>
                      </div>
                    )}
                    {p.status === 'confirmed' && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700">
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />
                          <span><strong>Payment confirmed!</strong> Contact us on WhatsApp to receive your file.</span>
                        </div>
                        <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello! My payment for "${(p as any).projects?.title ?? 'research material'}" was confirmed (Ref: ${p.payment_reference}). Please send my file.`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 rounded-xl text-xs font-medium transition-colors">
                          <MessageCircle size={13} /> Get My File on WhatsApp
                        </a>
                      </div>
                    )}
                    {p.status === 'failed' && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
                        <XCircle size={13} className="flex-shrink-0 mt-0.5" />
                        <span><strong>Rejected:</strong> {p.rejection_reason ?? 'Payment could not be verified. Please contact support.'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Projects tabs */}
          {activeTab !== 'payments' && (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="clay h-40 animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProjects.length > 0 ? (
                  displayedProjects.map((project, i) => (
                    <div key={project.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                      <ProjectCard title={project.title} description={project.description} difficulty={project.difficulty} price={project.price} onClick={() => router.push(`/projects/${project.id}`)} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full clay p-10 text-center">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={28} className="text-accent" />
                    </div>
                    <p className="font-semibold mb-1">
                      {activeTab === 'enrolled' ? 'No purchased materials yet' : activeTab === 'wishlist' ? 'Nothing saved yet' : 'No topics available'}
                    </p>
                    <p className="text-muted-foreground text-sm mb-5">
                      {activeTab === 'enrolled' ? 'Browse research materials and make your first purchase.' : activeTab === 'wishlist' ? 'Save topics you are interested in for later.' : 'Check back soon for new topics.'}
                    </p>
                    <Link href="/departments"><Button><BookOpen size={16} className="mr-2" />Browse Research Materials</Button></Link>
                  </div>
                )}
              </div>
            )
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border px-1 py-2 flex justify-around z-30">
        {tabs.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)}
            className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all text-xs ${activeTab === item.id ? 'text-accent' : 'text-muted-foreground'}`}>
            <item.icon size={20} />
            <span>{item.label}</span>
            {(item as any).badge > 0 && (
              <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {(item as any).badge}
              </span>
            )}
          </button>
        ))}
        {user?.role === 'admin' ? (
          <Link href="/admin" className="flex-1 px-2">
            <button className="w-full flex flex-col items-center gap-0.5 py-1.5 rounded-xl bg-accent text-white text-xs font-medium">
              <ShieldCheck size={20} /><span>Admin</span>
            </button>
          </Link>
        ) : (
          <Link href="/profile">
            <button className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-muted-foreground text-xs">
              <UserCircle size={20} /><span>Profile</span>
            </button>
          </Link>
        )}
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </ProtectedRoute>
  );
}
