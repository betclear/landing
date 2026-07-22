import { NextResponse } from "next/server";
import { normalizeHostname } from "@/lib/domains/normalize";
import {
  clientIpFromRequest,
  consumeRateLimit,
} from "@/lib/domains/rate-limit";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    const rate = consumeRateLimit(
      `domain-submission:${ip}`,
      RATE_LIMIT,
      RATE_WINDOW_MS,
    );

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSec) },
        },
      );
    }

    const body = (await request.json()) as { url?: string };
    const rawInput = typeof body.url === "string" ? body.url.trim() : "";
    if (!rawInput) {
      return NextResponse.json({ error: "Website link is required" }, { status: 400 });
    }

    if (rawInput.length > 500) {
      return NextResponse.json({ error: "Link is too long" }, { status: 400 });
    }

    const hostname = normalizeHostname(rawInput);
    if (!hostname) {
      return NextResponse.json(
        { error: "Enter a valid website link or domain" },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    const { data: existingDomain } = await supabase
      .from("blocked_domains")
      .select("id")
      .eq("hostname", hostname)
      .maybeSingle();

    if (existingDomain) {
      return NextResponse.json(
        {
          error: "This site is already in our blocklist",
          code: "already_blocked",
        },
        { status: 409 },
      );
    }

    const { data: pending } = await supabase
      .from("domain_submissions")
      .select("id")
      .eq("hostname", hostname)
      .eq("status", "pending")
      .maybeSingle();

    if (pending) {
      return NextResponse.json(
        {
          error: "This site is already waiting for review",
          code: "already_pending",
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("domain_submissions")
      .insert({
        hostname,
        raw_input: rawInput,
        status: "pending",
      })
      .select("id, hostname, status, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "This site is already waiting for review",
            code: "already_pending",
          },
          { status: 409 },
        );
      }
      console.error("domain submission insert failed", error);
      return NextResponse.json(
        { error: "Failed to submit site" },
        { status: 500 },
      );
    }

    return NextResponse.json({ submission: data }, { status: 201 });
  } catch (error) {
    console.error("domain submissions POST error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
