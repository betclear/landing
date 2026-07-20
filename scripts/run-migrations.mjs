import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;

const ENV_FILES = [".env.local", ".env"];

function loadEnv() {
  for (const file of ENV_FILES) {
    const envPath = join(process.cwd(), file);
    if (!existsSync(envPath)) continue;

    readFileSync(envPath, "utf8")
      .split("\n")
      .forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;

        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (!match) return;

        const key = match[1].trim();
        let value = match[2].trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      });
  }
}

function getProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Set it in .env or .env.local (see .env.example).",
    );
  }

  const match = url.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  if (!match) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL: ${url}. Expected https://<project-ref>.supabase.co`,
    );
  }

  return match[1];
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) {
    throw new Error(
      "Missing DATABASE_URL or SUPABASE_DB_PASSWORD. Get the database password from Supabase Dashboard → Project Settings → Database.",
    );
  }

  const projectRef = getProjectRef();
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;
}

async function ensureMigrationTable(client) {
  await client.query(`
    create table if not exists public.schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    );
  `);
}

async function hasAppliedMigration(client, filename) {
  const result = await client.query(
    "select 1 from public.schema_migrations where filename = $1 limit 1",
    [filename],
  );
  return result.rowCount > 0;
}

async function recordMigration(client, filename) {
  await client.query(
    "insert into public.schema_migrations (filename) values ($1) on conflict do nothing",
    [filename],
  );
}

async function main() {
  loadEnv();

  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const client = new Client({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await ensureMigrationTable(client);

    for (const file of files) {
      if (await hasAppliedMigration(client, file)) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = readFileSync(join(migrationsDir, file), "utf8");
      console.log(`Running ${file}...`);
      await client.query(sql);
      await recordMigration(client, file);
      console.log(`Applied ${file}`);
    }
  } finally {
    await client.end();
  }

  console.log("Migrations complete.");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
