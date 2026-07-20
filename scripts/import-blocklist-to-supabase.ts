/**
 * Import output/gambling.txt into Supabase blocked_domains.
 *
 * Usage:
 *   npx tsx scripts/import-blocklist-to-supabase.ts
 *   npx tsx scripts/import-blocklist-to-supabase.ts --limit 1000
 *   npx tsx scripts/import-blocklist-to-supabase.ts --clear
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const BATCH_SIZE = 500;

async function loadEnvLocal() {
  try {
    const envPath = path.resolve(".env.local");
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const eq = trimmed.indexOf("=");
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // rely on process env
  }
}

function parseArgs(argv: string[]) {
  const limitFlag = argv.findIndex((a) => a === "--limit");
  const limit =
    limitFlag >= 0 && argv[limitFlag + 1]
      ? Number(argv[limitFlag + 1])
      : undefined;
  return {
    clear: argv.includes("--clear"),
    limit: Number.isFinite(limit) ? limit : undefined,
  };
}

async function main() {
  await loadEnvLocal();
  const options = parseArgs(process.argv.slice(2));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const filePath = path.resolve("output", "gambling.txt");
  const body = await readFile(filePath, "utf8");
  let domains = body
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith("#"));

  if (options.limit && options.limit > 0) {
    domains = domains.slice(0, options.limit);
  }

  console.log(`Importing ${domains.length.toLocaleString("en-US")} domains...`);

  if (options.clear) {
    console.log("Clearing existing blocked_domains rows...");
    // Delete in chunks by selecting ids — full truncate via RPC may not exist.
    let deleted = 0;
    while (true) {
      const { data, error } = await supabase
        .from("blocked_domains")
        .select("id")
        .limit(1000);
      if (error) throw error;
      if (!data || data.length === 0) break;
      const ids = data.map((row) => row.id);
      const { error: delError } = await supabase
        .from("blocked_domains")
        .delete()
        .in("id", ids);
      if (delError) throw delError;
      deleted += ids.length;
      console.log(`  deleted ${deleted.toLocaleString("en-US")}`);
    }
  }

  let inserted = 0;
  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const slice = domains.slice(i, i + BATCH_SIZE).map((hostname) => ({
      hostname,
      category: "gambling",
      enabled: true,
    }));

    const { error } = await supabase
      .from("blocked_domains")
      .upsert(slice, { onConflict: "hostname", ignoreDuplicates: false });

    if (error) {
      throw new Error(`Upsert failed at offset ${i}: ${error.message}`);
    }

    inserted += slice.length;
    if (inserted % 5000 === 0 || inserted === domains.length) {
      console.log(
        `  upserted ${inserted.toLocaleString("en-US")} / ${domains.length.toLocaleString("en-US")}`,
      );
    }
  }

  const { count, error: countError } = await supabase
    .from("blocked_domains")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.warn("Import finished, but count failed:", countError.message);
  } else {
    console.log(
      `Done. Supabase blocked_domains count: ${(count ?? 0).toLocaleString("en-US")}`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
