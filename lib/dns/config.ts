/**
 * Single source of truth for the BetClear DNS resolver identity, shared by
 * the iOS configuration profile (DNS-over-HTTPS) and the Android Private DNS
 * setup guide (DNS-over-TLS). Both platforms point at the same resolver and
 * therefore enforce the same dynamic blocklist.
 */

/** Bare hostname entered in Android Settings → Private DNS (DoT, TCP 853). */
export const DNS_HOSTNAME = "dns.betclear.app";

/** DNS-over-HTTPS endpoint embedded in the iOS configuration profile. */
export const DOH_URL = `https://${DNS_HOSTNAME}/dns-query`;
