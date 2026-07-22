import { type NextRequest, NextResponse } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeToCookieValue,
  type AppLocale,
} from "@/lib/i18n/config";
import {
  getLocaleFromPathname,
  hasLocalePrefix,
  isLocaleExcludedPath,
  localizePath,
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
    url.pathname = `/${locale}`;
    const response = temporaryRedirect(url);
    response.headers.set("x-robots-tag", "noindex");
    if (!cookieLocale) {
      withLocaleCookie(response, locale);
    }
    return response;
  }

  // Explicit locale in URL — never override with geo.
  if (hasLocalePrefix(pathname)) {
    const locale = getLocaleFromPathname(pathname)!;
    const response = await updateSession(request);
    withLocaleCookie(response, locale);
    return response;
  }

  // Legacy unprefixed routes → locale-prefixed (prefer saved cookie, else /en).
  const bare = stripLocalePrefix(pathname);
  const shouldLegacyRedirect =
    bare.startsWith("/onboarding") ||
    bare.startsWith("/install") ||
    bare.startsWith("/blog") ||
    bare.startsWith("/privacy") ||
    bare.startsWith("/terms") ||
    bare.startsWith("/support") ||
    bare.startsWith("/report-site") ||
    bare.startsWith("/pricing") ||
    bare.startsWith("/login") ||
    bare === "/auth" ||
    bare.startsWith("/auth/") ||
    bare.startsWith("/payment") ||
    bare === "/install-test";

  if (shouldLegacyRedirect) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = resolvePreferredLocale({
      cookieLocale,
      country: null,
    });
    const targetLocale: AppLocale = cookieLocale ? locale : "en";
    const target = localizePath(
      targetLocale,
      bare === "/install-test" ? "/install" : bare,
    );
    const url = request.nextUrl.clone();
    url.pathname = target;
    return permanentRedirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
