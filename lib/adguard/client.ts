export type AdGuardRefreshResult = {
  ok: boolean;
  updated?: number;
  warning?: string;
};

type AdGuardConfig = {
  baseUrl: string;
  username: string;
  password: string;
};

function getAdGuardConfig(): AdGuardConfig | null {
  const baseUrl = process.env.ADGUARD_BASE_URL?.trim().replace(/\/$/, "");
  const username = process.env.ADGUARD_USERNAME?.trim();
  const password = process.env.ADGUARD_PASSWORD;

  if (!baseUrl || !username || !password) {
    return null;
  }

  return { baseUrl, username, password };
}

function authHeaders(config: AdGuardConfig): HeadersInit {
  const token = Buffer.from(
    `${config.username}:${config.password}`,
    "utf8",
  ).toString("base64");

  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Ensure AdGuard Home filter update interval is 1 hour as a fallback
 * if the immediate refresh call is missed.
 */
async function ensureFiltersUpdateInterval(
  config: AdGuardConfig,
): Promise<void> {
  const headers = authHeaders(config);

  const statusResponse = await fetch(
    `${config.baseUrl}/control/filtering/status`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  if (!statusResponse.ok) {
    console.error(
      "AdGuard filtering status failed",
      statusResponse.status,
    );
    return;
  }

  const status = (await statusResponse.json()) as {
    enabled?: boolean;
    interval?: number;
  };

  // AdGuard interval unit is hours. 1 = hourly fallback refresh.
  if (status.interval === 1) {
    return;
  }

  const configResponse = await fetch(
    `${config.baseUrl}/control/filtering/config`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        enabled: status.enabled ?? true,
        interval: 1,
      }),
      cache: "no-store",
    },
  );

  if (!configResponse.ok) {
    console.error(
      "AdGuard filters_update_interval set failed",
      configResponse.status,
    );
  }
}

/**
 * Ask AdGuard Home to re-download blocklists (not whitelist).
 * Credentials stay server-side only. Never throws for caller CRUD flows.
 */
export async function refreshAdGuardBlocklist(): Promise<AdGuardRefreshResult> {
  const config = getAdGuardConfig();

  if (!config) {
    return {
      ok: false,
      warning:
        "AdGuard credentials not configured. Domain saved, but DNS filter was not refreshed.",
    };
  }

  try {
    await ensureFiltersUpdateInterval(config);

    const response = await fetch(
      `${config.baseUrl}/control/filtering/refresh`,
      {
        method: "POST",
        headers: authHeaders(config),
        body: JSON.stringify({ whitelist: false }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("AdGuard refresh failed", response.status);
      return {
        ok: false,
        warning: `AdGuard filter refresh failed (HTTP ${response.status}). Domain change was saved.`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as {
      updated?: number;
    };

    return {
      ok: true,
      updated: typeof data.updated === "number" ? data.updated : undefined,
    };
  } catch (error) {
    console.error(
      "AdGuard refresh error",
      error instanceof Error ? error.message : "unknown",
    );
    return {
      ok: false,
      warning:
        "AdGuard filter refresh failed. Domain change was saved; DNS may update on the hourly fallback.",
    };
  }
}
