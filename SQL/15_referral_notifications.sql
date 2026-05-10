-- ============================================================
-- MESHO — REFERRAL NOTIFICATIONS
-- Adds DB triggers to auto-notify referrers when:
--   1. Someone signs up using their referral link
--   2. That person's purchase is confirmed (reward earned)
-- Safe to re-run.
-- ============================================================

-- Fix existing notification bodies to remove emojis (clean text only)
create or replace function public.notify_on_purchase_update()
returns trigger language plpgsql as $$
begin
  if new.status = 'confirmed' and old.status != 'confirmed' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'payment_confirmed', 'Payment Confirmed',
      'Your payment has been verified. Contact us on WhatsApp to receive your file.',
      '/dashboard?tab=payments');

    -- Notify the referrer that their referee just completed a purchase (reward earned)
    declare
      v_referred_by text;
      v_referrer_id text;
      v_referee_name text;
    begin
      select p.referred_by, p.name into v_referred_by, v_referee_name
      from public.profiles p where p.id = new.user_id;

      if v_referred_by is not null then
        select id into v_referrer_id from public.profiles where referral_code = v_referred_by;
        if v_referrer_id is not null then
          insert into public.notifications (user_id, type, title, body, link)
          values (v_referrer_id, 'referral_completed',
            'Referral Reward Earned',
            v_referee_name || ' just made their first purchase using your referral link. Your discount code is ready!',
            '/dashboard');
        end if;
      end if;
    end;
  end if;

  if new.status = 'failed' and old.status != 'failed' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'payment_rejected', 'Payment Rejected',
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

-- Trigger: notify referrer when a new referral_signup row is inserted
create or replace function public.notify_on_referral_signup()
returns trigger language plpgsql as $$
begin
  insert into public.notifications (user_id, type, title, body, link)
  values (
    new.referrer_id,
    'referral_signup',
    'New Referral Signed Up',
    new.referee_name || ' just signed up using your referral link. You will earn a reward once they make a purchase.',
    '/dashboard'
  );
  return new;
end;
$$;

drop trigger if exists on_referral_signup_insert on public.referral_signups;
create trigger on_referral_signup_insert
  after insert on public.referral_signups
  for each row execute procedure public.notify_on_referral_signup();

-- Fix admin chat notification (remove emoji)
create or replace function public.notify_on_admin_chat()
returns trigger language plpgsql as $$
begin
  if new.sender = 'admin' then
    insert into public.notifications (user_id, type, title, body, link)
    values (new.user_id, 'message', 'New message from Support',
      left(new.message, 80), '/dashboard?tab=chat');
  end if;
  return new;
end;
$$;

drop trigger if exists on_admin_chat_message on public.chat_messages;
create trigger on_admin_chat_message
  after insert on public.chat_messages
  for each row execute procedure public.notify_on_admin_chat();
