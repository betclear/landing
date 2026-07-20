import { NextResponse } from "next/server";
import {
  getRecoveryProfileByUserId,
  isSubscriptionEntitled,
  updateRecoveryProfileByUserId,
} from "@/lib/onboarding/profile";
import { getStripe } from "@/lib/stripe/client";
import { isPlanId } from "@/lib/stripe/prices";
import { getSubscriptionPeriodEnd, unixToIso } from "@/lib/stripe/subscription";
import { getAuthenticatedUser } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "missing_session" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.metadata?.userId && session.metadata.userId !== user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (
      session.client_reference_id &&
      session.client_reference_id !== user.id
    ) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const profile = await getRecoveryProfileByUserId(user.id);
    if (profile && isSubscriptionEntitled(profile.subscription_status)) {
      return NextResponse.json({
        ok: true,
        status: profile.subscription_status,
        source: "profile",
      });
    }

    const paymentOk =
      session.status === "complete" ||
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    if (!paymentOk) {
      return NextResponse.json(
        { ok: false, error: "not_ready" },
        { status: 402 },
      );
    }

    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? session.subscription
        : null;

    const plan = isPlanId(session.metadata?.selectedPlan)
      ? session.metadata.selectedPlan
      : profile?.selected_plan;

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    await updateRecoveryProfileByUserId(user.id, {
      stripe_customer_id: customerId ?? profile?.stripe_customer_id ?? null,
      stripe_subscription_id:
        subscription?.id ?? profile?.stripe_subscription_id ?? null,
      subscription_status:
        subscription?.status ??
        (paymentOk ? "trialing" : profile?.subscription_status ?? null),
      selected_plan: plan ?? null,
      trial_ends_at: subscription
        ? unixToIso(subscription.trial_end)
        : (profile?.trial_ends_at ?? null),
      current_period_ends_at: subscription
        ? getSubscriptionPeriodEnd(subscription)
        : (profile?.current_period_ends_at ?? null),
      onboarding_completed_at:
        profile?.onboarding_completed_at ?? new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      status: subscription?.status ?? "trialing",
      source: "checkout_session",
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "verify_failed"
        : error instanceof Error
          ? error.message
          : "verify_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
