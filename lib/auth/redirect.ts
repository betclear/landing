export function authCallbackUrl(nextPath: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
          /\/$/,
          "",
        );

  return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}
