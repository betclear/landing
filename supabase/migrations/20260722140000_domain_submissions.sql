-- Public user requests to block gambling sites not yet in BetClear

create table if not exists public.domain_submissions (
  id uuid primary key default gen_random_uuid(),
  hostname text not null,
  raw_input text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists domain_submissions_status_created_idx
  on public.domain_submissions (status, created_at desc);

create index if not exists domain_submissions_hostname_idx
  on public.domain_submissions (hostname);

-- One open request per hostname
create unique index if not exists domain_submissions_pending_hostname_uidx
  on public.domain_submissions (hostname)
  where status = 'pending';

alter table public.domain_submissions enable row level security;

-- Server uses the service role key, which bypasses RLS.
-- No public policies: anon/authenticated clients cannot read or write.
