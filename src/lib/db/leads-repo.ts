import "server-only";
import { and, count, desc, eq, gte, lte, or, sql, type SQL } from "drizzle-orm";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from "@/lib/leads/sources";
import { getDb } from "./client";
import { leads, type Lead, type NewLead } from "./schema";

export const PAGE_SIZE = 50;

export type LeadFilters = {
  status?: LeadStatus;
  source?: LeadSource;
  locale?: "ru" | "en";
  /** YYYY-MM-DD, Moscow time. */
  from?: string;
  to?: string;
  q?: string;
};

type SearchParams = Record<string, string | string[] | undefined>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function first(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || undefined;
}

export function parseLeadFilters(params: SearchParams): LeadFilters {
  const status = first(params.status);
  const source = first(params.source);
  const locale = first(params.locale);
  const from = first(params.from);
  const to = first(params.to);
  return {
    status: (LEAD_STATUSES as readonly string[]).includes(status ?? "") ? (status as LeadStatus) : undefined,
    source: (LEAD_SOURCES as readonly string[]).includes(source ?? "") ? (source as LeadSource) : undefined,
    locale: locale === "ru" || locale === "en" ? locale : undefined,
    from: from && DATE_RE.test(from) ? from : undefined,
    to: to && DATE_RE.test(to) ? to : undefined,
    q: first(params.q)?.slice(0, 100),
  };
}

/** Moscow is UTC+3 all year. */
function moscowTime(date: string, endOfDay = false): Date {
  return new Date(`${date}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+03:00`);
}

export function moscowToday(now = new Date()): string {
  return new Date(now.getTime() + 3 * 3600_000).toISOString().slice(0, 10);
}

export function buildSearchText(name: string, phone: string): string {
  return `${name.toLowerCase()} ${phone.replace(/\D/g, "")}`;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

function whereFor(filters: LeadFilters): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];
  if (filters.status) conditions.push(eq(leads.status, filters.status));
  if (filters.source) conditions.push(eq(leads.source, filters.source));
  if (filters.locale) conditions.push(eq(leads.locale, filters.locale));
  if (filters.from) conditions.push(gte(leads.createdAt, moscowTime(filters.from)));
  if (filters.to) conditions.push(lte(leads.createdAt, moscowTime(filters.to, true)));
  if (filters.q) {
    const text = `%${escapeLike(filters.q.toLowerCase())}%`;
    const digits = filters.q.replace(/\D/g, "");
    conditions.push(
      or(
        sql`${leads.searchText} LIKE ${text} ESCAPE '\\'`,
        digits.length >= 3 ? sql`${leads.searchText} LIKE ${`%${digits}%`}` : undefined,
      ),
    );
  }
  return and(...conditions);
}

export function insertLead(lead: Omit<NewLead, "id">): { id: number; duplicate: boolean } {
  const db = getDb();
  const inserted = db
    .insert(leads)
    .values(lead)
    .onConflictDoNothing({ target: leads.clientSubmissionId })
    .returning({ id: leads.id })
    .get();
  if (inserted) return { id: inserted.id, duplicate: false };

  const existing = db
    .select({ id: leads.id })
    .from(leads)
    .where(eq(leads.clientSubmissionId, lead.clientSubmissionId))
    .get();
  return { id: existing!.id, duplicate: true };
}

export function listLeads(filters: LeadFilters, page = 1): { rows: Lead[]; total: number; pages: number } {
  const db = getDb();
  const where = whereFor(filters);
  const total = db.select({ n: count() }).from(leads).where(where).get()?.n ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const rows = db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt), desc(leads.id))
    .limit(PAGE_SIZE)
    .offset((current - 1) * PAGE_SIZE)
    .all();
  return { rows, total, pages };
}

/** All matching rows (for CSV export), newest first. */
export function exportLeads(filters: LeadFilters, limit = 10_000): Lead[] {
  return getDb()
    .select()
    .from(leads)
    .where(whereFor(filters))
    .orderBy(desc(leads.createdAt), desc(leads.id))
    .limit(limit)
    .all();
}

export function getLead(id: number): Lead | undefined {
  return getDb().select().from(leads).where(eq(leads.id, id)).get();
}

export function leadCounters(): { total: number; fresh: number; today: number } {
  const db = getDb();
  const total = db.select({ n: count() }).from(leads).get()?.n ?? 0;
  const fresh = db.select({ n: count() }).from(leads).where(eq(leads.status, "new")).get()?.n ?? 0;
  const today =
    db
      .select({ n: count() })
      .from(leads)
      .where(gte(leads.createdAt, moscowTime(moscowToday())))
      .get()?.n ?? 0;
  return { total, fresh, today };
}

export function updateLead(id: number, patch: { status?: LeadStatus; adminNote?: string | null }): boolean {
  const result = getDb()
    .update(leads)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .run();
  return result.changes > 0;
}
