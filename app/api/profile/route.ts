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
import { resolveInstallIdentity } from "@/lib/stripe/access";
import { getOrCreateDeviceInstall } from "@/lib/devices/installs";
import { dohUrlForClient } from "@/lib/dns/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PROFILE_HEADERS = {
  "Content-Type": "application/x-apple-aspen-config",
  "Content-Disposition": 'attachment; filename="BetClear.mobileconfig"',
  "Cache-Control": "no-store",
} as const;

function signingFailureResponse(message: string, status: number) {
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
  const accessToken = new URL(request.url).searchParams.get("access");
  const identity = await resolveInstallIdentity(accessToken);
  if (!identity) {
    return NextResponse.json(
      {
        error: "Active subscription required",
        checkoutUrl: "/pricing",
      },
      { status: 402 },
    );
  }

  let dohUrl: string;
  try {
    const install = await getOrCreateDeviceInstall({
      userId: identity.userId,
      stripeCustomerId: identity.stripeCustomerId,
      platform: "ios",
      ensureAdGuard: true,
    });
    dohUrl = dohUrlForClient(install.client_id);
  } catch (error) {
    console.error("[api/profile] device install failed", error);
    return NextResponse.json(
      {
        error: "device_install_failed",
        message: "Unable to prepare your protection profile. Please try again.",
      },
      { status: 503 },
    );
  }

  const unsignedXml = generateMobileConfig(dohUrl);

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
