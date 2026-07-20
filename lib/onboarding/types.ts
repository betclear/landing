export type PlanId = "annual" | "monthly";

export type OnboardingState = {
  currentStep: number;
  currency: string;
  monthlyGamblingSpend: number | null;
  weeklyGamblingHours: number | null;
  lastGamblingDate: string | null;
  lastGamblingDateIsApproximate: boolean;
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
};

export const ONBOARDING_STORAGE_KEY = "betclear-onboarding-v1";

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
  { id: "pricing", path: "/onboarding/pricing", label: "Plan", step: 6 },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
