import type { PlanId } from "@/lib/onboarding/types";
import type { AppLocale } from "@/lib/i18n/config";
import {
  getLocalePricing,
  getPlanPricing,
  getStripePriceIdForLocale,
} from "@/lib/i18n/pricing";
import { formatCurrency } from "@/lib/i18n/format";

/** @deprecated Prefer getPlanDisplay(locale, plan) for locale-aware pricing. */
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

export function getPlanDisplay(locale: AppLocale, plan: PlanId) {
  const pricing = getPlanPricing(locale, plan);
  const localePricing = getLocalePricing(locale);
  // Plan prices are billed in USD for all markets — format with en-US so
  // Brazil still shows $3.99 / $29.99 rather than a converted BRL amount.
  const formatted = formatCurrency(pricing.amount, "en", pricing.currency);
  const equivalent =
    plan === "annual" && pricing.monthlyEquivalent != null
      ? formatCurrency(pricing.monthlyEquivalent, "en", pricing.currency)
      : null;

  return {
    ...pricing,
    currency: localePricing.currency,
    priceLabel: formatted,
    formattedAmount: formatted,
    equivalentLabel: equivalent,
    savingsPercent: pricing.savingsPercent,
  };
}

/** Resolve Stripe Price ID. Same prices for all locales for now. */
export function getStripePriceId(
  plan: PlanId,
  locale: AppLocale = "en",
): string {
  return getStripePriceIdForLocale(locale, plan);
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "annual" || value === "monthly";
}

export function isAppLocaleParam(value: unknown): value is AppLocale {
  return value === "en" || value === "br";
}
