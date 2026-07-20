import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  extractDomainsFromHtml,
  parseDomainLines,
} from "@/lib/blocklist/domain-parser";
import { parseAcmaHtml } from "@/blocklists/providers/acma";

const fixtures = path.join(process.cwd(), "tests", "fixtures");

describe("domain-parser", () => {
  it("parses HaGeZi-style fixtures", () => {
    const body = readFileSync(path.join(fixtures, "hagezi-domains.txt"), "utf8");
    const parsed = parseDomainLines(body, "hagezi");
    expect(parsed.domains).toContain("example-casino.com");
    expect(parsed.domains).toContain("www.bet-fixture.com");
    expect(parsed.domains).toContain("wildcard-bet.example");
    expect(parsed.domains).toContain("hosts-style.example");
    expect(parsed.domains).not.toContain("localhost");
  });

  it("parses Block List Project hosts format", () => {
    const body = readFileSync(
      path.join(fixtures, "blocklist-project.txt"),
      "utf8",
    );
    const parsed = parseDomainLines(body, "block-list-project");
    expect(parsed.domains).toEqual(
      expect.arrayContaining([
        "blp-casino.example",
        "blp-poker.example",
        "blp-plain.example",
      ]),
    );
    expect(parsed.domains).not.toContain("localhost");
  });

  it("extracts ACMA HTML domains without chrome", () => {
    const html = readFileSync(path.join(fixtures, "acma.html"), "utf8");
    const { domains, warnings } = parseAcmaHtml(html);
    expect(domains).toEqual(
      expect.arrayContaining([
        "fairgo-fixture.com",
        "rocketplay-fixture.com",
        "uptownpokies-fixture.com",
        "spinanga-fixture.com",
      ]),
    );
    expect(domains.some((d) => d.includes("acma.gov.au"))).toBe(false);
    expect(domains.some((d) => d.includes("google.com"))).toBe(false);
    expect(warnings.length).toBeGreaterThan(0); // low count warning from fixture
  });

  it("extractDomainsFromHtml ignores empty pages", () => {
    expect(extractDomainsFromHtml("<html><body>Hi</body></html>")).toEqual([]);
  });
});
