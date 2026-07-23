import type Stripe from "stripe";
import { after } from "next/server";
import {
  clickIdsFromStripeMetadata,
  hasClickAttribution,
} from "@/lib/attribution/metadata";
import { uploadPurchase, uploadTrial } from "@/lib/google-ads/conversions";
import { createServiceClient } from "@/lib/supabase/server";
import type { BillingPlan } from "@/lib/stripe/config";
import {
  computeEntitlement,
  type EntitlementMode,
} from "@/lib/entitlement/mode";
import { syncDnsFilteringForOwner } from "@/lib/devices/installs";

type SubscriptionRow = {
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  email: string | null;
  user_id: string | null;
  status: string;
  price_id: string | null;
  plan: BillingPlan | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  grace_ends_at: string | null;
  entitlement_mode: EntitlementMode;
  is_premium: boolean;
};

/** Subscription states that grant premium access (active, trial, and grace). */
const PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);

export function isPremiumStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  return PREMIUM_STATUSES.has(status);
}

function planFromPriceId(priceId: string | null | undefined): BillingPlan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return "monthly";
  if (priceId === process.env.STRIPE_PRICE_ANNUAL) return "annual";
  return null;
}

/**
 * Prefer snake_case `user_id`; accept camelCase `userId` for older sessions.
 */
function userIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
): string | null {
  if (!metadata) return null;
  return metadata.user_id ?? metadata.userId ?? null;
}

async function mirrorStatusToRecoveryProfile(
  customerId: string,
  status: string,
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("user_recovery_profiles")
    .update({ subscription_status: status })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("failed to mirror subscription status to profile", error);
  }
}

function subscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): string | null {
  const end = subscription.items.data[0]?.current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}

function subscriptionTrialEnd(
  subscription: Stripe.Subscription,
): string | null {
  return subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
}

async function loadPreviousEntitlementState(customerId: string): Promise<{
  graceEndsAt: Date | null;
  userId: string | null;
}> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("grace_ends_at, user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return {
    graceEndsAt: data?.grace_ends_at ? new Date(data.grace_ends_at) : null,
    userId: data?.user_id ?? null,
  };
}

/**
 * When leaving a full-access status without converting, open a 24h DNS grace
 * window once (persisted as grace_ends_at).
 */
function resolveGraceEndsAt(options: {
  status: string;
  trialEndsAt: Date | null;
  previousGraceEndsAt: Date | null;
  previousWasFull: boolean;
}): Date | null {
  if (PREMIUM_STATUSES.has(options.status)) {
    return null;
  }

  if (options.previousGraceEndsAt) {
    return options.previousGraceEndsAt;
  }

  // First transition out of entitled status → start grace.
  if (options.previousWasFull) {
    return new Date(Date.now() + 1000 * 60 * 60 * 24);
  }

  // Cold start with expired trial still inside 24h of trial_end.
  if (options.trialEndsAt) {
    const graceFromTrial = new Date(
      options.trialEndsAt.getTime() + 1000 * 60 * 60 * 24,
    );
    if (graceFromTrial.getTime() > Date.now()) {
      return graceFromTrial;
    }
  }

  return null;
}

async function upsertSubscriptionState(
  row: Omit<SubscriptionRow, "email" | "user_id"> &
    Partial<Pick<SubscriptionRow, "email" | "user_id">>,
) {
  const supabase = createServiceClient();
  const payload: Record<string, unknown> = { ...row };
  if (row.email == null) delete payload.email;
  if (row.user_id == null) delete payload.user_id;

  let { error } = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "stripe_customer_id" });

  if (error?.code === "23503" && "user_id" in payload) {
    delete payload.user_id;
    ({ error } = await supabase
      .from("subscriptions")
      .upsert(payload, { onConflict: "stripe_customer_id" }));
  }

  if (error) {
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }

  await mirrorStatusToRecoveryProfile(row.stripe_customer_id, row.status);

  const userId = (payload.user_id as string | undefined) ?? row.user_id ?? null;
  after(() => {
    void syncDnsFilteringForOwner({
      userId,
      stripeCustomerId: row.stripe_customer_id,
      filtersDns: row.entitlement_mode === "full" || row.entitlement_mode === "grace_24h",
    });
  });
}

async function upsertFromStripeSubscription(
  subscription: Stripe.Subscription,
  overrides?: {
    email?: string | null;
    userId?: string | null;
    status?: string;
  },
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const status = overrides?.status ?? subscription.status;
  const trialEndsAtIso = subscriptionTrialEnd(subscription);
  const trialEndsAt = trialEndsAtIso ? new Date(trialEndsAtIso) : null;

  const previous = await loadPreviousEntitlementState(customerId);
  const supabase = createServiceClient();
  const { data: prevRow } = await supabase
    .from("subscriptions")
    .select("entitlement_mode, status, is_premium")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  const wasEntitled =
    prevRow?.entitlement_mode === "full" ||
    prevRow?.entitlement_mode === "grace_24h" ||
    isPremiumStatus(prevRow?.status) ||
    prevRow?.is_premium === true;

  const graceEndsAt = resolveGraceEndsAt({
    status,
    trialEndsAt,
    previousGraceEndsAt: previous.graceEndsAt,
    previousWasFull: wasEntitled && !PREMIUM_STATUSES.has(status),
  });

  const entitlement = computeEntitlement({
    status,
    trialEndsAt,
    previousGraceEndsAt: graceEndsAt,
  });

  const userId =
    overrides?.userId ??
    userIdFromMetadata(subscription.metadata) ??
    previous.userId;

  await upsertSubscriptionState({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    email: overrides?.email ?? null,
    user_id: userId,
    status,
    price_id: priceId,
    plan: planFromPriceId(priceId),
    current_period_end: subscriptionPeriodEnd(subscription),
    trial_ends_at: trialEndsAtIso,
    grace_ends_at: entitlement.graceEndsAt
      ? entitlement.graceEndsAt.toISOString()
      : null,
    entitlement_mode: entitlement.mode,
    is_premium: entitlement.isPremium,
  });
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
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  const userId =
    userIdFromMetadata(session.metadata) ??
    userIdFromMetadata(subscription.metadata);

  await upsertFromStripeSubscription(subscription, { email, userId });

  after(() => {
    void (async () => {
      const attribution = clickIdsFromStripeMetadata(session.metadata);
      if (!hasClickAttribution(attribution) && !email) return;

      const result = await uploadTrial({
        attribution,
        email,
        orderId: session.id,
      });

      if (!result.ok) {
        console.error("google ads trial upload failed", result.error);
      }
    })();
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
) {
  await upsertFromStripeSubscription(subscription);
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
) {
  await handleSubscriptionUpdated(subscription);
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
) {
  await upsertFromStripeSubscription(subscription, { status: "canceled" });
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

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);

  if (!subscriptionId) return;

  const stripe = (await import("@/lib/stripe/client")).getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdated(subscription);

  after(() => {
    void (async () => {
      if ((invoice.amount_paid ?? 0) <= 0) return;

      const attribution = clickIdsFromStripeMetadata(subscription.metadata);
      const email = invoice.customer_email ?? null;
      if (!hasClickAttribution(attribution) && !email) return;

      const result = await uploadPurchase({
        attribution,
        email,
        orderId: invoice.id,
        value: (invoice.amount_paid ?? 0) / 100,
        currencyCode: (invoice.currency ?? "usd").toUpperCase(),
      });

      if (!result.ok) {
        console.error("google ads purchase upload failed", result.error);
      }
    })();
  });
}
