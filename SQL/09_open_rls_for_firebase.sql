-- ============================================================
-- MESHO — OPEN RLS FOR FIREBASE USERS
-- Firebase users have no Supabase session so auth.uid() = null.
-- We already opened SELECT in 07_fixes.sql.
-- Now open UPDATE so users can save their profile.
-- ============================================================

-- Profiles: allow any client to update (data is protected by
-- the app logic — users only update their own row by id)
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Anyone can update profile" on public.profiles
  for update using (true);

-- Also ensure insert is open (for new Google sign-ups)
drop policy if exists "Anyone can insert profile" on public.profiles;
create policy "Anyone can insert profile" on public.profiles
  for insert with check (true);
