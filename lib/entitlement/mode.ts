export type EntitlementMode = "full" | "grace_24h" | "none";

export const GRACE_PERIOD_MS = 1000 * 60 * 60 * 24; // 24 hours

const FULL_STATUSES = new Set(["active", "trialing", "past_due"]);

export type EntitlementInput = {
  status: string;
  trialEndsAt?: Date | null;
  previousGraceEndsAt?: Date | null;
  now?: Date;
};

export type EntitlementResult = {
  mode: EntitlementMode;
  isPremium: boolean;
  graceEndsAt: Date | null;
  filtersDns: boolean;
};

/**
 * Derive entitlement from Stripe subscription state.
 * - full: active / trialing / past_due
 * - grace_24h: left full entitlement unpaid, still inside grace window
 * - none: everything else
 */
export function computeEntitlement(input: EntitlementInput): EntitlementResult {
  const now = input.now ?? new Date();

  if (FULL_STATUSES.has(input.status)) {
    return {
      mode: "full",
      isPremium: true,
      graceEndsAt: null,
      filtersDns: true,
    };
  }

  // Leaving a trial without converting: open a 24h grace window once.
  let graceEndsAt = input.previousGraceEndsAt ?? null;
  if (
    !graceEndsAt &&
    input.trialEndsAt &&
    input.trialEndsAt.getTime() <= now.getTime() &&
    now.getTime() - input.trialEndsAt.getTime() < GRACE_PERIOD_MS
  ) {
    graceEndsAt = new Date(input.trialEndsAt.getTime() + GRACE_PERIOD_MS);
  }

  if (graceEndsAt && graceEndsAt.getTime() > now.getTime()) {
    return {
      mode: "grace_24h",
      isPremium: true,
      graceEndsAt,
      filtersDns: true,
    };
  }

  return {
    mode: "none",
    isPremium: false,
    graceEndsAt: graceEndsAt && graceEndsAt.getTime() <= now.getTime()
      ? graceEndsAt
      : null,
    filtersDns: false,
  };
}

export function isEntitledMode(mode: EntitlementMode | null | undefined): boolean {
  return mode === "full" || mode === "grace_24h";
}
