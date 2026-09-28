import { checkAdminPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { hashIp } from "@/lib/hash";
import { isSameOrigin } from "@/lib/origin";
import { getRateLimiter } from "@/lib/rate-limit";
import { seeOther } from "@/lib/redirect";
import { getClientIp } from "@/lib/request-ip";

const limiter = () => getRateLimiter("admin-login", { limit: 5, windowMs: 10 * 60_000 });

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("/admin/login") && !next.includes("//") ? next : "/admin";
}

function back(error: string, next: string) {
  const params = new URLSearchParams({ error });
  if (next !== "/admin") params.set("next", next);
  return seeOther(`/admin/login?${params}`);
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const next = safeNext(form?.get("next") ?? null);
  if (!form || !isSameOrigin(request.headers)) return back("invalid", next);

  if (!limiter().hit(hashIp(getClientIp(request.headers))).ok) return back("rate", next);

  const password = form.get("password");
  let ok = false;
  try {
    ok = typeof password === "string" && checkAdminPassword(password);
  } catch {
    return back("config", next);
  }
  if (!ok) return back("password", next);

  let token: string;
  try {
    token = await createSessionToken();
  } catch {
    return back("config", next);
  }
  const response = seeOther(next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
