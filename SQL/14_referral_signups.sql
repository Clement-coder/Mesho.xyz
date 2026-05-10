-- ============================================================
-- MESHO — REFERRAL SIGNUPS TRACKING
-- Tracks every signup that used a referral code so the referrer
-- can see who signed up (pending) vs who purchased (completed).
-- Safe to re-run. Run in Supabase SQL Editor.
-- ============================================================

-- 0. Ensure referral columns exist on profiles (idempotent)
alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by   text;

-- Backfill referral_code for any profile that doesn't have one yet
update public.profiles
set referral_code = upper(substring(replace(id::text, '-', ''), 1, 8))
where referral_code is null;

-- 1. Table
create table if not exists public.referral_signups (
  id            uuid        primary key default uuid_generate_v4(),
  referrer_code text        not null,
  referrer_id   text        not null references public.profiles(id) on delete cascade,
  referee_id    text        not null references public.profiles(id) on delete cascade,
  referee_name  text        not null,
  referee_email text        not null,
  -- false = signed up, no confirmed purchase yet
  -- true  = first purchase confirmed, reward issued
  completed     boolean     not null default false,
  created_at    timestamptz not null default now(),
  constraint referral_signups_pair_unique unique (referrer_id, referee_id)
);

-- 2. Open RLS (Firebase users have no Supabase JWT session)
alter table public.referral_signups enable row level security;

drop policy if exists "Open select referral_signups" on public.referral_signups;
drop policy if exists "Open insert referral_signups"  on public.referral_signups;
drop policy if exists "Open update referral_signups"  on public.referral_signups;

create policy "Open select referral_signups" on public.referral_signups for select using (true);
create policy "Open insert referral_signups" on public.referral_signups for insert with check (true);
create policy "Open update referral_signups" on public.referral_signups for update using (true);

-- 3. Backfill existing referred profiles
--    referral_code is now guaranteed to exist from step 0.
--    completed = true if they already have at least one confirmed purchase.
insert into public.referral_signups
  (referrer_code, referrer_id, referee_id, referee_name, referee_email, completed)
select
  p.referred_by,
  r.id,
  p.id,
  p.name,
  p.email,
  exists (
    select 1 from public.purchases pu
    where pu.user_id = p.id and pu.status = 'confirmed'
  )
from public.profiles p
join public.profiles r on r.referral_code = p.referred_by
where p.referred_by is not null
  and p.id <> r.id
on conflict (referrer_id, referee_id) do nothing;
