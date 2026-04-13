-- ============================================================
-- MESHO DATA SCIENCES — FIREBASE AUTH MIGRATION
-- Run this in Supabase SQL Editor
-- Firebase UIDs are strings (e.g. "abc123xyz"), not UUIDs.
-- We must change profiles.id from uuid to text and drop the
-- foreign key to auth.users (Firebase handles auth now).
-- ============================================================

-- 1. Drop the old FK constraint and recreate profiles.id as text
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles alter column id type text using id::text;

-- 2. purchases.user_id also referenced auth.users — change to text
alter table public.purchases drop constraint if exists purchases_user_id_fkey;
alter table public.purchases alter column user_id type text using user_id::text;

-- 3. RLS policies that used auth.uid() (uuid) still work because
--    auth.uid() returns text when cast — but since Firebase handles
--    auth, RLS on profiles/purchases will be enforced via service role
--    from the server. For public reads (departments, courses, projects)
--    the existing policies remain unchanged.

-- 4. Allow upsert on profiles from anon (Firebase token not known to Supabase)
--    We'll use the service role key server-side for writes.
--    For now, open insert on profiles so the client can create profiles:
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Anyone can insert profile" on public.profiles
  for insert with check (true);
