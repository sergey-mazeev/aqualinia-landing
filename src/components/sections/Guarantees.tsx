import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

type Item = { title: string; text: string };
const ICONS: IconName[] = ["shield", "refresh", "badge", "truck"];

export function Guarantees() {
  const t = useTranslations("guarantees");
  const items = t.raw("items") as Item[];
  return (
    <Section id="guarantees" className="bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.title} className="rounded-[28px] p-7 ring-1 ring-line transition hover:shadow-card">
              <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-br from-sea to-blue text-white">
                <Icon name={ICONS[i]} size={26} />
              </span>
              <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
