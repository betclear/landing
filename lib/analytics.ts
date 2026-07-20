declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "homepage_viewed"
  | "hero_cta_clicked"
  | "hero_start_protection_clicked"
  | "hero_how_it_works_clicked"
  | "how_it_works_clicked"
  | "trust_installation_guide_clicked"
  | "cost_comparison_cta_clicked"
  | "installation_section_viewed"
  | "pricing_viewed"
  | "pricing_annual_selected"
  | "pricing_monthly_selected"
  | "pricing_start_protection_clicked"
  | "faq_opened"
  | "profile_download_clicked"
  | "installation_guide_opened"
  | "final_cta_clicked"
  | "onboarding_started"
  | "onboarding_spend_completed"
  | "onboarding_time_completed"
  | "onboarding_date_completed"
  | "onboarding_date_confirmed"
  | "onboarding_impact_viewed"
  | "onboarding_plan_selected"
  | "authentication_started"
  | "authentication_completed"
  | "stripe_checkout_started"
  | "stripe_checkout_completed"
  | "installation_page_viewed";

/** Non-sensitive analytics properties only — never send spend/hours/dates. */
export type AnalyticsPayload = {
  plan?: "annual" | "monthly";
  currency?: string;
  step?: string;
  source?: string;
  method?: string;
  question?: string;
};

const BLOCKED_PAYLOAD_KEYS = new Set([
  "monthlyGamblingSpend",
  "weeklyGamblingHours",
  "lastGamblingDate",
  "lastGamblingDateIsApproximate",
  "amount",
  "hours",
  "spend",
]);

export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  try {
    window.clarity?.("event", event);
    if (payload) {
      const safe: Record<string, string> = {};
      for (const [key, value] of Object.entries(payload)) {
        if (value == null) continue;
        if (BLOCKED_PAYLOAD_KEYS.has(key)) continue;
        safe[key] = String(value);
      }
      window.clarity?.("set", event, JSON.stringify(safe));
    }
  } catch {
    // Analytics must never break the product flow.
  }
}
