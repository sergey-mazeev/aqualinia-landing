import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { getDatabaseConfig } from "@/lib/env";
import * as schema from "./schema";

export type Db = LibSQLDatabase<typeof schema>;

type Connection = { url: string; db: Db; ready: Promise<void> };
const cache = globalThis as typeof globalThis & { __leadsDb?: Connection };

/**
 * Local SQLite file (`file:` URL, dev and Docker) or Turso (`libsql://`, Vercel).
 * Opened lazily — never at import time, so `next build` needs no database —
 * with pending migrations applied once per process.
 */
export async function getDb(): Promise<Db> {
  const { url, authToken } = getDatabaseConfig();

  if (cache.__leadsDb?.url !== url) {
    const isFile = url.startsWith("file:");
    if (isFile) mkdirSync(path.dirname(path.resolve(url.slice("file:".length))), { recursive: true });
    const client = createClient({ url, authToken });
    const db = drizzle(client, { schema });
    const ready = (async () => {
      if (isFile) {
        await client.execute("PRAGMA journal_mode = WAL");
        await client.execute("PRAGMA busy_timeout = 5000");
      }
      await migrate(db, {
        migrationsFolder: process.env.MIGRATIONS_DIR || path.join(process.cwd(), "drizzle"),
      });
    })();
    cache.__leadsDb = { url, db, ready };
  }

  const connection = cache.__leadsDb!;
  try {
    await connection.ready;
  } catch (error) {
    cache.__leadsDb = undefined; // retry on the next request
    throw error;
  }
  return connection.db;
}
