import { NextResponse } from "next/server";
import { buildAdGuardBlocklist } from "@/lib/blocklist/serve";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public AdGuard-compatible blocklist.
 * Primary source: output/gambling.txt (pipeline).
 * Plus: enabled rows from Supabase admin overrides.
 */
export async function GET() {
  try {
    const { body } = await buildAdGuardBlocklist();

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
