import { useTranslations } from "next-intl";
import { CartridgeArt } from "@/components/illustrations/CartridgeArt";
import { Wave } from "@/components/illustrations/Wave";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

type Stage = { title: string; text: string };

export function HowItWorks() {
  const t = useTranslations("how");
  const stages = t.raw("stages") as Stage[];
  return (
    <Section id="how" className="overflow-hidden bg-pale">
      <Wave fill="#ffffff" position="top" />
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[260px] lg:max-w-[380px]">
            <div aria-hidden="true" className="absolute inset-8 rounded-full bg-white blur-2xl" />
            <CartridgeArt className="relative w-full" />
          </div>
          <div className="flex flex-col gap-3">
            {stages.map((stage, i) => (
              <details
                key={stage.title}
                open={i === 0}
                name="stages"
                className="group rounded-3xl bg-white ring-1 ring-line transition open:shadow-card"
              >
                <summary className="flex items-center gap-4 p-5 text-lg font-bold">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-pale text-blue transition group-open:bg-blue group-open:text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1">{stage.title}</span>
                  <Icon name="chevron" size={20} className="text-muted transition group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 pl-[76px] leading-relaxed text-muted">{stage.text}</p>
              </details>
            ))}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-deep p-6 text-white">
                <Icon name="wrench" className="text-sky" />
                <p className="mt-3 text-lg font-bold">{t("installTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{t("installText")}</p>
              </div>
              <div className="rounded-3xl bg-mint p-6">
                <Icon name="drop" className="text-sea" />
                <p className="mt-3 text-lg font-bold">{t("pitcherTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t("pitcherText")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
