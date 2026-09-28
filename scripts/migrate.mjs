// Applies pending migrations. Runs in the Vercel build (see vercel.json); the app also
// applies them on first database access.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  `file:${process.env.DATABASE_PATH || "./data/leads.db"}`;
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || undefined;

if (url.startsWith("file:")) mkdirSync(path.dirname(path.resolve(url.slice(5))), { recursive: true });
const client = createClient({ url, authToken });
await migrate(drizzle(client), { migrationsFolder: process.env.MIGRATIONS_DIR || "./drizzle" });
client.close();
console.log(`Migrations applied to ${url.startsWith("file:") ? url : new URL(url).host}`);
