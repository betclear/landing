"use client";

import { useEffect } from "react";
import { setAnalyticsDefaults } from "@/lib/analytics";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Keeps Clarity event payloads tagged with the active locale/market. */
export function AnalyticsLocaleSync() {
  const { language, market } = useLocale();

  useEffect(() => {
    setAnalyticsDefaults({ locale: language, market });
  }, [language, market]);

  return null;
}
