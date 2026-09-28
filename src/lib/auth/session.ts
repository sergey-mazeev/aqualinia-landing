// Imported by src/proxy.ts, so it must stay free of `server-only` and Node-only APIs.
import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET must be set (at least 32 characters)");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.sub === "admin" && payload.role === "admin";
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
