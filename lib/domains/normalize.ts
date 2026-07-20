/**
 * Normalize a user-supplied URL or hostname into a bare registrable-style hostname.
 * Examples:
 *   https://www.bet365.com/sports?source=test → bet365.com
 *   www.stake.com → stake.com
 *   pokerstars.com. → pokerstars.com
 */
export function normalizeHostname(input: string): string | null {
  if (typeof input !== "string") return null;

  let value = input.trim().toLowerCase();
  if (!value) return null;

  // Strip surrounding whitespace already done; remove internal spaces
  if (/\s/.test(value)) {
    value = value.replace(/\s+/g, "");
  }

  let hostname: string;

  try {
    if (value.includes("://")) {
      hostname = new URL(value).hostname;
    } else if (/[/?#]/.test(value) || value.includes("@")) {
      hostname = new URL(`https://${value}`).hostname;
    } else {
      // Bare host, optionally with port: example.com:443
      hostname = value.split("/")[0] ?? value;
      hostname = hostname.replace(/:\d+$/, "");
    }
  } catch {
    hostname = value
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      ?.split("?")[0]
      ?.split("#")[0]
      ?.replace(/:\d+$/, "") ?? "";
  }

  hostname = hostname.trim().toLowerCase();
  hostname = hostname.replace(/^\.+/, "").replace(/\.+$/, "");
  hostname = hostname.replace(/^www\./, "");

  if (!isValidHostname(hostname)) {
    return null;
  }

  return hostname;
}

export function isValidHostname(hostname: string): boolean {
  if (!hostname || hostname.length > 253) return false;
  if (hostname.includes("..")) return false;
  if (hostname.startsWith("-") || hostname.endsWith("-")) return false;

  // Require at least one dot (domain.tld). Reject IPs and bare labels.
  if (!hostname.includes(".")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;

  const labels = hostname.split(".");
  if (labels.length < 2) return false;

  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,63}$/.test(tld)) return false;

  return labels.every((label) => {
    if (!label || label.length > 63) return false;
    return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label);
  });
}
