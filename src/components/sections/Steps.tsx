import { useTranslations } from "next-intl";
import { CtaButton } from "@/components/lead/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { buttonClass } from "@/components/ui/button";

type Step = { title: string; text: string };
const ICONS: IconName[] = ["chat", "phone", "truck"];

export function Steps() {
  const t = useTranslations("steps");
  const steps = t.raw("items") as Step[];
  return (
    <Section id="steps" className="bg-white">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="relative grid gap-5 md:grid-cols-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="absolute top-12 left-[16%] hidden h-8 w-[68%] text-sky md:block"
          >
            <path d="M0 20c80-24 170-24 250 0s170 24 250 0 170-24 250 0 170 24 250 0" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
          </svg>
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex flex-col items-center rounded-[28px] bg-pale/60 px-6 pt-8 pb-8 text-center">
              <span className="relative grid size-20 place-items-center rounded-full bg-white text-blue shadow-card ring-8 ring-white">
                <Icon name={ICONS[i]} size={30} />
                <span className="absolute -top-1 -right-1 grid size-8 place-items-center rounded-full bg-sea text-sm font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <CtaButton source="steps_cta" className={buttonClass("primary", "lg")}>
            {t("cta")}
            <Icon name="arrow" size={20} />
          </CtaButton>
        </div>
      </div>
    </Section>
  );
}
