import { readFile } from "node:fs/promises";
import path from "node:path";
import { blocklistConfig } from "@/config/blocklist.config";
import { sha256Hex } from "@/lib/blocklist/cache";
import { isValidDomain } from "@/lib/blocklist/domain-validator";
import { normalizeDomain } from "@/lib/blocklist/normalize";
import type { BlocklistMetadata } from "@/blocklists/types";

function fail(message: string): never {
  console.error(`blocklist:check failed: ${message}`);
  process.exit(1);
}

async function main() {
  const outputDir = path.resolve(blocklistConfig.outputDirectory);
  const gamblingPath = path.join(outputDir, blocklistConfig.outputFiles.gambling);
  const metadataPath = path.join(outputDir, blocklistConfig.outputFiles.metadata);

  let body: string;
  try {
    body = await readFile(gamblingPath, "utf8");
  } catch {
    fail(`${gamblingPath} does not exist`);
  }

  if (!body) fail("gambling.txt is empty");
  if (!body.endsWith("\n")) fail("gambling.txt must end with a newline");

  const lines = body.replace(/\n$/, "").split("\n");
  if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) {
    fail("gambling.txt has no domains");
  }

  if (lines.length < blocklistConfig.minimumFinalDomainCount) {
    fail(
      `domain count ${lines.length} below minimum ${blocklistConfig.minimumFinalDomainCount}`,
    );
  }

  const seen = new Set<string>();
  let previous = "";

  for (const [index, line] of lines.entries()) {
    if (!line) fail(`blank line at ${index + 1}`);
    if (line !== line.toLowerCase()) fail(`non-lowercase at ${index + 1}`);
    if (line.startsWith("#") || line.includes(" ")) {
      fail(`invalid content at ${index + 1}`);
    }

    const { domain, reason } = normalizeDomain(line);
    if (!domain || domain !== line) {
      fail(`not normalized at ${index + 1}: ${reason ?? "mismatch"}`);
    }

    const validation = isValidDomain(domain);
    if (!validation.valid) {
      fail(`invalid domain at ${index + 1}: ${validation.reason}`);
    }

    if (seen.has(domain)) fail(`duplicate domain: ${domain}`);
    seen.add(domain);

    if (previous && domain.localeCompare(previous) < 0) {
      fail(`not sorted near ${domain}`);
    }
    previous = domain;
  }

  let metadata: BlocklistMetadata;
  try {
    metadata = JSON.parse(await readFile(metadataPath, "utf8")) as BlocklistMetadata;
  } catch {
    fail("metadata.json missing or invalid");
  }

  if (metadata.merge.finalDomainCount !== lines.length) {
    fail(
      `metadata count ${metadata.merge.finalDomainCount} != file lines ${lines.length}`,
    );
  }

  const digest = sha256Hex(body);
  if (metadata.output.sha256 !== digest) {
    fail("SHA-256 checksum mismatch");
  }

  console.log(
    `blocklist:check passed (${lines.length.toLocaleString("en-US")} domains)`,
  );
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
