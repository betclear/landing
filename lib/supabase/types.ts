import type { PlanId } from "@/lib/onboarding/types";

export type BlockedDomain = {
  id: string;
  hostname: string;
  category: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type DomainSubmissionStatus = "pending" | "approved" | "rejected";

export type DomainSubmission = {
  id: string;
  hostname: string;
  raw_input: string;
  status: DomainSubmissionStatus;
  created_at: string;
  reviewed_at: string | null;
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

export type SubscriptionRow = {
  id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  email: string | null;
  user_id: string | null;
  status: string;
  price_id: string | null;
  plan: PlanId | null;
  current_period_end: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

/** Flattened registered-user row for the admin users table. */
export type AdminRegisteredUser = {
  id: string;
  email: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  providers: string[];
  // subscriptions.*
  subscription_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_email: string | null;
  subscription_status: string | null;
  price_id: string | null;
  plan: PlanId | null;
  current_period_end: string | null;
  is_premium: boolean | null;
  subscription_created_at: string | null;
  subscription_updated_at: string | null;
  // user_recovery_profiles.*
  profile_id: string | null;
  currency: string | null;
  monthly_gambling_spend: number | null;
  weekly_gambling_hours: number | null;
  last_gambling_date: string | null;
  last_gambling_date_is_approximate: boolean | null;
  onboarding_completed_at: string | null;
  selected_plan: PlanId | null;
  profile_stripe_customer_id: string | null;
  profile_stripe_subscription_id: string | null;
  profile_subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_ends_at: string | null;
  profile_created_at: string | null;
  profile_updated_at: string | null;
};
