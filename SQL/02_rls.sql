-- ============================================================
-- MESHO DATA SCIENCES — ROW LEVEL SECURITY
-- Run this SECOND in Supabase SQL Editor
-- ============================================================

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.courses enable row level security;
alter table public.projects enable row level security;
alter table public.purchases enable row level security;
alter table public.hire_requests enable row level security;
alter table public.training_registrations enable row level security;
alter table public.contact_messages enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can update all profiles" on public.profiles
  for update using (public.is_admin());

-- DEPARTMENTS (public read, admin write)
create policy "Anyone can view departments" on public.departments
  for select using (true);

create policy "Admins can manage departments" on public.departments
  for all using (public.is_admin());

-- COURSES (public read, admin write)
create policy "Anyone can view courses" on public.courses
  for select using (true);

create policy "Admins can manage courses" on public.courses
  for all using (public.is_admin());

-- PROJECTS (public read, admin write)
create policy "Anyone can view projects" on public.projects
  for select using (true);

create policy "Admins can manage projects" on public.projects
  for all using (public.is_admin());

-- PURCHASES
create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);

create policy "Users can insert own purchases" on public.purchases
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all purchases" on public.purchases
  for select using (public.is_admin());

create policy "Admins can update purchases" on public.purchases
  for update using (public.is_admin());

-- HIRE REQUESTS (anyone can insert, admin can read/update)
create policy "Anyone can submit hire requests" on public.hire_requests
  for insert with check (true);

create policy "Admins can manage hire requests" on public.hire_requests
  for all using (public.is_admin());

-- TRAINING REGISTRATIONS (anyone can insert, admin can read/update)
create policy "Anyone can register for training" on public.training_registrations
  for insert with check (true);

create policy "Admins can manage training registrations" on public.training_registrations
  for all using (public.is_admin());

-- CONTACT MESSAGES (anyone can insert, admin can read/update)
create policy "Anyone can send contact messages" on public.contact_messages
  for insert with check (true);

create policy "Admins can manage contact messages" on public.contact_messages
  for all using (public.is_admin());
