import { randomUUID } from "crypto";
import { DOH_URL } from "@/lib/dns/config";

const ROOT_IDENTIFIER = "app.betclear.protection";
const DNS_IDENTIFIER = "app.betclear.protection.dns";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Generates an Apple configuration profile that configures managed DNS-over-HTTPS.
 * Blocked domains are NOT embedded; the DoH resolver enforces the blocklist.
 * Pass a per-user DoH URL so entitlement can be revoked without reinstall.
 */
export function generateMobileConfig(dohUrl: string = DOH_URL): string {
  const rootUuid = randomUUID().toUpperCase();
  const dnsUuid = randomUUID().toUpperCase();

  const description =
    "Configures encrypted DNS on this iPhone so BetClear can block gambling websites. Domains are enforced by the BetClear DNS resolver, not stored inside this profile.";

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DNSSettings</key>
			<dict>
				<key>DNSProtocol</key>
				<string>HTTPS</string>
				<key>ServerURL</key>
				<string>${escapeXml(dohUrl)}</string>
			</dict>
			<key>PayloadDescription</key>
			<string>${escapeXml(description)}</string>
			<key>PayloadDisplayName</key>
			<string>BetClear DNS</string>
			<key>PayloadIdentifier</key>
			<string>${escapeXml(DNS_IDENTIFIER)}</string>
			<key>PayloadType</key>
			<string>com.apple.dnsSettings.managed</string>
			<key>PayloadUUID</key>
			<string>${dnsUuid}</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>${escapeXml(description)}</string>
	<key>PayloadDisplayName</key>
	<string>BetClear Protection</string>
	<key>PayloadIdentifier</key>
	<string>${escapeXml(ROOT_IDENTIFIER)}</string>
	<key>PayloadOrganization</key>
	<string>BetClear</string>
	<key>PayloadRemovalDisallowed</key>
	<false/>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>${rootUuid}</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>
`;
}
