import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { ProfileSigningCredentials } from "@/lib/profile/credentials";

export class ProfileSigningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileSigningError";
  }
}

type OpenSslResult = {
  stdout: Buffer;
  stderr: string;
  code: number | null;
};

function runOpenSsl(args: string[], input?: Buffer | string): Promise<OpenSslResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("openssl", args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on("error", (error) => {
      reject(
        new ProfileSigningError(
          `Failed to spawn OpenSSL (${error.message}). Ensure the openssl CLI is available on this host.`,
        ),
      );
    });

    child.on("close", (code) => {
      resolve({
        stdout: Buffer.concat(stdoutChunks),
        stderr: Buffer.concat(stderrChunks).toString("utf8").trim(),
        code,
      });
    });

    if (input !== undefined) {
      child.stdin.end(input);
    } else {
      child.stdin.end();
    }
  });
}

/** Sanitize OpenSSL stderr so private key material never appears in logs/errors. */
function sanitizeOpenSslMessage(message: string): string {
  return message
    .replace(/-----BEGIN[\s\S]*?-----END [^-]+-----/g, "[redacted-pem]")
    .replace(/\b(key|private|passphrase|password)\s*[:=]\s*\S+/gi, "$1=[redacted]")
    .slice(0, 500);
}

async function withSigningWorkspace<T>(
  credentials: ProfileSigningCredentials,
  fn: (paths: {
    certPath: string;
    keyPath: string;
    chainPath: string | null;
    workDir: string;
  }) => Promise<T>,
): Promise<T> {
  const workDir = await mkdtemp(path.join(tmpdir(), "betclear-profile-"));
  const certPath = path.join(workDir, "cert.pem");
  const keyPath = path.join(workDir, "key.pem");
  const chainPath = credentials.chainPem
    ? path.join(workDir, "chain.pem")
    : null;

  try {
    await writeFile(certPath, credentials.certPem, { mode: 0o600 });
    await writeFile(keyPath, credentials.keyPem, { mode: 0o600 });
    if (chainPath && credentials.chainPem) {
      await writeFile(chainPath, credentials.chainPem, { mode: 0o600 });
    }

    return await fn({ certPath, keyPath, chainPath, workDir });
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

/**
 * Signs an unsigned .mobileconfig XML payload as CMS/PKCS#7 DER using OpenSSL.
 * Apple installs require a non-detached DER signature.
 */
export async function signMobileConfig(
  unsignedXml: string,
  credentials: ProfileSigningCredentials,
): Promise<Buffer> {
  return withSigningWorkspace(credentials, async ({ certPath, keyPath, chainPath }) => {
    const args = [
      "cms",
      "-sign",
      "-binary",
      "-nodetach",
      "-outform",
      "DER",
      "-md",
      "sha256",
      "-signer",
      certPath,
      "-inkey",
      keyPath,
    ];

    if (chainPath) {
      args.push("-certfile", chainPath);
    }

    const result = await runOpenSsl(args, unsignedXml);

    if (result.code !== 0 || result.stdout.length === 0) {
      throw new ProfileSigningError(
        `OpenSSL CMS sign failed${result.stderr ? `: ${sanitizeOpenSslMessage(result.stderr)}` : "."}`,
      );
    }

    return result.stdout;
  });
}

/**
 * Verifies a CMS/PKCS#7 DER-signed mobileconfig before serving it.
 *
 * Uses `-noverify` so private/self-signed CAs still pass this preflight check;
 * iOS evaluates device trust separately. Still confirms CMS signature validity
 * and that the embedded payload matches the unsigned XML we generated.
 */
export async function verifySignedMobileConfig(
  signedDer: Buffer,
  expectedUnsignedXml: string,
): Promise<void> {
  const result = await runOpenSsl(
    ["cms", "-verify", "-inform", "DER", "-binary", "-noverify"],
    signedDer,
  );

  if (result.code !== 0) {
    throw new ProfileSigningError(
      `Signed profile failed OpenSSL verification${
        result.stderr ? `: ${sanitizeOpenSslMessage(result.stderr)}` : "."
      }`,
    );
  }

  const extracted = result.stdout.toString("utf8");
  if (extracted !== expectedUnsignedXml) {
    throw new ProfileSigningError(
      "Signed profile content does not match the generated unsigned profile.",
    );
  }
}

/**
 * Sign then verify. Returns DER bytes only if verification succeeds.
 */
export async function signAndVerifyMobileConfig(
  unsignedXml: string,
  credentials: ProfileSigningCredentials,
): Promise<Buffer> {
  const signed = await signMobileConfig(unsignedXml, credentials);
  await verifySignedMobileConfig(signed, unsignedXml);
  return signed;
}
