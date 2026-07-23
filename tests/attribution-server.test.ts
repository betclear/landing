import { describe, expect, it } from "vitest";
import {
  clickAttributionFromCookies,
  isNewAuthUser,
  signupOrderId,
} from "@/lib/attribution/server";

describe("clickAttributionFromCookies", () => {
  it("reads click ids from cookie header", () => {
    expect(
      clickAttributionFromCookies(
        "_gclid=abc123; _gbraid=gb1; other=x; _wbraid=wb1",
      ),
    ).toEqual({
      gclid: "abc123",
      gbraid: "gb1",
      wbraid: "wb1",
    });
  });

  it("returns empty strings when cookies are missing", () => {
    expect(clickAttributionFromCookies(null)).toEqual({
      gclid: "",
      gbraid: "",
      wbraid: "",
    });
  });
});

describe("signupOrderId", () => {
  it("uses stable signup prefix", () => {
    expect(signupOrderId("user-123")).toBe("signup_user-123");
  });
});

describe("isNewAuthUser", () => {
  it("detects first sign-in when timestamps match", () => {
    const now = new Date().toISOString();
    expect(
      isNewAuthUser({
        created_at: now,
        last_sign_in_at: now,
      }),
    ).toBe(true);
  });

  it("returns false for returning users", () => {
    expect(
      isNewAuthUser({
        created_at: "2026-01-01T00:00:00.000Z",
        last_sign_in_at: "2026-07-23T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});
