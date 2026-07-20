import { normalizeDomain } from "@/lib/blocklist/normalize";
import { isValidDomain } from "@/lib/blocklist/domain-validator";
import type { RejectedEntry } from "@/blocklists/types";

export interface ParseLinesResult {
  domains: string[];
  rejected: RejectedEntry[];
  rawEntryCount: number;
}

/**
 * Parse a multi-line blocklist body into normalized validated domains.
 */
export function parseDomainLines(
  body: string,
  providerId: string,
): ParseLinesResult {
  const lines = body.split(/\r?\n/);
  const domains: string[] = [];
  const rejected: RejectedEntry[] = [];
  let rawEntryCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip pure comments without counting as raw domain attempts heavily —
    // still count non-empty content lines as raw entries for reporting.
    rawEntryCount += 1;

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("!") ||
      trimmed.startsWith(";")
    ) {
      continue;
    }

    const { domain, reason } = normalizeDomain(trimmed);
    if (!domain) {
      if (reason && reason !== "comment" && reason !== "empty") {
        rejected.push({
          providerId,
          reason: reason ?? "unparseable",
          original: trimmed,
        });
      }
      continue;
    }

    const validation = isValidDomain(domain);
    if (!validation.valid) {
      rejected.push({
        providerId,
        reason: validation.reason ?? "invalid hostname",
        original: trimmed,
      });
      continue;
    }

    domains.push(domain);
  }

  return { domains, rejected, rawEntryCount };
}

/**
 * Extract candidate domain strings from HTML (ACMA-style pages).
 * Only considers anchors/list items that look like hostnames, not site chrome.
 */
export function extractDomainsFromHtml(html: string): string[] {
  const candidates = new Set<string>();

  // Prefer list items and table cells with domain-like text
  const listItemRe =
    /<(?:li|td|dd)[^>]*>\s*(?:<a[^>]*>)?\s*([a-z0-9][a-z0-9.-]+\.[a-z]{2,})(?:\s*<\/a>)?\s*<\/(?:li|td|dd)>/gi;
  let match: RegExpExecArray | null;
  while ((match = listItemRe.exec(html)) !== null) {
    if (match[1]) {
      candidates.add(match[1].toLowerCase().replace(/^www\./, ""));
    }
  }

  // Anchors whose href is http(s) to an external host, text equals host-ish
  const anchorRe =
    /<a[^>]+href=["']https?:\/\/([^"'/]+)[^"']*["'][^>]*>\s*([^<]+?)\s*<\/a>/gi;
  while ((match = anchorRe.exec(html)) !== null) {
    const hrefHost = match[1]?.toLowerCase() ?? "";
    const text = (match[2] ?? "").trim().toLowerCase();
    if (
      hrefHost &&
      !hrefHost.includes("acma.gov.au") &&
      !hrefHost.includes("australia.gov.au") &&
      hrefHost.includes(".")
    ) {
      candidates.add(hrefHost.replace(/^www\./, ""));
    }
    if (/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/.test(text)) {
      candidates.add(text.replace(/^www\./, ""));
    }
  }

  // Plain domain lines in <pre> or code blocks
  const preRe = /<(?:pre|code)[^>]*>([\s\S]*?)<\/(?:pre|code)>/gi;
  while ((match = preRe.exec(html)) !== null) {
    const block = match[1] ?? "";
    for (const line of block.split(/\r?\n/)) {
      const t = line.trim().toLowerCase();
      if (/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/.test(t)) {
        candidates.add(t);
      }
    }
  }

  return Array.from(candidates);
}
