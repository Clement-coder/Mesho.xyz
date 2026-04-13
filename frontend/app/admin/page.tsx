'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Users, FolderOpen, UserCheck, BookOpen, MessageCircle, ShoppingCart, TrendingUp, Mail, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  users: number;
  purchases: number;
  hireRequests: number;
  trainingRegs: number;
  contactMessages: number;
  unreadMessages: number;
  revenue: number;
  projects: number;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ users: 0, purchases: 0, hireRequests: 0, trainingRegs: 0, contactMessages: 0, unreadMessages: 0, revenue: 0, projects: 0 });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [recentHire, setRecentHire] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const supabase = createClient();

    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('purchases').select('id, amount, status', { count: 'exact' }),
      supabase.from('hire_requests').select('id', { count: 'exact', head: true }),
      supabase.from('training_registrations').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id, read', { count: 'exact' }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('purchases').select('id, amount, status, created_at, project_id, user_id, profiles(name, email), projects(title)').order('created_at', { ascending: false }).limit(5),
      supabase.from('hire_requests').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([usersRes, purchasesRes, hireRes, trainingRes, contactRes, projectsRes, recentPurchasesRes, recentHireRes]) => {
      const confirmedRevenue = (purchasesRes.data ?? []).filter((p: any) => p.status === 'confirmed').reduce((sum: number, p: any) => sum + p.amount, 0);
      const unread = (contactRes.data ?? []).filter((m: any) => !m.read).length;
      setStats({
        users: usersRes.count ?? 0,
        purchases: purchasesRes.count ?? 0,
        hireRequests: hireRes.count ?? 0,
        trainingRegs: trainingRes.count ?? 0,
        contactMessages: contactRes.count ?? 0,
        unreadMessages: unread,
        revenue: confirmedRevenue,
        projects: projectsRes.count ?? 0,
      });
      setRecentPurchases(recentPurchasesRes.data ?? []);
      setRecentHire(recentHireRes.data ?? []);
      setLoading(false);
    });
  }, [user]);

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.users, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/users' },
    { icon: ShoppingCart, label: 'Total Purchases', value: stats.purchases, color: 'text-green-500', bg: 'bg-green-500/10', href: '/admin/purchases' },
    { icon: TrendingUp, label: 'Revenue (₦)', value: `₦${stats.revenue.toLocaleString()}`, color: 'text-accent', bg: 'bg-accent/10', href: '/admin/purchases' },
    { icon: FolderOpen, label: 'Projects', value: stats.projects, color: 'text-purple-500', bg: 'bg-purple-500/10', href: '/admin/projects' },
    { icon: UserCheck, label: 'Hire Requests', value: stats.hireRequests, color: 'text-orange-500', bg: 'bg-orange-500/10', href: '/admin/hire-requests' },
    { icon: BookOpen, label: 'Training Registrations', value: stats.trainingRegs, color: 'text-teal-500', bg: 'bg-teal-500/10', href: '/admin/training' },
    { icon: MessageCircle, label: 'Contact Messages', value: stats.contactMessages, color: 'text-pink-500', bg: 'bg-pink-500/10', href: '/admin/messages' },
    { icon: Mail, label: 'Unread Messages', value: stats.unreadMessages, color: 'text-red-500', bg: 'bg-red-500/10', href: '/admin/messages' },
  ];

  const adminNav = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/purchases', label: 'Purchases' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/hire-requests', label: 'Hire Requests' },
    { href: '/admin/training', label: 'Training' },
    { href: '/admin/messages', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin top nav */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-4 overflow-x-auto">
        <span className="text-sm font-semibold text-accent whitespace-nowrap flex items-center gap-1.5">
          <AlertCircle size={15} /> Admin Panel
        </span>
        <div className="flex gap-1">
          {adminNav.map(nav => (
            <Link key={nav.href} href={nav.href}>
              <span className="text-xs px-3 py-1.5 rounded-lg hover:bg-muted transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground">{nav.label}</span>
            </Link>
          ))}
        </div>
        <Link href="/dashboard" className="ml-auto text-xs text-accent hover:underline whitespace-nowrap">← User Dashboard</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Admin Overview</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user.name}. Here's what's happening on the platform.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <Link key={i} href={card.href}>
              <div className="clay p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <card.icon size={18} className={card.color} />
                </div>
                <p className="text-xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Purchases */}
          <div className="clay p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Purchases</h2>
              <Link href="/admin/purchases" className="text-xs text-accent hover:underline">View all</Link>
            </div>
            {recentPurchases.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No purchases yet</p>
            ) : (
              <div className="space-y-3">
                {recentPurchases.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{p.profiles?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.projects?.title ?? 'Unknown project'}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="font-semibold text-accent">₦{p.amount?.toLocaleString()}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${p.status === 'confirmed' ? 'bg-green-100 text-green-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Hire Requests */}
          <div className="clay p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Hire Requests</h2>
              <Link href="/admin/hire-requests" className="text-xs text-accent hover:underline">View all</Link>
            </div>
            {recentHire.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No hire requests yet</p>
            ) : (
              <div className="space-y-3">
                {recentHire.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.type === 'analyst' ? 'Data Analyst' : 'Researcher'} • {h.department}</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-3 flex-shrink-0 ${h.status === 'completed' ? 'bg-green-100 text-green-700' : h.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : h.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
