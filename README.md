# BetClear

Premium iPhone gambling-block product. This repo currently includes:

- Marketing landing page
- Private admin control panel for a dynamic domain blocklist (Supabase)
- Authenticated plain-text blocklist API for the future DNS resolver
- iOS `.mobileconfig` generator that points devices at `https://dns.betclear.app/dns-query`
- Local install-test page for downloading the profile
- Stripe subscription paywall (Checkout, webhooks, profile gating)

**Not implemented yet:** the DNS-over-HTTPS resolver at `dns.betclear.app`.

**Implemented in this repo:** personalized onboarding, Supabase Auth, Stripe Checkout (7-day trial), Stripe webhooks, paywall-gated profile download, and post-payment redirect to `/install`.

## Architecture

```
Landing CTA → /onboarding/* → /auth → Stripe Checkout → /payment/success → /install
                                                     │
                                                     ▼
                                         user_recovery_profiles (Supabase)
                                                     ▲
                                         Stripe webhooks + verify-session

Admin UI (/admin/domains) → blocked_domains → GET /api/blocklist
GET /api/profile → signed .mobileconfig for iPhone install
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
2. Copy the project URL, anon key, and **service role** key into `.env.local` (see `.env.example`).
3. Apply migrations using **one** of the options below.

### Option A: Supabase CLI (recommended)

Link the repo to your remote project once:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

`<your-project-ref>` is the subdomain from `NEXT_PUBLIC_SUPABASE_URL`.

Push all files in `supabase/migrations/`:

```bash
npm run db:push
```

### Option B: Direct Postgres (`npm run db:migrate`)

Add your database password to `.env` or `.env.local`:

```bash
SUPABASE_DB_PASSWORD=...
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
```

Or set a full connection string instead:

```bash
DATABASE_URL=postgresql://postgres:...@db.<project-ref>.supabase.co:5432/postgres
```

Then run:

```bash
npm run db:migrate
```

This applies any migration not yet recorded in `public.schema_migrations`.

### Option C: SQL Editor

Paste and run each file under `supabase/migrations/` in order in the Supabase SQL Editor.

Migrations create `blocked_domains`, `subscriptions` (Stripe), `user_recovery_profiles` (onboarding), and link subscriptions to auth users. RLS is enabled; privileged writes use the service role key.

### Supabase Auth

1. In Supabase → **Authentication → Providers**, enable **Email** and **Google**.
2. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
3. Copy the anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Stripe setup

1. Create a Stripe product (for example “BetClear Protection”).
2. Create two recurring prices:
   - Annual: `$29.99` / year → put the Price ID in `STRIPE_PRICE_ANNUAL`
   - Monthly: `$3.99` / month → put the Price ID in `STRIPE_PRICE_MONTHLY`
3. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Set `NEXT_PUBLIC_APP_URL` (and optionally `NEXT_PUBLIC_SITE_URL`) to your deployed origin.
5. Create webhook endpoints for:
   - `POST /api/webhooks/stripe` (paywall / subscriptions table)
   - `POST /api/stripe/webhook` (onboarding recovery profile sync)

   Subscribe at least to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

6. Put the signing secret in `STRIPE_WEBHOOK_SECRET`.

Local webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Onboarding checkout is created by `POST /api/stripe/create-checkout-session` with `{ "plan": "annual" | "monthly" }`. Prices are resolved server-side from env Price IDs. Both plans use a 7-day trial.

## Onboarding flow

Landing CTA → `/onboarding/spend` → time → last gamble → confirm date → impact → pricing → `/auth` → Stripe Checkout → `/payment/success` → `/install`.

Incomplete answers are stored in `localStorage` so OAuth redirects and refreshes keep progress. After authentication, answers are saved to `user_recovery_profiles`. Temporary local state is cleared once Checkout is created.

## Environment variables

Documented in `.env.example`:

| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Auth (browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Admin + privileged profile/billing writes |
| `SUPABASE_DB_PASSWORD` | **Server only** | Postgres password for `npm run db:migrate` |
| `DATABASE_URL` | **Server only** | Optional full Postgres URL (overrides `SUPABASE_DB_PASSWORD`) |
| `NEXT_PUBLIC_APP_URL` | Public | Canonical app URL for auth + Stripe redirects |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe.js publishable key |
| `STRIPE_SECRET_KEY` | **Server only** | Stripe API secret |
| `STRIPE_WEBHOOK_SECRET` | **Server only** | Stripe webhook signing secret |
| `STRIPE_PRICE_ANNUAL` | **Server only** | Stripe Price ID for $29.99/year |
| `STRIPE_PRICE_MONTHLY` | **Server only** | Stripe Price ID for $3.99/month |
| `ADMIN_PASSWORD` | **Server only** | Temporary password for `/admin` |
| `BLOCKLIST_API_TOKEN` | **Server only** | Reserved / unused by the public AdGuard blocklist endpoint |
| `ADGUARD_BASE_URL` | **Server only** | AdGuard Home base URL, e.g. `https://dns.betclear.app` |
| `ADGUARD_USERNAME` | **Server only** | AdGuard Home admin username |
| `ADGUARD_PASSWORD` | **Server only** | AdGuard Home admin password |
| `NEXT_PUBLIC_SITE_URL` | Public | Alias for site URL used by existing paywall helpers |
| `STRIPE_PRICE_TEST` | **Server only** | Optional low-cost test price ID |
| `PROFILE_SIGNING_CERT` | **Server only** | Leaf certificate PEM used to CMS-sign `.mobileconfig` |
| `PROFILE_SIGNING_KEY` | **Server only** | Matching private key PEM (**never expose**) |
| `PROFILE_SIGNING_CHAIN` | **Server only** | Optional intermediate/root chain PEM |
| `PROFILE_SIGNING_CERT_PATH` | **Server only** | Absolute path to leaf cert PEM (alternative to env PEM) |
| `PROFILE_SIGNING_KEY_PATH` | **Server only** | Absolute path to private key PEM |
| `PROFILE_SIGNING_CHAIN_PATH` | **Server only** | Absolute path to chain PEM (optional) |
| `PROFILE_SIGNING_DIR` | **Server only** | Directory containing `cert.pem` / `key.pem` / optional `chain.pem` (default: `secrets/profile-signing`) |

