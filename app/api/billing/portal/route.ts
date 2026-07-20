import { NextResponse } from "next/server";
import { getStripeCustomerIdForAccess } from "@/lib/stripe/access";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getSiteUrl } from "@/lib/stripe/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 },
    );
  }

  const customerId = await getStripeCustomerIdForAccess();
  if (!customerId) {
    return NextResponse.json(
      { error: "Sign in with an active subscription first." },
      { status: 401 },
    );
  }

  try {
    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
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
