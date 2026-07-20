import { describe, expect, it } from "vitest";
import { normalizeDomain } from "@/lib/blocklist/normalize";

describe("normalizeDomain", () => {
  it("normalizes plain and uppercase domains", () => {
    expect(normalizeDomain("Example.COM").domain).toBe("example.com");
    expect(normalizeDomain("casino.example.com").domain).toBe(
      "casino.example.com",
    );
  });

  it("normalizes full URLs with ports and paths", () => {
    expect(
      normalizeDomain("HTTPS://WWW.Example.COM/path?q=1#frag").domain,
    ).toBe("www.example.com");
    expect(normalizeDomain("https://bet.example.com:443/x").domain).toBe(
      "bet.example.com",
    );
  });

  it("handles hosts-file and wildcards", () => {
    expect(normalizeDomain("0.0.0.0 casino.example.com").domain).toBe(
      "casino.example.com",
    );
    expect(normalizeDomain("*.BET.EXAMPLE.COM.").domain).toBe("bet.example.com");
  });

  it("rejects comments, email, localhost, IPs, whitespace", () => {
    expect(normalizeDomain("# comment").domain).toBeNull();
    expect(normalizeDomain("user@example.com").domain).toBeNull();
    expect(normalizeDomain("127.0.0.1 localhost").domain).toBeNull();
    expect(normalizeDomain("192.168.1.1").domain).toBe("192.168.1.1"); // normalize keeps; validator rejects
    expect(normalizeDomain("not a domain").domain).toBeNull();
  });

  it("converts unicode to punycode", () => {
    const result = normalizeDomain("bücher.example");
    expect(result.domain).toBe("xn--bcher-kva.example");
  });
});
