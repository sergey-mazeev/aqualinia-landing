import { useTranslations } from "next-intl";
import { PROBLEMS, type Problem } from "@/data/taxonomy";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { buttonClass } from "@/components/ui/button";

const ICONS: Record<Problem, IconName> = {
  chlorine: "flask",
  rust: "rust",
  hardness: "kettle",
  metals: "atom",
  microplastics: "particles",
  bacteria: "microbe",
};

export function Problems() {
  const t = useTranslations("problems");
  return (
    <Section id="problems" className="bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <li
              key={problem}
              className="group relative overflow-hidden rounded-[28px] bg-white p-7 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span
                aria-hidden="true"
                className={`absolute -top-10 -right-10 size-32 rounded-full opacity-60 transition group-hover:scale-125 ${i % 2 ? "bg-mint" : "bg-pale"}`}
              />
              <span
                className={`relative grid size-14 place-items-center rounded-2xl ${i % 2 ? "bg-mint text-sea" : "bg-pale text-blue"}`}
              >
                <Icon name={ICONS[problem]} size={28} />
              </span>
              <h3 className="relative mt-5 text-xl font-bold">{t(`items.${problem}.title`)}</h3>
              <p className="relative mt-2 leading-relaxed text-muted">{t(`items.${problem}.text`)}</p>
              <p className="relative mt-4 border-t border-dashed border-line pt-4 text-sm">
                <span className="font-semibold text-deep">{t("sign")}</span>{" "}
                <span className="text-muted">{t(`items.${problem}.sign`)}</span>
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-start gap-5 rounded-[28px] bg-linear-to-r from-pale to-mint p-7 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-xl text-lg font-semibold">{t("ctaText")}</p>
          <a href="#quiz" className={buttonClass("primary", "md", "shrink-0")}>
            {t("cta")}
            <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </Section>
  );
}
