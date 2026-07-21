import { NextResponse } from "next/server";
import { getSiteUrl, type BillingPlan } from "@/lib/stripe/config";
import { getAuthUser } from "@/lib/auth/user";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getStripePriceId, isAppLocaleParam } from "@/lib/stripe/prices";
import { localizePath } from "@/lib/i18n/routing";
import type { AppLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Run npm run stripe:setup." },
      { status: 503 },
    );
  }

  let body: { plan?: BillingPlan; locale?: unknown };
  try {
    body = (await request.json()) as { plan?: BillingPlan; locale?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const locale: AppLocale = isAppLocaleParam(body.locale) ? body.locale : "en";

  if (isSupabaseAuthConfigured()) {
    const user = await getAuthUser();
    if (!user) {
      const loginUrl = `${localizePath(locale, "/login")}?next=${encodeURIComponent(localizePath(locale, "/pricing"))}`;
      return NextResponse.json(
        { error: "Sign in required before checkout.", loginUrl },
        { status: 401 },
      );
    }
  }

  try {
    const plan = body.plan;

    if (plan !== "monthly" && plan !== "annual" && plan !== "test") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    let priceId: string | undefined;
    if (plan === "test") {
      priceId = process.env.STRIPE_PRICE_TEST;
    } else {
      try {
        priceId = getStripePriceId(plan, locale);
      } catch {
        priceId = undefined;
      }
    }

    if (!priceId) {
      return NextResponse.json(
        { error: `Missing price ID for ${plan} plan (${locale})` },
        { status: 500 },
      );
    }

    const stripe = getStripe();
    const siteUrl = getSiteUrl();
    const user = await getAuthUser();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}${localizePath(locale, "/install/complete")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localizePath(locale, "/pricing")}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_email: user?.email ?? undefined,
      client_reference_id: user?.id,
      metadata: {
        app: "betclear",
        plan,
        locale,
        ...(user ? { user_id: user.id } : {}),
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
      { error: "Unable to start checkout" },
      { status: 500 },
    );
  }
}
