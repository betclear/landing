export interface ProviderContext {
  signal?: AbortSignal;
  cacheDirectory: string;
  forceRefresh: boolean;
}

export interface ProviderResult {
  providerId: string;
  providerName: string;
  sourceUrl?: string;
  fetchedAt: string;
  rawEntryCount: number;
  domains: string[];
  warnings: string[];
  usedCache: boolean;
}

export interface BlocklistProvider {
  id: string;
  name: string;
  sourceUrl?: string;
  enabled: boolean;
  fetchDomains(context: ProviderContext): Promise<ProviderResult>;
}

export type ProviderStatus =
  | "success"
  | "success_stale_cache"
  | "failed"
  | "disabled";

export interface RejectedEntry {
  providerId: string;
  reason: string;
  original: string;
}

export interface NormalizedDomainResult {
  domain: string | null;
  reason?: string;
}

export interface MergeResult {
  domains: string[];
  attribution: Map<string, Set<string>>;
  validEntriesBeforeDeduplication: number;
  duplicatesRemoved: number;
  domainsBeforeAllowlist: number;
  allowlistRules: number;
  allowlistMatchesRemoved: number;
  allowlistRemovedSample: string[];
}

export interface SourceMetadata {
  id: string;
  name: string;
  sourceUrl?: string;
  status: ProviderStatus;
  usedCache: boolean;
  rawEntries: number;
  validDomains: number;
  rejectedEntries: number;
  uniqueContributions: number;
  warnings: string[];
}

export interface BlocklistMetadata {
  schemaVersion: 1;
  generatedAt: string;
  durationMs: number;
  success: boolean;
  usedStaleCache: boolean;
  sources: SourceMetadata[];
  merge: {
    validEntriesBeforeDeduplication: number;
    duplicatesRemoved: number;
    domainsBeforeAllowlist: number;
    allowlistRules: number;
    allowlistMatchesRemoved: number;
    finalDomainCount: number;
  };
  output: {
    file: string;
    sha256: string;
  };
}

export interface CachedSourceMeta {
  sourceUrl: string;
  fetchedAt: string;
  etag?: string;
  lastModified?: string;
  contentType?: string;
  byteLength: number;
}

export interface DownloadResult {
  body: string;
  status: number;
  fromCache: boolean;
  staleCache: boolean;
  etag?: string;
  lastModified?: string;
  sourceUrl: string;
  fetchedAt: string;
}
