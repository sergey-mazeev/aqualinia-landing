import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/origin";

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new NextResponse(null, { status: 403 });
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
