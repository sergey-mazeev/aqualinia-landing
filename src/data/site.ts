// PLACEHOLDER: every value in this file is a stand-in. Replace with real data before launch.
import type { Localized } from "./taxonomy";

export const site = {
  brand: { ru: "АкваЛиния", en: "AquaLinia" } satisfies Localized,

  phone: {
    display: "+7 (800) 000-00-00",
    href: "tel:+78000000000",
  },
  hours: { ru: "Ежедневно 9:00–21:00 (МСК)", en: "Daily 9:00–21:00 (Moscow time)" } satisfies Localized,
  email: "hello@example.ru",
  messengers: {
    telegram: "https://t.me/example_aqualinia",
    whatsapp: "https://wa.me/78000000000",
  },
  /** Contact methods offered in forms. Adjust if a messenger becomes unavailable. */
  contactMethods: ["call", "telegram", "whatsapp"] as const,

  /** Promo bar: shown only until the deadline (checked in the browser, the page is static). */
  promo: {
    enabled: true,
    deadline: "2026-10-31T23:59:59+03:00",
    text: {
      ru: "Осенняя акция: картридж в подарок к любой проточной системе",
      en: "Autumn offer: a free cartridge with any under-sink system",
    } satisfies Localized,
  },

  /** Instalment hint on product cards. Off by default: advertising credit is regulated (38-FZ, art. 28). */
  showInstallments: false,
  installmentParts: 4,

  stats: {
    rating: 4.9,
    families: 12000,
    reviewCount: 2340,
    satisfiedPercent: 97,
    recommendPercent: 94,
  },

  /** Price of bottled water used as the calculator default, ₽ per litre (19 L bottle ≈ 450 ₽). */
  bottledPricePerLiter: 25,

  legal: {
    company: { ru: "ООО «АкваЛиния»", en: "AquaLinia LLC" } satisfies Localized,
    inn: "0000000000",
    ogrn: "0000000000000",
    address: {
      ru: "г. Москва, ул. Примерная, д. 1, офис 1",
      en: "1 Primernaya St., office 1, Moscow, Russia",
    } satisfies Localized,
    privacyEmail: "privacy@example.ru",
  },

  consentVersion: "2026-09-28",
} as const;

export type ContactMethod = (typeof site.contactMethods)[number];
