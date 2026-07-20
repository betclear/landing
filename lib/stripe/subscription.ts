import type Stripe from "stripe";

export function unixToIso(value: number | null | undefined): string | null {
  if (!value) return null;
  return new Date(value * 1000).toISOString();
}

export function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): string | null {
  const fromItem = subscription.items?.data?.[0]?.current_period_end;
  return unixToIso(fromItem);
}

export function getInvoiceSubscriptionId(
  invoice: Stripe.Invoice,
): string | null {
  const fromParent = invoice.parent?.subscription_details?.subscription;
  if (typeof fromParent === "string") return fromParent;
  if (fromParent && typeof fromParent === "object" && "id" in fromParent) {
    return fromParent.id;
  }
  return null;
}
