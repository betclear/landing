export type EntitlementMode = "full" | "grace_24h" | "none";

/** No grace: cancel/unpaid cuts off DNS filtering immediately. */
export const GRACE_PERIOD_MS = 0;

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
 * - none: everything else (no grace window)
 */
export function computeEntitlement(input: EntitlementInput): EntitlementResult {
  if (FULL_STATUSES.has(input.status)) {
    return {
      mode: "full",
      isPremium: true,
      graceEndsAt: null,
      filtersDns: true,
    };
  }

  return {
    mode: "none",
    isPremium: false,
    graceEndsAt: null,
    filtersDns: false,
  };
}

export function isEntitledMode(mode: EntitlementMode | null | undefined): boolean {
  return mode === "full" || mode === "grace_24h";
}
