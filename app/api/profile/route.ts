import { NextResponse } from "next/server";
import {
  loadProfileSigningCredentials,
  ProfileSigningConfigError,
} from "@/lib/profile/credentials";
import { generateMobileConfig } from "@/lib/profile/generate";
import {
  ProfileSigningError,
  signAndVerifyMobileConfig,
} from "@/lib/profile/sign";
import { hasPaywallAccess } from "@/lib/stripe/access";
import { isStripeConfigured } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROFILE_HEADERS = {
  "Content-Type": "application/x-apple-aspen-config",
  "Content-Disposition": 'attachment; filename="BetClear.mobileconfig"',
  "Cache-Control": "no-store",
} as const;

function signingFailureResponse(message: string, status: number) {
  // Never include private key material; callers only get a safe public error.
  console.error(`[api/profile] ${message}`);
  return NextResponse.json(
    {
      error: "profile_signing_failed",
      message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: Request) {
  if (isStripeConfigured()) {
    const accessToken = new URL(request.url).searchParams.get("access");
    const allowed = await hasPaywallAccess(accessToken);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Active subscription required",
          checkoutUrl: "/onboarding/pricing",
        },
        { status: 402 },
      );
    }
  }

  const unsignedXml = generateMobileConfig();

  let credentials;
  try {
    credentials = await loadProfileSigningCredentials();
  } catch (error) {
    if (error instanceof ProfileSigningConfigError) {
      return signingFailureResponse(error.message, 503);
    }
    return signingFailureResponse(
      "Unable to load profile signing credentials.",
      503,
    );
  }

  try {
    const signedDer = await signAndVerifyMobileConfig(unsignedXml, credentials);
    return new NextResponse(new Uint8Array(signedDer), {
      status: 200,
      headers: PROFILE_HEADERS,
    });
  } catch (error) {
    if (error instanceof ProfileSigningError) {
      return signingFailureResponse(error.message, 500);
    }
    return signingFailureResponse(
      "Unexpected error while signing the configuration profile.",
      500,
    );
  }
}
