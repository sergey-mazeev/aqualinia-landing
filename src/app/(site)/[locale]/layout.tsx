import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as localeParam } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { alternatesFor, getSiteUrl } from "@/lib/site-url";
import "../../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0077b6",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await localeParam();
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: getSiteUrl(),
    title: { default: t("title"), template: `%s — ${t("brand")}` },
    description: t("description"),
    alternates: alternatesFor(locale),
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      siteName: t("brand"),
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await localeParam();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={onest.variable}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
