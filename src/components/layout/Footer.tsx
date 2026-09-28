import { useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Link } from "@/i18n/navigation";
import { localizedPath } from "@/lib/site-url";
import { LogoMark } from "@/components/illustrations/Logo";
import { NAV_ITEMS } from "./nav";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tf = useTranslations("final");
  const locale = useLocale();
  const home = localizedPath(locale);
  const anchorBase = home === "/" ? "/" : home;
  const year = new Date(site.consentVersion).getFullYear();

  return (
    <footer className="bg-deep pt-16 pb-28 text-white/75 md:pb-12">
      <div className="container-x grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <a href={home} className="flex items-center gap-2.5 text-white">
            <LogoMark />
            <span className="text-xl font-bold">{site.brand[locale]}</span>
          </a>
          <p className="max-w-xs">{t("about")}</p>
        </div>
        <div>
          <p className="mb-4 font-semibold text-white">{t("navTitle")}</p>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`${anchorBase}#${item.id}`} className="transition hover:text-white">
                  {tn(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-semibold text-white">{t("contactsTitle")}</p>
          <ul className="flex flex-col gap-2">
            <li>
              <a href={site.phone.href} className="font-semibold text-white">
                {site.phone.display}
              </a>
            </li>
            <li>{site.hours[locale]}</li>
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-4">
              <a href={site.messengers.telegram} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                {tf("telegram")}
              </a>
              <a href={site.messengers.whatsapp} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                {tf("whatsapp")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-4 font-semibold text-white">{t("legalTitle")}</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>{site.legal.company[locale]}</li>
            <li>
              {t("inn")} {site.legal.inn} · {t("ogrn")} {site.legal.ogrn}
            </li>
            <li>{site.legal.address[locale]}</li>
            <li>
              <Link href="/privacy" className="underline-offset-2 transition hover:text-white hover:underline">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/consent" className="underline-offset-2 transition hover:text-white hover:underline">
                {t("consent")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:justify-between">
        <p>{t("offer")}</p>
        <p>
          © {year} {site.brand[locale]}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
