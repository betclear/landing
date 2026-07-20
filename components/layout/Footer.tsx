import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  FOOTER_PRODUCT_LINKS,
  FOOTER_SUPPORT_LINKS,
  SITE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-[#081113] py-16 text-[#f5f7f3]">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em]">{SITE.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#a9bab6]">
              Protects the decision you make today from the urge you may feel
              tomorrow.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-5 inline-block text-sm text-[#7ed6bc] transition-opacity hover:opacity-80"
            >
              {SITE.email}
            </a>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#7ed6bc]">
              Product
            </p>
            <nav aria-label="Product" className="mt-4 flex flex-col gap-2.5">
              {FOOTER_PRODUCT_LINKS.map((link) => (
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
              Support
            </p>
            <nav aria-label="Support" className="mt-4 flex flex-col gap-2.5">
              {FOOTER_SUPPORT_LINKS.map((link) =>
                "external" in link && link.external ? (
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
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Gambling website protection for iPhone. Not a medical service.</p>
        </div>
      </Container>
    </footer>
  );
}
