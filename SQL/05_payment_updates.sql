-- ============================================================
-- MESHO DATA SCIENCES — PAYMENT & PROFILE UPDATES
-- Run this in Supabase SQL Editor (after 01_schema, 02_rls,
-- 03_seed, 04_storage)
-- ============================================================

-- 1. Add whatsapp field to profiles (admin uses this to send files)
alter table public.profiles
  add column if not exists whatsapp text;

-- 2. Add extra columns to purchases for the bank-transfer flow
--    These snapshot the buyer's contact info at purchase time so
--    the admin can reach them even if the profile changes later.
alter table public.purchases
  add column if not exists user_name      text,
  add column if not exists user_email     text,
  add column if not exists user_whatsapp  text,
  add column if not exists rejection_reason text;

-- 3. RLS: admin must be able to update profiles.enrolled_projects
--    when confirming a payment.  The policy "Admins can update all
--    profiles" already exists from 02_rls.sql — this is a safety
--    no-op in case it was missed.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'Admins can update all profiles'
  ) then
    execute $policy$
      create policy "Admins can update all profiles" on public.profiles
        for update using (public.is_admin());
    $policy$;
  end if;
end;
$$;
