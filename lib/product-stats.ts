import { readFile } from "node:fs/promises";
import path from "node:path";

export type ProductStats = {
  domainCount: number;
  domainCountLabel: string;
  generatedAt: string | null;
  sourcesSucceeded: number;
};

function formatDomainCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }
  if (count >= 1_000) {
    const rounded = Math.floor(count / 1_000) * 1_000;
    return `${rounded.toLocaleString("en-US")}+`;
  }
  return count.toLocaleString("en-US");
}

export async function getProductStats(): Promise<ProductStats> {
  try {
    const filePath = path.join(process.cwd(), "output", "metadata.json");
    const raw = await readFile(filePath, "utf8");
    const metadata = JSON.parse(raw) as {
      generatedAt?: string;
      merge?: { finalDomainCount?: number };
      sources?: Array<{ status?: string }>;
    };

    const domainCount = metadata.merge?.finalDomainCount ?? 0;
    const sourcesSucceeded =
      metadata.sources?.filter(
        (source) =>
          source.status === "success" || source.status === "success_stale_cache",
      ).length ?? 0;

    return {
      domainCount,
      domainCountLabel: formatDomainCount(domainCount),
      generatedAt: metadata.generatedAt ?? null,
      sourcesSucceeded,
    };
  } catch {
    return {
      domainCount: 0,
      domainCountLabel: "Growing",
      generatedAt: null,
      sourcesSucceeded: 0,
    };
  }
}
