'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getTrainingRegistrations, updateTrainingRegistrationStatusAction } from '../actions';
import { toast } from 'sonner';
import type { TrainingRegistration } from '@/lib/types';
import { PhoneDisplay } from '@/app/components/phone-display';
import { ChevronDown, ChevronUp, Mail, Building2, Clock, Check, User } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statuses = [
  { value: 'pending', label: 'Pending', cls: 'text-yellow-600 bg-yellow-50' },
  { value: 'confirmed', label: 'Confirmed', cls: 'text-green-600 bg-green-50' },
  { value: 'cancelled', label: 'Cancelled', cls: 'text-red-600 bg-red-50' }
];

export default function AdminTrainingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    getTrainingRegistrations().then(data => {
      setRegistrations(data);
      setLoading(false);
    });
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await updateTrainingRegistrationStatusAction(id, status);
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
    setUpdating(null);
  };

  if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="space-y-4">
        {registrations.length === 0 && <div className="clay p-8 text-center text-muted-foreground text-sm">No training registrations yet</div>}
        {registrations.map(r => {
          const isExpanded = expanded === r.id;
          const borderCls = r.status === 'pending' ? 'border-l-yellow-400' : r.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400';

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
                      SPSS Training
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-1">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {r.email}</span>
                    <PhoneDisplay phone={r.phone} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5 font-medium text-foreground"><Clock size={14} className="text-accent" /> Schedule: <span className="truncate max-w-[200px]">{r.schedule.replace(/-/g, ' ')}</span></span>
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
                        <span className={`w-2 h-2 rounded-full ${r.status === 'pending' ? 'bg-yellow-500' : r.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        {r.status.replace(/\b\w/g, l => l.toUpperCase())}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {r.institution && (
                      <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                        <Building2 size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div><p className="text-xs text-muted-foreground mb-0.5">Institution</p><p className="font-medium">{r.institution}</p></div>
                      </div>
                    )}
                    <div className="flex items-start gap-2 bg-muted/30 rounded-xl p-3">
                      <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div><p className="text-xs text-muted-foreground mb-0.5">Submitted On</p><p className="font-medium">{new Date(r.created_at).toLocaleString()}</p></div>
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
