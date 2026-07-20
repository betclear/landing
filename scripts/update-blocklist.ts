import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { providers } from "@/blocklists/sources";
import type {
  BlocklistMetadata,
  ProviderResult,
  RejectedEntry,
  SourceMetadata,
} from "@/blocklists/types";
import { blocklistConfig } from "@/config/blocklist.config";
import { ensureCacheDir, sha256Hex } from "@/lib/blocklist/cache";
import { parseDomainLines } from "@/lib/blocklist/domain-parser";
import { createLogger, formatCount } from "@/lib/blocklist/logger";
import { loadAllowlistRules, mergeProviderDomains } from "@/lib/blocklist/merge";
import {
  buildOverlapStats,
  classifyProviderStatus,
  summarizeSources,
  uniqueContributions,
} from "@/lib/blocklist/statistics";

const log = createLogger("update");

interface CliOptions {
  force: boolean;
  allowLargeDrop: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  return {
    force: argv.includes("--force"),
    allowLargeDrop: argv.includes("--allow-large-drop"),
  };
}

async function readPreviousMetadata(
  metadataPath: string,
): Promise<BlocklistMetadata | null> {
  try {
    const raw = await readFile(metadataPath, "utf8");
    return JSON.parse(raw) as BlocklistMetadata;
  } catch {
    return null;
  }
}

async function atomicWrite(finalPath: string, content: string): Promise<void> {
  const dir = path.dirname(finalPath);
  const base = path.basename(finalPath);
  const tmpPath = path.join(dir, `.${base}.tmp`);
  await writeFile(tmpPath, content, "utf8");
  await rename(tmpPath, finalPath);
}

async function cleanupTmp(dir: string): Promise<void> {
  // Best-effort cleanup of leftover temps
  try {
    const { readdir } = await import("node:fs/promises");
    const entries = await readdir(dir);
    await Promise.all(
      entries
        .filter((name) => name.startsWith(".") && name.endsWith(".tmp"))
        .map((name) => rm(path.join(dir, name), { force: true })),
    );
  } catch {
    // ignore
  }
}

