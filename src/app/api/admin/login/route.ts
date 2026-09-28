import { NextResponse } from "next/server";
import { checkAdminPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { hashIp } from "@/lib/hash";
import { isSameOrigin } from "@/lib/origin";
import { getRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

const limiter = () => getRateLimiter("admin-login", { limit: 5, windowMs: 10 * 60_000 });

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("/admin/login") && !next.includes("//") ? next : "/admin";
}

function back(request: Request, error: string, next: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", error);
  if (next !== "/admin") url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const next = safeNext(form?.get("next") ?? null);
  if (!form || !isSameOrigin(request.headers)) return back(request, "invalid", next);

  if (!limiter().hit(hashIp(getClientIp(request.headers))).ok) return back(request, "rate", next);

  const password = form.get("password");
  let ok = false;
  try {
    ok = typeof password === "string" && checkAdminPassword(password);
  } catch {
    return back(request, "config", next);
  }
  if (!ok) return back(request, "password", next);

  let token: string;
  try {
    token = await createSessionToken();
  } catch {
    return back(request, "config", next);
  }
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
