export const ANALYTICS_CONSENT_COOKIE = "betclear_analytics_consent";
/** 6 months — common retention for analytics consent choices. */
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export const CLARITY_PROJECT_ID = "xphqj04z51";

export type AnalyticsConsent = "granted" | "denied";

export const CONSENT_CHANGED_EVENT = "betclear:consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "betclear:open-cookie-settings";

export function parseAnalyticsConsent(
  value: string | null | undefined,
): AnalyticsConsent | null {
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function readAnalyticsConsentFromDocument(): AnalyticsConsent | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`));
  if (!match) return null;

  return parseAnalyticsConsent(decodeURIComponent(match.split("=").slice(1).join("=")));
}

export function writeAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof document === "undefined") return;

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = [
    `${ANALYTICS_CONSENT_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${ANALYTICS_CONSENT_MAX_AGE}`,
    "SameSite=Lax",
    secure,
  ]
    .filter(Boolean)
    .join("; ");

  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }),
  );
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
