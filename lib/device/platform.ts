import { isAndroidUserAgent, isIosUserAgent } from "@/lib/stripe/browser";

export type DevicePlatform = "ios" | "android" | "unknown";

export function detectDevicePlatform(userAgent: string): DevicePlatform {
  if (isAndroidUserAgent(userAgent)) return "android";
  if (isIosUserAgent(userAgent)) return "ios";
  return "unknown";
}
