# BetClear — Google Ads Conversion Tracking (Stripe)

**Audience:** Backend / Full-stack developer  
**Product:** [betclear.app](https://betclear.app)  
**Payments:** Stripe  
**Ads account (client):** `831-494-7794`  
**MCC (login customer):** `123-039-9435`

This doc describes the **exact** conversion setup already created in Google Ads and how to wire Stripe so trials and purchases appear in the Brazil Search campaign.

---

## 1. Account & conversion actions (already created)

Do **not** create new conversion actions unless names collide. Use these IDs:

| Name | Conversion Action ID | Resource name | Primary for account goals | When to fire |
|------|----------------------|---------------|---------------------------|--------------|
| **BetClear Trial** | `7694794750` | `customers/8314947794/conversionActions/7694794750` | **Yes** | User starts free trial (Checkout completed with trial / subscription enters `trialing`) |
| **BetClear Purchase** | `7694795221` | `customers/8314947794/conversionActions/7694795221` | No | First paid invoice / trial converts to paid |

**Conversion type:** `UPLOAD_CLICKS` (server-side upload via Google Ads API — not a browser gtag label).

**Campaign context:** Search campaign **Brazil** (`24045590598`) currently uses Manual CPC. After conversions flow reliably (2+ weeks), bidding can move to Maximize Conversions / tCPA using **BetClear Trial** as the primary goal.

> Note: This Ads account also has Remo / offline upload primaries. For BetClear optimization, campaign conversion goals should prefer **BetClear Trial** (+ Purchase as secondary). Coordinate with the media buyer before changing account-default goals.

---

## 2. Architecture

```
User clicks Google Ad
  URL: https://betclear.app/?gclid=XXXX   (or gbraid / wbraid on some devices)
        │
        ▼
Frontend stores click IDs in first-party cookies (90 days)
        │
        ▼
Create Stripe Checkout Session
  metadata: { gclid, gbraid?, wbraid? }
  (+ copy same metadata onto Subscription if using subscriptions)
        │
        ▼
Stripe webhook
  checkout.session.completed  → upload BetClear Trial
  invoice.paid (amount_paid > 0) → upload BetClear Purchase (+ value)
        │
        ▼
Google Ads API: ConversionUploadService.UploadClickConversions
```

**Why server-side (not only gtag):** Ad blockers, ITP, and in-app browsers drop client tags. Stripe webhooks + `gclid` in metadata are more reliable for subscription products.

---

## 3. Frontend — capture `gclid` / `gbraid` / `wbraid`

### 3.1 Load on every page of `betclear.app`

Use the script in this repo: [`public/gclid.js`](../public/gclid.js).

Example (HTML):

```html
<script src="/gclid.js" defer></script>
```

Next.js App Router — e.g. in root `layout.tsx`:

```tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="/gclid.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

### 3.2 Cookies written

| Cookie | Source query param | Max age |
|--------|--------------------|---------|
| `_gclid` | `gclid` | 90 days |
| `_gbraid` | `gbraid` | 90 days |
| `_wbraid` | `wbraid` | 90 days |

### 3.3 Read before checkout

```js
const attribution = window.BetClearAttribution?.all?.() || {
  gclid: "",
  gbraid: "",
  wbraid: "",
};

// POST to your API that creates Stripe Checkout
await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    priceId: "...",
    ...attribution,
  }),
});
```

---

## 4. Create Stripe Checkout with metadata

When creating the Checkout Session, **always** attach attribution to `metadata`.  
For subscriptions, also set `subscription_data.metadata` so later `invoice.paid` events still carry `gclid`.

### Node (stripe SDK)

```js
const session = await stripe.checkout.sessions.create({
  mode: "subscription", // or "payment"
  line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  success_url: "https://betclear.app/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://betclear.app/pricing",
  customer_email: email, // optional
  metadata: {
    gclid: gclid || "",
    gbraid: gbraid || "",
    wbraid: wbraid || "",
    product: "betclear",
  },
  subscription_data: {
    trial_period_days: 7, // if applicable
    metadata: {
      gclid: gclid || "",
      gbraid: gbraid || "",
      wbraid: wbraid || "",
      product: "betclear",
    },
  },
});
```

### Rules

- Empty string is OK if user did not come from Ads — webhook will skip Ads upload when no click id and no email enhancement.
- Do **not** put PII in metadata beyond what you already store; `gclid` is fine.
- Keep the same `gclid` on Customer / Subscription metadata if you create them in a separate step.

---

## 5. Stripe webhooks → Google Ads upload

### 5.1 Events to subscribe

| Stripe event | Google Ads action | Value |
|--------------|-------------------|-------|
| `checkout.session.completed` | **BetClear Trial** (`7694794750`) | `0` (or omit) |
| `invoice.paid` where `amount_paid > 0` | **BetClear Purchase** (`7694795221`) | `amount_paid / 100` |

Optional refinement:

- If Checkout is payment-only (no trial), you may fire **Purchase** on `checkout.session.completed` instead of Trial.
- If trial converts later, fire **Purchase** on the first non-zero `invoice.paid`.

### 5.2 Webhook endpoint (Stripe Dashboard)

1. Developers → Webhooks → Add endpoint  
2. URL: `https://<your-api-host>/webhooks/stripe`  
3. Select events above  
4. Store signing secret as `STRIPE_WEBHOOK_SECRET`

