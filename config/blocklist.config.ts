import path from "node:path";

export const blocklistConfig = {
  cacheDirectory: ".cache/blocklists",
  outputDirectory: "output",
  customDomainsPath: path.join("data", "custom", "gambling-domains.txt"),
  allowlistPath: path.join("data", "custom", "allowlist.txt"),
  timeoutMs: 20_000,
  maxRetries: 3,
  maxResponseBytes: 50_000_000,
  cacheMaxAgeHours: 48,
  maximumRejectedEntriesInFile: 10_000,
  minimumSuccessfulProviders: 2,
  minimumFinalDomainCount: 1_000,
  maximumAllowedCountDropPercent: 40,
  failOnCustomProviderError: true,
  userAgent: "BetClear-Blocklist-Updater/1.0 (+https://betclear.app)",
  outputFiles: {
    gambling: "gambling.txt",
    metadata: "metadata.json",
    sourceReport: "source-report.json",
    rejected: "rejected.txt",
  },
} as const;

export type BlocklistConfig = typeof blocklistConfig;
