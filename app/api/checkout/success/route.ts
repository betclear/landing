import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  grantAccessFromCheckoutSession,
} from "@/lib/stripe/access";
import { isStripeConfigured } from "@/lib/stripe/client";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";
import { getStripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function localeFromSession(sessionId: string): Promise<AppLocale> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const raw = session.metadata?.locale;
    if (raw && isAppLocale(raw)) return raw;
  } catch {
    // Fall through to English.
  }
  return "en";
}

function redirectWithAccess(
  request: Request,
  token: string,
  locale: AppLocale,
) {
  const path = localizePath(locale, "/install");
  const url = new URL(path, request.url);
  url.searchParams.set("access", token);
  const response = NextResponse.redirect(url);
  response.cookies.set(ACCESS_COOKIE, token, accessCookieOptions());
  return response;
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");

  if (!isStripeConfigured()) {
    return NextResponse.redirect(
      new URL(localizePath("en", "/pricing"), request.url),
    );
  }

  if (!sessionId) {
    return NextResponse.redirect(
      new URL(localizePath("en", "/pricing"), request.url),
    );
  }

  const locale = await localeFromSession(sessionId);

  try {
    const token = await grantAccessFromCheckoutSession(sessionId);
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `${localizePath(locale, "/pricing")}?error=checkout`,
          request.url,
        ),
      );
    }

    return redirectWithAccess(request, token, locale);
  } catch (error) {
    console.error("checkout success error", error);
    return NextResponse.redirect(
      new URL(
        `${localizePath(locale, "/pricing")}?error=checkout`,
        request.url,
      ),
    );
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { sessionId?: string };
    const sessionId = body.sessionId;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const token = await grantAccessFromCheckoutSession(sessionId);
    if (!token) {
      return NextResponse.json(
        { error: "Checkout session is not paid." },
        { status: 402 },
      );
    }

    const response = NextResponse.json({ ok: true, token });
    response.cookies.set(ACCESS_COOKIE, token, accessCookieOptions());
    return response;
  } catch (error) {
    console.error("checkout success post error", error);
    return NextResponse.json(
      { error: "Unable to verify checkout session" },
      { status: 500 },
    );
  }
}
