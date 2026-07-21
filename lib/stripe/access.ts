import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth/user";
import {
  getRecoveryProfileByStripeCustomerId,
  getRecoveryProfileByUserId,
  isSubscriptionEntitled,
} from "@/lib/onboarding/profile";
import { createServiceClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { isPremiumStatus } from "@/lib/stripe/webhooks";

export const ACCESS_COOKIE = "betclear_access";
const ACCESS_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type SubscriptionRecord = {
  stripe_customer_id: string;
  status: string;
  current_period_end: string | null;
};

type AccessPayload = {
  customerId: string;
  exp: number;
};

function getAccessSecret(): string {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return secret;
}

export function createAccessToken(customerId: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      customerId,
      exp: Date.now() + ACCESS_TTL_MS,
    } satisfies AccessPayload),
    "utf8",
  ).toString("base64url");

  const signature = createHmac("sha256", getAccessSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyAccessToken(
  token: string | undefined,
): AccessPayload | null {
  if (!token || !process.env.STRIPE_SECRET_KEY) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", process.env.STRIPE_SECRET_KEY)
    .update(payload)
    .digest("base64url");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AccessPayload;

    if (!data.customerId || typeof data.exp !== "number") return null;
    if (Date.now() >= data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function accessCookieOptions(maxAgeSeconds = ACCESS_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function isActiveSubscription(record: {
  status: string;
  current_period_end: string | null;
}): boolean {
  if (!ACTIVE_STATUSES.has(record.status)) return false;

  if (record.current_period_end) {
    return new Date(record.current_period_end).getTime() > Date.now();
  }

  return true;
}

export async function getSubscriptionForUser(
  userId: string,
  email?: string | null,
): Promise<SubscriptionRecord | null> {
  const supabase = createServiceClient();

  const { data: byUser, error: byUserError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (byUserError) {
    console.error("subscription lookup by user failed", byUserError);
    return null;
  }

  if (byUser) return byUser;

  if (!email) return null;

  const { data: byEmail, error: byEmailError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, status, current_period_end")
    .eq("email", email)
    .maybeSingle();

  if (byEmailError) {
    console.error("subscription lookup by email failed", byEmailError);
    return null;
  }

  return byEmail;
}

export async function isUserSubscribed(
  userId: string,
  email?: string | null,
): Promise<boolean> {
  const record = await getSubscriptionForUser(userId, email);
  if (!record) return false;
  return isActiveSubscription(record);
}

export async function isCustomerSubscribed(
  customerId: string,
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    console.error("subscription lookup failed", error);
    return false;
  }

  if (!data) return false;
  return isActiveSubscription(data);
}

export async function isUserPremium(
  userId: string,
  email?: string | null,
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data: byUser, error: byUserError } = await supabase
    .from("subscriptions")
    .select("is_premium")
    .eq("user_id", userId)
    .maybeSingle();

  if (byUserError) {
    console.error("premium lookup by user failed", byUserError);
  } else if (byUser) {
    return byUser.is_premium === true;
  }

  if (!email) return false;

  const { data: byEmail, error: byEmailError } = await supabase
    .from("subscriptions")
    .select("is_premium")
    .eq("email", email)
    .maybeSingle();

  if (byEmailError) {
    console.error("premium lookup by email failed", byEmailError);
    return false;
  }

  return byEmail?.is_premium === true;
}

export async function isCustomerPremium(customerId: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("is_premium")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    console.error("premium lookup by customer failed", error);
    return false;
  }

  return data?.is_premium === true;
}

export async function getStripeCustomerIdForAccess(): Promise<string | null> {
  const user = await getAuthUser();
  if (user) {
    const record = await getSubscriptionForUser(user.id, user.email);
    if (record && isActiveSubscription(record)) {
      return record.stripe_customer_id;
    }
  }

  const jar = await cookies();
  const access = verifyAccessToken(jar.get(ACCESS_COOKIE)?.value);
  if (access && (await isCustomerSubscribed(access.customerId))) {
    return access.customerId;
  }

  return null;
}

export async function hasPaywallAccess(
  accessToken?: string | null,
): Promise<boolean> {
  if (!isStripeConfigured()) return true;

  const user = await getAuthUser();
  if (user) {
    if (await isUserPremium(user.id, user.email)) {
      return true;
    }

    const profile = await getRecoveryProfileByUserId(user.id);
    if (isSubscriptionEntitled(profile?.subscription_status)) {
      return true;
    }
  }

  const jar = await cookies();
  const candidates = [accessToken, jar.get(ACCESS_COOKIE)?.value];

  for (const raw of candidates) {
    const access = verifyAccessToken(raw ?? undefined);
    if (!access) continue;
    if (await isCustomerPremium(access.customerId)) {
      return true;
    }

    const profile = await getRecoveryProfileByStripeCustomerId(
      access.customerId,
    );
    if (isSubscriptionEntitled(profile?.subscription_status)) {
      return true;
    }
  }

  return false;
}

export function profileDownloadPath(accessToken?: string | null): string {
  if (!accessToken) return "/api/profile";
  return `/api/profile?access=${encodeURIComponent(accessToken)}`;
}

async function isCheckoutSessionSubscribed(
  session: Awaited<
    ReturnType<ReturnType<typeof getStripe>["checkout"]["sessions"]["retrieve"]>
  >,
): Promise<boolean> {
  if (await isCustomerSubscribedFromStripeSession(session)) {
    return true;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!customerId) return false;

  return isCustomerSubscribed(customerId);
}

async function isCustomerSubscribedFromStripeSession(
  session: Awaited<
    ReturnType<ReturnType<typeof getStripe>["checkout"]["sessions"]["retrieve"]>
  >,
): Promise<boolean> {
  const subscription = session.subscription;
  if (!subscription) return false;

  if (typeof subscription === "object") {
    return isPremiumStatus(subscription.status);
  }

  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(subscription);
  return isPremiumStatus(sub.status);
}

export async function grantAccessFromCheckoutSession(
  sessionId: string,
): Promise<string | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (
    session.status !== "complete" &&
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    return null;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!customerId) return null;

  if (!(await isCheckoutSessionSubscribed(session))) {
    return null;
  }

  return createAccessToken(customerId);
}