async function main() {
  const started = Date.now();
  const options = parseArgs(process.argv.slice(2));
  const outputDir = path.resolve(blocklistConfig.outputDirectory);
  const cacheDir = path.resolve(blocklistConfig.cacheDirectory);

  await mkdir(outputDir, { recursive: true });
  await ensureCacheDir(cacheDir);

  const gamblingPath = path.join(outputDir, blocklistConfig.outputFiles.gambling);
  const metadataPath = path.join(outputDir, blocklistConfig.outputFiles.metadata);
  const reportPath = path.join(
    outputDir,
    blocklistConfig.outputFiles.sourceReport,
  );
  const rejectedPath = path.join(outputDir, blocklistConfig.outputFiles.rejected);

  const previous = await readPreviousMetadata(metadataPath);
  const providerResults: Array<{
    result?: ProviderResult;
    rejected: RejectedEntry[];
    status: SourceMetadata["status"];
    error?: string;
    staleCache: boolean;
  }> = [];

  let usedStaleCache = false;
  const allRejected: RejectedEntry[] = [];

  for (const provider of providers) {
    if (!provider.enabled) {
      providerResults.push({
        rejected: [],
        status: "disabled",
        staleCache: false,
      });
      continue;
    }

    try {
      const result = await provider.fetchDomains({
        cacheDirectory: cacheDir,
        forceRefresh: options.force,
      });

      // Re-parse for rejected diagnostics from raw isn't always available;
      // compute rejected as raw - unique valid approximation via parseDomainLines
      // on joined domains is wrong. Providers already normalized; track empty.
      const rejected: RejectedEntry[] = [];
      const staleCache = result.warnings.some((w) =>
        w.toLowerCase().includes("stale cache"),
      );
      if (staleCache) usedStaleCache = true;

      providerResults.push({
        result,
        rejected,
        status: classifyProviderStatus({
          enabled: true,
          failed: false,
          usedCache: result.usedCache,
          staleCache,
        }),
        staleCache,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      log.error(`Provider ${provider.id} failed`, { message });

      if (provider.id === "custom" && blocklistConfig.failOnCustomProviderError) {
        throw new Error(`Custom provider failed: ${message}`);
      }

      providerResults.push({
        rejected: [],
        status: "failed",
        error: message,
        staleCache: false,
      });
    }
  }

  // Collect rejected by re-reading isn't possible for network providers without body.
  // Instead, each provider returns domains already filtered; for diagnostics we
  // parse custom file and also attach provider warnings. For network providers,
  // approximate rejected from rawEntryCount - domains.length.
  for (const entry of providerResults) {
    if (!entry.result) continue;
    const approxRejected = Math.max(
      0,
      entry.result.rawEntryCount - entry.result.domains.length,
    );
    // We don't have originals for approx; skip rejected file inflation.
    void approxRejected;
  }

  const successful = providerResults.filter(
    (p) =>
      p.status === "success" || p.status === "success_stale_cache",
  );

  if (successful.length < blocklistConfig.minimumSuccessfulProviders) {
    throw new Error(
      `Only ${successful.length} successful providers; need at least ${blocklistConfig.minimumSuccessfulProviders}`,
    );
  }

  const batches = successful
    .map((p) => p.result)
    .filter((r): r is ProviderResult => Boolean(r))
    .map((r) => ({ providerId: r.providerId, domains: r.domains }));

  // Build rejected list by re-parsing custom file for diagnostics + note counts
  try {
    const customBody = await readFile(
      path.resolve(blocklistConfig.customDomainsPath),
      "utf8",
    );
    const customParsed = parseDomainLines(customBody, "custom");
    allRejected.push(...customParsed.rejected);
  } catch {
    // ignore
  }

  const allowlistRules = await loadAllowlistRules(
    path.resolve(blocklistConfig.allowlistPath),
  );
  const merged = mergeProviderDomains(batches, allowlistRules);

  if (merged.domains.length < blocklistConfig.minimumFinalDomainCount) {
    throw new Error(
      `Final domain count ${merged.domains.length} below minimum ${blocklistConfig.minimumFinalDomainCount}`,
    );
  }

  if (previous && !options.allowLargeDrop) {
    const prevCount = previous.merge.finalDomainCount;
    if (prevCount > 0) {
      const dropPercent =
        ((prevCount - merged.domains.length) / prevCount) * 100;
      if (dropPercent > blocklistConfig.maximumAllowedCountDropPercent) {
        throw new Error(
          `Catastrophic drop: ${prevCount} → ${merged.domains.length} (${dropPercent.toFixed(1)}%). Re-run with --allow-large-drop to override.`,
        );
      }
    }
  }

  const body = `${merged.domains.join("\n")}\n`;
  const digest = sha256Hex(body);

  const sources: SourceMetadata[] = providers.map((provider, index) => {
    const entry = providerResults[index]!;
    const result = entry.result;
    const validDomains = result?.domains.length ?? 0;
    const rejectedEntries = result
      ? Math.max(0, result.rawEntryCount - result.domains.length)
      : 0;

    return {
      id: provider.id,
      name: provider.name,
      sourceUrl: result?.sourceUrl ?? provider.sourceUrl,
      status: entry.status,
      usedCache: result?.usedCache ?? false,
      rawEntries: result?.rawEntryCount ?? 0,
      validDomains,
      rejectedEntries,
      uniqueContributions: uniqueContributions(merged.attribution, provider.id),
      warnings: [
        ...(result?.warnings ?? []),
        ...(entry.error ? [`error: ${entry.error}`] : []),
      ],
    };
  });

  const metadata: BlocklistMetadata = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    success: true,
    usedStaleCache,
    sources,
    merge: {
      validEntriesBeforeDeduplication: merged.validEntriesBeforeDeduplication,
      duplicatesRemoved: merged.duplicatesRemoved,
      domainsBeforeAllowlist: merged.domainsBeforeAllowlist,
      allowlistRules: merged.allowlistRules,
      allowlistMatchesRemoved: merged.allowlistMatchesRemoved,
      finalDomainCount: merged.domains.length,
    },
    output: {
      file: path.join(
        blocklistConfig.outputDirectory,
        blocklistConfig.outputFiles.gambling,
      ),
      sha256: digest,
    },
  };

  const overlap = buildOverlapStats(merged.attribution);
  const sourceReport = {
    generatedAt: metadata.generatedAt,
    sources,
    overlap,
    allowlistRemovedSample: merged.allowlistRemovedSample,
  };

  const rejectedLines = allRejected
    .slice(0, blocklistConfig.maximumRejectedEntriesInFile)
    .map(
      (item) =>
        `[${item.providerId}] ${item.reason} | ${item.original.replace(/[\u0000-\u001f\u007f]/g, " ")}`,
    );
  const rejectedBody =
    rejectedLines.length > 0 ? `${rejectedLines.join("\n")}\n` : "";

  await atomicWrite(gamblingPath, body);
  await atomicWrite(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  await atomicWrite(reportPath, `${JSON.stringify(sourceReport, null, 2)}\n`);
  await atomicWrite(rejectedPath, rejectedBody);
  await cleanupTmp(outputDir);

  const totalRejected = sources.reduce((sum, s) => sum + s.rejectedEntries, 0);

  console.log(`
BetClear gambling blocklist updated

Sources
${summarizeSources(sources)}

Processing
Raw entries${"".padStart(20)}${formatCount(sources.reduce((s, x) => s + x.rawEntries, 0)).padStart(12)}
Rejected entries${"".padStart(16)}${formatCount(totalRejected).padStart(12)}
Valid before deduplication${"".padStart(6)}${formatCount(merged.validEntriesBeforeDeduplication).padStart(12)}
Duplicates removed${"".padStart(14)}${formatCount(merged.duplicatesRemoved).padStart(12)}
Allowlist removals${"".padStart(14)}${formatCount(merged.allowlistMatchesRemoved).padStart(12)}
Final domains${"".padStart(19)}${formatCount(merged.domains.length).padStart(12)}

Output
${metadata.output.file}
SHA-256: ${digest}
Completed in ${(metadata.durationMs / 1000).toFixed(1)}s
${usedStaleCache ? "\nWarning: one or more providers used stale cache.\n" : ""}`);

  for (const source of sources) {
    for (const warning of source.warnings) {
      console.warn(`⚠ [${source.id}] ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error(
    "Blocklist update failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
