import { NextResponse } from "next/server";
import { hasPaywallAccess } from "@/lib/stripe/access";
import { isStripeConfigured } from "@/lib/stripe/client";
import { generateMobileConfig } from "@/lib/profile/generate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (isStripeConfigured()) {
    const accessToken = new URL(request.url).searchParams.get("access");
    const allowed = await hasPaywallAccess(accessToken);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Active subscription required",
          checkoutUrl: "/pricing",
        },
        { status: 402 },
      );
    }
  }

  const profile = generateMobileConfig();

  return new NextResponse(profile, {
    status: 200,
    headers: {
      "Content-Type": "application/x-apple-aspen-config",
      "Content-Disposition": 'attachment; filename="BetClear.mobileconfig"',
      "Cache-Control": "no-store",
    },
  });
}
