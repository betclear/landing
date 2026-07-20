import { NextResponse } from "next/server";
import { verifyAccessToken, ACCESS_COOKIE } from "@/lib/stripe/access";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/stripe/config";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 },
    );
  }

  const jar = await cookies();
  const access = verifyAccessToken(jar.get(ACCESS_COOKIE)?.value);
  if (!access) {
    return NextResponse.json(
      { error: "Sign in with an active subscription first." },
      { status: 401 },
    );
  }

  try {
    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: access.customerId,
      return_url: `${getSiteUrl()}/install`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("billing portal error", error);
    return NextResponse.json(
      { error: "Unable to open billing portal." },
      { status: 500 },
    );
  }
}
