import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;

function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env");
    readFileSync(envPath, "utf8")
      .split("\n")
      .forEach((line) => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) process.env[match[1].trim()] = match[2].trim();
      });
  } catch {
    // .env is optional if vars are already exported
  }
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectRef = process.env.SUPABASE_PROJECT_REF ?? "sznbidzvquwinoplbumv";

  if (!password) {
    throw new Error(
      "Missing DATABASE_URL or SUPABASE_DB_PASSWORD. Get the database password from Supabase Dashboard → Project Settings → Database.",
    );
  }

  return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;
}

async function tableExists(client, tableName) {
  const result = await client.query(
    `select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = $1
    ) as exists`,
    [tableName],
  );

  return Boolean(result.rows[0]?.exists);
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
    for (const file of files) {
      const tableName = file.includes("stripe_subscriptions")
        ? "subscriptions"
        : file.includes("blocked_domains")
          ? "blocked_domains"
          : null;

      if (tableName && (await tableExists(client, tableName))) {
        console.log(`Skipping ${file} (${tableName} already exists)`);
        continue;
      }

      const sql = readFileSync(join(migrationsDir, file), "utf8");
      console.log(`Running ${file}...`);
      await client.query(sql);
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
