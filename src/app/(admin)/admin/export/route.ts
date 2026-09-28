import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/require-admin";
import { exportLeads, moscowToday, parseLeadFilters } from "@/lib/db/leads-repo";
import { csvPhone, toCsv } from "@/lib/leads/csv";
import { CONTACT_LABELS, SOURCE_LABELS, STATUS_LABELS } from "@/lib/leads/sources";
import { formatMoscow, productName, quizLabels } from "../_components/format";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/admin/login", request.url), 303);

  const url = new URL(request.url);
  const filters = parseLeadFilters(Object.fromEntries(url.searchParams));
  const rows = exportLeads(filters);

  const csv = toCsv([
    [
      "№", "Дата (МСК)", "Статус", "Имя", "Телефон", "Связь", "Форма", "Товар", "Кол-во",
      "Подбор", "Рекомендовано", "Комментарий", "Заметка", "Язык",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "Страница", "Referrer",
    ],
    ...rows.map((lead) => [
      lead.id,
      formatMoscow(lead.createdAt),
      STATUS_LABELS[lead.status],
      lead.name,
      csvPhone(lead.phone),
      CONTACT_LABELS[lead.contactMethod],
      SOURCE_LABELS[lead.source],
      productName(lead.productSku),
      lead.quantity,
      quizLabels(lead.quizAnswers).map((q) => `${q.question} ${q.answer}`).join("; "),
      lead.recommendedSkus?.map(productName).join(", "),
      lead.comment,
      lead.adminNote,
      lead.locale,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.utmTerm,
      lead.utmContent,
      lead.pagePath,
      lead.referrer,
    ]),
  ]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${moscowToday()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
