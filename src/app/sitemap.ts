import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl, localizedPath } from "@/lib/site-url";

const PAGES = ["/", "/privacy", "/consent"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: new URL(localizedPath(locale, page), base).toString(),
      changeFrequency: "weekly" as const,
      priority: page === "/" ? 1 : 0.3,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, new URL(localizedPath(l, page), base).toString()]),
        ),
      },
    })),
  );
}
