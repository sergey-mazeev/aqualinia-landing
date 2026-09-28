import "server-only";

/** Read lazily so `next build` (and the Docker build) works without secrets. */
export function getAdminPassword(): string {
  const value = process.env.ADMIN_PASSWORD ?? "";
  if (process.env.NODE_ENV === "production" && value.length < 12) {
    throw new Error("ADMIN_PASSWORD must be set and at least 12 characters long");
  }
  if (!value) throw new Error("ADMIN_PASSWORD is not set");
  return value;
}

export function assertSessionSecret(): void {
  const value = process.env.SESSION_SECRET ?? "";
  if (value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters long");
}

export function getDbPath(): string {
  return process.env.DATABASE_PATH || "./data/leads.db";
}
