import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { downloadText } from "@/lib/blocklist/download";
import { writeCache } from "@/lib/blocklist/cache";

describe("downloadText", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("downloads and caches a response", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "bl-cache-"));
    globalThis.fetch = vi.fn(async () => {
      return new Response("example.com\n", {
        status: 200,
        headers: { etag: '"abc"', "content-type": "text/plain" },
      });
    }) as typeof fetch;

    const result = await downloadText({
      providerId: "testprov",
      sourceUrl: "https://example.test/list.txt",
      cacheDirectory: dir,
      forceRefresh: true,
      maxRetries: 0,
    });

    expect(result.body).toContain("example.com");
    expect(result.fromCache).toBe(false);
    await rm(dir, { recursive: true, force: true });
  });

  it("uses stale cache when network fails", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "bl-cache-"));
    await writeCache(dir, "staleprov", "cached.com\n", {
      sourceUrl: "https://example.test/list.txt",
      fetchedAt: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
      byteLength: 11,
    });

    globalThis.fetch = vi.fn(async () => {
      throw new Error("network down");
    }) as typeof fetch;

    const result = await downloadText({
      providerId: "staleprov",
      sourceUrl: "https://example.test/list.txt",
      cacheDirectory: dir,
      forceRefresh: true,
      maxRetries: 0,
    });

    expect(result.staleCache).toBe(true);
    expect(result.body).toContain("cached.com");
    await rm(dir, { recursive: true, force: true });
  });

  it("rejects oversized responses", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "bl-cache-"));
    globalThis.fetch = vi.fn(async () => {
      return new Response("x".repeat(1000), { status: 200 });
    }) as typeof fetch;

    await expect(
      downloadText({
        providerId: "bigprov",
        sourceUrl: "https://example.test/big.txt",
        cacheDirectory: dir,
        forceRefresh: true,
        maxRetries: 0,
        maxResponseBytes: 100,
      }),
    ).rejects.toThrow(/exceeded/);

    await rm(dir, { recursive: true, force: true });
  });
});
