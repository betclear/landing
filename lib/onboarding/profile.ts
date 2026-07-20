import type { OnboardingPersistPayload } from "@/lib/onboarding/types";
import { createServiceClient } from "@/lib/supabase/server";
import type { UserRecoveryProfileRow } from "@/lib/supabase/types";

const ACTIVE_STATUSES = new Set([
  "trialing",
  "active",
  "past_due",
]);

export function isSubscriptionEntitled(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return ACTIVE_STATUSES.has(status);
}

export async function upsertRecoveryProfile(
  userId: string,
  payload: OnboardingPersistPayload,
): Promise<UserRecoveryProfileRow> {
  const supabase = createServiceClient();

  const row = {
    user_id: userId,
    currency: payload.currency,
    monthly_gambling_spend: payload.monthlyGamblingSpend,
    weekly_gambling_hours: payload.weeklyGamblingHours,
    last_gambling_date: payload.lastGamblingDate,
    last_gambling_date_is_approximate: payload.lastGamblingDateIsApproximate,
    selected_plan: payload.selectedPlan,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_recovery_profiles")
    .upsert(row, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save recovery profile");
  }

  return data as UserRecoveryProfileRow;
}

export async function getRecoveryProfileByUserId(
  userId: string,
): Promise<UserRecoveryProfileRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_recovery_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserRecoveryProfileRow | null) ?? null;
}

export async function getRecoveryProfileByStripeCustomerId(
  customerId: string,
): Promise<UserRecoveryProfileRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_recovery_profiles")
    .select("*")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as UserRecoveryProfileRow | null) ?? null;
}

export async function updateRecoveryProfileByUserId(
  userId: string,
  patch: Partial<UserRecoveryProfileRow>,
): Promise<UserRecoveryProfileRow> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("user_recovery_profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update recovery profile");
  }

  return data as UserRecoveryProfileRow;
}
