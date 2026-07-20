import { createPrivateKey } from "node:crypto";
import { Crypto } from "@peculiar/webcrypto";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import type { ProfileSigningCredentials } from "@/lib/profile/credentials";

export class ProfileSigningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileSigningError";
  }
}

const webCrypto = new Crypto();
pkijs.setEngine(
  "betclear",
  new pkijs.CryptoEngine({
    name: "betclear",
    crypto: webCrypto,
  }),
);

function pemBlocks(pem: string, label: string): Buffer[] {
  const re = new RegExp(
    `-----BEGIN ${label}-----[\\s\\S]+?-----END ${label}-----`,
    "g",
  );
  const blocks = pem.match(re);
  if (!blocks?.length) {
    throw new ProfileSigningError(`No PEM ${label} blocks found.`);
  }
  return blocks.map((block) => {
    const b64 = block
      .replace(new RegExp(`-----BEGIN ${label}-----`), "")
      .replace(new RegExp(`-----END ${label}-----`), "")
      .replace(/\s+/g, "");
    return Buffer.from(b64, "base64");
  });
}

function parseCertificates(pem: string): pkijs.Certificate[] {
  return pemBlocks(pem, "CERTIFICATE").map((der) =>
    pkijs.Certificate.fromBER(der),
  );
}

async function importSigningKey(keyPem: string): Promise<CryptoKey> {
  let keyObject;
  try {
    keyObject = createPrivateKey(keyPem);
  } catch {
    throw new ProfileSigningError(
      "Unable to parse PROFILE_SIGNING_KEY as a PEM private key.",
    );
  }

  const pkcs8 = keyObject.export({ type: "pkcs8", format: "der" });
  const type = keyObject.asymmetricKeyType;

  if (type === "rsa") {
    return webCrypto.subtle.importKey(
      "pkcs8",
      pkcs8,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }

  if (type === "ec") {
    const nodeCurve = keyObject.asymmetricKeyDetails?.namedCurve || "P-256";
    // Node reports OpenSSL curve names; WebCrypto expects NIST names.
    const namedCurve =
      (
        {
          prime256v1: "P-256",
          secp256r1: "P-256",
          secp384r1: "P-384",
          secp521r1: "P-521",
        } as Record<string, string>
      )[nodeCurve] || nodeCurve;

    return webCrypto.subtle.importKey(
      "pkcs8",
      pkcs8,
      { name: "ECDSA", namedCurve },
      false,
      ["sign"],
    );
  }

  throw new ProfileSigningError(
    `Unsupported private key type "${type}". Use RSA or EC (P-256) keys.`,
  );
}

function extractEncapsulatedContent(signedData: pkijs.SignedData): string {
  const eContent = signedData.encapContentInfo.eContent;
  if (!eContent) {
    throw new ProfileSigningError("Signed profile is missing embedded content.");
  }

  // eContent may be a single OCTET STRING or a constructed one.
  const hex = eContent.getValue();
  return Buffer.from(hex).toString("utf8");
}

/**
 * Signs an unsigned .mobileconfig as CMS/PKCS#7 DER (non-detached).
 *
 * Pure JS (pkijs + WebCrypto) so it works on Vercel without the OpenSSL CLI.
 * Supports RSA and ECDSA keys (Let's Encrypt defaults to ECDSA).
 */
export async function signMobileConfig(
  unsignedXml: string,
  credentials: ProfileSigningCredentials,
): Promise<Buffer> {
  try {
    const leafCerts = parseCertificates(credentials.certPem);
    const leaf = leafCerts[0];
    if (!leaf) {
      throw new ProfileSigningError("PROFILE_SIGNING_CERT is missing a certificate.");
    }

    const chain = credentials.chainPem
      ? parseCertificates(credentials.chainPem)
      : [];
    const privateKey = await importSigningKey(credentials.keyPem);
    const data = Buffer.from(unsignedXml, "utf8");

    const cmsSigned = new pkijs.SignedData({
      version: 1,
      encapContentInfo: new pkijs.EncapsulatedContentInfo({
        eContentType: pkijs.ContentInfo.DATA,
        eContent: new asn1js.OctetString({ valueHex: data }),
      }),
      signerInfos: [
        new pkijs.SignerInfo({
          version: 1,
          sid: new pkijs.IssuerAndSerialNumber({
            issuer: leaf.issuer,
            serialNumber: leaf.serialNumber,
          }),
        }),
      ],
      certificates: [leaf, ...chain],
    });

    await cmsSigned.sign(privateKey, 0, "SHA-256");

    const cms = new pkijs.ContentInfo({
      contentType: pkijs.ContentInfo.SIGNED_DATA,
      content: cmsSigned.toSchema(true),
    });

    return Buffer.from(cms.toSchema().toBER(false));
  } catch (error) {
    if (error instanceof ProfileSigningError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "unknown error";
    throw new ProfileSigningError(`CMS profile signing failed: ${message}`);
  }
}

/**
 * Verifies a CMS/PKCS#7 DER-signed mobileconfig before serving it.
 * Confirms cryptographic signature validity and embedded payload match.
 */
export async function verifySignedMobileConfig(
  signedDer: Buffer,
  expectedUnsignedXml: string,
  credentials?: ProfileSigningCredentials,
): Promise<void> {
  try {
    const cms = pkijs.ContentInfo.fromBER(signedDer);
    if (cms.contentType !== pkijs.ContentInfo.SIGNED_DATA) {
      throw new ProfileSigningError("Profile is not CMS SignedData.");
    }

    const signedData = new pkijs.SignedData({ schema: cms.content });
    const extracted = extractEncapsulatedContent(signedData);
    if (extracted !== expectedUnsignedXml) {
      throw new ProfileSigningError(
        "Signed profile content does not match the generated unsigned profile.",
      );
    }

    const trustedCerts = credentials
      ? [
          ...parseCertificates(credentials.certPem),
          ...(credentials.chainPem
            ? parseCertificates(credentials.chainPem)
            : []),
        ]
      : undefined;

    const ok = await signedData.verify({
      signer: 0,
      checkChain: false,
      trustedCerts,
    });

    if (!ok) {
      throw new ProfileSigningError("Signed profile CMS signature is invalid.");
    }
  } catch (error) {
    if (error instanceof ProfileSigningError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "unknown error";
    throw new ProfileSigningError(
      `Signed profile failed CMS verification: ${message}`,
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
  await verifySignedMobileConfig(signed, unsignedXml, credentials);
  return signed;
}
