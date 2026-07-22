import { getRequestConfig } from "next-intl/server";
import type { AppLocale } from "@/lib/i18n/config";
import { isAppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { routing } from "@/lib/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: getDictionary(locale as AppLocale),
  };
});
