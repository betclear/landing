import type { AppLocale } from "@/lib/i18n/config";
import { localeConfig } from "@/lib/i18n/config";
import type { PlanId } from "@/lib/onboarding/types";

export type LocalePlanPricing = {
  currency: string;
  amount: number;
  stripePriceIdEnv: string;
  interval: "year" | "month";
  monthlyEquivalent?: number;
  savingsPercent?: number;
};

export type LocalePricingConfig = {
  currency: string;
  monthly: LocalePlanPricing;
  annual: LocalePlanPricing;
};

/**
 * Shared plan pricing for all locales for now.
 * Brazil uses the same USD amounts and Stripe Price IDs as English.
 */
const SHARED_PRICING: LocalePricingConfig = {
  currency: "USD",
  monthly: {
    currency: "USD",
    amount: 3.99,
    stripePriceIdEnv: "STRIPE_PRICE_MONTHLY",
    interval: "month",
  },
  annual: {
    currency: "USD",
    amount: 29.99,
    stripePriceIdEnv: "STRIPE_PRICE_ANNUAL",
    interval: "year",
    monthlyEquivalent: 2.5,
    savingsPercent: 37,
  },
};

export const LOCALE_PRICING: Record<AppLocale, LocalePricingConfig> = {
  en: SHARED_PRICING,
  br: SHARED_PRICING,
};

export function getLocalePricing(_locale: AppLocale): LocalePricingConfig {
  return SHARED_PRICING;
}

export function getPlanPricing(
  _locale: AppLocale,
  plan: PlanId,
): LocalePlanPricing {
  return SHARED_PRICING[plan];
}

export function getStripePriceIdForLocale(
  _locale: AppLocale,
  plan: PlanId,
): string {
  const envKey = SHARED_PRICING[plan].stripePriceIdEnv;
  const priceId =
    process.env[envKey] ||
    (plan === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL_USD
      : process.env.STRIPE_PRICE_MONTHLY_USD);

  if (!priceId) {
    throw new Error(
      `Missing Stripe price for plan=${plan} (env ${envKey} or STRIPE_PRICE_*_USD)`,
    );
  }

  return priceId;
}

/** Default onboarding spend currency — can differ from plan billing currency. */
export function defaultCurrencyForLocale(locale: AppLocale): string {
  return localeConfig[locale].currency;
}
