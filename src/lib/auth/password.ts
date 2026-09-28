import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminPassword } from "@/lib/env";

/** Constant-time comparison (hashing first makes lengths equal). */
export function checkAdminPassword(candidate: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(candidate), digest(getAdminPassword()));
}
