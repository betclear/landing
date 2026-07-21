import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type { BillingPlan } from "@/lib/stripe/config";

type SubscriptionRow = {
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  email: string | null;
  user_id: string | null;
  status: string;
  price_id: string | null;
  plan: BillingPlan | null;
  current_period_end: string | null;
};

function planFromPriceId(priceId: string | null | undefined): BillingPlan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return "monthly";
  if (priceId === process.env.STRIPE_PRICE_ANNUAL) return "annual";
  return null;
}

function subscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): string | null {
  const end = subscription.items.data[0]?.current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}

async function upsertSubscription(row: SubscriptionRow) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("subscriptions").upsert(row, {
    onConflict: "stripe_customer_id",
  });

  if (error) {
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }
}

async function updateSubscriptionByCustomerId(
  customerId: string,
  patch: Partial<
    Pick<
      SubscriptionRow,
      | "stripe_subscription_id"
      | "status"
      | "price_id"
      | "plan"
      | "current_period_end"
    >
  >,
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("subscriptions")
    .update(patch)
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!customerId || !subscriptionId) {
    throw new Error("Checkout session missing customer or subscription");
  }

  const stripe = (await import("@/lib/stripe/client")).getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  const userId = session.metadata?.user_id ?? null;

  await upsertSubscription({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    email,
    user_id: userId,
    status: subscription.status,
    price_id: priceId,
    plan: planFromPriceId(priceId),
    current_period_end: subscriptionPeriodEnd(subscription),
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const priceId = subscription.items.data[0]?.price.id ?? null;

  await updateSubscriptionByCustomerId(customerId, {
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    price_id: priceId,
    plan: planFromPriceId(priceId),
    current_period_end: subscriptionPeriodEnd(subscription),
  });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  await updateSubscriptionByCustomerId(customerId, {
    stripe_subscription_id: subscription.id,
    status: "canceled",
    price_id: subscription.items.data[0]?.price.id ?? null,
    plan: planFromPriceId(subscription.items.data[0]?.price.id),
    current_period_end: subscriptionPeriodEnd(subscription),
  });
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const legacySubscription = (
    invoice as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    }
  ).subscription;

  if (legacySubscription) {
    return typeof legacySubscription === "string"
      ? legacySubscription
      : legacySubscription.id;
  }

  const parentSubscription = invoice.parent?.subscription_details?.subscription;
  if (parentSubscription) {
    return typeof parentSubscription === "string"
      ? parentSubscription
      : parentSubscription.id;
  }

  return null;
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);

  if (!subscriptionId) return;

  const stripe = (await import("@/lib/stripe/client")).getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdated(subscription);
}
