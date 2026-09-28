import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Wave } from "@/components/illustrations/Wave";
import { LeadForm } from "@/components/lead/LeadForm";
import { Icon } from "@/components/ui/Icon";

export function FinalSection() {
  const t = useTranslations("final");
  return (
    <section id="contact" className="relative overflow-hidden bg-linear-to-br from-blue via-[#005f93] to-deep py-24 text-white md:py-32">
      <Wave fill="#ffffff" position="top" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-0 size-[420px] rounded-full bg-sky/30 blur-3xl" />
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[2rem] leading-[1.1] font-bold tracking-tight text-balance md:text-5xl">{t("title")}</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{t("text")}</p>
          <a href={site.phone.href} className="mt-8 inline-flex items-center gap-3 text-2xl font-bold md:text-3xl">
            <span className="grid size-12 place-items-center rounded-full bg-white/15">
              <Icon name="phone" />
            </span>
            {site.phone.display}
          </a>
          <p className="mt-8 text-sm font-semibold text-white/70">{t("or")}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={site.messengers.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-semibold ring-1 ring-white/25 transition hover:bg-white/20"
            >
              <Icon name="send" size={18} />
              {t("telegram")}
            </a>
            <a
              href={site.messengers.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-5 font-semibold ring-1 ring-white/25 transition hover:bg-white/20"
            >
              <Icon name="chat" size={18} />
              {t("whatsapp")}
            </a>
          </div>
        </div>
        <div className="rounded-[32px] bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-md md:p-8">
          <LeadForm source="final" showComment tone="dark" />
        </div>
      </div>
    </section>
  );
}
