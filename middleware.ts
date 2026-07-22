import { type NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeToCookieValue,
  type AppLocale,
} from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";
import {
  getLocaleFromPathname,
  hasLocalePrefix,
  isLocaleExcludedPath,
  resolvePreferredLocale,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

function withLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set(LOCALE_COOKIE, localeToCookieValue(locale), {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

function temporaryRedirect(url: URL) {
  return NextResponse.redirect(url, 307);
}

function permanentRedirect(url: URL) {
  return NextResponse.redirect(url, 308);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLocaleExcludedPath(pathname)) {
    return updateSession(request);
  }

  // Root: cookie → country → English. Non-permanent so preferences can change.
  if (pathname === "/" || pathname === "") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const country = request.headers.get("x-vercel-ip-country");
    const locale = resolvePreferredLocale({ cookieLocale, country });
    const url = request.nextUrl.clone();
    url.pathname = getPathname({ locale, href: "/" });
    const response = temporaryRedirect(url);
    response.headers.set("x-robots-tag", "noindex");
    if (!cookieLocale) {
      withLocaleCookie(response, locale);
    }
    return response;
  }

  // Metadata icons must stay at root (/icon.png, /apple-icon.png), not /en/...
  if (hasLocalePrefix(pathname)) {
    const bare = stripLocalePrefix(pathname);
    const assetPath =
      bare === "/apple-icon" || bare === "/apple-icon.png"
        ? "/apple-icon.png"
        : bare === "/icon" || bare === "/icon.png"
          ? "/icon.png"
          : bare === "/favicon.ico"
            ? "/favicon.ico"
            : null;

    if (assetPath) {
      const url = request.nextUrl.clone();
      url.pathname = assetPath;
      return permanentRedirect(url);
    }

    const locale = getLocaleFromPathname(pathname)!;
    const response = await updateSession(request);
    withLocaleCookie(response, locale);
    return response;
  }

  // Unprefixed app routes → locale-prefixed (prefer saved cookie, else /en).
  const bare = stripLocalePrefix(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = resolvePreferredLocale({
    cookieLocale,
    country: null,
  });
  const targetLocale: AppLocale = cookieLocale ? locale : "en";
  const href = bare === "/install-test" ? "/install" : bare;
  const url = request.nextUrl.clone();
  url.pathname = getPathname({ locale: targetLocale, href });
  return permanentRedirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    "/(en|br)/apple-icon",
    "/(en|br)/apple-icon.png",
    "/(en|br)/icon",
    "/(en|br)/icon.png",
    "/(en|br)/favicon.ico",
  ],
};
