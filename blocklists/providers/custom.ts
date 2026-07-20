import { readFile } from "node:fs/promises";
import path from "node:path";
import { blocklistConfig } from "@/config/blocklist.config";
import { parseDomainLines } from "@/lib/blocklist/domain-parser";
import type {
  BlocklistProvider,
  ProviderContext,
  ProviderResult,
} from "@/blocklists/types";

export function createCustomProvider(
  customPath = blocklistConfig.customDomainsPath,
): BlocklistProvider {
  return {
    id: "custom",
    name: "BetClear Custom",
    enabled: true,
    async fetchDomains(_context: ProviderContext): Promise<ProviderResult> {
      const absolute = path.resolve(customPath);
      const body = await readFile(absolute, "utf8");
      const parsed = parseDomainLines(body, "custom");

      return {
        providerId: "custom",
        providerName: "BetClear Custom",
        fetchedAt: new Date().toISOString(),
        rawEntryCount: parsed.rawEntryCount,
        domains: parsed.domains,
        warnings: [],
        usedCache: false,
      };
    },
  };
}

export const customProvider = createCustomProvider();
