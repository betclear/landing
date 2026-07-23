import {
  clickAttributionFromBody,
  hasClickAttribution,
} from "@/lib/attribution/metadata";
import {
  clickAttributionFromCookies,
  signupOrderId,
} from "@/lib/attribution/server";
import { uploadSignup } from "@/lib/google-ads/conversions";

type ReportSignupOptions = {
  userId: string;
  email?: string | null;
  cookieHeader?: string | null;
  body?: unknown;
};

export async function reportSignupConversion(
  options: ReportSignupOptions,
): Promise<{ ok: boolean; error?: string }> {
  const fromBody = clickAttributionFromBody(options.body);
  const fromCookies = clickAttributionFromCookies(options.cookieHeader ?? null);

  const attribution = {
    gclid: fromBody.gclid || fromCookies.gclid,
    gbraid: fromBody.gbraid || fromCookies.gbraid,
    wbraid: fromBody.wbraid || fromCookies.wbraid,
  };

  if (!hasClickAttribution(attribution) && !options.email) {
    return { ok: false, error: "need_click_id_or_email" };
  }

  const result = await uploadSignup({
    attribution,
    email: options.email,
    orderId: signupOrderId(options.userId),
  });

  if (!result.ok) {
    console.error("google ads signup upload failed", result.error);
  }

  return result;
}
