import { describe, expect, it } from "vitest";
import {
  clickAttributionFromBody,
  clickAttributionToMetadata,
  clickIdsFromStripeMetadata,
  hasClickAttribution,
} from "@/lib/attribution/metadata";

describe("clickAttributionFromBody", () => {
  it("extracts click ids from request body", () => {
    expect(
      clickAttributionFromBody({
        gclid: "abc123",
        gbraid: "gb1",
        wbraid: "wb1",
      }),
    ).toEqual({
      gclid: "abc123",
      gbraid: "gb1",
      wbraid: "wb1",
    });
  });

  it("returns empty strings for missing or invalid values", () => {
    expect(clickAttributionFromBody(null)).toEqual({
      gclid: "",
      gbraid: "",
      wbraid: "",
    });
    expect(clickAttributionFromBody({ gclid: 123 })).toEqual({
      gclid: "",
      gbraid: "",
      wbraid: "",
    });
    expect(clickAttributionFromBody({ gclid: "  " })).toEqual({
      gclid: "",
      gbraid: "",
      wbraid: "",
    });
  });

  it("rejects oversized values", () => {
    const long = "x".repeat(501);
    expect(clickAttributionFromBody({ gclid: long }).gclid).toBe("");
  });
});

describe("clickAttributionToMetadata", () => {
  it("includes only non-empty click ids", () => {
    expect(
      clickAttributionToMetadata({
        gclid: "abc",
        gbraid: "",
        wbraid: "wb",
      }),
    ).toEqual({
      gclid: "abc",
      wbraid: "wb",
    });
  });
});

describe("clickIdsFromStripeMetadata", () => {
  it("reads click ids from stripe metadata", () => {
    expect(
      clickIdsFromStripeMetadata({
        gclid: "abc",
        gbraid: "gb",
        wbraid: "wb",
        plan: "annual",
      }),
    ).toEqual({
      gclid: "abc",
      gbraid: "gb",
      wbraid: "wb",
    });
  });
});

describe("hasClickAttribution", () => {
  it("detects any click id", () => {
    expect(
      hasClickAttribution({ gclid: "", gbraid: "x", wbraid: "" }),
    ).toBe(true);
    expect(
      hasClickAttribution({ gclid: "", gbraid: "", wbraid: "" }),
    ).toBe(false);
  });
});
