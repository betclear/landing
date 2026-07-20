import { hageziProvider } from "@/blocklists/providers/hagezi";
import { blockListProjectProvider } from "@/blocklists/providers/blocklist-project";
import { acmaProvider } from "@/blocklists/providers/acma";
import { customProvider } from "@/blocklists/providers/custom";
import type { BlocklistProvider } from "@/blocklists/types";

/**
 * Register providers here. Adding a future source only requires a new
 * provider file and an entry in this array.
 */
export const providers: BlocklistProvider[] = [
  hageziProvider,
  blockListProjectProvider,
  acmaProvider,
  customProvider,
];
