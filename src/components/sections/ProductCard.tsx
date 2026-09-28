"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { site } from "@/data/site";
import { formatRub } from "@/lib/format";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { CtaButton } from "@/components/lead/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { buttonClass } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("catalog");
  const locale = useLocale();
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const rating = product.rating.toFixed(1).replace(".", locale === "ru" ? "," : ".");

  return (
    <article className="group flex flex-col rounded-[28px] bg-white ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative m-2 grid aspect-[4/3] place-items-center overflow-hidden rounded-[22px] bg-linear-to-br from-pale via-pale to-mint/70">
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-deep px-2.5 py-1 text-xs font-semibold text-white">
              {t(`badges.${product.badge}`)}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-white">−{discount}%</span>
          )}
        </div>
        <ProductArt
          product={product}
          uid={`card-${product.sku}`}
          className="h-[78%] w-auto transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-3 pb-5">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Stars rating={product.rating} size={14} />
          <span className="font-semibold text-deep">{rating}</span>
          <span>· {t("reviews", { count: product.reviews })}</span>
        </p>
        <div>
          <h3 className="text-lg leading-snug font-bold">{product.name[locale]}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{product.tagline[locale]}</p>
        </div>
        <ul className="flex flex-col gap-1.5 text-sm">
          {product.bullets[locale].map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <Icon name="check" size={18} strokeWidth={2.4} className="mt-px shrink-0 text-sea" />
              {bullet}
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1.5 text-xs font-medium text-deep">
          <li className="rounded-full bg-pale px-2.5 py-1">{t("stages", { count: product.stages })}</li>
          <li className="rounded-full bg-pale px-2.5 py-1">
            {product.installMinutes
              ? t("install", { minutes: product.installMinutes })
              : product.volumeL
                ? t("volume", { volume: String(product.volumeL).replace(".", locale === "ru" ? "," : ".") })
                : t("noInstall")}
          </li>
        </ul>

        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-2xl font-extrabold tracking-tight">{formatRub(product.price, locale)}</span>
            {product.oldPrice && (
              <span className="text-muted line-through">{formatRub(product.oldPrice, locale)}</span>
            )}
          </div>
          {product.oldPrice && (
            <p className="mt-1 inline-flex rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-deep">
              {t("save", { amount: formatRub(product.oldPrice - product.price, locale) })}
            </p>
          )}
          {site.showInstallments && product.price >= 3000 && (
            <p className="mt-1 text-xs text-muted">
              {t("installments", {
                parts: site.installmentParts,
                amount: formatRub(Math.ceil(product.price / site.installmentParts), locale),
              })}
              *
            </p>
          )}
          <CtaButton
            source="product"
            productSku={product.sku}
            className={buttonClass("primary", "md", "mt-4 w-full")}
          >
            {t("order")}
          </CtaButton>
        </div>
      </div>
    </article>
  );
}
