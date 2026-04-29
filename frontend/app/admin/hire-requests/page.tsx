'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { HireRequest } from '@/lib/types';
import { getHireRequests, updateHireRequestStatusAction } from '../actions';
import { ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Building2, BookOpen, Clock, ClipboardList, Info, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhoneDisplay } from '@/app/components/phone-display';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminHireRequestsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statuses = [
    { value: 'pending', label: 'Pending', cls: 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200' },
    { value: 'in_progress', label: 'In Progress', cls: 'text-blue-700 bg-blue-100 hover:bg-blue-200' },
    { value: 'completed', label: 'Completed', cls: 'text-green-700 bg-green-100 hover:bg-green-200' },
    { value: 'cancelled', label: 'Cancelled', cls: 'text-red-700 bg-red-100 hover:bg-red-200' },
  ];

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    getHireRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      setLoading(false);
    });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await updateHireRequestStatusAction(id, status);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Update failed');
    }
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="space-y-4">
        {requests.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm">No hire requests yet</div>}
        {requests.map(r => {
          const wa = (r.phone || '').replace(/\D/g, '');
          const isExpanded = expanded === r.id;
          const borderCls = r.status === 'pending' ? 'border-l-yellow-400' : r.status === 'completed' ? 'border-l-green-400' : r.status === 'in_progress' ? 'border-l-blue-400' : 'border-l-red-400';

          return (
            <div key={r.id} className={`clay p-4 sm:p-5 border-l-4 ${borderCls} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 mr-1">
                      {r.profile_picture_url ? (
                        <img src={r.profile_picture_url} className="w-6 h-6 rounded-full object-cover shadow-sm border border-border" alt="" />
                      ) : (
                        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center border border-border">
                          <User size={12} className="text-accent" />
                        </div>
                      )}
                      <h3 className="font-bold text-lg leading-none">{r.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {r.type === 'analyst' ? 'Data Analyst' : 'Researcher'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-1">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {r.email}</span>
                    <PhoneDisplay phone={r.phone} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5 font-medium text-foreground"><Building2 size={14} className="text-accent" /> Dept: {r.department}</span>
                    {r.topic && <span className="flex items-center gap-1.5 font-medium text-foreground"><BookOpen size={14} className="text-accent" /> Topic: {r.topic}</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === r.id ? null : r.id)}
                      disabled={updating === r.id}
                      className="w-full sm:w-36 flex items-center justify-between text-xs border border-border rounded-lg px-3 py-1.5 bg-background hover:bg-muted transition-colors disabled:opacity-50 font-medium cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${r.status === 'pending' ? 'bg-yellow-500' : r.status === 'in_progress' ? 'bg-blue-500' : r.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {r.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openDropdown === r.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdown === r.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute right-0 sm:left-0 top-full mt-1 w-full sm:w-36 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          {statuses.map(s => (
                            <button
                              key={s.value}
                              onClick={() => {
                                updateStatus(r.id, s.value);
                                setOpenDropdown(null);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${r.status === s.value ? s.cls : 'hover:bg-muted'}`}
                            >
                              {s.label}
                              {r.status === s.value && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="flex items-center gap-1.5 text-xs text-accent hover:underline whitespace-nowrap bg-accent/5 px-3 py-1.5 rounded-lg">
                    {isExpanded ? <><ChevronUp size={14} /> Less Details</> : <><ChevronDown size={14} /> More Details</>}
                  </button>
                </div>
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

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-muted-foreground">Submitted on {new Date(r.created_at).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      {wa && (
                        <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello ${r.name}, regarding your ${r.type === 'analyst' ? 'Data Analyst' : 'Researcher'} request for topic: "${r.topic || r.department}".`)}`}
                          target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                          <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white border-0 gap-1.5">
                            <MessageCircle size={14} /> WhatsApp
                          </Button>
                        </a>
                      )}
                      <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Your Mesho ${r.type === 'analyst' ? 'Data Analyst' : 'Researcher'} Request`)}`} className="flex-1 sm:flex-none">
                        <Button size="sm" variant="outline" className="w-full gap-1.5"><Mail size={14} /> Email</Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
