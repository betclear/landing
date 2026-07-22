import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";
import type {
  AdminRegisteredUser,
  SubscriptionRow,
  UserRecoveryProfileRow,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function providersForUser(user: {
  app_metadata?: Record<string, unknown> | null;
  identities?: Array<{ provider?: string | null }> | null;
}): string[] {
  const fromIdentities =
    user.identities
      ?.map((identity) => identity.provider)
      .filter((provider): provider is string => Boolean(provider)) ?? [];

  if (fromIdentities.length > 0) {
    return Array.from(new Set(fromIdentities));
  }

  const metaProviders = user.app_metadata?.providers;
  if (Array.isArray(metaProviders)) {
    return metaProviders.filter(
      (provider): provider is string => typeof provider === "string",
    );
  }

  const provider = user.app_metadata?.provider;
  return typeof provider === "string" ? [provider] : [];
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      200,
      Math.max(1, Number(searchParams.get("pageSize") ?? "50") || 50),
    );

    const supabase = createServiceClient();

    const [
      { data: authData, error: authError },
      { data: subscriptions, error: subscriptionsError },
      { data: profiles, error: profilesError },
    ] = await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase
        .from("subscriptions")
        .select(
          "id, stripe_customer_id, stripe_subscription_id, email, user_id, status, price_id, plan, current_period_end, is_premium, created_at, updated_at",
        ),
      supabase.from("user_recovery_profiles").select("*"),
    ]);

    if (authError) {
      console.error("admin users list failed", authError);
      return NextResponse.json(
        { error: "Failed to load users" },
        { status: 500 },
      );
    }

    if (subscriptionsError) {
      console.error("admin subscriptions list failed", subscriptionsError);
      return NextResponse.json(
        { error: "Failed to load subscriptions" },
        { status: 500 },
      );
    }

    if (profilesError) {
      console.error("admin profiles list failed", profilesError);
      return NextResponse.json(
        { error: "Failed to load recovery profiles" },
        { status: 500 },
      );
    }

    const subscriptionRows = (subscriptions ?? []) as SubscriptionRow[];
    const profileRows = (profiles ?? []) as UserRecoveryProfileRow[];

    const subscriptionsByUserId = new Map<string, SubscriptionRow>();
    const subscriptionsByEmail = new Map<string, SubscriptionRow>();
    for (const row of subscriptionRows) {
      if (row.user_id) subscriptionsByUserId.set(row.user_id, row);
      if (row.email) subscriptionsByEmail.set(row.email.toLowerCase(), row);
    }

    const profilesByUserId = new Map<string, UserRecoveryProfileRow>();
    for (const row of profileRows) {
      profilesByUserId.set(row.user_id, row);
    }

    let users: AdminRegisteredUser[] = (authData.users ?? []).map((user) => {
      const email = user.email ?? null;
      const subscription =
        (user.id ? subscriptionsByUserId.get(user.id) : undefined) ??
        (email ? subscriptionsByEmail.get(email.toLowerCase()) : undefined) ??
        null;
      const profile = profilesByUserId.get(user.id) ?? null;

      return {
        id: user.id,
        email,
        email_confirmed_at: user.email_confirmed_at ?? null,
        last_sign_in_at: user.last_sign_in_at ?? null,
        created_at: user.created_at,
        providers: providersForUser(user),
        subscription_id: subscription?.id ?? null,
        stripe_customer_id: subscription?.stripe_customer_id ?? null,
        stripe_subscription_id: subscription?.stripe_subscription_id ?? null,
        subscription_email: subscription?.email ?? null,
        subscription_status: subscription?.status ?? null,
        price_id: subscription?.price_id ?? null,
        plan: subscription?.plan ?? null,
        current_period_end: subscription?.current_period_end ?? null,
        is_premium: subscription?.is_premium ?? null,
        subscription_created_at: subscription?.created_at ?? null,
        subscription_updated_at: subscription?.updated_at ?? null,
        profile_id: profile?.id ?? null,
        currency: profile?.currency ?? null,
        monthly_gambling_spend: profile?.monthly_gambling_spend ?? null,
        weekly_gambling_hours: profile?.weekly_gambling_hours ?? null,
        last_gambling_date: profile?.last_gambling_date ?? null,
        last_gambling_date_is_approximate:
          profile?.last_gambling_date_is_approximate ?? null,
        onboarding_completed_at: profile?.onboarding_completed_at ?? null,
        selected_plan: profile?.selected_plan ?? null,
        profile_stripe_customer_id: profile?.stripe_customer_id ?? null,
        profile_stripe_subscription_id: profile?.stripe_subscription_id ?? null,
        profile_subscription_status: profile?.subscription_status ?? null,
        trial_ends_at: profile?.trial_ends_at ?? null,
        current_period_ends_at: profile?.current_period_ends_at ?? null,
        profile_created_at: profile?.created_at ?? null,
        profile_updated_at: profile?.updated_at ?? null,
      };
    });

    if (q) {
      users = users.filter((user) => {
        const haystack = [
          user.id,
          user.email,
          user.subscription_email,
          user.stripe_customer_id,
          user.stripe_subscription_id,
          user.subscription_status,
          user.plan,
          user.providers.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    users.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const total = users.length;
    const from = (page - 1) * pageSize;
    const pageUsers = users.slice(from, from + pageSize);

    return NextResponse.json({
      users: pageUsers,
      page,
      pageSize,
      total,
    });
  } catch (error) {
    console.error("admin users GET error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
