-- Link Stripe subscriptions to Supabase Auth users

alter table public.subscriptions
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create unique index if not exists subscriptions_user_id_unique_idx
  on public.subscriptions (user_id)
  where user_id is not null;
