import { after } from "next/server";
import { NextResponse } from "next/server";
import {
  clickAttributionFromBody,
  hasClickAttribution,
} from "@/lib/attribution/metadata";
import { reportSignupConversion } from "@/lib/google-ads/report-signup";
import { getAuthenticatedUser } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const attribution = clickAttributionFromBody(body);
  if (!hasClickAttribution(attribution) && !user.email) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  after(() => {
    void reportSignupConversion({
      userId: user.id,
      email: user.email,
      cookieHeader: request.headers.get("cookie"),
      body,
    });
  });

  return NextResponse.json({ ok: true });
}
