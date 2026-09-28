import Link from "next/link";
import { listLeads, parseLeadFilters, type LeadFilters } from "@/lib/db/leads-repo";
import { formatPhone } from "@/lib/leads/phone";
import { CONTACT_LABELS, LEAD_SOURCES, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from "@/lib/leads/sources";
import { buttonClass } from "@/components/ui/button";
import { formatMoscow, productName } from "../_components/format";
import { StatusSelect } from "../_components/StatusSelect";

export const metadata = { title: "Список заявок" };

function query(filters: LeadFilters, extra: Record<string, string | number> = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...extra })) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

const selectClass =
  "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-blue focus:ring-4 focus:ring-sky/30";
const labelClass = "mb-1 block text-xs font-semibold text-muted";

export default async function LeadsPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const page = Math.max(1, Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1);
  const { rows, total, pages } = await listLeads(filters, page);
  const current = Math.min(page, pages);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <form method="get" className="grid gap-3 rounded-3xl bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(5,1fr)_auto] lg:items-end">
        <div>
          <label htmlFor="q" className={labelClass}>
            Поиск
          </label>
          <input id="q" name="q" defaultValue={filters.q} placeholder="Имя или телефон" className={selectClass} />
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>
            Статус
          </label>
          <select id="status" name="status" defaultValue={filters.status ?? ""} className={selectClass}>
            <option value="">Все</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="source" className={labelClass}>
            Источник
          </label>
          <select id="source" name="source" defaultValue={filters.source ?? ""} className={selectClass}>
            <option value="">Все</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="locale" className={labelClass}>
            Язык
          </label>
          <select id="locale" name="locale" defaultValue={filters.locale ?? ""} className={selectClass}>
            <option value="">Все</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
        </div>
        <div>
          <label htmlFor="from" className={labelClass}>
            С (МСК)
          </label>
          <input id="from" name="from" type="date" defaultValue={filters.from} className={selectClass} />
        </div>
        <div>
          <label htmlFor="to" className={labelClass}>
            По (МСК)
          </label>
          <input id="to" name="to" type="date" defaultValue={filters.to} className={selectClass} />
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button type="submit" className={buttonClass("primary", "sm", "flex-1 lg:flex-none")}>
            Найти
          </button>
          {hasFilters && (
            <Link href="/admin" className={buttonClass("ghost", "sm")}>
              Сбросить
            </Link>
          )}
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Найдено: <b className="text-deep">{total}</b>
        </p>
        <a href={`/admin/export${query(filters)}`} className={buttonClass("outline", "sm")}>
          Скачать CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Клиент</th>
              <th className="px-4 py-3 font-semibold">Связь</th>
              <th className="px-4 py-3 font-semibold">Источник</th>
              <th className="px-4 py-3 font-semibold">Товар / подбор</th>
              <th className="px-4 py-3 font-semibold">Язык</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} className={`border-b border-line/60 last:border-0 ${lead.status === "new" ? "bg-pale/50" : ""}`}>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  <Link href={`/admin/leads/${lead.id}`} className="hover:text-blue">
                    {formatMoscow(lead.createdAt)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-semibold hover:text-blue">
                    {lead.name}
                  </Link>
                  <a href={`tel:${lead.phone}`} className="block text-muted hover:text-blue">
                    {formatPhone(lead.phone)}
                  </a>
                </td>
                <td className="px-4 py-3">{CONTACT_LABELS[lead.contactMethod]}</td>
                <td className="px-4 py-3">{SOURCE_LABELS[lead.source]}</td>
                <td className="max-w-64 px-4 py-3">
                  {lead.productSku
                    ? `${productName(lead.productSku)}${lead.quantity && lead.quantity > 1 ? ` × ${lead.quantity}` : ""}`
                    : lead.recommendedSkus?.length
                      ? `Подбор: ${lead.recommendedSkus.map(productName).join(", ")}`
                      : "—"}
                </td>
                <td className="px-4 py-3 uppercase">{lead.locale}</td>
                <td className="px-4 py-3">
                  <StatusSelect key={`${lead.id}-${lead.status}`} id={lead.id} status={lead.status} label={`Статус заявки ${lead.id}`} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-muted">
                  {hasFilters ? "По этим фильтрам заявок нет." : "Заявок пока нет — они появятся здесь, как только клиенты отправят форму на сайте."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Страницы" className="flex items-center justify-center gap-3 text-sm">
          {current > 1 ? (
            <Link href={`/admin${query(filters, { page: current - 1 })}`} className={buttonClass("ghost", "sm")}>
              ← Назад
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Страница {current} из {pages}
          </span>
          {current < pages && (
            <Link href={`/admin${query(filters, { page: current + 1 })}`} className={buttonClass("ghost", "sm")}>
              Дальше →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
