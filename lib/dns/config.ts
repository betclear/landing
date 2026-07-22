/**
 * Single source of truth for the BetClear DNS resolver identity.
 * Shared base hostname for migration; per-user installs use a ClientID subdomain.
 */

/** Bare shared hostname (legacy installs + migration window). */
export const DNS_HOSTNAME = "dns.betclear.app";

/** DNS-over-HTTPS endpoint for the shared hostname (legacy). */
export const DOH_URL = `https://${DNS_HOSTNAME}/dns-query`;

/** Per-user Android Private DNS hostname: <clientId>.dns.betclear.app */
export function dnsHostnameForClient(clientId: string): string {
  return `${clientId}.${DNS_HOSTNAME}`;
}

/** Per-user iOS DoH URL. AdGuard also accepts /dns-query/<clientId> on the base host. */
export function dohUrlForClient(clientId: string): string {
  return `https://${dnsHostnameForClient(clientId)}/dns-query`;
}
