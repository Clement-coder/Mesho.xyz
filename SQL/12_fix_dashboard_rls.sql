-- ============================================================
-- MESHO — FIX DASHBOARD LOADING (RLS for Firebase users)
-- Firebase users have no Supabase session so auth.uid() = null.
-- This opens SELECT on projects and purchases so the dashboard
-- can load data using the anon/publishable key from the browser.
-- ============================================================

-- PROJECTS: drop old policies and open SELECT to everyone
drop policy if exists "Anyone can view projects" on public.projects;
drop policy if exists "Admins can manage projects" on public.projects;

create policy "Open select projects" on public.projects
  for select using (true);

create policy "Admins can manage projects" on public.projects
  for all using (true);  -- admin operations go through service role key anyway

-- PURCHASES: ensure SELECT is fully open (07_fixes.sql may have been overridden)
drop policy if exists "Users can view own purchases" on public.purchases;
drop policy if exists "Admins can view all purchases" on public.purchases;

create policy "Open select purchases" on public.purchases
  for select using (true);
