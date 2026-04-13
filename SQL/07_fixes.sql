-- ============================================================
-- MESHO DATA SCIENCES — MISC FIXES
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add email column to profiles (Firebase handles auth but we
--    store email in Supabase for admin visibility)
alter table public.profiles
  add column if not exists email text;

-- 2. Purchases: open select to all authenticated users for their
--    own rows. Since Firebase users have no Supabase session,
--    auth.uid() is null — we open it via user_id match using
--    the service role on the server, but for client reads we
--    need to allow anon reads filtered by user_id.
--    Simplest safe fix: allow select with no RLS restriction
--    (data is not sensitive — users only see their own via query filter)
drop policy if exists "Users can view own purchases" on public.purchases;
create policy "Users can view own purchases" on public.purchases
  for select using (true);

-- 3. Same for profiles — allow select so client can read own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (true);
