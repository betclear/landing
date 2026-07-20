-- BetClear: authenticated user recovery profiles + subscription state

create table if not exists public.user_recovery_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  currency text not null default 'USD',
  monthly_gambling_spend numeric(12, 2) not null,
  weekly_gambling_hours numeric(8, 2) not null,
  last_gambling_date date null,
  last_gambling_date_is_approximate boolean not null default false,
  onboarding_completed_at timestamptz null,
  selected_plan text null check (selected_plan in ('annual', 'monthly')),
  stripe_customer_id text null unique,
  stripe_subscription_id text null unique,
  subscription_status text null,
  trial_ends_at timestamptz null,
  current_period_ends_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_recovery_profiles_user_id_idx
  on public.user_recovery_profiles (user_id);

create index if not exists user_recovery_profiles_stripe_customer_id_idx
  on public.user_recovery_profiles (stripe_customer_id);

create index if not exists user_recovery_profiles_stripe_subscription_id_idx
  on public.user_recovery_profiles (stripe_subscription_id);

drop trigger if exists user_recovery_profiles_set_updated_at
  on public.user_recovery_profiles;

create trigger user_recovery_profiles_set_updated_at
before update on public.user_recovery_profiles
for each row
execute function public.set_updated_at();

alter table public.user_recovery_profiles enable row level security;

drop policy if exists "Users can read own recovery profile"
  on public.user_recovery_profiles;
create policy "Users can read own recovery profile"
  on public.user_recovery_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own recovery profile"
  on public.user_recovery_profiles;
create policy "Users can insert own recovery profile"
  on public.user_recovery_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own recovery profile"
  on public.user_recovery_profiles;
create policy "Users can update own recovery profile"
  on public.user_recovery_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Stripe webhooks and privileged server writes use the service role (bypasses RLS).