### 5.3 Upload helper (reference implementation)

See [`server/upload_google_ads_conversion.py`](../server/upload_google_ads_conversion.py):

- `upload_trial(gclid=..., email=..., order_id=...)` → Trial action  
- `upload_purchase(gclid=..., email=..., value=..., order_id=..., currency_code=...)` → Purchase action  

**Required fields for a match:**

- Prefer `gclid` (or `gbraid` / `wbraid`)  
- Always send stable `order_id` (Stripe `session.id` or `invoice.id`) for deduplication  
- Optionally send **SHA-256 hashed email** (lowercase, trimmed) for Enhanced Conversions match rate  

**Datetime format for Google Ads API:**

```text
yyyy-mm-dd HH:mm:ss+00:00
```

Example: `2026-07-23 09:15:00+00:00`

### 5.4 Pseudo-flow in your webhook handler

```text
verify Stripe signature

if event.type == checkout.session.completed:
  session = event.data.object
  gclid = session.metadata.gclid
  email = session.customer_details.email
  upload BetClear Trial
    conversion_action = .../7694794750
    gclid, order_id = session.id, value = 0

if event.type == invoice.paid:
  invoice = event.data.object
  if invoice.amount_paid <= 0: return 200
  gclid = invoice.subscription.metadata.gclid  # or retrieve subscription
  upload BetClear Purchase
    conversion_action = .../7694795221
    value = amount_paid / 100
    currency = invoice.currency.upper()
    order_id = invoice.id

return 200 quickly; do Ads upload async if needed (queue)
```

### 5.5 Idempotency

- Use Stripe object ids as `order_id`  
- Google Ads deduplicates on `(conversion_action, order_id)` for uploads  
- Webhook retries are safe if `order_id` is stable  

---

## 6. Environment variables (production)

