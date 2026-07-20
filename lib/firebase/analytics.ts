import {
  getAnalytics,
  isSupported,
  type Analytics,
} from "firebase/analytics";

import { getFirebaseApp } from "./client";

let analytics: Analytics | null = null;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || analytics) {
    return analytics;
  }

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}
