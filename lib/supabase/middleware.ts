import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/config";
import { getLocaleFromPathname } from "@/lib/i18n/routing";

function nextWithLocale(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  if (locale) {
    requestHeaders.set("x-betclear-locale", locale);
  }
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseAuthConfigured()) {
    return nextWithLocale(request);
  }

  const code = request.nextUrl.searchParams.get("code");
  if (code && request.nextUrl.pathname !== "/auth/callback") {
    const locale = getLocaleFromPathname(request.nextUrl.pathname);
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!url.searchParams.has("next")) {
      url.searchParams.set("next", locale ? `/${locale}/auth` : "/en/auth");
    }
    return NextResponse.redirect(url);
  }

  let supabaseResponse = nextWithLocale(request);

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = nextWithLocale(request);
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh the auth session without trusting getSession() alone.
  await supabase.auth.getUser();

  return supabaseResponse;
}
