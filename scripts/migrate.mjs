// Applies pending migrations (the app also does this on first DB access).
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const file = process.env.DATABASE_PATH || "./data/leads.db";
mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
const sqlite = new Database(file);
sqlite.pragma("journal_mode = WAL");
migrate(drizzle(sqlite), { migrationsFolder: process.env.MIGRATIONS_DIR || "./drizzle" });
sqlite.close();
console.log(`Migrations applied to ${file}`);
