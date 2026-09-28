// Relative imports only: drizzle-kit loads this file outside Next and doesn't resolve `@/`.
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { CONTACT_METHODS, LEAD_SOURCES, LEAD_STATUSES } from "../leads/sources";

export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    source: text("source", { enum: LEAD_SOURCES }).notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    contactMethod: text("contact_method", { enum: CONTACT_METHODS }).notNull(),
    comment: text("comment"),
    productSku: text("product_sku"),
    quantity: integer("quantity"),
    quizAnswers: text("quiz_answers", { mode: "json" }).$type<Record<string, string>>(),
    recommendedSkus: text("recommended_skus", { mode: "json" }).$type<string[]>(),
    locale: text("locale").notNull(),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    referrer: text("referrer"),
    pagePath: text("page_path"),
    status: text("status", { enum: LEAD_STATUSES }).notNull().default("new"),
    adminNote: text("admin_note"),
    consentAt: integer("consent_at", { mode: "timestamp_ms" }).notNull(),
    consentVersion: text("consent_version").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    /** Lower-cased name + phone digits: SQLite can't case-fold Cyrillic in LIKE. */
    searchText: text("search_text").notNull(),
    clientSubmissionId: text("client_submission_id").notNull().unique(),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt),
    index("leads_status_idx").on(t.status),
    index("leads_source_idx").on(t.source),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
