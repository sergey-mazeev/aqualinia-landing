import { handleLeadRequest } from "@/lib/leads/create-lead";

export async function POST(request: Request) {
  const result = await handleLeadRequest(request);
  const headers: HeadersInit = { "Cache-Control": "no-store" };
  if ("retryAfterSec" in result && result.retryAfterSec) headers["Retry-After"] = String(result.retryAfterSec);
  return Response.json(result.body, { status: result.status, headers });
}
