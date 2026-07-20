import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { getSiteUrl } from "@/lib/stripe/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/pricing";
  }
  return value;
}

export async function GET(request: Request) {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const oauthError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (oauthError && !code) {
    console.error("auth callback oauth error", oauthError);
    return NextResponse.redirect(new URL("/login?error=auth", getSiteUrl()));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("auth callback error", error);
    return NextResponse.redirect(
      new URL("/login?error=auth", getSiteUrl()),
    );
  }

  return NextResponse.redirect(new URL(next, getSiteUrl()));
}
