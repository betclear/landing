"use client";

import { useEffect } from "react";

import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getFirebaseAnalytics } from "@/lib/firebase/analytics";

export function FirebaseAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    void getFirebaseAnalytics();
  }, []);

  return null;
}
