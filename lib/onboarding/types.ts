export type PlanId = "annual" | "monthly";

export type ProtectionDurationMonths = 1 | 3 | 6 | 12;

export type OnboardingState = {
  currentStep: number;
  currency: string;
  monthlyGamblingSpend: number | null;
  weeklyGamblingHours: number | null;
  lastGamblingDate: string | null;
  lastGamblingDateIsApproximate: boolean;
  protectionDurationMonths: ProtectionDurationMonths;
  selectedPlan: PlanId;
};

export type UserRecoveryProfile = {
  id: string;
  user_id: string;
  currency: string;
  monthly_gambling_spend: number;
  weekly_gambling_hours: number;
  last_gambling_date: string | null;
  last_gambling_date_is_approximate: boolean;
  onboarding_completed_at: string | null;
  selected_plan: PlanId | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingPersistPayload = {
  currency: string;
  monthlyGamblingSpend: number;
  weeklyGamblingHours: number;
  lastGamblingDate: string | null;
  lastGamblingDateIsApproximate: boolean;
  selectedPlan: PlanId;
  protectionDurationMonths?: ProtectionDurationMonths;
};

export const ONBOARDING_STORAGE_KEY = "betclear-onboarding-v1";

export const PROTECTION_DURATION_OPTIONS = [1, 3, 6, 12] as const;

export function isProtectionDurationMonths(
  value: unknown,
): value is ProtectionDurationMonths {
  return (
    value === 1 || value === 3 || value === 6 || value === 12
  );
}

export const ONBOARDING_STEPS = [
  { id: "spend", path: "/onboarding/spend", label: "Spend", step: 1 },
  { id: "time", path: "/onboarding/time", label: "Time", step: 2 },
  { id: "last-gamble", path: "/onboarding/last-gamble", label: "Date", step: 3 },
  {
    id: "confirm-date",
    path: "/onboarding/confirm-date",
    label: "Confirm",
    step: 4,
  },
  { id: "impact", path: "/onboarding/impact", label: "Impact", step: 5 },
  {
    id: "protection-period",
    path: "/onboarding/protection-period",
    label: "Period",
    step: 6,
  },
  { id: "pricing", path: "/onboarding/pricing", label: "Plan", step: 7 },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];

/** Suggested Stripe plan from the chosen protection duration. */
export function planForProtectionDuration(
  months: ProtectionDurationMonths,
): PlanId {
  return months === 12 ? "annual" : "monthly";
}
