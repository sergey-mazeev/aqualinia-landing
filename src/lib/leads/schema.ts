import { z } from "zod";
import { routing } from "@/i18n/routing";
import { normalizePhone } from "./phone";
import { QUIZ_OPTIONS } from "./quiz";
import { CONTACT_METHODS, LEAD_SOURCES } from "./sources";

// Error messages are codes; the client translates them (messages: form.errors.<code>).
export const ERROR_CODES = [
  "required",
  "name_short",
  "too_long",
  "phone_invalid",
  "consent_required",
  "product_required",
  "quiz_required",
  "invalid",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** Fields the visitor fills in. Validation only — no transforms, so input and output types match. */
export const contactSchema = z.object({
  name: z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .min(2, { error: "name_short" })
    .max(80, { error: "too_long" }),
  phone: z
    .string({ error: "required" })
    .trim()
    .min(1, { error: "required" })
    .max(32, { error: "phone_invalid" })
    .refine((value) => normalizePhone(value) !== null, { error: "phone_invalid" }),
  contactMethod: z.enum(CONTACT_METHODS, { error: "invalid" }),
  comment: z.string().trim().max(1000, { error: "too_long" }).optional(),
  consent: z.literal(true, { error: "consent_required" }),
});
export type ContactFields = z.infer<typeof contactSchema>;

export const quizAnswersSchema = z.object({
  format: z.enum(QUIZ_OPTIONS.format),
  problem: z.enum(QUIZ_OPTIONS.problem),
  people: z.enum(QUIZ_OPTIONS.people),
  budget: z.enum(QUIZ_OPTIONS.budget),
});

const optionalText = z.string().trim().max(300).optional();

export const attributionSchema = z.object({
  utmSource: optionalText,
  utmMedium: optionalText,
  utmCampaign: optionalText,
  utmTerm: optionalText,
  utmContent: optionalText,
  referrer: z.string().trim().max(500).optional(),
  pagePath: optionalText,
});
export type Attribution = z.infer<typeof attributionSchema>;

/** Full body of POST /api/leads. */
export const leadPayloadSchema = contactSchema
  .extend({
    source: z.enum(LEAD_SOURCES, { error: "invalid" }),
    locale: z.enum(routing.locales, { error: "invalid" }),
    productSku: z.string().trim().max(40).optional(),
    quantity: z.number().int().min(1).max(20).optional(),
    quizAnswers: quizAnswersSchema.optional(),
    attribution: attributionSchema.optional(),
    /** Honeypot: real visitors never see or fill this field. */
    website: z.string().max(200).optional(),
    /** Epoch ms when the form was opened. */
    startedAt: z.number().int().nonnegative(),
    clientSubmissionId: z.uuid({ error: "invalid" }),
  })
  .superRefine((lead, ctx) => {
    if (lead.source === "product" && !lead.productSku) {
      ctx.addIssue({ code: "custom", message: "product_required", path: ["productSku"] });
    }
    if ((lead.source === "quiz" || lead.source === "hero_quiz") && !lead.quizAnswers) {
      ctx.addIssue({ code: "custom", message: "quiz_required", path: ["quizAnswers"] });
    }
  });
export type LeadPayload = z.infer<typeof leadPayloadSchema>;

/** Flattens zod issues into `{ field: code }` for the API response. */
export function issuesToFieldErrors(error: z.ZodError): Record<string, ErrorCode> {
  const result: Record<string, ErrorCode> = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "_";
    if (result[field]) continue;
    const code = (ERROR_CODES as readonly string[]).includes(issue.message) ? issue.message : "invalid";
    result[field] = code as ErrorCode;
  }
  return result;
}
