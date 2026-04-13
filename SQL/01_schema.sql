-- ============================================================
-- MESHO DATA SCIENCES — SUPABASE SCHEMA
-- Run this FIRST in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text,
  profile_picture_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  enrolled_projects text[] not null default '{}',
  wishlist text[] not null default '{}',
  hours_learned int not null default 0,
  certificates int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- DEPARTMENTS
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  icon text not null default 'BookOpen',
  color text not null default '#3b82f6',
  created_at timestamptz not null default now()
);

-- COURSES
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  department_id uuid not null references public.departments(id) on delete cascade,
  name text not null,
  icon text not null default 'BookOpen',
  difficulty text not null default 'Undergraduate',
  tools text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- PROJECTS
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  difficulty text not null default 'Undergraduate',
  price int not null default 5000,
  tools text[] not null default '{}',
  duration text not null default 'Instant Download',
  learning_outcomes text[] not null default '{}',
  file_url text,
  locked boolean not null default true,
  created_at timestamptz not null default now()
);

-- PURCHASES
create table if not exists public.purchases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  amount int not null,
  payment_reference text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamptz not null default now()
);

-- HIRE REQUESTS
create table if not exists public.hire_requests (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('analyst', 'researcher')),
  name text not null,
  email text not null,
  phone text not null,
  institution text,
  department text not null,
  topic text,
  deadline date,
  services text[],
  research_type text,
  details text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- TRAINING REGISTRATIONS
create table if not exists public.training_registrations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  institution text,
  schedule text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- CONTACT MESSAGES
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- TRIGGER: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, profile_picture_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TRIGGER: updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
