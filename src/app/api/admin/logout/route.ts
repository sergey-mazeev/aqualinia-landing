import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/origin";
import { seeOther } from "@/lib/redirect";

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new NextResponse(null, { status: 403 });
  const response = seeOther("/admin/login");
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
