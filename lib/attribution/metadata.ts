import type Stripe from "stripe";

export type ClickAttribution = {
  gclid: string;
  gbraid: string;
  wbraid: string;
};

const MAX_LEN = 500;

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_LEN) return "";
  return trimmed;
}

export function clickAttributionFromBody(body: unknown): ClickAttribution {
  if (!body || typeof body !== "object") {
    return { gclid: "", gbraid: "", wbraid: "" };
  }

  const record = body as Record<string, unknown>;
  return {
    gclid: sanitize(record.gclid),
    gbraid: sanitize(record.gbraid),
    wbraid: sanitize(record.wbraid),
  };
}

export function clickAttributionToMetadata(
  attribution: ClickAttribution,
): Record<string, string> {
  const metadata: Record<string, string> = {};
  if (attribution.gclid) metadata.gclid = attribution.gclid;
  if (attribution.gbraid) metadata.gbraid = attribution.gbraid;
  if (attribution.wbraid) metadata.wbraid = attribution.wbraid;
  return metadata;
}

export function clickIdsFromStripeMetadata(
  meta: Stripe.Metadata | null | undefined,
): ClickAttribution {
  if (!meta) {
    return { gclid: "", gbraid: "", wbraid: "" };
  }

  return {
    gclid: sanitize(meta.gclid),
    gbraid: sanitize(meta.gbraid),
    wbraid: sanitize(meta.wbraid),
  };
}

export function hasClickAttribution(attribution: ClickAttribution): boolean {
  return Boolean(attribution.gclid || attribution.gbraid || attribution.wbraid);
}
