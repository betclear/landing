import { NextResponse } from "next/server";
import { getPriceId, getSiteUrl, type BillingPlan } from "@/lib/stripe/config";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Run npm run stripe:setup." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { plan?: BillingPlan };
    const plan = body.plan;

    if (plan !== "monthly" && plan !== "annual" && plan !== "test") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = getPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing price ID for ${plan} plan` },
        { status: 500 },
      );
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        app: "betclear",
        plan,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout error", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Check Stripe configuration." },
      { status: 500 },
    );
  }
}
