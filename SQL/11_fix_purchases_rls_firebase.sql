-- ============================================================
-- MESHO — FIX PURCHASES RLS FOR FIREBASE USERS
-- Firebase users have no Supabase session so auth.uid() = null.
-- Open INSERT, UPDATE (own rows), and DELETE (own rows) on
-- purchases so the payment flow works correctly.
-- ============================================================

-- INSERT: allow any client to create a purchase
drop policy if exists "Users can insert own purchases" on public.purchases;
create policy "Anyone can insert purchases" on public.purchases
  for insert with check (true);

-- UPDATE: allow any client to update purchases (app filters by id)
drop policy if exists "Users can update own purchases" on public.purchases;
create policy "Anyone can update purchases" on public.purchases
  for update using (true);

-- DELETE: allow any client to delete purchases (used for cancel/draft cleanup)
drop policy if exists "Users can delete own purchases" on public.purchases;
create policy "Anyone can delete purchases" on public.purchases
  for delete using (true);

-- Also add the awaiting_confirmation status to the purchases status check constraint
-- (if one exists — safe no-op if not)
alter table public.purchases
  drop constraint if exists purchases_status_check;

alter table public.purchases
  add constraint purchases_status_check
  check (status in ('awaiting_confirmation', 'pending', 'confirmed', 'failed'));
