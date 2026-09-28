import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const intl = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Admin must be handled before next-intl, otherwise `/admin` is rewritten to `/ru/admin`.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return noindex(NextResponse.next());

    const ok = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!ok) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname + search);
      return noindex(NextResponse.redirect(url));
    }
    return noindex(NextResponse.next());
  }

  return intl(request);
}

function noindex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Skip API routes, Next internals and anything that looks like a file (contains a dot).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
