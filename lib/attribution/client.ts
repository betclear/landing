import type { ClickAttribution } from "@/lib/attribution/metadata";

export function getClickAttribution(): ClickAttribution {
  if (typeof window === "undefined") {
    return { gclid: "", gbraid: "", wbraid: "" };
  }

  return (
    window.BetClearAttribution?.all?.() ?? { gclid: "", gbraid: "", wbraid: "" }
  );
}
