import { downloadText } from "@/lib/blocklist/download";
import { parseDomainLines } from "@/lib/blocklist/domain-parser";
import type {
  BlocklistProvider,
  ProviderContext,
  ProviderResult,
} from "@/blocklists/types";

const DOMAIN_URL =
  "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/gambling-onlydomains.txt";
const HOSTS_FALLBACK_URL =
  "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/hosts/gambling.txt";

export const hageziProvider: BlocklistProvider = {
  id: "hagezi",
  name: "HaGeZi Gambling",
  sourceUrl: DOMAIN_URL,
  enabled: true,
  async fetchDomains(context: ProviderContext): Promise<ProviderResult> {
    const warnings: string[] = [];
    let download;
    let usedFallback = false;

    try {
      download = await downloadText({
        providerId: this.id,
        sourceUrl: DOMAIN_URL,
        cacheDirectory: context.cacheDirectory,
        forceRefresh: context.forceRefresh,
        signal: context.signal,
      });
    } catch (error) {
      warnings.push(
        `Primary domain list failed: ${error instanceof Error ? error.message : "unknown"}. Trying hosts fallback.`,
      );
      download = await downloadText({
        providerId: `${this.id}-hosts`,
        sourceUrl: HOSTS_FALLBACK_URL,
        cacheDirectory: context.cacheDirectory,
        forceRefresh: context.forceRefresh,
        signal: context.signal,
      });
      usedFallback = true;
    }

    const parsed = parseDomainLines(download.body, this.id);
    if (usedFallback) {
      warnings.push("Used hosts-format fallback URL.");
    }
    if (download.staleCache) {
      warnings.push("Served from stale cache after network failure.");
    }

    return {
      providerId: this.id,
      providerName: this.name,
      sourceUrl: usedFallback ? HOSTS_FALLBACK_URL : DOMAIN_URL,
      fetchedAt: download.fetchedAt,
      rawEntryCount: parsed.rawEntryCount,
      domains: parsed.domains,
      warnings,
      usedCache: download.fromCache,
    };
  },
};
