"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const target = locale === "ru" ? "en" : "ru";
  return (
    <Link
      href={pathname}
      locale={target}
      hrefLang={target}
      aria-label={t("switchLabel")}
      className={`inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-bold ring-1 ring-line transition hover:bg-pale hover:ring-sky ${className}`}
    >
      <span className="text-muted">{locale.toUpperCase()}</span>
      <span className="text-line">/</span>
      <span className="text-blue">{t("switchTo")}</span>
    </Link>
  );
}
