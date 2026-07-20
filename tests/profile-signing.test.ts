import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadProfileSigningCredentials,
  ProfileSigningConfigError,
} from "@/lib/profile/credentials";
import { generateMobileConfig } from "@/lib/profile/generate";
import {
  signAndVerifyMobileConfig,
  signMobileConfig,
  verifySignedMobileConfig,
} from "@/lib/profile/sign";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, ORIGINAL_ENV);
  delete process.env.PROFILE_SIGNING_CERT;
  delete process.env.PROFILE_SIGNING_KEY;
  delete process.env.PROFILE_SIGNING_CHAIN;
  delete process.env.PROFILE_SIGNING_CERT_PATH;
  delete process.env.PROFILE_SIGNING_KEY_PATH;
  delete process.env.PROFILE_SIGNING_CHAIN_PATH;
  delete process.env.PROFILE_SIGNING_DIR;
});

function generateSelfSignedPem(): { certPem: string; keyPem: string } {
  // Write the key to a temp file — OpenSSL on GitHub ubuntu runners cannot
  // load private keys from /dev/stdin ("No such device or address").
  const dir = mkdtempSync(path.join(tmpdir(), "betclear-openssl-"));
  const keyPath = path.join(dir, "key.pem");
  const certPath = path.join(dir, "cert.pem");

  try {
    const key = spawnSync(
      "openssl",
      ["genrsa", "-out", keyPath, "2048"],
      { encoding: "buffer", maxBuffer: 1024 * 1024 },
    );
    if (key.status !== 0) {
      throw new Error(`openssl genrsa failed: ${key.stderr.toString()}`);
    }

    const cert = spawnSync(
      "openssl",
      [
        "req",
        "-new",
        "-x509",
        "-key",
        keyPath,
        "-out",
        certPath,
        "-sha256",
        "-days",
        "1",
        "-subj",
        "/CN=BetClear Test/O=BetClear/C=US",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 },
    );
    if (cert.status !== 0) {
      throw new Error(`openssl req failed: ${cert.stderr.toString()}`);
    }

    return {
      keyPem: readFileSync(keyPath, "utf8"),
      certPem: readFileSync(certPath, "utf8"),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("profile signing", () => {
  it("keeps the DNS-over-HTTPS payload in the unsigned XML", () => {
    const xml = generateMobileConfig();
    expect(xml).toContain("com.apple.dnsSettings.managed");
    expect(xml).toContain("https://dns.betclear.app/dns-query");
    expect(xml).toContain("<string>HTTPS</string>");
    expect(xml.startsWith("<?xml")).toBe(true);
  });

  it("signs with OpenSSL CMS DER and verifies embedded content", async () => {
    const { certPem, keyPem } = generateSelfSignedPem();
    const unsigned = generateMobileConfig();

    const signed = await signAndVerifyMobileConfig(unsigned, {
      certPem,
      keyPem,
      chainPem: null,
    });

    expect(Buffer.isBuffer(signed)).toBe(true);
    expect(signed.length).toBeGreaterThan(unsigned.length);
    // DER CMS is binary — must not look like raw plist XML.
    expect(signed.subarray(0, 5).toString("utf8")).not.toBe("<?xml");
  });

  it("rejects verification when content was tampered after signing", async () => {
    const { certPem, keyPem } = generateSelfSignedPem();
    const unsigned = generateMobileConfig();
    const signed = await signMobileConfig(unsigned, {
      certPem,
      keyPem,
      chainPem: null,
    });

    await expect(
      verifySignedMobileConfig(signed, unsigned + " "),
    ).rejects.toThrow(/does not match/i);
  });

  it("loads credentials from PEM env vars (including literal \\n)", async () => {
    const { certPem, keyPem } = generateSelfSignedPem();
    process.env.PROFILE_SIGNING_CERT = certPem.trim().replace(/\n/g, "\\n");
    process.env.PROFILE_SIGNING_KEY = keyPem.trim().replace(/\n/g, "\\n");

    const loaded = await loadProfileSigningCredentials();
    expect(loaded.certPem).toContain("BEGIN CERTIFICATE");
    expect(loaded.keyPem).toContain("PRIVATE KEY");
    expect(loaded.chainPem).toBeNull();
  });

  it("loads credentials from a mounted directory", async () => {
    const { certPem, keyPem } = generateSelfSignedPem();
    const dir = await mkdtemp(path.join(tmpdir(), "betclear-creds-"));
    try {
      await writeFile(path.join(dir, "cert.pem"), certPem, { mode: 0o600 });
      await writeFile(path.join(dir, "key.pem"), keyPem, { mode: 0o600 });
      process.env.PROFILE_SIGNING_DIR = dir;

      const loaded = await loadProfileSigningCredentials();
      expect(loaded.certPem).toContain("BEGIN CERTIFICATE");
      expect(loaded.keyPem).toContain("PRIVATE KEY");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("fails clearly when signing credentials are missing", async () => {
    process.env.PROFILE_SIGNING_DIR = path.join(
      tmpdir(),
      "betclear-missing-signing-dir",
    );

    await expect(loadProfileSigningCredentials()).rejects.toBeInstanceOf(
      ProfileSigningConfigError,
    );
  });
});
