"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** next/link wrapper that prefixes the active locale. */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { href: localize } = useLocale();
  return <Link href={localize(href)} {...props} />;
}
