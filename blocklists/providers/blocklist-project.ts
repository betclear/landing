import { downloadText } from "@/lib/blocklist/download";
import { parseDomainLines } from "@/lib/blocklist/domain-parser";
import type {
  BlocklistProvider,
  ProviderContext,
  ProviderResult,
} from "@/blocklists/types";

const SOURCE_URL =
  "https://raw.githubusercontent.com/blocklistproject/Lists/master/gambling.txt";

export const blockListProjectProvider: BlocklistProvider = {
  id: "block-list-project",
  name: "Block List Project Gambling",
  sourceUrl: SOURCE_URL,
  enabled: true,
  async fetchDomains(context: ProviderContext): Promise<ProviderResult> {
    const warnings: string[] = [];
    const download = await downloadText({
      providerId: this.id,
      sourceUrl: SOURCE_URL,
      cacheDirectory: context.cacheDirectory,
      forceRefresh: context.forceRefresh,
      signal: context.signal,
    });

    const parsed = parseDomainLines(download.body, this.id);
    if (download.staleCache) {
      warnings.push("Served from stale cache after network failure.");
    }

    return {
      providerId: this.id,
      providerName: this.name,
      sourceUrl: SOURCE_URL,
      fetchedAt: download.fetchedAt,
      rawEntryCount: parsed.rawEntryCount,
      domains: parsed.domains,
      warnings,
      usedCache: download.fromCache,
    };
  },
};
