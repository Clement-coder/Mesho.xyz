'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '../components/project-card';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutModal } from '@/components/logout-modal';
import { DashboardSidebar } from '../components/dashboard-sidebar';
import { BookOpen, BarChart3, Award, FolderOpen, Search, Heart, UserCircle, CreditCard, Clock, CheckCircle, XCircle, ChevronLeft, MessageCircle, ShieldCheck, Eye, X, Copy, Building2, ClipboardList, Info } from 'lucide-react';
import { PaymentReceipt } from '../components/payment-receipt';
import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from 'sonner';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2348012345678';
import { createClient } from '@/utils/supabase/client';
import type { Project, Purchase, HireRequest } from '@/lib/types';
import { getUserHireRequests } from './actions';

const statusIcon = { awaiting_confirmation: Clock, pending: Clock, confirmed: CheckCircle, failed: XCircle };
const statusColor = { awaiting_confirmation: 'text-blue-600 bg-blue-50', pending: 'text-yellow-600 bg-yellow-50', confirmed: 'text-green-600 bg-green-50', failed: 'text-red-600 bg-red-50' };

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'all' | 'wishlist' | 'payments' | 'hire'>('enrolled');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [purchases, setPurchases] = useState<(Purchase & { projects?: Project })[]>([]);
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewPayment, setViewPayment] = useState<(Purchase & { projects?: Project }) | null>(null);
  const [viewHireRequest, setViewHireRequest] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Honor ?tab= redirect from external pages
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'payments') setActiveTab('payments');
    if (tab === 'hire') setActiveTab('hire');
  }, [searchParams]);

  // Reset search on tab change
  useEffect(() => { setSearch(''); }, [activeTab]);

  // Refresh user on mount so role/profile changes take effect
  useEffect(() => { refreshUser(); }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('projects').select('*').order('title'),
      supabase.from('purchases').select('*, projects(*)').order('created_at', { ascending: false }),
      getUserHireRequests(user.email)
    ]).then(([{ data: projs, error: projErr }, { data: allPurch, error: purchErr }, hireData]) => {
      if (projErr) console.error('projects error:', projErr);
      if (purchErr) console.error('purchases error:', purchErr);
      const purch = (allPurch ?? []).filter((p: any) => p.user_id === user.id);
      setAllProjects(projs ?? []);
      setPurchases(purch);
      setHireRequests(hireData ?? []);
      setLoading(false);
    });
  }, [user]);

  const confirmedProjectIds = purchases.filter(p => p.status === 'confirmed').map(p => p.project_id);
  const enrolledProjects = allProjects.filter(p => confirmedProjectIds.includes(p.id));
  const wishlistProjects = allProjects.filter(p => user?.wishlist.includes(p.id));
  const baseProjects = activeTab === 'enrolled' ? enrolledProjects : activeTab === 'wishlist' ? wishlistProjects : allProjects;
  const displayedProjects = search.trim()
    ? baseProjects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    : baseProjects;
  const pendingCount = purchases.filter(p => p.status === 'pending' || p.status === 'awaiting_confirmation').length;
  const purchasedCount = purchases.filter(p => p.status === 'confirmed').length;

  const handleLogout = () => { logout(); setShowLogoutModal(false); };

  const stats = [
    { icon: FolderOpen, label: 'Purchased Materials', value: purchasedCount, desc: 'Research materials you own' },
    { icon: CreditCard, label: 'Pending Payments', value: pendingCount, desc: 'Awaiting admin confirmation' },
    { icon: Award, label: 'Completed Projects', value: purchasedCount, desc: 'Projects fully completed' },
  ];

  const tabs = [
    { id: 'enrolled', label: 'My Materials', short: 'Materials', icon: FolderOpen },
    { id: 'payments', label: 'Payments', short: 'Payments', icon: CreditCard, badge: pendingCount },
    { id: 'all', label: 'All Topics', short: 'Topics', icon: Search },
    { id: 'wishlist', label: 'Saved', short: 'Saved', icon: Heart },
    { id: 'hire', label: 'My Hire Requests', short: 'Hire', icon: UserCircle },
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
            <div className="space-y-3">
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
                const Icon = statusIcon[p.status as keyof typeof statusIcon] ?? Clock;
                const borderColor = p.status === 'confirmed' ? 'border-l-green-400' : p.status === 'failed' ? 'border-l-red-400' : p.status === 'awaiting_confirmation' ? 'border-l-blue-400' : 'border-l-yellow-400';
                return (
                  <div key={p.id} className={`clay p-3 sm:p-4 border-l-4 ${borderColor}`}>
                    {/* Top row: title + amount */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-sm leading-tight min-w-0 flex-1 pr-2">{(p as any).projects?.title ?? 'Research Material'}</p>
                      <span className="font-bold text-accent text-sm flex-shrink-0">₦{p.amount.toLocaleString()}</span>
                    </div>
                    {/* Date + status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${(statusColor as any)[p.status] ?? statusColor.pending}`}>
                        <Icon size={10} />
                        {p.status === 'awaiting_confirmation' ? 'initiated' : p.status}
                      </span>
                    </div>
                    {/* Ref + View */}
                    <div className="flex items-center gap-2 mb-3">
                      <p className="bg-muted/30 rounded-lg px-2 py-1.5 text-xs text-muted-foreground font-mono flex-1 truncate min-w-0">
                        {p.payment_reference ?? '—'}
                      </p>
                      <button onClick={() => setViewPayment(p)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors flex-shrink-0">
                        <Eye size={12} /> View
                      </button>
                    </div>
                    {p.status === 'awaiting_confirmation' && (
                      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700">
                        <Clock size={13} className="flex-shrink-0 mt-0.5" />
                        <span><strong>Payment initiated</strong> — Please complete your bank transfer using the reference above, then tap "I Have Paid" on the payment screen.</span>
                      </div>
                    )}
                    {p.status === 'pending' && (
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-700">
                        <Clock size={13} className="flex-shrink-0 mt-0.5" />
                        <span><strong>Awaiting verification</strong> — Admin will confirm your bank transfer and send your material shortly.</span>
                      </div>
                    )}
                    {p.status === 'confirmed' && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700 flex-1">
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />
                          <span><strong>Payment confirmed!</strong> Send your receipt to get your file.</span>
                        </div>
                        <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`🧾 *PAYMENT RECEIPT — MESHO DATA SCIENCES*\n\n📚 Course: ${(p as any).projects?.title ?? 'Research Material'}\n💰 Amount: ₦${p.amount.toLocaleString()}\n🔖 Ref: ${p.payment_reference ?? '—'}\n📅 Date: ${new Date(p.created_at).toLocaleString()}\n✅ Status: CONFIRMED\n\nPlease send my file. Thank you!`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 sm:flex-shrink-0 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 px-4 rounded-xl text-xs font-medium transition-colors whitespace-nowrap">
                          <MessageCircle size={13} /> Send Receipt & Get My File
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

          {/* Hire Requests tab */}
          {activeTab === 'hire' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">My Hire Requests</h2>
                <span className="text-xs text-muted-foreground">{hireRequests.length} total</span>
              </div>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="clay h-24 animate-pulse rounded-2xl" />)
              ) : hireRequests.length === 0 ? (
                <div className="clay p-10 text-center">
                  <UserCircle size={36} className="text-accent mx-auto mb-3 opacity-60" />
                  <p className="font-semibold mb-1">No hire requests yet</p>
                  <p className="text-muted-foreground text-sm mb-5">Need a data analyst or researcher? We can help.</p>
                  <Link href="/hire"><Button><BookOpen size={16} className="mr-2" />Hire a Professional</Button></Link>
                </div>
              ) : hireRequests.map((r, i) => {
                const isExpanded = viewHireRequest === r.id;
                return (
                  <div key={r.id} className="clay p-4 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-medium truncate">{r.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                            {r.type === 'analyst' ? 'Data Analyst' : 'Researcher'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'completed' ? 'bg-green-100 text-green-700' : r.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : r.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {r.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">Dept: {r.department}{r.topic ? ` • Topic: ${r.topic}` : ''}</p>
                      </div>
                      <button onClick={() => setViewHireRequest(isExpanded ? null : r.id)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors flex-shrink-0">
                        {isExpanded ? 'Hide' : 'View Details'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-sm">
                          {r.deadline && (
                            <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                              <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground mb-0.5">Deadline</p><p className="font-medium">{new Date(r.deadline).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                            </div>
                          )}
                          {r.institution && (
                            <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                              <Building2 size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground mb-0.5">Institution</p><p className="font-medium">{r.institution}</p></div>
                            </div>
                          )}
                          {r.research_type && (
                            <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                              <BookOpen size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground mb-0.5">Research Type</p><p className="font-medium capitalize">{r.research_type}</p></div>
                            </div>
                          )}
                          {r.services && r.services.length > 0 && (
                            <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                              <ClipboardList size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div><p className="text-xs text-muted-foreground mb-0.5">Requested Services</p><p className="font-medium capitalize">{r.services.join(', ')}</p></div>
                            </div>
                          )}
                        </div>
                        {r.details && (
                          <div className="flex items-start gap-3 bg-accent/5 rounded-xl p-4 mb-5">
                            <Info size={18} className="text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Additional Details</p>
                              <p className="text-sm leading-relaxed">{r.details}</p>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mb-4">Submitted on {new Date(r.created_at).toLocaleString()}</p>
                        <div className="mt-4 flex justify-end">
                          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello Mesho Data Sciences, I would like to follow up on my ${r.type === 'analyst' ? 'Data Analyst' : 'Researcher'} request submitted on ${new Date(r.created_at).toLocaleDateString()}.`)}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2 border-0"><MessageCircle size={14} /> Contact Support via WhatsApp</Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Projects tabs */}
          {(activeTab !== 'payments' && activeTab !== 'hire') && (
            <>
              {/* Tab heading + optional search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold">
                    {activeTab === 'enrolled' ? 'My Materials' : activeTab === 'wishlist' ? 'Saved Topics' : 'All Topics'}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeTab === 'enrolled' ? 'Research materials you have purchased.' : activeTab === 'wishlist' ? 'Topics you saved for later.' : 'Browse all available research topics.'}
                  </p>
                </div>
                {activeTab === 'all' && (
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search topics…"
                      className="w-full pl-8 pr-4 h-9 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}
              </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="clay h-40 animate-pulse rounded-2xl" />)}
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProjects.length > 0 ? (
                  displayedProjects.map((project, i) => (
                    <div key={project.id} className="animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                      <ProjectCard title={project.title} description={project.description} difficulty={project.difficulty} price={project.price} href={`/projects/${project.id}`} onClick={() => router.push(`/projects/${project.id}`)} gridRef={gridRef} />
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
            }</>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border px-1 py-2 flex justify-around z-30">
        {tabs.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)}
            className={`relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all text-xs ${activeTab === item.id ? 'text-accent' : 'text-muted-foreground'}`}>
            <item.icon size={20} />
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.short}</span>
            {(item as any).badge > 0 && (
              <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {(item as any).badge}
              </span>
            )}
          </button>
        ))}
        {user?.role === 'admin' ? (
          <Link href="/admin">
            <button className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-accent transition-all text-xs font-medium">
              <ShieldCheck size={20} /><span>Admin</span>
            </button>
          </Link>
        ) : (
          <Link href="/profile">
            <button className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-muted-foreground text-xs transition-colors hover:text-foreground">
              <UserCircle size={20} /><span>Profile</span>
            </button>
          </Link>
        )}
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />

      {/* Payment modal — receipt for confirmed, details for others */}
      {viewPayment && viewPayment.status === 'confirmed' && (
        <PaymentReceipt
          purchase={viewPayment as any}
          userName={user?.name ?? 'Customer'}
          onClose={() => setViewPayment(null)}
        />
      )}
      {viewPayment && viewPayment.status !== 'confirmed' && (() => {
        const p = viewPayment;
        const Icon = (statusIcon as any)[p.status] ?? Clock;
        const borderColor = p.status === 'failed' ? 'border-red-400' : p.status === 'awaiting_confirmation' ? 'border-blue-400' : 'border-yellow-400';
        return (
          <BottomSheet isOpen onClose={() => setViewPayment(null)}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-base">Payment Details</h2>
              <button onClick={() => setViewPayment(null)} className="p-1.5 hover:bg-muted rounded-lg"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className={`border-l-4 ${borderColor} pl-3`}>
                <p className="font-semibold">{(p as any).projects?.title ?? 'Research Material'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Amount', value: `₦${p.amount.toLocaleString()}`, copy: null },
                  { label: 'Status', value: <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${(statusColor as any)[p.status] ?? statusColor.pending}`}><Icon size={10} />{p.status === 'awaiting_confirmation' ? 'initiated' : p.status}</span>, copy: null },
                  { label: 'Reference', value: <span className="font-mono text-xs break-all">{p.payment_reference ?? '—'}</span>, copy: p.payment_reference },
                  { label: 'Date', value: new Date(p.created_at).toLocaleDateString(), copy: null },
                ].map((item, i) => (
                  <div key={i} className="bg-muted/30 rounded-xl p-3 flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                    {item.copy && (
                      <button onClick={() => navigator.clipboard.writeText(item.copy!).then(() => toast.success(`${item.label} copied!`))}
                        className="flex-shrink-0 p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground mt-0.5">
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {(p.status === 'awaiting_confirmation' || p.status === 'pending') && (
                <>
                  <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs ${p.status === 'awaiting_confirmation' ? 'bg-blue-50 border border-blue-200 text-blue-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'}`}>
                    <Clock size={13} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {p.status === 'awaiting_confirmation'
                        ? <><strong>Payment initiated</strong> — Complete your bank transfer using the reference above, then tap "I Have Paid".</>
                        : <><strong>Awaiting verification</strong> — Admin will confirm your bank transfer shortly.</>}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bank Transfer Details</p>
                    {[
                      { label: 'Bank', value: process.env.NEXT_PUBLIC_BANK_NAME ?? 'First Bank of Nigeria', copy: false },
                      { label: 'Account Number', value: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '—', copy: true },
                      { label: 'Account Name', value: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? 'Mesho Data Sciences', copy: false },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2 text-sm gap-2">
                        <span className="text-muted-foreground text-xs">{item.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-xs">{item.value}</span>
                          {item.copy && (
                            <button onClick={() => navigator.clipboard.writeText(item.value).then(() => toast.success(`${item.label} copied!`))}
                              className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground flex-shrink-0">
                              <Copy size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {p.status === 'failed' && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-700">
                  <XCircle size={13} className="flex-shrink-0 mt-0.5" />
                  <span><strong>Rejected:</strong> {p.rejection_reason ?? 'Payment could not be verified. Please contact support.'}</span>
                </div>
              )}
            </div>
          </BottomSheet>
        );
      })()}
    </ProtectedRoute>
  );
}
