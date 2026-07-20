-- BetClear: Stripe subscription records for paywall access

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  stripe_customer_id text not null unique,
  stripe_subscription_id text unique,
  email text,
  status text not null,
  price_id text,
  plan text check (plan in ('monthly', 'annual')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_email_idx
  on public.subscriptions (email);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Server uses the service role key, which bypasses RLS.
