import { describe, expect, it } from "vitest";
import { mergeProviderDomains } from "@/lib/blocklist/merge";

describe("mergeProviderDomains", () => {
  it("deduplicates, sorts, and attributes sources", () => {
    const result = mergeProviderDomains(
      [
        { providerId: "a", domains: ["zeta.com", "alpha.com", "shared.com"] },
        { providerId: "b", domains: ["shared.com", "beta.com", "ALPHA.com"] },
      ],
      [],
    );

    expect(result.domains).toEqual([
      "alpha.com",
      "beta.com",
      "shared.com",
      "zeta.com",
    ]);
    expect(result.attribution.get("shared.com")).toEqual(
      new Set(["a", "b"]),
    );
    expect(result.duplicatesRemoved).toBeGreaterThan(0);
  });

  it("applies exact and leading-dot allowlist rules", () => {
    const result = mergeProviderDomains(
      [
        {
          providerId: "a",
          domains: [
            "keep.com",
            "support.example.com",
            "example.com",
            "www.example.com",
            "other.com",
          ],
        },
      ],
      ["support.example.com", ".example.com"],
    );

    expect(result.domains).toEqual(["keep.com", "other.com"]);
    expect(result.allowlistMatchesRemoved).toBe(3);
    expect(result.allowlistRemovedSample).toEqual(
      expect.arrayContaining([
        "example.com",
        "support.example.com",
        "www.example.com",
      ]),
    );
  });

  it("is deterministic", () => {
    const batches = [
      { providerId: "a", domains: ["b.com", "a.com"] },
      { providerId: "b", domains: ["a.com", "c.com"] },
    ];
    const first = mergeProviderDomains(batches, []).domains.join("\n");
    const second = mergeProviderDomains(batches, []).domains.join("\n");
    expect(first).toBe(second);
  });
});
