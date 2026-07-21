import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/user";
import { hasPaywallAccess } from "@/lib/stripe/access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ authenticated: false, subscribed: false });
  }

  const subscribed = await hasPaywallAccess();

  return NextResponse.json({ authenticated: true, subscribed });
}
