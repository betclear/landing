import { NextResponse } from "next/server";
import {
  clickAttributionFromBody,
  clickAttributionToMetadata,
} from "@/lib/attribution/metadata";
import {
  getRecoveryProfileByUserId,
  updateRecoveryProfileByUserId,
} from "@/lib/onboarding/profile";
import { getAppUrl, getStripe } from "@/lib/stripe/client";
import {
  getStripePriceId,
  isAppLocaleParam,
  isPlanId,
  TRIAL_PERIOD_DAYS,
} from "@/lib/stripe/prices";
import { getPathname } from "@/lib/i18n/navigation";
import type { AppLocale } from "@/lib/i18n/config";
import { getAuthenticatedUser } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const plan =
    body && typeof body === "object"
      ? (body as { plan?: unknown }).plan
      : undefined;
  const localeRaw =
    body && typeof body === "object"
      ? (body as { locale?: unknown }).locale
      : undefined;
  const locale: AppLocale = isAppLocaleParam(localeRaw) ? localeRaw : "en";

  if (!isPlanId(plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  const profile = await getRecoveryProfileByUserId(user.id);
  if (!profile) {
    return NextResponse.json({ error: "profile_required" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const priceId = getStripePriceId(plan, locale);
    const appUrl = getAppUrl();
    const attribution = clickAttributionFromBody(body);
    const clickMetadata = clickAttributionToMetadata(attribution);

    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: {
          user_id: user.id,
          userId: user.id,
          ...clickMetadata,
        },
      });
      customerId = customer.id;
      await updateRecoveryProfileByUserId(user.id, {
        stripe_customer_id: customerId,
        selected_plan: plan,
      });
    } else {
      await updateRecoveryProfileByUserId(user.id, {
        selected_plan: plan,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_PERIOD_DAYS,
        metadata: {
          user_id: user.id,
          userId: user.id,
          selectedPlan: plan,
          locale,
          currency: profile.currency,
          monthlyGamblingSpend: String(profile.monthly_gambling_spend),
          weeklyGamblingHours: String(profile.weekly_gambling_hours),
          lastGamblingDate: profile.last_gambling_date ?? "",
          lastGamblingDateIsApproximate: String(
            profile.last_gambling_date_is_approximate,
          ),
          ...clickMetadata,
        },
      },
      metadata: {
        user_id: user.id,
        userId: user.id,
        selectedPlan: plan,
        locale,
        currency: profile.currency,
        monthlyGamblingSpend: String(profile.monthly_gambling_spend),
        weeklyGamblingHours: String(profile.weekly_gambling_hours),
        lastGamblingDate: profile.last_gambling_date ?? "",
        lastGamblingDateIsApproximate: String(
          profile.last_gambling_date_is_approximate,
        ),
        ...clickMetadata,
      },
      success_url: `${appUrl}${getPathname({ locale: locale, href: "/payment/success" })}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${getPathname({ locale: locale, href: "/onboarding/pricing" })}`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "checkout_url_missing" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "checkout_failed"
        : error instanceof Error
          ? error.message
          : "checkout_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
