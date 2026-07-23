import { createHash } from "crypto";
import { GoogleAdsApi, services } from "google-ads-api";
import type { ClickAttribution } from "@/lib/attribution/metadata";
import { getGoogleAdsConfig, isGoogleAdsConfigured } from "@/lib/google-ads/config";

export type UploadResult =
  | { ok: true }
  | { ok: false; error: string };

function hashEmail(email: string): string {
  return createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

function formatConversionDateTime(date = new Date()): string {
  return date
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d{3}Z$/, "+00:00");
}

async function uploadClickConversion(options: {
  conversionActionId: string;
  attribution: ClickAttribution;
  email?: string | null;
  orderId: string;
  conversionValue: number;
  currencyCode?: string;
  conversionDateTime?: Date;
}): Promise<UploadResult> {
  if (!isGoogleAdsConfigured()) {
    return { ok: false, error: "google_ads_not_configured" };
  }

  const hasClickId = Boolean(
    options.attribution.gclid ||
      options.attribution.gbraid ||
      options.attribution.wbraid,
  );
  if (!hasClickId && !options.email) {
    return { ok: false, error: "need_click_id_or_email" };
  }

  const config = getGoogleAdsConfig();
  const client = new GoogleAdsApi({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    developer_token: config.developerToken,
  });

  const customer = client.Customer({
    customer_id: config.customerId,
    login_customer_id: config.loginCustomerId,
    refresh_token: config.refreshToken,
  });

  const conversion: Record<string, unknown> = {
    conversion_action: `customers/${config.customerId}/conversionActions/${options.conversionActionId}`,
    conversion_date_time: formatConversionDateTime(options.conversionDateTime),
    conversion_value: options.conversionValue,
    currency_code: options.currencyCode ?? "USD",
    order_id: options.orderId,
  };

  if (options.attribution.gclid) {
    conversion.gclid = options.attribution.gclid;
  } else if (options.attribution.gbraid) {
    conversion.gbraid = options.attribution.gbraid;
  } else if (options.attribution.wbraid) {
    conversion.wbraid = options.attribution.wbraid;
  }

  if (options.email) {
    conversion.user_identifiers = [{ hashed_email: hashEmail(options.email) }];
  }

  const request = new services.UploadClickConversionsRequest({
    customer_id: config.customerId,
    conversions: [conversion],
    partial_failure: true,
  });

  try {
    await customer.conversionUploads.uploadClickConversions(request);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("google ads conversion upload failed", message);
    return { ok: false, error: message };
  }
}

export async function uploadSignup(options: {
  attribution: ClickAttribution;
  email?: string | null;
  orderId: string;
  conversionDateTime?: Date;
}): Promise<UploadResult> {
  const config = getGoogleAdsConfig();
  return uploadClickConversion({
    conversionActionId: config.signupActionId,
    attribution: options.attribution,
    email: options.email,
    orderId: options.orderId,
    conversionValue: 0,
    currencyCode: "USD",
    conversionDateTime: options.conversionDateTime,
  });
}

export async function uploadTrial(options: {
  attribution: ClickAttribution;
  email?: string | null;
  orderId: string;
  conversionDateTime?: Date;
}): Promise<UploadResult> {
  const config = getGoogleAdsConfig();
  return uploadClickConversion({
    conversionActionId: config.trialActionId,
    attribution: options.attribution,
    email: options.email,
    orderId: options.orderId,
    conversionValue: 0,
    currencyCode: "USD",
    conversionDateTime: options.conversionDateTime,
  });
}

export async function uploadPurchase(options: {
  attribution: ClickAttribution;
  email?: string | null;
  orderId: string;
  value: number;
  currencyCode?: string;
  conversionDateTime?: Date;
}): Promise<UploadResult> {
  const config = getGoogleAdsConfig();
  return uploadClickConversion({
    conversionActionId: config.purchaseActionId,
    attribution: options.attribution,
    email: options.email,
    orderId: options.orderId,
    conversionValue: options.value,
    currencyCode: options.currencyCode ?? "USD",
    conversionDateTime: options.conversionDateTime,
  });
}
