import { useTranslations } from "next-intl";
import { FlowArt } from "@/components/illustrations/FlowArt";
import { PitcherArt } from "@/components/illustrations/PitcherArt";
import { Wave } from "@/components/illustrations/Wave";
import { Quiz } from "@/components/lead/Quiz";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/Section";

export function QuizSection() {
  const t = useTranslations("quiz");
  const benefits = t.raw("benefits") as string[];
  return (
    <section id="quiz" className="relative overflow-hidden bg-linear-to-br from-pale via-pale to-mint py-24 md:py-32">
      <Wave fill="#ffffff" position="top" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} align="left" />
          <ul className="-mt-4 flex flex-col gap-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-lg font-semibold">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sea text-white">
                  <Icon name="check" size={16} strokeWidth={2.6} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="mt-10 hidden items-end gap-2 lg:flex">
            <PitcherArt uid="quiz-deco" accent="blue" className="w-36" />
            <FlowArt uid="quiz-deco" accent="sea" stages={4} className="w-56" />
          </div>
        </div>
        <div className="rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-white md:p-8">
          <Quiz source="quiz" />
        </div>
      </div>
      <Wave fill="#ffffff" />
    </section>
  );
}
