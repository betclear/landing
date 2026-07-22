-- User-linked DNS entitlement: persist entitlement mode + per-device client IDs.

alter table public.subscriptions
  add column if not exists entitlement_mode text not null default 'none'
    check (entitlement_mode in ('full', 'grace_24h', 'none')),
  add column if not exists grace_ends_at timestamptz,
  add column if not exists trial_ends_at timestamptz;

-- Backfill from existing premium flag / status.
update public.subscriptions
set entitlement_mode = case
  when is_premium = true or status in ('active', 'trialing', 'past_due') then 'full'
  else 'none'
end
where entitlement_mode = 'none'
  and (is_premium = true or status in ('active', 'trialing', 'past_due'));

create table if not exists public.device_installs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  stripe_customer_id text,
  client_id text not null unique,
  platform text check (platform is null or platform in ('ios', 'android', 'unknown')),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint device_installs_owner_check
    check (user_id is not null or stripe_customer_id is not null)
);

create index if not exists device_installs_user_id_idx
  on public.device_installs (user_id)
  where revoked_at is null;

create index if not exists device_installs_customer_id_idx
  on public.device_installs (stripe_customer_id)
  where revoked_at is null;

alter table public.device_installs enable row level security;
