import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getLead } from "@/lib/db/leads-repo";
import { formatPhone, phoneDigits } from "@/lib/leads/phone";
import { CONTACT_LABELS, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from "@/lib/leads/sources";
import { buttonClass } from "@/components/ui/button";
import { updateNoteAction, updateStatusAction } from "../../../actions";
import { formatMoscow, productName, quizLabels } from "../../../_components/format";
import { StatusBadge } from "../../../_components/StatusBadge";

export const metadata = { title: "Заявка" };

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line/60 py-3 last:border-0 sm:grid-cols-[180px_1fr]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium break-words">{children ?? "—"}</dd>
    </div>
  );
}

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const lead = /^\d+$/.test(id) ? await getLead(Number(id)) : undefined;
  if (!lead) notFound();

  const digits = phoneDigits(lead.phone);
  const quiz = quizLabels(lead.quizAnswers);
  const utm = [
    ["utm_source", lead.utmSource],
    ["utm_medium", lead.utmMedium],
    ["utm_campaign", lead.utmCampaign],
    ["utm_term", lead.utmTerm],
    ["utm_content", lead.utmContent],
  ].filter(([, v]) => v);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="text-sm font-semibold text-blue hover:underline">
        ← Все заявки
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">
          Заявка №{lead.id} · {lead.name}
        </h1>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="mb-2 text-lg font-bold">Данные клиента</h2>
          <dl>
            <Row label="Получена">{formatMoscow(lead.createdAt)} (МСК)</Row>
            <Row label="Имя">{lead.name}</Row>
            <Row label="Телефон">
              <a href={`tel:${lead.phone}`} className="text-blue hover:underline">
                {formatPhone(lead.phone)}
              </a>
            </Row>
            <Row label="Удобная связь">{CONTACT_LABELS[lead.contactMethod]}</Row>
            <Row label="Язык сайта">{lead.locale === "en" ? "Английский (EN)" : "Русский (RU)"}</Row>
            <Row label="Форма">{SOURCE_LABELS[lead.source]}</Row>
            {lead.productSku && (
              <Row label="Товар">
                {productName(lead.productSku)} · {lead.quantity ?? 1} шт.
              </Row>
            )}
            {lead.comment && <Row label="Комментарий">{lead.comment}</Row>}
            {quiz.map((item) => (
              <Row key={item.question} label={item.question}>
                {item.answer}
              </Row>
            ))}
            {lead.recommendedSkus?.length ? (
              <Row label="Рекомендовано">{lead.recommendedSkus.map(productName).join(", ")}</Row>
            ) : null}
          </dl>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold">Связаться</h2>
            <div className="mt-4 grid gap-2">
              <a href={`tel:${lead.phone}`} className={buttonClass("primary", "sm")}>
                Позвонить
              </a>
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                WhatsApp
              </a>
              <a href={`https://t.me/+${digits}`} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "sm")}>
                Telegram
              </a>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold">Обработка</h2>
            <form key={`status-${lead.updatedAt.getTime()}`} action={updateStatusAction} className="mt-4 flex gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="status" className="sr-only">
                Статус
              </label>
              <select
                id="status"
                name="status"
                defaultValue={lead.status}
                className="h-10 flex-1 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-blue"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <button type="submit" className={buttonClass("primary", "sm")}>
                Сохранить
              </button>
            </form>
            <form key={`note-${lead.updatedAt.getTime()}`} action={updateNoteAction} className="mt-5 flex flex-col gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="note" className="text-sm font-semibold">
                Заметка менеджера
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                maxLength={2000}
                defaultValue={lead.adminNote ?? ""}
                placeholder="Например: перезвонить в пятницу, интересует «Квартет Ультра»"
                className="rounded-2xl border border-line p-3 text-sm outline-none focus:border-blue focus:ring-4 focus:ring-sky/30"
              />
              <button type="submit" className={buttonClass("ghost", "sm", "self-start")}>
                Сохранить заметку
              </button>
            </form>
            <p className="mt-4 text-xs text-muted">Изменена: {formatMoscow(lead.updatedAt)}</p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="mb-2 text-lg font-bold">Откуда пришёл</h2>
            <dl className="text-sm">
              {utm.map(([key, value]) => (
                <Row key={key} label={key!}>
                  {value}
                </Row>
              ))}
              <Row label="Страница">{lead.pagePath}</Row>
              <Row label="Referrer">{lead.referrer}</Row>
              <Row label="Согласие на ПДн">
                {formatMoscow(lead.consentAt)} · ред. {lead.consentVersion}
              </Row>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
