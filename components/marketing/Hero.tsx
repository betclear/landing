"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

type HeroProps = {
  domainCountLabel: string;
};

function measureFittedSize(
  line1: string,
  line2: string,
  available: number,
  styles: CSSStyleDeclaration,
) {
  const probe = document.createElement("span");
  probe.style.cssText = [
    "position:absolute",
    "visibility:hidden",
    "pointer-events:none",
    "white-space:nowrap",
    `font-family:${styles.fontFamily}`,
    "font-weight:700",
    "letter-spacing:-1.5px",
  ].join(";");
  document.body.appendChild(probe);

  let lo = 28;
  let hi = 72;
  let best = lo;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    probe.style.fontSize = `${mid}px`;
    probe.textContent = line1;
    const w1 = probe.getBoundingClientRect().width;
    probe.textContent = line2;
    const w2 = probe.getBoundingClientRect().width;
    if (Math.max(w1, w2) <= available - 1) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  probe.remove();
  return best;
}

function MobileHeroTitle({ line1, line2 }: { line1: string; line2: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(40);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const fit = () => {
      const available = el.clientWidth;
      if (available <= 0) return;
      const next = measureFittedSize(
        line1,
        line2,
        available,
        getComputedStyle(el),
      );
      setFontSize((prev) => (prev === next ? prev : next));
    };

    fit();
    void document.fonts.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [line1, line2]);

  return (
    <span
      ref={wrapRef}
      style={{
        display: "block",
        width: "100%",
        color: "#000",
        fontWeight: 700,
        fontSize,
        letterSpacing: "-1.5px",
        lineHeight: 1.05,
        textAlign: "center",
      }}
      aria-hidden="true"
    >
      <span style={{ display: "block", whiteSpace: "nowrap" }}>{line1}</span>
      <span style={{ display: "block", whiteSpace: "nowrap" }}>{line2}</span>
    </span>
  );
}

export function Hero({ domainCountLabel }: HeroProps) {
  const { t } = useLocale();
  const [isMobile, setIsMobile] = useState(true);

  const titleParts = t("hero.title", { domainCount: domainCountLabel }).split(
    "|",
  );
  const titleLine1 = titleParts[0]?.trim() ?? "";
  const titleLine2 = (titleParts[1] ?? "").trim().replace(/\u00A0/g, " ");
  const fullTitle = [titleLine1, titleLine2].filter(Boolean).join(" ");

  useEffect(() => {
    trackEvent("homepage_viewed");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative pb-14 pt-6 sm:pb-20 sm:pt-10">
      <Container className="relative">
        <div className="hero-content mx-auto max-w-xl text-center">
          <div className="hero-copy">
            <p className="hero-eyebrow mx-auto">{t("hero.eyebrow")}</p>

            <h1
              style={{
                margin: 0,
                width: "100%",
                color: "#000",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              <span className="sr-only">{fullTitle}</span>
              {isMobile ? (
                <MobileHeroTitle line1={titleLine1} line2={titleLine2} />
              ) : (
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 60,
                    letterSpacing: "-1.8px",
                  }}
                >
                  {fullTitle}
                </span>
              )}
            </h1>

            <p className="hero-subtitle mx-auto max-w-[34rem] text-pretty">
              {t("hero.description")}
            </p>
          </div>
          <div className="hero-actions">
            <Button
              href={"/onboarding/spend"}
              size="lg"
              onClick={() => {
                trackEvent("hero_start_protection_clicked");
                trackEvent("hero_cta_clicked", { source: "hero" });
              }}
            >
              {t("hero.primaryCta")}
            </Button>
            <Button
              href={"/#how-it-works"}
              variant="secondary"
              size="lg"
              showArrow={false}
              onClick={() => {
                trackEvent("hero_how_it_works_clicked");
                trackEvent("how_it_works_clicked");
              }}
            >
              {t("hero.secondaryCta")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
