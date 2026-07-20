import { readFile } from "node:fs/promises";
import { normalizeDomain } from "@/lib/blocklist/normalize";
import { isValidDomain } from "@/lib/blocklist/domain-validator";
import type { MergeResult } from "@/blocklists/types";

export interface ProviderDomainBatch {
  providerId: string;
  domains: string[];
}

export async function loadAllowlistRules(
  allowlistPath: string,
): Promise<string[]> {
  try {
    const body = await readFile(allowlistPath, "utf8");
    return body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

function isAllowlisted(domain: string, rules: string[]): boolean {
  for (const rule of rules) {
    if (rule.startsWith(".")) {
      const suffix = rule.slice(1).toLowerCase();
      if (domain === suffix || domain.endsWith(`.${suffix}`)) {
        return true;
      }
      continue;
    }

    const exact = rule.toLowerCase().replace(/^\*\./, "");
    if (domain === exact) {
      return true;
    }
  }
  return false;
}

export function mergeProviderDomains(
  batches: ProviderDomainBatch[],
  allowlistRules: string[],
): MergeResult {
  const attribution = new Map<string, Set<string>>();
  let validEntriesBeforeDeduplication = 0;

  for (const batch of batches) {
    for (const raw of batch.domains) {
      const { domain } = normalizeDomain(raw);
      if (!domain) continue;
      const validation = isValidDomain(domain);
      if (!validation.valid) continue;

      validEntriesBeforeDeduplication += 1;
      const set = attribution.get(domain) ?? new Set<string>();
      set.add(batch.providerId);
      attribution.set(domain, set);
    }
  }

  const beforeAllowlist = Array.from(attribution.keys()).sort((a, b) =>
    a.localeCompare(b),
  );
  const domainsBeforeAllowlist = beforeAllowlist.length;
  const duplicatesRemoved =
    validEntriesBeforeDeduplication - domainsBeforeAllowlist;

  const removed: string[] = [];
  const domains: string[] = [];

  for (const domain of beforeAllowlist) {
    if (isAllowlisted(domain, allowlistRules)) {
      removed.push(domain);
      attribution.delete(domain);
      continue;
    }
    domains.push(domain);
  }

  return {
    domains,
    attribution,
    validEntriesBeforeDeduplication,
    duplicatesRemoved,
    domainsBeforeAllowlist,
    allowlistRules: allowlistRules.length,
    allowlistMatchesRemoved: removed.length,
    allowlistRemovedSample: removed.slice(0, 20),
  };
}
