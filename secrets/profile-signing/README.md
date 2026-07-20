# Apple configuration profile signing material

Place the certificate materials used to CMS/PKCS#7-sign `BetClear.mobileconfig` in this directory (or configure equivalent env vars / absolute paths — see the root README).

## Required files

| File | Purpose |
|---|---|
| `cert.pem` | Leaf certificate (PEM). Shown as the profile signer on iOS when trusted. |
| `key.pem` | Matching private key (PEM). **Never commit, log, or expose this file.** |
| `chain.pem` | Optional. Intermediate (and root if needed) certificates in PEM, concatenated. |

Example layout:

```text
secrets/profile-signing/
  cert.pem
  key.pem
  chain.pem   # optional
```

These filenames are the defaults when `PROFILE_SIGNING_DIR` points here (the app default).

## Permissions

```bash
chmod 600 secrets/profile-signing/key.pem
chmod 644 secrets/profile-signing/cert.pem secrets/profile-signing/chain.pem
```

## Do not commit secrets

`*.pem` files are gitignored. Only this README should be tracked under this folder.

## Certificate guidance

- Use a certificate whose **Subject / Organization** matches the brand you want iOS to display (e.g. `BetClear`).
- For production installs that show a trusted signer (not “Not Signed”), use a certificate issued by a CA trusted on iOS, plus the full intermediate chain in `chain.pem`.
- Self-signed certificates still produce a cryptographically signed profile (useful for local testing) but iOS will not treat the signer as trusted.
- Apple Developer / MDM distribution certificates are appropriate when you already have an Apple signing identity; a standard publicly trusted TLS/code-signing-style identity with the right EKU can also work depending on your CA and deployment model. Validate on a real iPhone before shipping.

## Generating a local test identity (not for production)

```bash
openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
  -keyout secrets/profile-signing/key.pem \
  -out secrets/profile-signing/cert.pem \
  -subj "/CN=BetClear Dev/O=BetClear/C=US"
```

Then open `/api/profile` — the response should be DER-signed CMS, not raw XML.
