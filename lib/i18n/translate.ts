import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { en } from "@/lib/i18n/dictionaries/en";

type NestedValue = string | number | boolean | NestedValue[] | { [key: string]: NestedValue };

function getByPath(obj: NestedValue, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number | null | undefined>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value == null ? `{${key}}` : String(value);
  });
}

/**
 * Look up a translation key. Falls back to English, then the key itself
 * only in production if both miss (should not happen with typed dictionaries).
 */
export function translate(
  dictionary: Dictionary,
  key: string,
  vars?: Record<string, string | number | null | undefined>,
): string {
  const fromLocale = getByPath(dictionary as unknown as NestedValue, key);
  if (typeof fromLocale === "string") {
    return interpolate(fromLocale, vars);
  }

  const fromEnglish = getByPath(en as unknown as NestedValue, key);
  if (typeof fromEnglish === "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Missing key "${key}" — falling back to English`);
    }
    return interpolate(fromEnglish, vars);
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(`[i18n] Missing key "${key}" in all locales`);
  }

  // Never expose raw keys to users in production UI.
  return "";
}

export function translateList(
  dictionary: Dictionary,
  key: string,
): string[] {
  const value = getByPath(dictionary as unknown as NestedValue, key);
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value as string[];
  }

  const fallback = getByPath(en as unknown as NestedValue, key);
  if (
    Array.isArray(fallback) &&
    fallback.every((item) => typeof item === "string")
  ) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[i18n] Missing list key "${key}" — falling back to English`);
    }
    return fallback as string[];
  }

  return [];
}
