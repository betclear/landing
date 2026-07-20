import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  getRecoveryProfileByStripeCustomerId,
  getRecoveryProfileByUserId,
  updateRecoveryProfileByUserId,
} from "@/lib/onboarding/profile";
import { getStripe } from "@/lib/stripe/client";
import { isPlanId } from "@/lib/stripe/prices";
import {
  getInvoiceSubscriptionId,
  getSubscriptionPeriodEnd,
  unixToIso,
} from "@/lib/stripe/subscription";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function resolveUserId(
  subscription: Stripe.Subscription,
  customerId: string | null,
): Promise<string | null> {
  const fromMeta = subscription.metadata?.userId;
  if (fromMeta) return fromMeta;

  if (customerId) {
    const byCustomer = await getRecoveryProfileByStripeCustomerId(customerId);
    if (byCustomer) return byCustomer.user_id;
  }

  return null;
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  const userId = await resolveUserId(subscription, customerId);
  if (!userId) return;

  const planMeta = subscription.metadata?.selectedPlan;
  const plan = isPlanId(planMeta) ? planMeta : undefined;
  const existing = await getRecoveryProfileByUserId(userId);

  await updateRecoveryProfileByUserId(userId, {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    ...(plan ? { selected_plan: plan } : {}),
    trial_ends_at: unixToIso(subscription.trial_end),
    current_period_ends_at: getSubscriptionPeriodEnd(subscription),
    onboarding_completed_at:
      existing?.onboarding_completed_at ?? new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "misconfigured" }, { status: 400 });
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.metadata?.userId ?? session.client_reference_id ?? null;
        if (!userId) break;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        let subscription: Stripe.Subscription | null = null;
        if (typeof session.subscription === "string") {
          subscription = await stripe.subscriptions.retrieve(
            session.subscription,
          );
        } else if (session.subscription) {
          subscription = session.subscription;
        }

        const plan = isPlanId(session.metadata?.selectedPlan)
          ? session.metadata.selectedPlan
          : undefined;

        if (subscription) {
          await syncSubscription({
            ...subscription,
            metadata: {
              ...subscription.metadata,
              userId,
              selectedPlan: plan ?? subscription.metadata?.selectedPlan,
            },
          });
        } else {
          await updateRecoveryProfileByUserId(userId, {
            stripe_customer_id: customerId,
            selected_plan: plan,
            subscription_status: "trialing",
            onboarding_completed_at:
              (await getRecoveryProfileByUserId(userId))
                ?.onboarding_completed_at ?? new Date().toISOString(),
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        if (!customerId) break;

        const profile = await getRecoveryProfileByStripeCustomerId(customerId);
        if (!profile) break;

        const subscriptionId =
          getInvoiceSubscriptionId(invoice) ?? profile.stripe_subscription_id;

        if (subscriptionId) {
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscription(subscription);
        } else {
          await updateRecoveryProfileByUserId(profile.user_id, {
            subscription_status: "past_due",
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "webhook_handler_failed"
        : error instanceof Error
          ? error.message
          : "webhook_handler_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
