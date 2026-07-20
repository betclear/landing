import { describe, expect, it } from "vitest";
import { isIosUserAgent, isSafariUserAgent } from "@/lib/stripe/browser";

describe("isSafariUserAgent", () => {
  it("detects iOS Safari", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(isSafariUserAgent(ua)).toBe(true);
  });

  it("rejects iOS Chrome", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1";
    expect(isSafariUserAgent(ua)).toBe(false);
  });

  it("rejects desktop Chrome", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    expect(isSafariUserAgent(ua)).toBe(false);
  });

  it("detects desktop Safari", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
    expect(isSafariUserAgent(ua)).toBe(true);
  });
});

describe("isIosUserAgent", () => {
  it("detects iPhone", () => {
    expect(isIosUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe(
      true,
    );
  });
});
