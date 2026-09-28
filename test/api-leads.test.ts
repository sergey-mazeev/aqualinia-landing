import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const dir = mkdtempSync(path.join(tmpdir(), "leads-test-"));
process.env.DATABASE_PATH = path.join(dir, "leads.db");
process.env.IP_HASH_SALT = "test";

const { POST } = await import("@/app/api/leads/route");
const { getLead, listLeads } = await import("@/lib/db/leads-repo");

let ipCounter = 0;
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/leads", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": `10.0.0.${++ipCounter}`,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function lead(overrides: Record<string, unknown> = {}) {
  return {
    name: "Анна",
    phone: "8 (999) 123-45-67",
    contactMethod: "whatsapp",
    consent: true,
    source: "final",
    locale: "ru",
    startedAt: Date.now() - 5000,
    clientSubmissionId: crypto.randomUUID(),
    attribution: { utmSource: "yandex", pagePath: "/" },
    ...overrides,
  };
}

describe("POST /api/leads", () => {
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  beforeAll(() => undefined);

  it("stores a valid lead with a normalized phone", async () => {
    const res = await POST(request(lead()));
    expect(res.status).toBe(201);
    const { id } = await res.json();
    const row = getLead(id)!;
    expect(row.phone).toBe("+79991234567");
    expect(row.status).toBe("new");
    expect(row.utmSource).toBe("yandex");
    expect(row.consentAt).toBeInstanceOf(Date);
    expect(row.searchText).toBe("анна 79991234567");
  });

  it("rejects missing consent with a field code", async () => {
    const res = await POST(request(lead({ consent: false })));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.consent).toBe("consent_required");
  });

  it("rejects an invalid phone", async () => {
    const res = await POST(request(lead({ phone: "123" })));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.phone).toBe("phone_invalid");
  });

  it("rejects an unknown product", async () => {
    const res = await POST(request(lead({ source: "product", productSku: "NOPE" })));
    expect(res.status).toBe(400);
    expect((await res.json()).fields.productSku).toBe("invalid");
  });

  it("stores a product order with quantity", async () => {
    const res = await POST(request(lead({ source: "product", productSku: "F-QUARTET", quantity: 2 })));
    expect(res.status).toBe(201);
    const row = getLead((await res.json()).id)!;
    expect(row.productSku).toBe("F-QUARTET");
    expect(row.quantity).toBe(2);
  });

  it("recomputes quiz recommendations on the server", async () => {
    const res = await POST(
      request(
        lead({
          source: "quiz",
          quizAnswers: { format: "flow", problem: "kids", people: "3-4", budget: "any" },
          recommendedSkus: ["P-KAPLYA"],
        }),
      ),
    );
    expect(res.status).toBe(201);
    const row = getLead((await res.json()).id)!;
    expect(row.recommendedSkus?.length).toBe(2);
    expect(row.recommendedSkus).not.toContain("P-KAPLYA");
  });

  it("silently drops honeypot and too-fast submissions", async () => {
    const before = listLeads({}).total;
    const honeypot = await POST(request(lead({ website: "http://spam" })));
    expect(honeypot.status).toBe(200);
    const fast = await POST(request(lead({ startedAt: Date.now() })));
    expect(fast.status).toBe(200);
    expect(listLeads({}).total).toBe(before);
  });

  it("is idempotent per clientSubmissionId", async () => {
    const payload = lead();
    const first = await POST(request(payload));
    const second = await POST(request(payload));
    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect((await first.json()).id).toBe((await second.json()).id);
  });

  it("rejects cross-origin posts", async () => {
    const res = await POST(request(lead(), { origin: "https://evil.example", host: "localhost:3000" }));
    expect(res.status).toBe(403);
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(request("{nope"));
    expect(res.status).toBe(400);
  });

  it("rate-limits repeated requests from one IP", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      const res = await POST(request(lead(), { "x-real-ip": "10.9.9.9" }));
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("searches Cyrillic names case-insensitively and phones by digits", async () => {
    await POST(request(lead({ name: "Екатерина Смирнова", phone: "+7 916 555-44-33" })));
    expect(listLeads({ q: "СМИРНОВА" }).total).toBe(1);
    expect(listLeads({ q: "555 44" }).total).toBe(1);
    expect(listLeads({ q: "100%" }).total).toBe(0);
  });
});
