import type { ClickAttribution } from "@/lib/attribution/metadata";

function readCookie(cookieHeader: string | null, name: string): string {
  if (!cookieHeader) return "";
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function clickAttributionFromCookies(
  cookieHeader: string | null,
): ClickAttribution {
  return {
    gclid: readCookie(cookieHeader, "_gclid"),
    gbraid: readCookie(cookieHeader, "_gbraid"),
    wbraid: readCookie(cookieHeader, "_wbraid"),
  };
}

export function signupOrderId(userId: string): string {
  return `signup_${userId}`;
}

export function isNewAuthUser(user: {
  created_at?: string;
  last_sign_in_at?: string | null;
}): boolean {
  if (!user.created_at) return false;

  const createdAt = new Date(user.created_at).getTime();
  if (Number.isNaN(createdAt)) return false;

  if (!user.last_sign_in_at) {
    return Date.now() - createdAt < 5 * 60 * 1000;
  }

  const lastSignInAt = new Date(user.last_sign_in_at).getTime();
  if (Number.isNaN(lastSignInAt)) return false;

  return Math.abs(lastSignInAt - createdAt) < 60_000;
}
