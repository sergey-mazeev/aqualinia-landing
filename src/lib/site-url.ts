import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";

/** Public origin of the site. Read at build time for static metadata (pass as a Docker build arg). */
export function getSiteUrl(): URL {
  return new URL(process.env.SITE_URL || "http://localhost:3000");
}

/** Path as served for a locale with `localePrefix: "as-needed"` (`/` for ru, `/en` for en). */
export function localizedPath(locale: AppLocale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  if (locale === "ru") return clean || "/";
  return `/en${clean}`;
}

export function alternatesFor(locale: AppLocale, path = "/"): Metadata["alternates"] {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ru: localizedPath("ru", path),
      en: localizedPath("en", path),
      "x-default": localizedPath("ru", path),
    },
  };
}
