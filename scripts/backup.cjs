// Consistent SQLite backup (safe with WAL). Also shipped in the Docker image.
// Usage: node scripts/backup.cjs [destination.db]
const fs = require("node:fs");
const path = require("node:path");

function loadSqlite() {
  try {
    return require("better-sqlite3");
  } catch {
    // Next standalone output keeps the package only inside node_modules/.pnpm.
    const store = path.join(__dirname, "..", "node_modules", ".pnpm");
    const dir = fs.readdirSync(store).find((name) => name.startsWith("better-sqlite3@"));
    return require(path.join(store, dir, "node_modules", "better-sqlite3"));
  }
}

const Database = loadSqlite();
const source = process.env.DATABASE_PATH || "./data/leads.db";
const destination =
  process.argv[2] || path.join(path.dirname(source), `backup-${new Date().toISOString().slice(0, 10)}.db`);

const db = new Database(source, { readonly: true });
db.backup(destination)
  .then(() => console.log(`Backup written to ${destination}`))
  .finally(() => db.close());
