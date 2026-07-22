import { describe, expect, it } from "vitest";
import { parseAnalyticsConsent } from "@/lib/consent";

describe("parseAnalyticsConsent", () => {
  it("accepts granted and denied", () => {
    expect(parseAnalyticsConsent("granted")).toBe("granted");
    expect(parseAnalyticsConsent("denied")).toBe("denied");
  });

  it("rejects unknown values", () => {
    expect(parseAnalyticsConsent(undefined)).toBeNull();
    expect(parseAnalyticsConsent(null)).toBeNull();
    expect(parseAnalyticsConsent("")).toBeNull();
    expect(parseAnalyticsConsent("yes")).toBeNull();
  });
});
