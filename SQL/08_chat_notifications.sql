-- ============================================================
-- MESHO — CHAT & NOTIFICATIONS
-- Run in Supabase SQL Editor
-- ============================================================

-- CHAT MESSAGES (user ↔ admin support chat)
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,          -- Firebase UID of the user
  user_name text not null,
  user_email text not null default '',
  sender text not null check (sender in ('user', 'admin')),
  message text not null,
  read_by_admin boolean not null default false,
  read_by_user boolean not null default true,
  created_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,          -- Firebase UID
  type text not null,             -- 'payment_confirmed' | 'payment_rejected' | 'message' | 'general'
  title text not null,
  body text not null,
  read boolean not null default false,
  link text,                      -- optional deep link e.g. '/dashboard?tab=payments'
  created_at timestamptz not null default now()
);

-- RLS
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;

-- Enable Realtime on chat_messages and notifications
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.notifications;

-- Chat: anyone can insert (user sends), all can select (open for Firebase users)
create policy "Anyone can insert chat message" on public.chat_messages for insert with check (true);
create policy "Anyone can read chat messages" on public.chat_messages for select using (true);
create policy "Anyone can update chat messages" on public.chat_messages for update using (true);

-- Notifications: open select/update (Firebase users have no Supabase session)
create policy "Anyone can read notifications" on public.notifications for select using (true);
create policy "Anyone can update notifications" on public.notifications for update using (true);
create policy "Anyone can insert notifications" on public.notifications for insert with check (true);

-- Trigger: when admin confirms a purchase → create notification for user
create or replace function public.notify_on_purchase_update()
returns trigger language plpgsql as $$
begin
  if new.status = 'confirmed' and old.status != 'confirmed' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'payment_confirmed', '✅ Payment Confirmed!',
      'Your payment has been verified. Contact us on WhatsApp to receive your file.',
      '/dashboard?tab=payments');
  end if;
  if new.status = 'failed' and old.status != 'failed' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'payment_rejected', '❌ Payment Rejected',
      coalesce('Reason: ' || new.rejection_reason, 'Your payment could not be verified. Please contact support.'),
      '/dashboard?tab=payments');
  end if;
  return new;
end;
$$;

drop trigger if exists on_purchase_status_change on public.purchases;
create trigger on_purchase_status_change
  after update on public.purchases
  for each row execute procedure public.notify_on_purchase_update();

-- Trigger: when admin sends a chat message → notify user
create or replace function public.notify_on_admin_chat()
returns trigger language plpgsql as $$
begin
  if new.sender = 'admin' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'message', '💬 New message from Support',
      left(new.message, 80), '/dashboard?tab=chat');
  end if;
  return new;
end;
$$;

drop trigger if exists on_admin_chat_message on public.chat_messages;
create trigger on_admin_chat_message
  after insert on public.chat_messages
  for each row execute procedure public.notify_on_admin_chat();