Never put `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_PASSWORD`, `ADGUARD_*`, or `PROFILE_SIGNING_*` secrets in client components / `NEXT_PUBLIC_*` vars.

`GET /api/blocklist` is intentionally public so AdGuard can fetch it. It merges:

1. `output/gambling.txt` from the blocklist pipeline (primary, ~hundreds of thousands of domains)
2. Enabled rows in Supabase `blocked_domains` (admin custom overrides only)

Supabase is **not** meant to store the full pipeline list (that would make the admin UI unusable). An empty Supabase table is normal until you add custom domains in `/admin/domains`.

After every successful admin domain create/update/delete, the server calls AdGuard `POST /control/filtering/refresh` so phones pick up overrides without reinstalling the profile. The server also ensures AdGuard `filters_update_interval` is **1 hour** as a fallback.

## Auth (Supabase)

End-user sign-in uses Supabase Auth before checkout: **Google** or **email magic link**.

1. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
2. In Supabase Dashboard → Authentication → URL Configuration:
   - **Site URL:** `http://localhost:3000` (local) or `https://www.betclear.app` (prod)
   - **Redirect URLs** (add all):
     - `http://localhost:3000/auth/callback**`
     - `https://www.betclear.app/auth/callback**`
   Without these, Supabase sends the auth `code` to `/` instead of `/auth/callback`.
3. Enable the **Email** provider (magic link / OTP).
4. Enable the **Google** provider using OAuth credentials from your Firebase Google Cloud project:
   - Firebase Console → Project settings → Your apps → Web app (or Google Cloud Console → APIs & Services → Credentials)
   - Copy the OAuth 2.0 **Client ID** and **Client secret**
   - Supabase Dashboard → Authentication → Providers → Google → paste both
   - In Google Cloud Console, add authorized redirect URIs:
     - `https://<project-ref>.supabase.co/auth/v1/callback` (required)
     - `https://auth.betclear.app/auth/v1/callback` (after custom domain; see below)
