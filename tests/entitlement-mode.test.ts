import { describe, expect, it } from "vitest";
import { computeEntitlement } from "@/lib/entitlement/mode";

describe("computeEntitlement", () => {
  it("returns full for active / trialing / past_due", () => {
    for (const status of ["active", "trialing", "past_due"]) {
      const result = computeEntitlement({ status });
      expect(result.mode).toBe("full");
      expect(result.isPremium).toBe(true);
      expect(result.filtersDns).toBe(true);
      expect(result.graceEndsAt).toBeNull();
    }
  });

  it("returns none immediately when canceled (no grace)", () => {
    const result = computeEntitlement({
      status: "canceled",
      previousGraceEndsAt: new Date("2099-01-01T00:00:00.000Z"),
      trialEndsAt: new Date("2026-07-22T06:00:00.000Z"),
    });
    expect(result.mode).toBe("none");
    expect(result.isPremium).toBe(false);
    expect(result.filtersDns).toBe(false);
    expect(result.graceEndsAt).toBeNull();
  });
});
