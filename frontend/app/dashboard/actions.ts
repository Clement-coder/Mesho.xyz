'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import type { HireRequest } from '@/lib/types';

export async function getUserHireRequests(email: string): Promise<HireRequest[]> {
  if (!email) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('hire_requests').select('*').eq('email', email).order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching user hire requests:', error);
    return [];
  }
  return data ?? [];
}
