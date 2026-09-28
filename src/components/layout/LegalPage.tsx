import { useFormatter, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import type { LegalSection } from "@/content/legal/types";
import { Icon } from "@/components/ui/Icon";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  const t = useTranslations("legal");
  const format = useFormatter();
  return (
    <>
      <Header />
      <main className="bg-pale py-14 md:py-20">
        <article className="container-x max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:underline">
            <Icon name="arrowLeft" size={16} />
            {t("back")}
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">
            {t("updated", { date: format.dateTime(new Date(site.consentVersion), { dateStyle: "long" }) })}
          </p>
          <div className="mt-10 flex flex-col gap-8 rounded-[28px] bg-white p-6 shadow-card md:p-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
