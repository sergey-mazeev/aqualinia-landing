import { NextResponse } from "next/server";

/**
 * 303 redirect with a relative Location. `request.url` in a standalone server reflects
 * the internal bind address (e.g. 0.0.0.0:3000), not the public host behind nginx.
 */
export function seeOther(location: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}
