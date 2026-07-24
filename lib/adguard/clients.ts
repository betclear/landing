import {
  authHeaders,
  fetchAdGuard,
  getAdGuardConfig,
} from "@/lib/adguard/client";

export type AdGuardClientResult = {
  ok: boolean;
  warning?: string;
};

type AdGuardClientPayload = {
  name: string;
  ids: string[];
  tags: string[];
  use_global_settings: boolean;
  filtering_enabled: boolean;
  parental_enabled: boolean;
  safebrowsing_enabled: boolean;
  safesearch_enabled: boolean;
  use_global_blocked_services: boolean;
  blocked_services: string[];
  upstreams: string[];
};

function clientPayload(clientId: string): AdGuardClientPayload {
  return {
    name: clientId,
    ids: [clientId],
    // AdGuard only accepts its built-in tag enum (e.g. device_phone).
    // Custom tags like "betclear" return HTTP 400 "invalid tag".
    tags: [],
    use_global_settings: false,
    filtering_enabled: true,
    parental_enabled: false,
    safebrowsing_enabled: false,
    safesearch_enabled: false,
    use_global_blocked_services: true,
    blocked_services: [],
    upstreams: [],
  };
}

/**
 * Ensure an AdGuard "client" exists for this ClientID with filtering ON.
 * Used for both DoH path (/dns-query/<id>) and DoT SNI (<id>.dns.betclear.app).
 */
export async function upsertAdGuardClient(
  clientId: string,
): Promise<AdGuardClientResult> {
  const config = getAdGuardConfig();
  if (!config) {
    return {
      ok: false,
      warning: "AdGuard credentials not configured; DNS client not synced.",
    };
  }

  const headers = authHeaders(config);
  const payload = clientPayload(clientId);

  try {
    const add = await fetchAdGuard(`${config.baseUrl}/control/clients/add`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (add.ok) {
      return { ok: true };
    }

    // Already exists → update in place.
    if (add.status === 400) {
      const update = await fetchAdGuard(
        `${config.baseUrl}/control/clients/update`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: clientId,
            data: payload,
          }),
        },
      );
      if (update.ok) {
        return { ok: true };
      }
      console.error("AdGuard client update failed", update.status);
      return {
        ok: false,
        warning: `AdGuard client update failed (HTTP ${update.status}).`,
      };
    }

    console.error("AdGuard client add failed", add.status);
    return {
      ok: false,
      warning: `AdGuard client add failed (HTTP ${add.status}).`,
    };
  } catch (error) {
    console.error(
      "AdGuard client upsert error",
      error instanceof Error ? error.message : "unknown",
    );
    return {
      ok: false,
      warning: "AdGuard client sync failed.",
    };
  }
}

/** Remove filtering for a ClientID (cancel / grace expired). */
export async function removeAdGuardClient(
  clientId: string,
): Promise<AdGuardClientResult> {
  const config = getAdGuardConfig();
  if (!config) {
    return {
      ok: false,
      warning: "AdGuard credentials not configured; DNS client not removed.",
    };
  }

  try {
    const response = await fetchAdGuard(
      `${config.baseUrl}/control/clients/delete`,
      {
        method: "POST",
        headers: authHeaders(config),
        body: JSON.stringify({ name: clientId }),
      },
    );

    // 400 often means "client not found" — treat as success for idempotency.
    if (response.ok || response.status === 400) {
      return { ok: true };
    }

    console.error("AdGuard client delete failed", response.status);
    return {
      ok: false,
      warning: `AdGuard client delete failed (HTTP ${response.status}).`,
    };
  } catch (error) {
    console.error(
      "AdGuard client delete error",
      error instanceof Error ? error.message : "unknown",
    );
    return {
      ok: false,
      warning: "AdGuard client delete failed.",
    };
  }
}
