import { createHash, randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { upsertAdGuardClient, removeAdGuardClient } from "@/lib/adguard/clients";

export type DevicePlatform = "ios" | "android" | "unknown";

export type DeviceInstall = {
  id: string;
  user_id: string | null;
  stripe_customer_id: string | null;
  client_id: string;
  platform: DevicePlatform | null;
  created_at: string;
  last_seen_at: string;
  revoked_at: string | null;
};

/**
 * DNS-safe AdGuard ClientID / subdomain label.
 * Example: bc + 32 hex chars → bc1a2b...@dns.betclear.app
 */
export function generateClientId(): string {
  return `bc${randomBytes(16).toString("hex")}`;
}

export function hashClientId(clientId: string): string {
  return createHash("sha256").update(clientId).digest("hex");
}

export async function getOrCreateDeviceInstall(options: {
  userId?: string | null;
  stripeCustomerId?: string | null;
  platform?: DevicePlatform;
  ensureAdGuard?: boolean;
}): Promise<DeviceInstall> {
  const userId = options.userId ?? null;
  const stripeCustomerId = options.stripeCustomerId ?? null;
  if (!userId && !stripeCustomerId) {
    throw new Error("device_install requires userId or stripeCustomerId");
  }

  const supabase = createServiceClient();

  let query = supabase
    .from("device_installs")
    .select("*")
    .is("revoked_at", null)
    .order("created_at", { ascending: true })
    .limit(1);

  if (userId) {
    query = query.eq("user_id", userId);
  } else {
    query = query.eq("stripe_customer_id", stripeCustomerId!);
  }

  const { data: existing, error: lookupError } = await query.maybeSingle();
  if (lookupError) {
    throw new Error(`device_install lookup failed: ${lookupError.message}`);
  }

  if (existing) {
    await supabase
      .from("device_installs")
      .update({
        last_seen_at: new Date().toISOString(),
        platform: options.platform ?? existing.platform,
        ...(userId && !existing.user_id ? { user_id: userId } : {}),
        ...(stripeCustomerId && !existing.stripe_customer_id
          ? { stripe_customer_id: stripeCustomerId }
          : {}),
      })
      .eq("id", existing.id);

    if (options.ensureAdGuard !== false) {
      await upsertAdGuardClient(existing.client_id);
    }
    return existing as DeviceInstall;
  }

  const clientId = generateClientId();
  const { data: created, error: insertError } = await supabase
    .from("device_installs")
    .insert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      client_id: clientId,
      platform: options.platform ?? "unknown",
    })
    .select("*")
    .single();

  if (insertError || !created) {
    throw new Error(
      `device_install create failed: ${insertError?.message ?? "unknown"}`,
    );
  }

  if (options.ensureAdGuard !== false) {
    await upsertAdGuardClient(clientId);
  }

  return created as DeviceInstall;
}

export async function listActiveClientIdsForOwner(options: {
  userId?: string | null;
  stripeCustomerId?: string | null;
}): Promise<string[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("device_installs")
    .select("client_id")
    .is("revoked_at", null);

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  } else if (options.stripeCustomerId) {
    query = query.eq("stripe_customer_id", options.stripeCustomerId);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) {
    console.error("listActiveClientIdsForOwner failed", error);
    return [];
  }
  return (data ?? []).map((row) => row.client_id as string);
}

export async function syncDnsFilteringForOwner(options: {
  userId?: string | null;
  stripeCustomerId?: string | null;
  filtersDns: boolean;
}): Promise<void> {
  const clientIds = await listActiveClientIdsForOwner(options);
  if (clientIds.length === 0) return;

  await Promise.all(
    clientIds.map((clientId) =>
      options.filtersDns
        ? upsertAdGuardClient(clientId)
        : removeAdGuardClient(clientId),
    ),
  );
}
