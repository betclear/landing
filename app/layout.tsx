import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { FirebaseAnalytics } from "@/components/shared/FirebaseAnalytics";
import { SITE } from "@/lib/constants";
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
  alternates: {
    canonical: "/",
  },
  keywords: [
    "gambling website blocker",
    "block gambling websites",
    "gambling blocker",
    "betting site blocker",
    "stop gambling online",
    "block betting sites on iPhone",
  ],
  openGraph: {
    title: "BetClear — Block Gambling Websites on iPhone",
    description: SITE.longDescription,
    siteName: SITE.name,
    type: "website",
    url: SITE.url,
    images: [
      {
        url: "/images/hero-iphone.png",
        width: 900,
        height: 1200,
        alt: "BetClear gambling website blocker on iPhone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BetClear — Block Gambling Websites on iPhone",
    description: SITE.longDescription,
    images: ["/images/hero-iphone.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
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
          Skip to content
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
