import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { getLocaleFromPathname, hasLocalePrefix } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/en/auth";
  }
  // Allow locale-prefixed and legacy paths (legacy redirected by middleware).
  if (hasLocalePrefix(value) || value.startsWith("/")) {
    return value;
  }
  return "/en/auth";
}

function redirectOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost && process.env.NODE_ENV === "production") {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return url.origin;
}

function authErrorPath(next: string): string {
  const locale = getLocaleFromPathname(next) ?? "en";
  if (
    next.endsWith("/auth") ||
    next.includes("/onboarding") ||
    next === "/auth"
  ) {
    return `/${locale}/auth?error=auth`;
  }
  return `/${locale}/login?error=auth`;
}

export async function GET(request: Request) {
  const origin = redirectOrigin(request);

  if (!isSupabaseAuthConfigured()) {
    return NextResponse.redirect(new URL("/en/login", origin));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const oauthError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (oauthError && !code) {
    console.error("auth callback oauth error", oauthError);
    return NextResponse.redirect(new URL(authErrorPath(next), origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/en/login", origin));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("auth callback error", error);
    return NextResponse.redirect(new URL(authErrorPath(next), origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
