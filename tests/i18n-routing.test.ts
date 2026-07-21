import { describe, expect, it } from "vitest";
import { languageToLocale } from "@/lib/i18n/config";
import {
  localizePath,
  resolvePreferredLocale,
  switchLocalePath,
} from "@/lib/i18n/routing";
import { formatCurrency, formatDate } from "@/lib/i18n/format";

describe("i18n routing", () => {
  it("maps language codes to URL locales", () => {
    expect(languageToLocale("en")).toBe("en");
    expect(languageToLocale("pt-BR")).toBe("br");
    expect(languageToLocale("br")).toBe("br");
  });

  it("localizes paths", () => {
    expect(localizePath("en", "/install")).toBe("/en/install");
    expect(localizePath("br", "/onboarding/spend")).toBe(
      "/br/onboarding/spend",
    );
    expect(localizePath("br", "/#how-it-works")).toBe("/br#how-it-works");
    expect(localizePath("en", "mailto:hello@betclear.app")).toBe(
      "mailto:hello@betclear.app",
    );
  });

  it("switches locale while preserving path", () => {
    expect(switchLocalePath("/en/install", "br")).toBe("/br/install");
    expect(switchLocalePath("/br/onboarding/spend", "en")).toBe(
      "/en/onboarding/spend",
    );
  });

  it("resolves preferred locale by cookie then country", () => {
    expect(resolvePreferredLocale({ cookieLocale: "pt-BR", country: "US" })).toBe(
      "br",
    );
    expect(resolvePreferredLocale({ cookieLocale: "en", country: "BR" })).toBe(
      "en",
    );
    expect(resolvePreferredLocale({ cookieLocale: null, country: "BR" })).toBe(
      "br",
    );
    expect(resolvePreferredLocale({ cookieLocale: null, country: "US" })).toBe(
      "en",
    );
    expect(resolvePreferredLocale({ cookieLocale: null, country: null })).toBe(
      "en",
    );
  });
});

describe("i18n formatting", () => {
  it("formats Brazilian currency and dates", () => {
    expect(formatCurrency(29.99, "br", "BRL")).toMatch(/R\$\s*29,99/);
    expect(formatCurrency(3.99, "en", "USD")).toMatch(/\$3\.99/);
    expect(formatDate("2026-07-21", "br")).toBe("21/07/2026");
  });
});
