import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
            {SITE.name}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="mt-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
