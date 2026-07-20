import type { ProviderStatus, SourceMetadata } from "@/blocklists/types";

export function uniqueContributions(
  attribution: Map<string, Set<string>>,
  providerId: string,
): number {
  let count = 0;
  for (const providers of attribution.values()) {
    if (providers.size === 1 && providers.has(providerId)) {
      count += 1;
    }
  }
  return count;
}

export function buildOverlapStats(attribution: Map<string, Set<string>>) {
  let singleSource = 0;
  let multiSource = 0;
  const pairwise = new Map<string, number>();
  const uniqueSamples = new Map<string, string[]>();
  const sharedSamples: string[] = [];

  for (const [domain, providers] of attribution.entries()) {
    const ids = Array.from(providers).sort();
    if (ids.length === 1) {
      singleSource += 1;
      const id = ids[0]!;
      const arr = uniqueSamples.get(id) ?? [];
      if (arr.length < 100) arr.push(domain);
      uniqueSamples.set(id, arr);
    } else {
      multiSource += 1;
      if (sharedSamples.length < 100) sharedSamples.push(domain);
      for (let i = 0; i < ids.length; i += 1) {
        for (let j = i + 1; j < ids.length; j += 1) {
          const key = `${ids[i]}|${ids[j]}`;
          pairwise.set(key, (pairwise.get(key) ?? 0) + 1);
        }
      }
    }
  }

  return {
    domainsInOneSourceOnly: singleSource,
    domainsInMultipleSources: multiSource,
    pairwiseOverlap: Object.fromEntries(pairwise),
    uniqueSamplesByProvider: Object.fromEntries(uniqueSamples),
    sharedSampleDomains: sharedSamples,
  };
}

export function classifyProviderStatus(input: {
  enabled: boolean;
  failed: boolean;
  usedCache: boolean;
  staleCache: boolean;
}): ProviderStatus {
  if (!input.enabled) return "disabled";
  if (input.failed) return "failed";
  if (input.staleCache) return "success_stale_cache";
  return "success";
}

export function summarizeSources(sources: SourceMetadata[]): string {
  return sources
    .map((source) => {
      const mark =
        source.status === "success" || source.status === "success_stale_cache"
          ? "✓"
          : source.status === "failed"
            ? "✗"
            : "·";
      const name = source.name.padEnd(30, " ");
      return `${mark} ${name}${source.validDomains.toLocaleString("en-US").padStart(10)} valid`;
    })
    .join("\n");
}
