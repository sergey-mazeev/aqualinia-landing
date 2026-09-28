import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { locale as localeParam } from "next/root-params";
import { LegalPage } from "@/components/layout/LegalPage";
import { privacyContent } from "@/content/legal/privacy";
import type { AppLocale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await localeParam()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle"), alternates: alternatesFor(locale, "/privacy") };
}

export default function PrivacyPage() {
  const t = useTranslations("legal");
  const locale = useLocale();
  return <LegalPage title={t("privacyTitle")} sections={privacyContent(locale)} />;
}
