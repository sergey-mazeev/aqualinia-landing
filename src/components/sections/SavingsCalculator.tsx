"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";
import { formatNumber, formatRub } from "@/lib/format";
import { calculateSavings } from "@/lib/leads/savings";
import { CtaButton } from "@/components/lead/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/button";

const DEFAULT_SKU = "F-TRIO-STD";

export function SavingsCalculator() {
  const t = useTranslations("calc");
  const tc = useTranslations("catalog");
  const locale = useLocale();
  const id = useId();
  const [people, setPeople] = useState(3);
  const [price, setPrice] = useState<number>(site.bottledPricePerLiter);
  const [sku, setSku] = useState(DEFAULT_SKU);
  const product = getProduct(sku) ?? getProduct(DEFAULT_SKU)!;
  const result = calculateSavings({ people, bottledPricePerLiter: price, product });
  const bottles = Math.round(result.litersPerYear / 19);

  return (
    <div className="rounded-[32px] bg-white p-6 text-deep shadow-lift md:p-8">
      <p className="text-2xl font-bold">{t("title")}</p>
      <p className="mt-1 text-muted">{t("subtitle")}</p>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-people`} className="text-sm font-semibold">
              {t("people")}
            </label>
            <output htmlFor={`${id}-people`} className="font-bold text-blue">
              {t("peopleValue", { count: people })}
            </output>
          </div>
          <input
            id={`${id}-people`}
            type="range"
            min={1}
            max={6}
            step={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="w-full accent-blue"
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-price`} className="text-sm font-semibold">
              {t("price")}
            </label>
            <output htmlFor={`${id}-price`} className="font-bold text-blue">
              {t("priceValue", { price })}
            </output>
          </div>
          <input
            id={`${id}-price`}
            type="range"
            min={10}
            max={60}
            step={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-blue"
          />
        </div>

        <div>
          <label htmlFor={`${id}-product`} className="mb-2 block text-sm font-semibold">
            {t("product")}
          </label>
          <div className="relative">
            <select
              id={`${id}-product`}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-line bg-white pr-10 pl-4 font-medium outline-none focus:border-blue focus:ring-4 focus:ring-sky/30"
            >
              {(["flow", "pitcher"] as const).map((category) => (
                <optgroup key={category} label={tc(`tabs.${category}`)}>
                  {products
                    .filter((p) => p.category === category)
                    .map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.name[locale]} — {formatRub(p.price, locale)}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <Icon name="chevron" size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-pale p-4">
          <dt className="text-sm text-muted">{t("bottled")}</dt>
          <dd className="mt-1 text-xl font-bold">{formatRub(result.bottledPerYear, locale)}</dd>
        </div>
        <div className="rounded-2xl bg-pale p-4">
          <dt className="text-sm text-muted">{t("filterFirst")}</dt>
          <dd className="mt-1 text-xl font-bold">{formatRub(result.filterFirstYear, locale)}</dd>
        </div>
        <div className="rounded-2xl bg-mint p-5 sm:col-span-2">
          <dt className="text-sm font-semibold text-sea">{t("savings")}</dt>
          <dd className="mt-1 text-4xl font-extrabold tracking-tight" aria-live="polite">
            {formatRub(Math.max(0, result.savingsFirstYear), locale)}
          </dd>
          <dd className="mt-2 text-sm text-deep/80">
            {t("nextYears", { amount: formatRub(result.filterNextYears, locale) })}
          </dd>
          <dd className="mt-1 text-sm text-deep/80">{t("bottles", { count: formatNumber(bottles, locale) })}</dd>
        </div>
      </dl>

      <CtaButton source="product" productSku={product.sku} className={buttonClass("primary", "lg", "mt-6 w-full")}>
        {t("cta")}
        <Icon name="arrow" size={20} />
      </CtaButton>
    </div>
  );
}
