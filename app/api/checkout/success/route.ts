import { NextResponse } from "next/server";
import {
  grantAccessFromCheckoutSession,
  setAccessCookie,
} from "@/lib/stripe/access";
import { isStripeConfigured } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL("/install", request.url));
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    const token = await grantAccessFromCheckoutSession(sessionId);
    if (!token) {
      return NextResponse.redirect(new URL("/pricing?error=checkout", request.url));
    }

    await setAccessCookie(token);
    return NextResponse.redirect(new URL("/install", request.url));
  } catch (error) {
    console.error("checkout success error", error);
    return NextResponse.redirect(new URL("/pricing?error=checkout", request.url));
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const token = await grantAccessFromCheckoutSession(sessionId);
    if (!token) {
      return NextResponse.json({ error: "Subscription not active" }, { status: 403 });
    }

    await setAccessCookie(token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("checkout verify error", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
