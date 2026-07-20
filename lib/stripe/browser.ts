/**
 * True Mobile Safari (not Chrome/Firefox/Edge wrappers on iOS).
 * Used to auto-complete install access in the browser that can install profiles.
 */
export function isSafariUserAgent(userAgent: string): boolean {
  if (!userAgent) return false;

  const ua = userAgent.toLowerCase();

  if (!ua.includes("safari")) return false;
  if (ua.includes("crios")) return false;
  if (ua.includes("fxios")) return false;
  if (ua.includes("edgios")) return false;
  if (ua.includes("android")) return false;
  if (ua.includes("chrome") && !ua.includes("chrome/0")) return false;

  return true;
}

export function isIosUserAgent(userAgent: string): boolean {
  return /iphone|ipad|ipod/i.test(userAgent);
}
