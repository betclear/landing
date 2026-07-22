import type { DevicePlatform } from "@/lib/device/platform";

export function pickPlatformContent<T>(
  platform: DevicePlatform,
  fallback: T,
  ios?: T,
  android?: T,
): T {
  if (platform === "android" && android !== undefined) return android;
  if (platform === "ios" && ios !== undefined) return ios;
  return fallback;
}
