import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  // `/` serves Russian, `/en` serves English.
  localePrefix: "as-needed",
  // Russian visitors with English browsers must still land on the Russian page;
  // English traffic is linked to `/en` directly and there is a visible switcher.
  localeDetection: false,
  // No cookies on the landing, so no cookie banner is required.
  localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];
