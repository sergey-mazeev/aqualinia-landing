"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalProvider";

/** Mobile bottom bar: appears after the hero, hides near the final form and while a modal is open. */
export function StickyCtaBar() {
  const t = useTranslations("sticky");
  const { open, isOpen } = useLeadModal();
  const [pastHero, setPastHero] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById("contact");
    const observer = target
      ? new IntersectionObserver(([entry]) => setFinalVisible(entry.isIntersecting), { threshold: 0.1 })
      : null;
    if (target) observer?.observe(target);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !finalVisible && !isOpen;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex gap-3">
        <a
          href={site.phone.href}
          tabIndex={visible ? 0 : -1}
          className={buttonClass("ghost", "md", "flex-1")}
        >
          <Icon name="phone" size={18} />
          {t("call")}
        </a>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => open({ source: "sticky_bar" })}
          className={buttonClass("primary", "md", "flex-[1.4]")}
          data-source="sticky_bar"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
}
