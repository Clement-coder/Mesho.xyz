-- ============================================================
-- MESHO — RUN THIS NOW TO FIX PROFILE UPDATES
-- Fixes: phone/whatsapp save failing for Firebase users
-- ============================================================

-- 1. Ensure whatsapp column exists
alter table public.profiles add column if not exists whatsapp text;
alter table public.profiles add column if not exists email text;

-- 2. Drop ALL existing profile policies (clean slate)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Anyone can insert profile" on public.profiles;
drop policy if exists "Anyone can update profile" on public.profiles;

-- 3. Open all operations (Firebase users have no Supabase session)
create policy "Open select profiles" on public.profiles for select using (true);
create policy "Open insert profiles" on public.profiles for insert with check (true);
create policy "Open update profiles" on public.profiles for update using (true);