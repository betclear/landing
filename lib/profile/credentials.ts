import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export type ProfileSigningCredentials = {
  /** Leaf certificate PEM used to sign the profile. */
  certPem: string;
  /** Matching private key PEM. Never log or return this value. */
  keyPem: string;
  /** Optional intermediate/root chain PEM (one or more certificates). */
  chainPem: string | null;
};

export class ProfileSigningConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileSigningConfigError";
  }
}

function normalizePem(value: string): string {
  // Vercel / dotenv often store multiline PEMs with literal \n sequences.
  const normalized = value.includes("\\n")
    ? value.replace(/\\n/g, "\n")
    : value;
  return normalized.trim() + "\n";
}

function looksLikePem(value: string, label: "CERTIFICATE" | "PRIVATE KEY"): boolean {
  if (label === "CERTIFICATE") {
    return value.includes("-----BEGIN CERTIFICATE-----");
  }
  return (
    value.includes("-----BEGIN PRIVATE KEY-----") ||
    value.includes("-----BEGIN RSA PRIVATE KEY-----") ||
    value.includes("-----BEGIN EC PRIVATE KEY-----")
  );
}

async function readOptionalFile(filePath: string): Promise<string | null> {
  try {
    await access(filePath, constants.R_OK);
  } catch {
    return null;
  }
  return readFile(filePath, "utf8");
}

async function loadFromDirectory(
  dir: string,
): Promise<ProfileSigningCredentials | null> {
  const certPath = path.join(dir, "cert.pem");
  const keyPath = path.join(dir, "key.pem");
  const chainPath = path.join(dir, "chain.pem");

  const [certPem, keyPem, chainPem] = await Promise.all([
    readOptionalFile(certPath),
    readOptionalFile(keyPath),
    readOptionalFile(chainPath),
  ]);

  if (!certPem && !keyPem) {
    return null;
  }
  if (!certPem || !keyPem) {
    throw new ProfileSigningConfigError(
      `Incomplete signing material in ${dir}: expected both cert.pem and key.pem.`,
    );
  }

  return {
    certPem: normalizePem(certPem),
    keyPem: normalizePem(keyPem),
    chainPem: chainPem ? normalizePem(chainPem) : null,
  };
}

async function loadFromExplicitPaths(): Promise<ProfileSigningCredentials | null> {
  const certPath = process.env.PROFILE_SIGNING_CERT_PATH?.trim();
  const keyPath = process.env.PROFILE_SIGNING_KEY_PATH?.trim();
  const chainPath = process.env.PROFILE_SIGNING_CHAIN_PATH?.trim();

  if (!certPath && !keyPath && !chainPath) {
    return null;
  }
  if (!certPath || !keyPath) {
    throw new ProfileSigningConfigError(
      "Set both PROFILE_SIGNING_CERT_PATH and PROFILE_SIGNING_KEY_PATH (chain path is optional).",
    );
  }

  const [certPem, keyPem, chainPem] = await Promise.all([
    readFile(certPath, "utf8"),
    readFile(keyPath, "utf8"),
    chainPath ? readFile(chainPath, "utf8") : Promise.resolve(null),
  ]);

  return {
    certPem: normalizePem(certPem),
    keyPem: normalizePem(keyPem),
    chainPem: chainPem ? normalizePem(chainPem) : null,
  };
}

function loadFromEnvPem(): ProfileSigningCredentials | null {
  const certRaw = process.env.PROFILE_SIGNING_CERT?.trim();
  const keyRaw = process.env.PROFILE_SIGNING_KEY?.trim();
  const chainRaw = process.env.PROFILE_SIGNING_CHAIN?.trim();

  if (!certRaw && !keyRaw && !chainRaw) {
    return null;
  }
  if (!certRaw || !keyRaw) {
    throw new ProfileSigningConfigError(
      "Set both PROFILE_SIGNING_CERT and PROFILE_SIGNING_KEY (PROFILE_SIGNING_CHAIN is optional).",
    );
  }

  const certPem = normalizePem(certRaw);
  const keyPem = normalizePem(keyRaw);
  const chainPem = chainRaw ? normalizePem(chainRaw) : null;

  if (!looksLikePem(certPem, "CERTIFICATE")) {
    throw new ProfileSigningConfigError(
      "PROFILE_SIGNING_CERT does not look like a PEM certificate.",
    );
  }
  if (!looksLikePem(keyPem, "PRIVATE KEY")) {
    throw new ProfileSigningConfigError(
      "PROFILE_SIGNING_KEY does not look like a PEM private key.",
    );
  }

  return { certPem, keyPem, chainPem };
}

/**
 * Loads Apple profile signing credentials.
 *
 * Precedence:
 * 1. Explicit file paths (PROFILE_SIGNING_*_PATH)
 * 2. PEM contents in env (PROFILE_SIGNING_CERT / KEY / CHAIN)
 * 3. Mounted directory (PROFILE_SIGNING_DIR, default secrets/profile-signing)
 */
export async function loadProfileSigningCredentials(): Promise<ProfileSigningCredentials> {
  const fromPaths = await loadFromExplicitPaths();
  if (fromPaths) {
    return fromPaths;
  }

  const fromEnv = loadFromEnvPem();
  if (fromEnv) {
    return fromEnv;
  }

  const dir =
    process.env.PROFILE_SIGNING_DIR?.trim() ||
    path.join(process.cwd(), "secrets", "profile-signing");
  const fromDir = await loadFromDirectory(dir);
  if (fromDir) {
    return fromDir;
  }

  throw new ProfileSigningConfigError(
    "Profile signing credentials are not configured. Provide PROFILE_SIGNING_CERT + PROFILE_SIGNING_KEY, path variants, or place cert.pem/key.pem under secrets/profile-signing/.",
  );
}
