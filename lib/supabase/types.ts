import type { PlanId } from "@/lib/onboarding/types";

export type BlockedDomain = {
  id: string;
  hostname: string;
  category: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type UserRecoveryProfileRow = {
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
