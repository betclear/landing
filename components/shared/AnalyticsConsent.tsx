"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import {
  CLARITY_PROJECT_ID,
  CONSENT_CHANGED_EVENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  readAnalyticsConsentFromDocument,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/consent";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getFirebaseAnalytics } from "@/lib/firebase/analytics";

function ClarityScript() {
  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

function ConsentedFirebaseAnalytics() {
  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    void getFirebaseAnalytics();
  }, []);

  return null;
}

export function AnalyticsConsent() {
  const { t } = useLocale();
  const [hydrated, setHydrated] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    setConsent(readAnalyticsConsentFromDocument());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const onConsentChanged = (event: Event) => {
      const detail = (event as CustomEvent<AnalyticsConsent>).detail;
      setConsent(detail);
      setForceOpen(false);
    };
    const onOpenSettings = () => setForceOpen(true);

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    };
  }, []);

  const showBanner = hydrated && (forceOpen || consent === null);

  return (
    <>
      {consent === "granted" ? (
        <>
          <ClarityScript />
          <ConsentedFirebaseAnalytics />
        </>
      ) : null}

      {showBanner ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          className="fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/80 bg-card/96 p-4 shadow-elevated backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <p
                  id="cookie-consent-title"
                  className="text-sm font-semibold tracking-[-0.02em] text-foreground"
                >
                  {t("cookieConsent.title")}
                </p>
                <p
                  id="cookie-consent-description"
                  className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
                >
                  {t("cookieConsent.description")}{" "}
                  <LocaleLink
                    href="/privacy"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {t("cookieConsent.privacyLink")}
                  </LocaleLink>
                  .
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  showArrow={false}
                  onClick={() => {
                    const hadAnalytics = consent === "granted";
                    writeAnalyticsConsent("denied");
                    // Unload analytics scripts that may already be in the page.
                    if (hadAnalytics) window.location.reload();
                  }}
                >
                  {t("cookieConsent.reject")}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto"
                  showArrow={false}
                  onClick={() => writeAnalyticsConsent("granted")}
                >
                  {t("cookieConsent.accept")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
