# BetClear Gambling Blocklist Pipeline

Automates download, parse, normalize, merge, validate, and export of gambling-related domains for BetClear DNS filtering.

## What it does

1. Fetches enabled public providers (HaGeZi, Block List Project, ACMA).
2. Reads BetClear custom domains from `data/custom/gambling-domains.txt`.
3. Normalizes and validates every entry.
4. Merges, deduplicates, applies allowlist rules.
5. Writes deterministic `output/gambling.txt` plus metadata/reports.

Public blocklists may contain **false positives**. Maintain `data/custom/allowlist.txt` and review provider changes. This pipeline does **not** claim to block every gambling website.

## Supported providers

| ID | Name | Network |
|---|---|---|
| `hagezi` | HaGeZi Gambling | Yes |
| `block-list-project` | Block List Project Gambling | Yes |
| `acma` | ACMA Illegal Gambling | Yes (HTML) |
| `custom` | BetClear Custom | No |

Register new providers in `blocklists/sources.ts`.

## Local usage

```bash
npm install
npm test
npm run blocklist:update
npm run blocklist:check
```

Also works with pnpm:

```bash
pnpm blocklist:update
pnpm blocklist:check
```

Flags:

```bash
npm run blocklist:update -- --force
npm run blocklist:update -- --allow-large-drop
```

## Custom domains

Edit `data/custom/gambling-domains.txt`:

```text
# comment
examplebet.ge
https://casino.example.com/path
*.crypto-casino.example
```

## Allowlist

Edit `data/custom/allowlist.txt`:

```text
# exact host only
support.example.com

# host + all subdomains
.example.com
```

## Adding a provider

1. Create `blocklists/providers/my-provider.ts` implementing `BlocklistProvider`.
2. Register it in `blocklists/sources.ts`.
3. Add fixture tests under `tests/`.

## Cache behavior

Downloads are cached under `.cache/blocklists/` (gitignored).

- Fresh cache reused within 48 hours (configurable).
- Conditional requests use `ETag` / `Last-Modified`.
- On network failure, stale cache may be used and marked in metadata.
- `--force` bypasses fresh-cache short-circuit.

## Failure behavior

- Providers fail independently.
- Pipeline requires at least 2 successful providers and ≥ 1000 final domains.
- Catastrophic count drops (>40% vs previous metadata) abort unless `--allow-large-drop`.
- Custom provider failures abort the run.
- Outputs are written atomically (temp → rename).

## Outputs

| File | Purpose |
|---|---|
| `output/gambling.txt` | Final sorted domain list |
| `output/metadata.json` | Counts, checksum, source status |
| `output/source-report.json` | Overlap / uniqueness samples |
| `output/rejected.txt` | Sample rejected entries |

## GitHub Action

`.github/workflows/update-gambling-blocklist.yml` runs daily at 03:17 UTC, on manual dispatch, and when pipeline files change. It tests, updates, checks integrity, uploads artifacts, and commits output when changed (`chore(blocklist): update gambling domains`).

## Licensing / attribution

Upstream lists remain under their respective licenses (HaGeZi, Block List Project, ACMA public pages). Keep attribution in operational docs when redistributing derived lists.
