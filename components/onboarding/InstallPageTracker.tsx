"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function InstallPageTracker() {
  useEffect(() => {
    trackEvent("installation_page_viewed", { step: "install" });
  }, []);

  return null;
}
