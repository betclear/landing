import { domainToASCII } from "node:url";

/**
 * Normalize a raw blocklist entry into a bare ASCII hostname, or null if rejected.
 * Does not collapse subdomains into apex domains.
 */
export function normalizeDomain(input: string): {
  domain: string | null;
  reason?: string;
} {
  if (typeof input !== "string") {
    return { domain: null, reason: "not a string" };
  }

  let value = input.trim();
  if (!value) {
    return { domain: null, reason: "empty" };
  }

  if (
    value.startsWith("#") ||
    value.startsWith("!") ||
    value.startsWith(";")
  ) {
    return { domain: null, reason: "comment" };
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  const hostsMatch = value.match(
    /^(?:0\.0\.0\.0|127\.0\.0\.1|::1)\s+(\S+)/i,
  );
  if (hostsMatch?.[1]) {
    value = hostsMatch[1];
  }

  if (value.startsWith("||")) {
    value = value.slice(2);
    const caret = value.indexOf("^");
    if (caret >= 0) {
      value = value.slice(0, caret);
    }
  }

  const dnsmasq = value.match(/^local=\/([^/]+)\//i);
  if (dnsmasq?.[1]) {
    value = dnsmasq[1];
  }

  value = value.trim().toLowerCase();

  while (value.startsWith("*.")) {
    value = value.slice(2);
  }
  if (value.startsWith("*")) {
    value = value.slice(1);
  }
  if (value.startsWith(".")) {
    value = value.slice(1);
  }

  try {
    if (value.includes("://") || value.includes("/") || value.includes("?")) {
      const asUrl = value.includes("://") ? value : `https://${value}`;
      const url = new URL(asUrl);
      value = url.hostname;
    } else if (value.includes("@") && !value.includes("://")) {
      return { domain: null, reason: "email addresses are not supported" };
    } else {
      const maybePort = value.match(/^([^[\]]+):(\d+)$/);
      if (maybePort?.[1]) {
        value = maybePort[1];
      }
    }
  } catch {
    value =
      value
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        ?.split("?")[0]
        ?.split("#")[0]
        ?.replace(/:\d+$/, "") ?? "";
  }

  value = value.trim().toLowerCase();
  value = value.replace(/^\.+/, "").replace(/\.+$/, "");

  if (!value) {
    return { domain: null, reason: "empty after normalization" };
  }

  if (/\s/.test(value)) {
    return { domain: null, reason: "contains whitespace" };
  }

  if (value === "localhost" || value.endsWith(".localhost")) {
    return { domain: null, reason: "localhost" };
  }

  try {
    const ascii = domainToASCII(value);
    if (!ascii) {
      return { domain: null, reason: "punycode conversion failed" };
    }
    value = ascii.toLowerCase();
  } catch {
    return { domain: null, reason: "punycode conversion failed" };
  }

  return { domain: value };
}

export function stripControlCharacters(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ");
}
