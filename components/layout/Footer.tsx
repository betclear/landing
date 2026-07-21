"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SITE } from "@/lib/constants";

export function Footer() {
  const { t, href } = useLocale();

  const productLinks = [
    { href: href("/#how-it-works"), label: t("footer.howItWorks") },
    { href: href("/guides"), label: t("footer.guides") },
    { href: href("/blog"), label: "Blog" },
    { href: href("/install"), label: t("footer.installation") },
    { href: href("/#pricing"), label: t("footer.pricing") },
    { href: href("/#faq"), label: t("footer.faq") },
  ];

  const supportLinks = [
    {
      href: href("/support"),
      label: t("nav.support"),
      external: false,
    },
    {
      href: `mailto:${SITE.email}`,
      label: t("footer.contact"),
      external: false,
    },
    { href: href("/privacy"), label: t("footer.privacy"), external: false },
    { href: href("/terms"), label: t("footer.terms"), external: false },
    {
      href: "https://www.begambleaware.org/",
      label: t("footer.beGambleAware"),
      external: true,
    },
    {
      href: "https://www.gamblersanonymous.org/",
      label: t("footer.gamblersAnonymous"),
      external: true,
    },
  ];

  return (
    <footer className="border-t border-border/70 bg-[#081113] py-16 text-[#f5f7f3]">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em]">{SITE.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#a9bab6]">
              {t("footer.blurb")}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-5 inline-block text-sm text-[#7ed6bc] transition-opacity hover:opacity-80"
            >
              {SITE.email}
            </a>
            <div className="mt-5">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#7ed6bc]">
              {t("footer.productHeading")}
            </p>
            <nav
              aria-label={t("common.product")}
              className="mt-4 flex flex-col gap-2.5"
            >
              {productLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#a9bab6] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#7ed6bc]">
              {t("footer.supportHeading")}
            </p>
            <nav
              aria-label={t("common.support")}
              className="mt-4 flex flex-col gap-2.5"
            >
              {supportLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#a9bab6] transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[#a9bab6] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#7a8f8a] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}.{" "}
            {t("common.allRightsReserved")}
          </p>
          <p>{t("footer.disclaimer")}</p>
        </div>
      </Container>
    </footer>
  );
}
