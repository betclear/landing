const IPV4_RE =
  /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const IPV6_RE = /^\[?[0-9a-f:]+\]?$/i;

/**
 * Syntax-based DNS hostname validation (no outdated TLD allowlist).
 */
export function isValidDomain(hostname: string): {
  valid: boolean;
  reason?: string;
} {
  if (!hostname) {
    return { valid: false, reason: "empty" };
  }

  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return { valid: false, reason: "localhost" };
  }

  if (IPV4_RE.test(hostname)) {
    return { valid: false, reason: "IP addresses are not supported" };
  }

  if (hostname.includes(":") || IPV6_RE.test(hostname)) {
    // After normalization, hostnames shouldn't contain bare IPv6
    if (hostname.includes(":")) {
      return { valid: false, reason: "IP addresses are not supported" };
    }
  }

  if (hostname.includes("/") || hostname.includes("?") || hostname.includes("#")) {
    return { valid: false, reason: "URL path or query remains" };
  }

  if (hostname.includes("*") || hostname.includes(" ")) {
    return { valid: false, reason: "invalid characters" };
  }

  if (/[\u0000-\u001f\u007f]/.test(hostname)) {
    return { valid: false, reason: "control characters" };
  }

  if (hostname.length > 253) {
    return { valid: false, reason: "hostname longer than 253 characters" };
  }

  if (!hostname.includes(".")) {
    return { valid: false, reason: "single-label hosts are not supported" };
  }

  if (hostname.includes("..")) {
    return { valid: false, reason: "consecutive dots" };
  }

  const labels = hostname.split(".");
  if (labels.length < 2) {
    return { valid: false, reason: "missing TLD-like structure" };
  }

  const tld = labels[labels.length - 1] ?? "";
  // Punycode TLDs (xn--) or alphabetic/numeric modern TLDs
  if (!/^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(tld)) {
    return { valid: false, reason: "invalid TLD-like label" };
  }

  for (const label of labels) {
    if (!label || label.length > 63) {
      return { valid: false, reason: "invalid label length" };
    }
    if (label.startsWith("-") || label.endsWith("-")) {
      return { valid: false, reason: "label cannot start or end with hyphen" };
    }
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)) {
      return { valid: false, reason: "invalid label characters" };
    }
  }

  return { valid: true };
}
