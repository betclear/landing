import type { AppLocale } from "@/lib/i18n/config";
import { en } from "./en";
import { ptBR } from "./pt-BR";
import type { Dictionary } from "./types";

export type { Dictionary } from "./types";
export { en } from "./en";
export { ptBR } from "./pt-BR";

export function getDictionary(locale: AppLocale | "en" | "br"): Dictionary {
  if (locale === "br") return ptBR;
  return en as unknown as Dictionary;
}
