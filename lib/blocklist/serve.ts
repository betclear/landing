import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeHostname } from "@/lib/domains/normalize";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Load the pipeline-exported domain list (output/gambling.txt).
 * This is the primary blocklist; Supabase holds admin overrides only.
 */
export async function loadPipelineDomains(): Promise<string[]> {
  const filePath = path.join(process.cwd(), "output", "gambling.txt");
  const body = await readFile(filePath, "utf8");
  const domains: string[] = [];

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim().toLowerCase();
    if (!trimmed || trimmed.startsWith("#")) continue;
    domains.push(trimmed);
  }

  return domains;
}

/**
 * Load enabled hostnames from Supabase admin table (custom overrides).
 * Failures are non-fatal when the pipeline file exists.
 */
export async function loadSupabaseDomains(): Promise<{
  domains: string[];
  error?: string;
}> {
  try {
    const supabase = createServiceClient();
    const domains: string[] = [];
    const pageSize = 1000;
    let from = 0;

    while (true) {
      const to = from + pageSize - 1;
      const { data, error } = await supabase
        .from("blocked_domains")
        .select("hostname")
        .eq("enabled", true)
        .order("hostname", { ascending: true })
        .range(from, to);

      if (error) {
        return { domains, error: error.message };
      }

      if (!data || data.length === 0) break;

      for (const row of data) {
        const hostname = normalizeHostname(row.hostname);
        if (hostname) domains.push(hostname);
      }

      if (data.length < pageSize) break;
      from += pageSize;
    }

    return { domains };
  } catch (error) {
    return {
      domains: [],
      error: error instanceof Error ? error.message : "Supabase unavailable",
    };
  }
}

export async function buildAdGuardBlocklist(): Promise<{
  body: string;
  pipelineCount: number;
  supabaseCount: number;
}> {
  const pipeline = await loadPipelineDomains();
  const supabase = await loadSupabaseDomains();

  // Pipeline file is required. Supabase errors are ignored if pipeline loaded.
  if (pipeline.length === 0 && supabase.error) {
    throw new Error(supabase.error);
  }

  const unique = new Set<string>(pipeline);
  for (const domain of supabase.domains) {
    unique.add(domain);
  }

  const rules = Array.from(unique)
    .sort((a, b) => a.localeCompare(b))
    .map((hostname) => `||${hostname}^`);

  return {
    body: rules.length > 0 ? `${rules.join("\n")}\n` : "",
    pipelineCount: pipeline.length,
    supabaseCount: supabase.domains.length,
  };
}
