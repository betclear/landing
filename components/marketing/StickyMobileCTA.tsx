"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const { t, href } = useLocale();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/92 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Button
        href={href("/onboarding/spend")}
        size="lg"
        className="w-full"
        showArrow={false}
        onClick={() =>
          trackEvent("hero_start_protection_clicked", { source: "sticky_mobile" })
        }
      >
        {t("stickyCta.label")}
      </Button>
    </div>
  );
}
