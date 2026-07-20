-- BetClear: blocked domains table for dynamic gambling blocklist

create extension if not exists pgcrypto;

create table if not exists public.blocked_domains (
  id uuid primary key default gen_random_uuid(),
  hostname text not null unique,
  category text not null default 'gambling',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blocked_domains_enabled_idx
  on public.blocked_domains (enabled);

create index if not exists blocked_domains_hostname_idx
  on public.blocked_domains (hostname);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blocked_domains_set_updated_at on public.blocked_domains;

create trigger blocked_domains_set_updated_at
before update on public.blocked_domains
for each row
execute function public.set_updated_at();

alter table public.blocked_domains enable row level security;

-- Server uses the service role key, which bypasses RLS.
-- No public policies: anon/authenticated clients cannot read or write.
