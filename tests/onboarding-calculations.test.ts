import { describe, expect, it } from "vitest";
import { calculateImpactEstimates } from "@/lib/onboarding/calculations";
import { parseOnboardingState } from "@/lib/onboarding/storage";

describe("calculateImpactEstimates", () => {
  it("computes annual spend, hours, and days", () => {
    const result = calculateImpactEstimates(500, 6);

    expect(result.annualGamblingSpend).toBe(6000);
    expect(result.annualGamblingHours).toBe(312);
    expect(result.displaySpend).toBe(6000);
    expect(result.displayHours).toBe(312);
    expect(result.displayDays).toBe(13);
    expect(result.displayDaysLabel).toBe("13");
  });

  it("keeps one decimal for full days under 10", () => {
    const result = calculateImpactEstimates(100, 1);

    expect(result.annualGamblingHours).toBe(52);
    expect(result.annualFullDays).toBeCloseTo(52 / 24, 5);
    expect(result.displayDaysLabel).toBe("2.2");
  });
});

describe("parseOnboardingState", () => {
  it("restores persisted onboarding answers", () => {
    const parsed = parseOnboardingState({
      currentStep: 4,
      currency: "eur",
      monthlyGamblingSpend: 250.5,
      weeklyGamblingHours: 3.5,
      lastGamblingDate: "2026-07-19",
      lastGamblingDateIsApproximate: false,
      selectedPlan: "monthly",
      protectionDurationMonths: 3,
    });

    expect(parsed).toMatchObject({
      currentStep: 4,
      currency: "EUR",
      monthlyGamblingSpend: 250.5,
      weeklyGamblingHours: 3.5,
      lastGamblingDate: "2026-07-19",
      lastGamblingDateIsApproximate: false,
      selectedPlan: "monthly",
      protectionDurationMonths: 3,
    });
  });

  it("defaults protection duration to 3 months", () => {
    const parsed = parseOnboardingState({
      currentStep: 1,
      currency: "USD",
      selectedPlan: "monthly",
    });

    expect(parsed?.protectionDurationMonths).toBe(3);
    expect(parsed?.selectedPlan).toBe("monthly");
  });
});
