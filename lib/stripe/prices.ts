import type { PlanId } from "@/lib/onboarding/types";

export const PLAN_PRICING = {
  annual: {
    id: "annual" as const,
    amountUsd: 29.99,
    interval: "year" as const,
    monthlyEquivalentUsd: 2.5,
    savingsPercent: 37,
    label: "Annual",
    priceLabel: "$29.99/year",
    equivalentLabel: "$2.50/month",
    description: "7-day free trial, then $29.99 billed annually.",
  },
  monthly: {
    id: "monthly" as const,
    amountUsd: 3.99,
    interval: "month" as const,
    label: "Monthly",
    priceLabel: "$3.99/month",
    description: "7-day free trial, then $3.99 billed monthly.",
  },
} as const;

export const TRIAL_PERIOD_DAYS = 7;

export function getStripePriceId(plan: PlanId): string {
  const priceId =
    plan === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;

  if (!priceId) {
    throw new Error(
      plan === "annual"
        ? "Missing STRIPE_PRICE_ANNUAL"
        : "Missing STRIPE_PRICE_MONTHLY",
    );
  }

  return priceId;
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "annual" || value === "monthly";
}