5. Apply migrations: `npm run db:push` (CLI) or `npm run db:migrate` (see Supabase setup).

**Google shows `*.supabase.co` on the consent screen** — that is normal with the default Supabase auth URL. To show `betclear.app` instead:

1. Supabase Dashboard → **Project Settings → Custom Domains** → add e.g. `auth.betclear.app`
2. DNS: CNAME `auth.betclear.app` → value shown by Supabase
3. After activation, set `NEXT_PUBLIC_SUPABASE_URL=https://auth.betclear.app` in production env
4. Google Cloud Console → add redirect URI `https://auth.betclear.app/auth/v1/callback`
5. Optional: Google Cloud → **Branding** → set app name “BetClear”, logo, homepage `https://www.betclear.app` (verification can take a few days)

Flow: `/login` → Google or email → `/auth/callback` → `/pricing` → Stripe Checkout → install.

On iPhone, users can sign in again in Safari with the same Google account or email to access their subscription without relying on cross-browser cookies.

## Stripe paywall

1. Add `STRIPE_SECRET_KEY` to `.env.local` (test mode recommended while developing).
2. Create BetClear products/prices and print price IDs:

```bash
npm run stripe:setup
```

3. Copy the printed `STRIPE_PRICE_*` values into `.env.local`.
4. Apply Supabase migrations (`npm run db:push` or `npm run db:migrate`).
5. Configure a webhook endpoint in the Stripe Dashboard:
   - URL: `https://www.betclear.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`
6. Enable the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) so `/api/billing/portal` works.
7. Local webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Flow: `/login` → `/pricing` → Stripe Checkout → `/install/complete?session_id=...` → copy/open `/api/checkout/success?session_id=...` in Safari on iPhone → `/install?access=token` → `/api/profile` download. Signed-in users can also open `/install` in Safari and sign in with the same email. If Stripe env vars are missing, the paywall stays open for local development.

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

`GET /api/profile` generates the same DNS payload as before, then **CMS/PKCS#7-signs** it with OpenSSL (DER, non-detached) before returning:

- `Content-Type: application/x-apple-aspen-config`
- `Content-Disposition: attachment; filename="BetClear.mobileconfig"`

The signature is verified with OpenSSL before the response is sent. If credentials are missing or signing/verification fails, the API returns JSON (`503` / `500`) instead of an unsigned profile. The private key is never logged or returned.

This route uses the **Node.js** runtime (not Edge) so the OpenSSL CLI can be invoked. Do not move `/api/profile` to Supabase Edge Functions or the Next.js Edge runtime without replacing OpenSSL with a compatible signing service.

### Profile signing setup

See also [`secrets/profile-signing/README.md`](secrets/profile-signing/README.md).

**Option A — mounted files (local / VM / container):**

```bash
mkdir -p secrets/profile-signing
# place cert.pem, key.pem, and optional chain.pem there
chmod 600 secrets/profile-signing/key.pem
```

**Option B — absolute paths:**

```bash
PROFILE_SIGNING_CERT_PATH=/secure/betclear/cert.pem
PROFILE_SIGNING_KEY_PATH=/secure/betclear/key.pem
PROFILE_SIGNING_CHAIN_PATH=/secure/betclear/chain.pem   # optional
```

**Option C — PEM in environment (e.g. Vercel):**

Set `PROFILE_SIGNING_CERT`, `PROFILE_SIGNING_KEY`, and optional `PROFILE_SIGNING_CHAIN` to full PEM text (literal `\n` newlines are accepted).

**Precedence:** explicit `*_PATH` env vars → PEM env vars → `PROFILE_SIGNING_DIR` / `secrets/profile-signing`.

With a certificate trusted on iOS (plus intermediates in the chain), Settings shows the signer identity instead of **Not Signed**. Self-signed certs are fine for local crypto tests but will not appear as a trusted signer on device.

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
