import { downloadText } from "@/lib/blocklist/download";
import {
  extractDomainsFromHtml,
  parseDomainLines,
} from "@/lib/blocklist/domain-parser";
import { normalizeDomain } from "@/lib/blocklist/normalize";
import { isValidDomain } from "@/lib/blocklist/domain-validator";
import type {
  BlocklistProvider,
  ProviderContext,
  ProviderResult,
} from "@/blocklists/types";

/** Configurable ACMA source — update here if ACMA moves the page. */
export const ACMA_SOURCE_URL =
  "https://www.acma.gov.au/blocked-gambling-websites";

/**
 * Isolated ACMA HTML extraction. Exported for fixture tests.
 */
export function parseAcmaHtml(html: string): {
  domains: string[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const candidates = extractDomainsFromHtml(html);
  const domains: string[] = [];

  for (const candidate of candidates) {
    const { domain } = normalizeDomain(candidate);
    if (!domain) continue;
    // Drop ACMA / gov chrome that may leak through
    if (
      domain.endsWith(".gov.au") ||
      domain === "google.com" ||
      domain.endsWith(".google.com") ||
      domain.endsWith(".googleapis.com") ||
      domain.endsWith(".gstatic.com") ||
      domain === "acma.gov.au"
    ) {
      continue;
    }
    const validation = isValidDomain(domain);
    if (!validation.valid) continue;
    domains.push(domain);
  }

  if (domains.length === 0) {
    warnings.push(
      "ACMA page could not be parsed reliably; no domains extracted. Update the parser or source URL.",
    );
  } else if (domains.length < 20) {
    warnings.push(
      `ACMA extraction returned only ${domains.length} domains; page structure may have changed.`,
    );
  }

  return { domains, warnings };
}

export const acmaProvider: BlocklistProvider = {
  id: "acma",
  name: "ACMA Illegal Gambling",
  sourceUrl: ACMA_SOURCE_URL,
  enabled: true,
  async fetchDomains(context: ProviderContext): Promise<ProviderResult> {
    const download = await downloadText({
      providerId: this.id,
      sourceUrl: ACMA_SOURCE_URL,
      cacheDirectory: context.cacheDirectory,
      forceRefresh: context.forceRefresh,
      signal: context.signal,
      // ACMA HTML pages are slower than raw GitHub text lists.
      timeoutMs: 60_000,
    });

    const warnings: string[] = [];
    if (download.staleCache) {
      warnings.push("Served from stale cache after network failure.");
    }

    const looksLikeHtml = /<html[\s>]/i.test(download.body) || /<body[\s>]/i.test(download.body);
    let domains: string[] = [];
    let rawEntryCount = 0;

    if (looksLikeHtml) {
      const parsed = parseAcmaHtml(download.body);
      domains = parsed.domains;
      warnings.push(...parsed.warnings);
      rawEntryCount = domains.length;
    } else {
      const parsed = parseDomainLines(download.body, this.id);
      domains = parsed.domains;
      rawEntryCount = parsed.rawEntryCount;
      if (domains.length === 0) {
        warnings.push(
          "ACMA response was not HTML and contained no parseable domains.",
        );
      }
    }

    return {
      providerId: this.id,
      providerName: this.name,
      sourceUrl: ACMA_SOURCE_URL,
      fetchedAt: download.fetchedAt,
      rawEntryCount,
      domains,
      warnings,
      usedCache: download.fromCache,
    };
  },
};
