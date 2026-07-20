import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  writeFile,
  access,
  constants,
} from "node:fs/promises";
import path from "node:path";
import type { CachedSourceMeta } from "@/blocklists/types";

function safeProviderId(providerId: string): string {
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(providerId)) {
    throw new Error(`Unsafe provider id: ${providerId}`);
  }
  return providerId.toLowerCase();
}

export function cachePaths(cacheDirectory: string, providerId: string) {
  const id = safeProviderId(providerId);
  const dir = path.resolve(cacheDirectory, id);
  return {
    dir,
    bodyPath: path.join(dir, "body.txt"),
    metaPath: path.join(dir, "meta.json"),
  };
}

export async function ensureCacheDir(cacheDirectory: string): Promise<void> {
  await mkdir(path.resolve(cacheDirectory), { recursive: true });
}

export async function readCache(
  cacheDirectory: string,
  providerId: string,
): Promise<{ body: string; meta: CachedSourceMeta } | null> {
  const { bodyPath, metaPath } = cachePaths(cacheDirectory, providerId);
  try {
    await access(bodyPath, constants.R_OK);
    await access(metaPath, constants.R_OK);
    const [body, metaRaw] = await Promise.all([
      readFile(bodyPath, "utf8"),
      readFile(metaPath, "utf8"),
    ]);
    const meta = JSON.parse(metaRaw) as CachedSourceMeta;
    return { body, meta };
  } catch {
    return null;
  }
}

export async function writeCache(
  cacheDirectory: string,
  providerId: string,
  body: string,
  meta: CachedSourceMeta,
): Promise<void> {
  const { dir, bodyPath, metaPath } = cachePaths(cacheDirectory, providerId);
  await mkdir(dir, { recursive: true });
  await writeFile(bodyPath, body, "utf8");
  await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
}

export function isCacheFresh(
  meta: CachedSourceMeta,
  maxAgeHours: number,
): boolean {
  const fetched = Date.parse(meta.fetchedAt);
  if (Number.isNaN(fetched)) return false;
  const ageMs = Date.now() - fetched;
  return ageMs <= maxAgeHours * 60 * 60 * 1000;
}

export function sha256Hex(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}
