export function reportSignupAttribution(): void {
  if (typeof window === "undefined") return;

  void fetch("/api/attribution/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      window.BetClearAttribution?.all?.() ?? {
        gclid: "",
        gbraid: "",
        wbraid: "",
      },
    ),
    keepalive: true,
  }).catch(() => {
    // Non-blocking; signup must not break auth flow.
  });
}
