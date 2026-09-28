// Consistent snapshot of the local SQLite database (safe with WAL) via VACUUM INTO.
// For Turso, use its built-in point-in-time recovery instead.
// Usage: node scripts/backup.cjs [destination.db]
const fs = require("node:fs");
const path = require("node:path");

function loadLibsql() {
  try {
    return require("@libsql/client");
  } catch {
    // Next standalone output keeps packages only inside node_modules/.pnpm.
    const store = path.join(__dirname, "..", "node_modules", ".pnpm");
    const dir = fs.readdirSync(store).find((name) => name.startsWith("@libsql+client@"));
    return require(path.join(store, dir, "node_modules", "@libsql", "client"));
  }
}

const { createClient } = loadLibsql();
const source = process.env.DATABASE_PATH || "./data/leads.db";
const destination = path.resolve(
  process.argv[2] || path.join(path.dirname(source), `backup-${new Date().toISOString().slice(0, 10)}.db`),
);
if (fs.existsSync(destination)) fs.rmSync(destination);

const client = createClient({ url: `file:${source}` });
client
  .execute({ sql: "VACUUM INTO ?", args: [destination] })
  .then(() => console.log(`Backup written to ${destination}`))
  .finally(() => client.close());
