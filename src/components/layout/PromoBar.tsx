"use client";

import { useEffect, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { sessionFlag } from "@/components/lead/client-utils";

const DISMISS_KEY = "promo_dismissed";
const DEADLINE_MS = Date.parse(site.promo.deadline);

/** Rendered at build time; hidden in the browser once the deadline passes or the visitor dismisses it. */
export function PromoBar() {
  const t = useTranslations("promo");
  const locale = useLocale();
  const format = useFormatter();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Sync with browser-only state (current time, sessionStorage) after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Date.now() > DEADLINE_MS || sessionFlag(DISMISS_KEY)) setHidden(true);
  }, []);

  if (!site.promo.enabled || hidden) return null;

  return (
    <div className="relative bg-deep text-white">
      <div className="container-x flex min-h-10 items-center justify-center gap-2 py-2 pr-10 text-center text-[13px] md:text-sm">
        <Icon name="gift" size={18} className="hidden shrink-0 text-sky sm:block" />
        <p>
          <span className="font-semibold">{site.promo.text[locale]}</span>{" "}
          <span className="text-sky">{t("until", { date: format.dateTime(DEADLINE_MS, { day: "numeric", month: "long" }) })}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          sessionFlag(DISMISS_KEY, true);
          setHidden(true);
        }}
        aria-label={t("close")}
        className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
