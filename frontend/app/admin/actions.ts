'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import type { HireRequest, TrainingRegistration } from '@/lib/types';

export async function getHireRequests(): Promise<HireRequest[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('hire_requests').select('*').order('created_at', { ascending: false });
  if (error) console.error('Error fetching hire requests:', error);
  
  if (data && data.length > 0) {
    const emails = data.map((r: any) => r.email);
    const { data: profiles } = await supabase.from('profiles').select('email, profile_picture_url').in('email', emails);
    const picMap = new Map(profiles?.map((p: any) => [p.email, p.profile_picture_url]));
    return data.map((r: any) => ({ ...r, profile_picture_url: picMap.get(r.email) || null }));
  }
  return data ?? [];
}

export async function updateHireRequestStatusAction(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('hire_requests').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function getHireRequestsOverview() {
  const supabase = createAdminClient();
  const [countRes, recentRes] = await Promise.all([
    supabase.from('hire_requests').select('id', { count: 'exact', head: true }),
    supabase.from('hire_requests').select('id,name,type,department,status,created_at').order('created_at', { ascending: false }).limit(5)
  ]);
  return {
    count: countRes.count ?? 0,
    recent: recentRes.data ?? []
  };
}

export async function getTrainingRegistrations(): Promise<TrainingRegistration[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('training_registrations').select('*').order('created_at', { ascending: false });
  if (error) console.error('Error fetching training registrations:', error);
  
  if (data && data.length > 0) {
    const emails = data.map((r: any) => r.email);
    const { data: profiles } = await supabase.from('profiles').select('email, profile_picture_url').in('email', emails);
    const picMap = new Map(profiles?.map((p: any) => [p.email, p.profile_picture_url]));
    return data.map((r: any) => ({ ...r, profile_picture_url: picMap.get(r.email) || null }));
  }
  return data ?? [];
}

export async function updateTrainingRegistrationStatusAction(id: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('training_registrations').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
export async function getAdminOverviewStats() {
  const s = createAdminClient();
  const [u, pu, tr, cm, pr, rpu, hireRes, hireRecent] = await Promise.all([
    s.from('profiles').select('id', { count: 'exact', head: true }),
    s.from('purchases').select('id,amount,status'),
    s.from('training_registrations').select('id', { count: 'exact', head: true }),
    s.from('contact_messages').select('id,read'),
    s.from('projects').select('id', { count: 'exact', head: true }),
    s.from('purchases').select('id,amount,status,created_at,user_name,user_email,projects(title)').order('created_at',{ascending:false}).limit(5),
    s.from('hire_requests').select('id', { count: 'exact', head: true }),
    s.from('hire_requests').select('id,name,type,department,status,created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  const pData = pu.data ?? [];
  return {
    users: u.count ?? 0,
    purchases: pData.length,
    revenue: pData.filter((x:any) => x.status === 'confirmed').reduce((a:number, x:any) => a + x.amount, 0),
    projects: pr.count ?? 0,
    hire: hireRes.count ?? 0,
    training: tr.count ?? 0,
    messages: cm.count ?? 0,
    unread: (cm.data ?? []).filter((x:any) => !x.read).length,
    pending: pData.filter((x:any) => x.status === 'pending').length,
    recentPurchases: rpu.data ?? [],
    recentHire: hireRecent.data ?? []
  };
}
