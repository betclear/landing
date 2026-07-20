import { describe, expect, it } from "vitest";
import { isValidDomain } from "@/lib/blocklist/domain-validator";

describe("isValidDomain", () => {
  it("accepts standard and hyphenated domains", () => {
    expect(isValidDomain("example.com").valid).toBe(true);
    expect(isValidDomain("my-casino.example.com").valid).toBe(true);
    expect(isValidDomain("xn--bcher-kva.example").valid).toBe(true);
  });

  it("rejects IPs, localhost, single labels", () => {
    expect(isValidDomain("192.168.1.1").valid).toBe(false);
    expect(isValidDomain("localhost").valid).toBe(false);
    expect(isValidDomain("intranet").valid).toBe(false);
  });

  it("enforces DNS label limits", () => {
    const longLabel = `${"a".repeat(64)}.com`;
    expect(isValidDomain(longLabel).valid).toBe(false);

    const longHost = `${"a".repeat(63)}.${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(63)}.com`;
    expect(isValidDomain(longHost).valid).toBe(false);

    expect(isValidDomain("-bad.example").valid).toBe(false);
    expect(isValidDomain("bad-.example").valid).toBe(false);
    expect(isValidDomain("a..b.com").valid).toBe(false);
  });

  it("rejects wildcards and path leftovers", () => {
    expect(isValidDomain("*.example.com").valid).toBe(false);
    expect(isValidDomain("example.com/path").valid).toBe(false);
  });
});
