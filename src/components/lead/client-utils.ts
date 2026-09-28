import type { Attribution } from "@/lib/leads/schema";

const ATTRIBUTION_KEY = "lead_attribution";
const SUBMITTED_KEY = "lead_submitted";
export const LEAD_SUBMITTED_EVENT = "lead:submitted";

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Stores UTM tags and an external referrer for the visit (a new UTM set replaces the old one). */
export function captureAttribution(): void {
  const storage = session();
  if (!storage) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Attribution = {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
    };
    const hasUtm = Object.values(utm).some(Boolean);
    if (storage.getItem(ATTRIBUTION_KEY) && !hasUtm) return;

    let referrer: string | undefined;
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.host !== window.location.host) referrer = document.referrer.slice(0, 500);
    }
    storage.setItem(ATTRIBUTION_KEY, JSON.stringify({ ...utm, referrer }));
  } catch {
    // Attribution is best-effort.
  }
}

export function readAttribution(): Attribution {
  let stored: Attribution = {};
  try {
    stored = JSON.parse(session()?.getItem(ATTRIBUTION_KEY) ?? "{}") as Attribution;
  } catch {
    stored = {};
  }
  const clip = (v?: string) => (v ? v.slice(0, 300) : undefined);
  return {
    utmSource: clip(stored.utmSource),
    utmMedium: clip(stored.utmMedium),
    utmCampaign: clip(stored.utmCampaign),
    utmTerm: clip(stored.utmTerm),
    utmContent: clip(stored.utmContent),
    referrer: stored.referrer?.slice(0, 500),
    pagePath: window.location.pathname.slice(0, 300),
  };
}

export function markSubmitted(): void {
  try {
    session()?.setItem(SUBMITTED_KEY, "1");
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(LEAD_SUBMITTED_EVENT));
}

export function wasSubmitted(): boolean {
  try {
    return session()?.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function sessionFlag(key: string, set = false): boolean {
  try {
    const storage = session();
    if (!storage) return false;
    if (set) storage.setItem(key, "1");
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** crypto.randomUUID needs a secure context; fall back to getRandomValues (works over plain http). */
export function uuid(): string {
  if (typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // fall through
    }
  }
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
