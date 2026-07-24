import { describe, expect, it } from "vitest";
import { computeEntitlement } from "@/lib/entitlement/mode";

describe("computeEntitlement", () => {
  const now = new Date("2026-07-22T12:00:00.000Z");

  it("returns full for active / trialing / past_due", () => {
    for (const status of ["active", "trialing", "past_due"]) {
      const result = computeEntitlement({ status, now });
      expect(result.mode).toBe("full");
      expect(result.isPremium).toBe(true);
      expect(result.filtersDns).toBe(true);
      expect(result.graceEndsAt).toBeNull();
    }
  });

  it("returns grace_24h when grace window is still open", () => {
    const graceEndsAt = new Date("2026-07-22T18:00:00.000Z");
    const result = computeEntitlement({
      status: "canceled",
      previousGraceEndsAt: graceEndsAt,
      now,
    });
    expect(result.mode).toBe("grace_24h");
    expect(result.isPremium).toBe(true);
    expect(result.filtersDns).toBe(true);
  });

  it("returns none when grace has expired", () => {
    const graceEndsAt = new Date("2026-07-21T12:00:00.000Z");
    const result = computeEntitlement({
      status: "canceled",
      previousGraceEndsAt: graceEndsAt,
      now,
    });
    expect(result.mode).toBe("none");
    expect(result.isPremium).toBe(false);
    expect(result.filtersDns).toBe(false);
  });

  it("opens grace from a recently ended trial", () => {
    const trialEndsAt = new Date("2026-07-22T06:00:00.000Z");
    const result = computeEntitlement({
      status: "canceled",
      trialEndsAt,
      now,
    });
    expect(result.mode).toBe("grace_24h");
    expect(result.graceEndsAt?.toISOString()).toBe(
      "2026-07-23T06:00:00.000Z",
    );
  });
});
