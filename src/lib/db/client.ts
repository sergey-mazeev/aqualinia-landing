import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { getDbPath } from "@/lib/env";
import * as schema from "./schema";

export type Db = BetterSQLite3Database<typeof schema>;

const cache = globalThis as typeof globalThis & { __leadsDb?: { db: Db; file: string } };

/**
 * Opens the database lazily (never at import time, so `next build` needs no DB),
 * applies pending migrations once and reuses the connection across hot reloads.
 */
export function getDb(): Db {
  const file = getDbPath();
  if (cache.__leadsDb?.file === file) return cache.__leadsDb.db;

  if (file !== ":memory:") mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 5000");

  const db = drizzle(sqlite, { schema });
  migrate(db, {
    migrationsFolder: process.env.MIGRATIONS_DIR || path.join(process.cwd(), "drizzle"),
  });

  cache.__leadsDb = { db, file };
  return db;
}
