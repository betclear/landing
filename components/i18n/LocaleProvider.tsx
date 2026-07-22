"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { DevicePlatform } from "@/lib/device/platform";
import type { AppLocale, LocaleMarket } from "@/lib/i18n/config";
import { localeConfig, localeToLanguage } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { interpolate, translate, translateList } from "@/lib/i18n/translate";

type LocaleContextValue = {
  locale: AppLocale;
  language: "en" | "pt-BR";
  market: LocaleMarket;
  platform: DevicePlatform;
  dictionary: Dictionary;
  t: (
    key: string,
    vars?: Record<string, string | number | null | undefined>,
  ) => string;
  tList: (key: string) => string[];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  platform = "unknown",
  children,
}: {
  locale: AppLocale;
  dictionary: Dictionary;
  platform?: DevicePlatform;
  children: ReactNode;
}) {
  const t = useCallback(
    (
      key: string,
      vars?: Record<string, string | number | null | undefined>,
    ) => translate(dictionary, key, vars, platform),
    [dictionary, platform],
  );

  const tList = useCallback(
    (key: string) => translateList(dictionary, key, platform),
    [dictionary, platform],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      language: localeToLanguage(locale),
      market: localeConfig[locale].market,
      platform,
      dictionary,
      t,
      tList,
    }),
    [locale, platform, dictionary, t, tList],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useTranslations() {
  return useLocale().t;
}

export { interpolate };
