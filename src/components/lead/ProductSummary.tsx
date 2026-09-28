"use client";

import { useLocale, useTranslations } from "next-intl";
import { getProduct } from "@/data/products";
import { formatRub } from "@/lib/format";
import { ProductArt } from "@/components/illustrations/ProductArt";

export function ProductSummary({ sku }: { sku: string }) {
  const locale = useLocale();
  const t = useTranslations("catalog");
  const product = getProduct(sku);
  if (!product) return null;
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl bg-pale p-3 pr-4">
      <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-white">
        <ProductArt product={product} uid={`sum-${sku}`} className="h-16 w-auto" />
      </div>
      <div className="min-w-0">
        <p className="leading-snug font-semibold">{product.name[locale]}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="text-base font-bold">{formatRub(product.price, locale)}</span>
          {product.oldPrice && (
            <span className="text-muted line-through">{formatRub(product.oldPrice, locale)}</span>
          )}
          {product.oldPrice && (
            <span className="font-semibold text-sea">
              {t("save", { amount: formatRub(product.oldPrice - product.price, locale) })}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
