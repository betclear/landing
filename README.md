# BetClear

Premium iPhone gambling-block product. This repo currently includes:

- Marketing landing page
- Private admin control panel for a dynamic domain blocklist (Supabase)
- Authenticated plain-text blocklist API for the future DNS resolver
- iOS `.mobileconfig` generator that points devices at `https://dns.betclear.app/dns-query`
- Local install-test page for downloading the profile

**Not implemented yet:** the DNS-over-HTTPS resolver at `dns.betclear.app`, Stripe, user accounts, or subscriptions.

## Architecture

```
Admin UI (/admin/domains)
        │
        ▼
Next.js API routes (service role)
        │
        ▼
Supabase table: blocked_domains
        │
        ▼
GET /api/blocklist  ──►  future DoH resolver at dns.betclear.app
GET /api/profile    ──►  iPhone installs managed DNS settings payload
```

The configuration profile does **not** embed blocked domains. It only configures encrypted DNS. The future resolver will fetch `/api/blocklist` and enforce the list dynamically.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres)
- Vercel-compatible Route Handlers

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see below), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a Supabase project.
2. Copy the project URL, anon key, and **service role** key into `.env.local`.
3. Run the migration in the Supabase SQL Editor, or with the Supabase CLI:

### Option A: SQL Editor

Open **SQL → New query**, paste the contents of:

`supabase/migrations/20260720120000_blocked_domains.sql`

Run it.

### Option B: Supabase CLI

```bash
npx supabase db push
# or
npx supabase migration up
```

The migration creates `blocked_domains` with an `updated_at` trigger and enables RLS with no public policies (server uses the service role key).

## Environment variables

Documented in `.env.example`:

| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Reserved for future client use; admin APIs use the service role |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Admin + blocklist database access |
| `ADMIN_PASSWORD` | **Server only** | Temporary password for `/admin` |
| `BLOCKLIST_API_TOKEN` | **Server only** | Reserved / unused by the public AdGuard blocklist endpoint |
| `ADGUARD_BASE_URL` | **Server only** | AdGuard Home base URL, e.g. `https://dns.betclear.app` |
| `ADGUARD_USERNAME` | **Server only** | AdGuard Home admin username |
| `ADGUARD_PASSWORD` | **Server only** | AdGuard Home admin password |

Never put `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, or `ADGUARD_*` secrets in client components / `NEXT_PUBLIC_*` vars.

`GET /api/blocklist` is intentionally public so AdGuard can fetch it. After every successful admin domain create/update/delete, the server calls AdGuard `POST /control/filtering/refresh` so phones pick up the new list without reinstalling the profile. The server also ensures AdGuard `filters_update_interval` is **1 hour** as a fallback.

## Admin page

1. Set `ADMIN_PASSWORD` in `.env.local`.
2. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
3. Sign in with that password.
4. Manage domains at [http://localhost:3000/admin/domains](http://localhost:3000/admin/domains).

You can add values like `https://www.bet365.com/sports` — they are normalized to bare hostnames (`bet365.com`).

After each successful change, the server refreshes AdGuard filters. If refresh fails, the DB change still sticks and the admin UI shows a warning.

## Test the blocklist API

Public AdGuard-compatible filter list (enabled domains only):

```bash
curl -i http://localhost:3000/api/blocklist
# production:
curl -i https://www.betclear.app/api/blocklist
```

Expected: HTTP 200, `Content-Type: text/plain; charset=utf-8`, rules like:

```text
||bet365.com^
||stake.com^
```

## Download the iOS profile

- Install page: [https://www.betclear.app/install](https://www.betclear.app/install)
- Direct API: [https://www.betclear.app/api/profile](https://www.betclear.app/api/profile)
- Legacy alias: `/install-test` redirects to `/install`

The profile configures managed DNS-over-HTTPS to `https://dns.betclear.app/dns-query`. That endpoint is **not implemented yet**. Installing the profile today only validates the install path.

## Scripts

- `npm run dev` - local development
- `npm run build` - production build
- `npm run start` - serve production build
- `npm run lint` - ESLint
- `npm test` - unit tests (includes blocklist pipeline)
- `npm run blocklist:update` - refresh `output/gambling.txt` from providers
- `npm run blocklist:check` - validate generated blocklist integrity

See [blocklists/README.md](blocklists/README.md) for the gambling blocklist pipeline.

## Milestone check

After setup you should be able to:

1. Add `stake.com` in `/admin/domains`
2. See it in `GET /api/blocklist`
3. Download an iPhone profile from `/install` that points at `dns.betclear.app`
