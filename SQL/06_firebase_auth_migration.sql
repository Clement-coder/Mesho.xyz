-- ============================================================
-- MESHO DATA SCIENCES — FIREBASE AUTH MIGRATION
-- Run this in Supabase SQL Editor
-- Firebase UIDs are strings, not UUIDs.
-- ============================================================

-- 1. Drop all policies that depend on profiles.id or purchases.user_id
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Anyone can insert profile" on public.profiles;

drop policy if exists "Users can view own purchases" on public.purchases;
drop policy if exists "Users can insert own purchases" on public.purchases;
drop policy if exists "Admins can view all purchases" on public.purchases;
drop policy if exists "Admins can update purchases" on public.purchases;

-- Drop storage policy that joins on purchases.user_id
drop policy if exists "Users can download purchased materials" on storage.objects;

-- 2. Drop FK constraints
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.purchases drop constraint if exists purchases_user_id_fkey;

-- 3. Change column types to text
alter table public.profiles alter column id type text using id::text;
alter table public.purchases alter column user_id type text using user_id::text;

-- 4. Add whatsapp + payment columns (safe no-ops if already exist)
alter table public.profiles add column if not exists whatsapp text;
alter table public.purchases add column if not exists user_name text;
alter table public.purchases add column if not exists user_email text;
alter table public.purchases add column if not exists user_whatsapp text;
alter table public.purchases add column if not exists rejection_reason text;

-- 5. Recreate RLS policies
-- Profiles: Firebase client inserts its own profile on signup
create policy "Anyone can insert profile" on public.profiles
  for insert with check (true);

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid()::text = id or public.is_admin());

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid()::text = id or public.is_admin());

-- Purchases: users manage their own, admins manage all
create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid()::text = user_id or public.is_admin());

create policy "Users can insert own purchases" on public.purchases
  for insert with check (true);

create policy "Admins can update purchases" on public.purchases
  for update using (public.is_admin());
