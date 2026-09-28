import { useLocale, useTranslations } from "next-intl";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { Wave } from "@/components/illustrations/Wave";
import { Stars } from "@/components/ui/Stars";
import { Section, SectionHeading } from "@/components/ui/Section";

type Review = { name: string; city: string; sku: string; text: string };

export function Reviews() {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const items = t.raw("items") as Review[];
  const stats = [
    { value: site.stats.rating.toFixed(1).replace(".", locale === "ru" ? "," : "."), label: t("stats.rating") },
    { value: `${site.stats.satisfiedPercent}%`, label: t("stats.satisfied") },
    { value: `${formatNumber(site.stats.families, locale)}+`, label: t("stats.families") },
  ];

  return (
    <Section id="reviews" className="overflow-hidden bg-pale">
      <Wave fill="#ffffff" position="top" />
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <dl className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-4 text-center shadow-card md:p-6">
              <dt className="order-2 text-xs text-muted md:text-sm">{stat.label}</dt>
              <dd className="text-2xl font-extrabold text-blue md:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((review) => {
            const product = getProduct(review.sku);
            return (
              <li key={review.name + review.city} className="flex flex-col rounded-[28px] bg-white p-7 shadow-card">
                <Stars rating={5} size={18} />
                <blockquote className="mt-4 flex-1 leading-relaxed">«{review.text}»</blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-sky to-blue font-bold text-white">
                    {review.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {review.name}, <span className="font-normal text-muted">{review.city}</span>
                    </p>
                    {product && (
                      <p className="text-sm text-sea">{t("bought", { product: product.name[locale] })}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
