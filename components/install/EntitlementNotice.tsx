import { createServiceClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/user";
import { verifyAccessToken, ACCESS_COOKIE } from "@/lib/stripe/access";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { AppLocale } from "@/lib/i18n/config";

export async function EntitlementNotice({
  locale,
  accessToken,
}: {
  locale: AppLocale;
  accessToken?: string | null;
}) {
  const dict = getDictionary(locale);
  const supabase = createServiceClient();

  let entitlementMode: string | null = null;

  const user = await getAuthUser();
  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("entitlement_mode")
      .eq("user_id", user.id)
      .order("is_premium", { ascending: false })
      .limit(1);
    entitlementMode = data?.[0]?.entitlement_mode ?? null;
  }

  if (!entitlementMode) {
    const jar = await cookies();
    const candidates = [accessToken, jar.get(ACCESS_COOKIE)?.value];
    for (const raw of candidates) {
      const access = verifyAccessToken(raw ?? undefined);
      if (!access) continue;
      const { data } = await supabase
        .from("subscriptions")
        .select("entitlement_mode")
        .eq("stripe_customer_id", access.customerId)
        .limit(1);
      entitlementMode = data?.[0]?.entitlement_mode ?? null;
      if (entitlementMode) break;
    }
  }

  if (entitlementMode === "grace_24h") {
    return (
      <div className="mt-6 rounded-[1.5rem] bg-soft p-5 text-sm leading-relaxed text-soft-foreground ring-1 ring-border">
        {dict.install.graceBanner}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[1.5rem] bg-card p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-border">
      {dict.install.reinstallBanner}
    </div>
  );
}
