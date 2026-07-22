export type BillingPlan = "monthly" | "annual";

export type PlanConfig = {
  id: BillingPlan;
  name: string;
  description: string;
  priceLabel: string;
  intervalLabel: string;
  features: readonly string[];
  priceIdEnv: "STRIPE_PRICE_MONTHLY" | "STRIPE_PRICE_ANNUAL";
  highlighted?: boolean;
};

export const BILLING_PLANS: PlanConfig[] = [
  {
    id: "monthly",
    name: "BetClear Monthly",
    description: "Flexible monthly protection you can cancel anytime.",
    priceLabel: "$3.99",
    intervalLabel: "per month",
    priceIdEnv: "STRIPE_PRICE_MONTHLY",
    features: [
      "System-wide gambling site blocking",
      "Updated blocklist without reinstalling",
      "Works in Safari and in-app browsers",
      "Cancel anytime from your billing portal",
    ],
  },
  {
    id: "annual",
    name: "BetClear Annual",
    description: "Best value for long-term protection.",
    priceLabel: "$29.99",
    intervalLabel: "per year",
    priceIdEnv: "STRIPE_PRICE_ANNUAL",
    highlighted: true,
    features: [
      "Everything in Monthly",
      "Save about 37% vs paying monthly",
      "One payment, year-round protection",
      "Priority support by email",
    ],
  },
];

export function getPriceId(plan: BillingPlan): string | undefined {
  if (plan === "monthly") {
    return process.env.STRIPE_PRICE_MONTHLY;
  }
  return process.env.STRIPE_PRICE_ANNUAL;
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/** Route Handler that sets the access cookie (not usable from Server Components). */
export function checkoutSuccessUrl(sessionId: string): string {
  return `${getSiteUrl()}/api/checkout/success?session_id=${encodeURIComponent(sessionId)}`;
}
