import { useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { HeroArt } from "@/components/illustrations/HeroArt";
import { Wave } from "@/components/illustrations/Wave";
import { CtaButton } from "@/components/lead/CtaButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { buttonClass } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const trust: [IconName, string][] = [
    ["shield", t("trust1")],
    ["refresh", t("trust2")],
    ["truck", t("trust3")],
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-pale via-pale to-[#f4fbff]">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full bg-sky/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -right-32 size-[420px] rounded-full bg-mint blur-3xl" />

      <div className="container-x relative grid items-center gap-8 pt-10 pb-28 md:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-36">
        <div className="animate-fade-up">
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/80 py-1.5 pr-4 pl-2 text-sm font-medium text-muted shadow-card ring-1 ring-line backdrop-blur">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-deep px-2.5 py-0.5 text-white">
              <Stars rating={5} size={12} />
            </span>
            {t("rating", {
              rating: site.stats.rating.toFixed(1).replace(".", locale === "ru" ? "," : "."),
              families: formatNumber(site.stats.families, locale),
            })}
          </p>

          <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl xl:text-[4.5rem]">
            {t("titleStart")}{" "}
            <span className="relative whitespace-nowrap text-blue">
              {t("titleAccent")}
              <svg aria-hidden="true" viewBox="0 0 220 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-sky">
                <path d="M2 10c30-8 60-8 90-2s70 8 126-4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>{" "}
            {t("titleEnd")}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{t("lead")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton source="hero_quiz" className={buttonClass("primary", "lg")}>
              <Icon name="sparkles" size={20} />
              {t("ctaQuiz")}
            </CtaButton>
            <a href="#catalog" className={buttonClass("ghost", "lg")}>
              {t("ctaCatalog")}
              <Icon name="arrow" size={20} />
            </a>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {trust.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 text-[15px] font-semibold">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-sea shadow-card ring-1 ring-line">
                  <Icon name={icon} size={20} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <HeroArt className="aspect-square w-full" />
          <div className="absolute top-[14%] right-0 rounded-3xl bg-white/75 px-5 py-4 shadow-lift ring-1 ring-white backdrop-blur-md md:right-2 animate-float [animation-delay:0.8s]">
            <p className="text-3xl font-extrabold text-blue">{t("badge1Title")}</p>
            <p className="text-sm font-medium text-muted">{t("badge1Text")}</p>
          </div>
          <div className="absolute right-[6%] bottom-[8%] rounded-3xl bg-deep/90 px-5 py-4 text-white shadow-lift backdrop-blur-md animate-float [animation-delay:2s]">
            <p className="text-2xl font-extrabold text-mint">{t("badge2Title")}</p>
            <p className="text-sm text-white/75">{t("badge2Text")}</p>
          </div>
        </div>
      </div>
      <Wave fill="#ffffff" />
    </section>
  );
}
