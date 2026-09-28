import "server-only";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { buildSearchText, insertLead } from "@/lib/db/leads-repo";
import { getRateLimiter } from "@/lib/rate-limit";
import { hashIp } from "@/lib/hash";
import { getClientIp } from "@/lib/request-ip";
import { normalizePhone } from "./phone";
import { recommend } from "./quiz";
import { issuesToFieldErrors, leadPayloadSchema, type ErrorCode } from "./schema";

export const MAX_BODY_BYTES = 16 * 1024;
/** Forms submitted faster than this are treated as bots. */
export const MIN_FILL_MS = 3000;

export type LeadResult =
  | { status: 201 | 200; body: { ok: true; id?: number } }
  | { status: 400; body: { ok: false; error: "validation"; fields: Record<string, ErrorCode> } }
  | { status: 400 | 403 | 413 | 429; body: { ok: false; error: string }; retryAfterSec?: number };

/** Requests per IP per 10 minutes (override with LEAD_RATE_LIMIT, e.g. for local testing). */
const limiter = () =>
  getRateLimiter("leads", { limit: Number(process.env.LEAD_RATE_LIMIT) || 5, windowMs: 10 * 60_000 });

function sameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return true; // non-browser clients; browsers always send Origin on POST
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleLeadRequest(request: Request, now = Date.now()): Promise<LeadResult> {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return { status: 413, body: { ok: false, error: "too_large" } };
  }
  if (!sameOrigin(request.headers)) return { status: 403, body: { ok: false, error: "forbidden" } };

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return { status: 413, body: { ok: false, error: "too_large" } };

  const ipHash = hashIp(getClientIp(request.headers));
  const rate = limiter().hit(ipHash, now);
  if (!rate.ok) {
    return {
      status: 429,
      body: { ok: false, error: "rate_limited" },
      retryAfterSec: Math.ceil(rate.retryAfterMs / 1000),
    };
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { status: 400, body: { ok: false, error: "invalid_json" } };
  }

  // Bots: filled honeypot or inhumanly fast submission. Pretend success, store nothing.
  const probe = body as { website?: unknown; startedAt?: unknown };
  if (typeof probe.website === "string" && probe.website.trim()) return { status: 200, body: { ok: true } };
  if (typeof probe.startedAt === "number" && now - probe.startedAt < MIN_FILL_MS) {
    return { status: 200, body: { ok: true } };
  }

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: "validation", fields: issuesToFieldErrors(parsed.error) } };
  }
  const lead = parsed.data;

  const phone = normalizePhone(lead.phone)!;
  const product = getProduct(lead.productSku);
  if (lead.productSku && !product) {
    return { status: 400, body: { ok: false, error: "validation", fields: { productSku: "invalid" } } };
  }

  const createdAt = new Date(now);
  const attribution = lead.attribution ?? {};
  const { id, duplicate } = insertLead({
    createdAt,
    updatedAt: createdAt,
    source: lead.source,
    name: lead.name,
    phone,
    contactMethod: lead.contactMethod,
    comment: lead.comment || null,
    productSku: product?.sku ?? null,
    quantity: product ? (lead.quantity ?? 1) : null,
    quizAnswers: lead.quizAnswers ?? null,
    // Never trust the client's recommendation; recompute from the answers.
    recommendedSkus: lead.quizAnswers ? recommend(lead.quizAnswers) : null,
    locale: lead.locale,
    utmSource: attribution.utmSource || null,
    utmMedium: attribution.utmMedium || null,
    utmCampaign: attribution.utmCampaign || null,
    utmTerm: attribution.utmTerm || null,
    utmContent: attribution.utmContent || null,
    referrer: attribution.referrer || null,
    pagePath: attribution.pagePath || null,
    status: "new",
    consentAt: createdAt,
    consentVersion: site.consentVersion,
    ipHash,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    searchText: buildSearchText(lead.name, phone),
    clientSubmissionId: lead.clientSubmissionId,
  });

  return { status: duplicate ? 200 : 201, body: { ok: true, id } };
}
