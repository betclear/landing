import { NextResponse } from "next/server";
import { normalizeHostname } from "@/lib/domains/normalize";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public AdGuard-compatible blocklist for the future DNS resolver / filter consumers.
 * Format: one rule per line, e.g. ||bet365.com^
 */
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("blocked_domains")
      .select("hostname")
      .eq("enabled", true)
      .order("hostname", { ascending: true });

    if (error) {
      console.error("blocklist query failed", error);
      return new NextResponse(
        `Failed to load blocklist from Supabase: ${error.message}`,
        {
          status: 500,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const unique = new Set<string>();
    for (const row of data ?? []) {
      const hostname = normalizeHostname(row.hostname);
      if (hostname) {
        unique.add(hostname);
      }
    }

    const rules = Array.from(unique)
      .sort((a, b) => a.localeCompare(b))
      .map((hostname) => `||${hostname}^`);

    const body = rules.length > 0 ? `${rules.join("\n")}\n` : "";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    console.error("blocklist route error", error);
    return new NextResponse(`Blocklist unavailable: ${message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}
