import { useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { localizedPath } from "@/lib/site-url";
import { LogoMark } from "@/components/illustrations/Logo";
import { CtaButton } from "@/components/lead/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS } from "./nav";
import { PromoBar } from "./PromoBar";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const home = localizedPath(locale);
  const anchorBase = home === "/" ? "/" : home;

  return (
    <>
      <PromoBar />
      <header className="sticky top-0 z-50 border-b border-line/70 bg-white/85 backdrop-blur-md">
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <a href={home} className="flex items-center gap-2.5" aria-label={site.brand[locale]}>
            <LogoMark />
            <span className="text-xl font-bold tracking-tight">{site.brand[locale]}</span>
          </a>

          <nav aria-label="primary" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`${anchorBase}#${item.id}`}
                className="rounded-full px-3.5 py-2 text-[15px] font-medium text-muted transition hover:bg-pale hover:text-deep"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a href={site.phone.href} className="hidden flex-col items-end leading-tight xl:flex">
              <span className="font-bold">{site.phone.display}</span>
              <span className="text-xs text-muted">{site.hours[locale]}</span>
            </a>
            <a
              href={site.phone.href}
              aria-label={site.phone.display}
              className="grid size-11 place-items-center rounded-full text-blue ring-1 ring-line transition hover:bg-pale md:hidden"
            >
              <Icon name="phone" size={20} />
            </a>
            <div className="hidden sm:block">
              <LocaleSwitcher />
            </div>
            <div className="hidden md:block">
              <CtaButton source="header_callback" className={buttonClass("secondary", "sm")}>
                {t("callback")}
              </CtaButton>
            </div>
            <MobileMenu homeHref={anchorBase} />
          </div>
        </div>
      </header>
    </>
  );
}
