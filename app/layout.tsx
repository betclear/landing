import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { FirebaseAnalytics } from "@/components/shared/FirebaseAnalytics";
import { SITE } from "@/lib/constants";
import { localeConfig, type AppLocale, isAppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BetClear — Block Gambling Websites on iPhone",
    template: `%s — ${SITE.name}`,
  },
  description: SITE.longDescription,
  metadataBase: new URL(SITE.url),
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const rawLocale = headerStore.get("x-betclear-locale");
  const locale: AppLocale =
    rawLocale && isAppLocale(rawLocale) ? rawLocale : "en";
  const htmlLang = localeConfig[locale].htmlLang;
  const dictionary = getDictionary(locale);

  return (
    <html lang={htmlLang} className="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{localStorage.removeItem('betclear-theme');document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#how-it-works"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          {dictionary.common.skipToContent}
        </a>
        <FirebaseAnalytics />
        {children}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xphqj04z51");
          `}
        </Script>
      </body>
    </html>
  );
}
