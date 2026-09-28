import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

type Item = { q: string; a: string };

export function Faq() {
  const t = useTranslations("faq");
  const tn = useTranslations("nav");
  const items = t.raw("items") as Item[];
  return (
    <Section id="faq" className="bg-white">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="left" />
          <div className="-mt-4 hidden rounded-[28px] bg-pale p-6 lg:block">
            <Icon name="phone" className="text-blue" />
            <a href={site.phone.href} className="mt-3 block text-2xl font-bold">
              {site.phone.display}
            </a>
            <p className="mt-1 text-sm text-muted">{tn("callback")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <details key={item.q} name="faq" className="group rounded-3xl bg-pale/60 ring-1 ring-transparent transition open:bg-white open:shadow-card open:ring-line">
              <summary className="flex items-center justify-between gap-4 p-6 text-lg font-bold">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-blue transition group-open:rotate-45 group-open:bg-blue group-open:text-white">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
