-- BetClear: single premium flag driven by Stripe webhook events

alter table public.subscriptions
  add column if not exists is_premium boolean not null default false;

-- Backfill existing rows: premium during trialing, active, and past_due (grace).
update public.subscriptions
  set is_premium = status in ('active', 'trialing', 'past_due');

create index if not exists subscriptions_is_premium_idx
  on public.subscriptions (is_premium);
