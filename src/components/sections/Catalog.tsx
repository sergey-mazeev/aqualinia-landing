"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { CATALOG_CHIPS, type CatalogChip, type Category } from "@/data/taxonomy";
import { SectionHeading } from "@/components/ui/Section";
import { ProductCard } from "./ProductCard";

const TABS: Category[] = ["flow", "pitcher"];

function matches(chip: CatalogChip, product: (typeof products)[number]): boolean {
  if (chip === "all") return true;
  if (chip === "kids") return product.forKids;
  return product.problems.includes(chip);
}

export function Catalog() {
  const t = useTranslations("catalog");
  const [tab, setTab] = useState<Category>("flow");
  const [chip, setChip] = useState<CatalogChip>("all");

  const inTab = useMemo(() => products.filter((p) => p.category === tab), [tab]);
  const visible = inTab.filter((p) => matches(chip, p));

  return (
    <section id="catalog" className="relative bg-white py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <div className="flex flex-col items-center gap-5">
          <div role="tablist" aria-label={t("title")} className="inline-flex rounded-full bg-pale p-1.5 ring-1 ring-line">
            {TABS.map((key) => {
              const selected = tab === key;
              const count = products.filter((p) => p.category === key).length;
              return (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  id={`tab-${key}`}
                  aria-selected={selected}
                  aria-controls="catalog-panel"
                  onClick={() => {
                    setTab(key);
                    setChip("all");
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:px-6 sm:text-base ${
                    selected ? "bg-white text-deep shadow-card" : "text-muted hover:text-deep"
                  }`}
                >
                  {t(`tabs.${key}`)}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-blue text-white" : "bg-white text-muted"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div role="group" aria-label={t("chipsLabel")} className="flex max-w-full gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {CATALOG_CHIPS.map((key) => {
              const selected = chip === key;
              const available = key === "all" || inTab.some((p) => matches(key, p));
              if (!available) return null;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setChip(key)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                    selected ? "bg-deep text-white ring-deep" : "bg-white text-deep ring-line hover:ring-sky"
                  }`}
                >
                  {t(`chips.${key}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="catalog-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          aria-live="polite"
          className="mt-10"
        >
          {visible.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-pale p-10 text-center">
              <p className="text-muted">{t("empty")}</p>
              <button
                type="button"
                onClick={() => setChip("all")}
                className="mt-4 font-semibold text-blue hover:underline"
              >
                {t("reset")}
              </button>
            </div>
          )}
          {site.showInstallments && <p className="mt-6 text-center text-xs text-muted">* {t("installmentsNote")}</p>}
        </div>
      </div>
    </section>
  );
}
