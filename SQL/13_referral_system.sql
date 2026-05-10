-- ============================================================
-- MESHO — REFERRAL SYSTEM
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add referral columns to profiles
alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by text;  -- stores the referral_code of the referrer

-- 2. Referral rewards table
create table if not exists public.referral_rewards (
  id uuid primary key default uuid_generate_v4(),
  referrer_id text not null references public.profiles(id) on delete cascade,
  referee_id text not null references public.profiles(id) on delete cascade,
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  discount_code text not null unique,
  discount_amount int not null default 500,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Add discount_code + discount_amount to purchases so admin sees it
alter table public.purchases
  add column if not exists discount_code text,
  add column if not exists discount_amount int not null default 0;

-- 4. Open RLS on referral_rewards (Firebase users have no Supabase session)
alter table public.referral_rewards enable row level security;
create policy "Open select referral_rewards" on public.referral_rewards for select using (true);
create policy "Open insert referral_rewards" on public.referral_rewards for insert with check (true);
create policy "Open update referral_rewards" on public.referral_rewards for update using (true);

-- 5. Generate a referral code for every existing profile that doesn't have one
update public.profiles
set referral_code = upper(substring(replace(id::text, '-', ''), 1, 8))
where referral_code is null;

-- 6. Function: auto-generate referral_code on new profile insert
create or replace function public.generate_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code := upper(substring(replace(new.id::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists set_referral_code on public.profiles;
create trigger set_referral_code
  before insert on public.profiles
  for each row execute procedure public.generate_referral_code();
