'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, ShoppingCart, TrendingUp, FolderOpen, UserCheck, BookOpen, MessageCircle, Mail, Clock } from 'lucide-react';
import type { AdminTab } from './admin-shell';
import { getAdminOverviewStats } from '../actions';

interface Props { onTab: (t: AdminTab) => void; }

export function AdminOverview({ onTab }: Props) {
  const [stats, setStats] = useState({ users:0, purchases:0, revenue:0, projects:0, hire:0, training:0, messages:0, unread:0, pending:0 });
  const [recent, setRecent] = useState<{ purchases: any[]; hire: any[] }>({ purchases: [], hire: [] });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAdminOverviewStats();
        setStats({
          users: data.users,
          purchases: data.purchases,
          revenue: data.revenue,
          projects: data.projects,
          hire: data.hire,
          training: data.training,
          messages: data.messages,
          unread: data.unread,
          pending: data.pending,
        });
        setRecent({ purchases: data.recentPurchases, hire: data.recentHire });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const cards = [
    { icon: Users,         label: 'Total Users',     value: stats.users,                    tab: 'users'     as AdminTab, color: 'text-blue-500',   bg: 'bg-blue-500/10' },
    { icon: ShoppingCart,  label: 'Purchases',        value: stats.purchases,                tab: 'purchases' as AdminTab, color: 'text-green-500',  bg: 'bg-green-500/10' },
    { icon: TrendingUp,    label: 'Revenue',          value: `₦${stats.revenue.toLocaleString()}`, tab: 'purchases' as AdminTab, color: 'text-accent',     bg: 'bg-accent/10' },
    { icon: Clock,         label: 'Pending Payments', value: stats.pending,                  tab: 'purchases' as AdminTab, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { icon: FolderOpen,    label: 'Projects',         value: stats.projects,                 tab: 'projects'  as AdminTab, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: UserCheck,     label: 'Hire Requests',    value: stats.hire,                     tab: 'hire'      as AdminTab, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { icon: BookOpen,      label: 'Training Regs',    value: stats.training,                 tab: 'training'  as AdminTab, color: 'text-teal-500',   bg: 'bg-teal-500/10' },
    { icon: Mail,          label: 'Unread Messages',  value: stats.unread,                   tab: 'messages'  as AdminTab, color: 'text-pink-500',   bg: 'bg-pink-500/10' },
  ];

  const statusCls = (s:string) => s==='confirmed'?'bg-green-100 text-green-700':s==='failed'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-muted-foreground text-sm mb-6">Platform summary at a glance.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cards.map((c,i) => (
          <button key={i} onClick={() => onTab(c.tab)} className="clay p-4 text-left hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon size={18} className={c.color} />
            </div>
            <p className="text-xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="clay p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Purchases</h2>
            <button onClick={()=>onTab('purchases')} className="text-xs text-accent hover:underline">View all</button>
          </div>
          {recent.purchases.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No purchases yet</p> : (
            <div className="space-y-3">
              {recent.purchases.map((p:any) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.user_name ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.projects?.title ?? '—'}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="font-semibold text-accent text-xs">₦{p.amount?.toLocaleString()}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusCls(p.status)}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="clay p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Hire Requests</h2>
            <button onClick={()=>onTab('hire')} className="text-xs text-accent hover:underline">View all</button>
          </div>
          {recent.hire.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No hire requests yet</p> : (
            <div className="space-y-3">
              {recent.hire.map((h:any) => (
                <div key={h.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.type==='analyst'?'Data Analyst':'Researcher'} • {h.department}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ml-3 flex-shrink-0 ${h.status==='completed'?'bg-green-100 text-green-700':h.status==='in_progress'?'bg-blue-100 text-blue-700':h.status==='cancelled'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