```bash
# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=<from MCC API Center>
GOOGLE_ADS_LOGIN_CUSTOMER_ID=1230399435
GOOGLE_ADS_CUSTOMER_ID=8314947794
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/adc.json
# OR use OAuth refresh token style google-ads.yaml — pick one auth method

BETCLEAR_TRIAL_CONVERSION_ACTION_ID=7694794750
BETCLEAR_PURCHASE_CONVERSION_ACTION_ID=7694795221

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Auth note:** Laptop Application Default Credentials are fine for local tests. Production should use a durable OAuth refresh token or a supported service-account setup with Google Ads access on MCC `1230399435` / client `8314947794`.

Developer token must have at least **Explorer** (or Standard) access for production uploads.

---

## 7. Google Ads API call shape (reference)

Endpoint conceptually: `ConversionUploadService.UploadClickConversions`

```json
{
  "customerId": "8314947794",
  "partialFailure": true,
  "conversions": [
    {
      "conversionAction": "customers/8314947794/conversionActions/7694794750",
      "gclid": "EAIa...",
      "conversionDateTime": "2026-07-23 09:15:00+00:00",
      "conversionValue": 0,
      "currencyCode": "USD",
      "orderId": "cs_live_..."
    }
  ]
}
```

Purchase example — change action id to `7694795221` and set `conversionValue` to the paid amount in major currency units (e.g. `29.99`).

Official docs: [Upload click conversions](https://developers.google.com/google-ads/api/docs/conversions/upload-clicks)

---

## 8. QA checklist

| Step | Expected |
|------|----------|
| Open `https://betclear.app/?gclid=TEST123` | Cookie `_gclid=TEST123` |
| Start Checkout | Session `metadata.gclid` = `TEST123` |
| Complete test Checkout (Stripe test mode) | Webhook 200; logs show upload attempt |
| Google Ads → Goals → Conversions → diagnostics / uploads | Request accepted (test gclid may not attribute to a real click) |
| Real Ads click → real trial | **BetClear Trial** count increases within ~24h (often sooner) |
| First paid invoice | **BetClear Purchase** with value |

### Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| Upload OK but 0 conversions in UI | Fake/test `gclid` | Use a real ad click |
| `gclid` empty in webhook | Cookie not set / metadata not passed / subscription metadata missing | Fix frontend + `subscription_data.metadata` |
| `PERMISSION_DENIED` | Wrong customer / MCC login id | Use login customer `1230399435` |
| Duplicate conversions | Unstable `order_id` | Always use Stripe ids |
| Wrong campaign optimization | Other primary goals (Remo) | Set BetClear goals on campaign |

---

## 9. Privacy / compliance

- Disclose ads/analytics cookies in privacy policy if required in target markets (Brazil LGPD, etc.).  
- If sending hashed email (Enhanced Conversions), accept Google Ads **customer data terms** in the Ads UI and only hash after normalization (trim + lowercase).  
- Do not log raw `gclid` + full card data together in plaintext logs.

---

## 10. Definition of done

Implementation is complete when:

1. [ ] `gclid.js` (or equivalent) ships on all marketing + checkout entry pages  
2. [ ] Stripe Checkout + Subscription metadata include `gclid` / `gbraid` / `wbraid`  
3. [ ] Webhooks fire Trial + Purchase uploads to the conversion action IDs above  
4. [ ] Staging test with Stripe test mode shows successful API responses  
5. [ ] Within ~48h of real paid traffic, Google Ads shows **BetClear Trial** (and Purchase when charged)  
6. [ ] Media buyer confirms Brazil campaign conversion goals point at BetClear actions  

---

## 11. Contacts / ownership

| Area | Owner |
|------|--------|
| Google Ads account & conversion actions | Performance / media |
| Frontend cookie + checkout payload | Frontend |
| Stripe session + webhooks + Ads upload | Backend |
| Conversion goal settings on campaign | Performance / media |

**Questions for media:** campaign goal mapping, whether Trial stays primary after Purchase volume grows.

---

## Appendix A — Quick IDs cheat sheet

```
MCC_LOGIN_CUSTOMER_ID=1230399435
ADS_CUSTOMER_ID=8314947794
CAMPAIGN_BRAZIL_ID=24045590598
CONVERSION_TRIAL_ID=7694794750
CONVERSION_PURCHASE_ID=7694795221
LANDING=https://betclear.app
```

## Appendix B — Related files in this repo

- `public/gclid.js` — browser capture  
- `server/upload_google_ads_conversion.py` — Python upload helpers + Flask sketch  
- `TRACKING.md` — shorter overview (Georgian)
