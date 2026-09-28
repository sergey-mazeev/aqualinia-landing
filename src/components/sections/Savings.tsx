import { useTranslations } from "next-intl";
import { Wave } from "@/components/illustrations/Wave";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/Section";
import { SavingsCalculator } from "./SavingsCalculator";

type Row = { label: string; filter: string; bottled: string; boiling: string };
const MARKS = ["yes", "no", "partly"] as const;

function Cell({ value, highlight = false }: { value: string; highlight?: boolean }) {
  const t = useTranslations("compare");
  if (!(MARKS as readonly string[]).includes(value)) {
    return <span className={highlight ? "font-semibold text-white" : "text-white/75"}>{value}</span>;
  }
  const mark = value as (typeof MARKS)[number];
  const style = {
    yes: "bg-mint text-sea",
    partly: "bg-[#fdf1d6] text-[#8a5a00]",
    no: "bg-white/10 text-white/60",
  }[mark];
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`grid size-6 place-items-center rounded-full ${style}`}>
        <Icon name={mark === "yes" ? "check" : mark === "no" ? "close" : "minus"} size={14} strokeWidth={2.6} />
      </span>
      <span className={highlight ? "font-semibold text-white" : "text-white/75"}>{t(mark)}</span>
    </span>
  );
}

export function Savings() {
  const t = useTranslations("compare");
  const rows = t.raw("rows") as Row[];

  return (
    <section id="savings" className="relative overflow-hidden bg-deep py-24 text-white md:py-32">
      <Wave fill="#ffffff" position="top" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 -left-40 size-[480px] rounded-full bg-blue/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-sea/40 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} tone="dark" />
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="overflow-x-auto rounded-[32px] bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                <caption className="sr-only">{t("title")}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="p-5 text-sm font-medium text-white/60">
                      {t("cols.feature")}
                    </th>
                    <th scope="col" className="bg-blue/35 p-5 font-bold">
                      <span className="inline-flex items-center gap-2">
                        <Icon name="drop" size={18} className="text-sky" />
                        {t("cols.filter")}
                      </span>
                    </th>
                    <th scope="col" className="p-5 font-semibold text-white/80">
                      {t("cols.bottled")}
                    </th>
                    <th scope="col" className="p-5 font-semibold text-white/80">
                      {t("cols.boiling")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-white/10">
                      <th scope="row" className="p-5 font-medium text-white/70">
                        {row.label}
                      </th>
                      <td className="bg-blue/20 p-5">
                        <Cell value={row.filter} highlight />
                      </td>
                      <td className="p-5">
                        <Cell value={row.bottled} />
                      </td>
                      <td className="p-5">
                        <Cell value={row.boiling} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-white/55">{t("footnote")}</p>
          </div>
          <SavingsCalculator />
        </div>
      </div>
      <Wave fill="#ffffff" />
    </section>
  );
}
