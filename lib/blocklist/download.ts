import { blocklistConfig } from "@/config/blocklist.config";
import { isCacheFresh, readCache, writeCache } from "@/lib/blocklist/cache";
import { createLogger } from "@/lib/blocklist/logger";
import type { DownloadResult } from "@/blocklists/types";

const log = createLogger("download");

export interface DownloadOptions {
  providerId: string;
  sourceUrl: string;
  cacheDirectory: string;
  forceRefresh?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
  maxRetries?: number;
  maxResponseBytes?: number;
  cacheMaxAgeHours?: number;
  userAgent?: string;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Aborted"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new Error("Aborted"));
      },
      { once: true },
    );
  });
}

function shouldRetry(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const asInt = Number(header);
  if (!Number.isNaN(asInt)) return asInt * 1000;
  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return null;
}

async function readBodyWithLimit(
  response: Response,
  maxBytes: number,
): Promise<string> {
  if (!response.body) {
    const text = await response.text();
    if (Buffer.byteLength(text, "utf8") > maxBytes) {
      throw new Error(`Response exceeded ${maxBytes} bytes`);
    }
    return text;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`Response exceeded ${maxBytes} bytes`);
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
}

export async function downloadText(
  options: DownloadOptions,
): Promise<DownloadResult> {
  const {
    providerId,
    sourceUrl,
    cacheDirectory,
    forceRefresh = false,
    signal,
    timeoutMs = blocklistConfig.timeoutMs,
    maxRetries = blocklistConfig.maxRetries,
    maxResponseBytes = blocklistConfig.maxResponseBytes,
    cacheMaxAgeHours = blocklistConfig.cacheMaxAgeHours,
    userAgent = blocklistConfig.userAgent,
  } = options;

  const cached = await readCache(cacheDirectory, providerId);
  if (cached && !forceRefresh && isCacheFresh(cached.meta, cacheMaxAgeHours)) {
    return {
      body: cached.body,
      status: 200,
      fromCache: true,
      staleCache: false,
      etag: cached.meta.etag,
      lastModified: cached.meta.lastModified,
      sourceUrl: cached.meta.sourceUrl,
      fetchedAt: cached.meta.fetchedAt,
    };
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort);

    try {
      const headers: Record<string, string> = {
        "User-Agent": userAgent,
        Accept: "text/plain,text/html,application/octet-stream,*/*",
      };

      if (cached?.meta.etag) {
        headers["If-None-Match"] = cached.meta.etag;
      }
      if (cached?.meta.lastModified) {
        headers["If-Modified-Since"] = cached.meta.lastModified;
      }

      const response = await fetch(sourceUrl, {
        headers,
        signal: controller.signal,
        redirect: "follow",
      });

      if (response.status === 304 && cached) {
        const fetchedAt = new Date().toISOString();
        await writeCache(cacheDirectory, providerId, cached.body, {
          ...cached.meta,
          fetchedAt,
          sourceUrl,
        });
        return {
          body: cached.body,
          status: 304,
          fromCache: true,
          staleCache: false,
          etag: cached.meta.etag,
          lastModified: cached.meta.lastModified,
          sourceUrl,
          fetchedAt,
        };
      }

      if (!response.ok) {
        if (shouldRetry(response.status) && attempt < maxRetries) {
          const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
          const backoff = retryAfter ?? 500 * 2 ** attempt;
          log.warn("retrying download", { providerId, status: response.status, backoff });
          await sleep(backoff, signal);
          continue;
        }
        throw new Error(`HTTP ${response.status} for ${sourceUrl}`);
      }

      const body = await readBodyWithLimit(response, maxResponseBytes);
      const fetchedAt = new Date().toISOString();
      const etag = response.headers.get("etag") ?? undefined;
      const lastModified = response.headers.get("last-modified") ?? undefined;

      await writeCache(cacheDirectory, providerId, body, {
        sourceUrl,
        fetchedAt,
        etag,
        lastModified,
        contentType: response.headers.get("content-type") ?? undefined,
        byteLength: Buffer.byteLength(body, "utf8"),
      });

      return {
        body,
        status: response.status,
        fromCache: false,
        staleCache: false,
        etag,
        lastModified,
        sourceUrl,
        fetchedAt,
      };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const backoff = 500 * 2 ** attempt;
        log.warn("download error, retrying", {
          providerId,
          attempt,
          message: error instanceof Error ? error.message : "unknown",
        });
        await sleep(backoff, signal);
        continue;
      }
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", onAbort);
    }
  }

  if (cached) {
    log.warn("using stale cache after download failure", { providerId });
    return {
      body: cached.body,
      status: 0,
      fromCache: true,
      staleCache: true,
      etag: cached.meta.etag,
      lastModified: cached.meta.lastModified,
      sourceUrl: cached.meta.sourceUrl,
      fetchedAt: cached.meta.fetchedAt,
    };
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to download ${sourceUrl}`);
}
