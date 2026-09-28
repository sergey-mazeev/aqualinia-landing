"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/data/site";
import { LogoMark } from "@/components/illustrations/Logo";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead/LeadModalProvider";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NAV_ITEMS } from "./nav";

/**
 * Full-screen overlay rendered in a portal: the sticky header uses backdrop-filter,
 * which would otherwise become the containing block of a fixed-position panel.
 */
export function MobileMenu({ homeHref }: { homeHref: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { open: openModal } = useLeadModal();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  // Scroll only after the menu has closed and the page scroll lock is released;
  // otherwise the browser aborts the smooth scroll halfway.
  function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return; // another page: let the link navigate home
    event.preventDefault();
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 60);
  }

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("menu")}
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full ring-1 ring-line transition hover:bg-pale"
      >
        <Icon name="menu" size={22} />
      </button>
      {open &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            className="fixed inset-0 z-[60] flex animate-fade-up flex-col overflow-y-auto bg-white"
          >
            <div className="container-x flex h-[72px] shrink-0 items-center justify-between border-b border-line">
              <a href={homeHref} onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                <LogoMark />
                <span className="text-xl font-bold">{site.brand[locale]}</span>
              </a>
              <button
                ref={closeRef}
                type="button"
                aria-label={t("close")}
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full ring-1 ring-line transition hover:bg-pale"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <nav className="container-x flex flex-col pt-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`${homeHref}#${item.id}`}
                  onClick={(event) => goTo(event, item.id)}
                  className="flex items-center justify-between border-b border-line py-4 text-xl font-semibold"
                >
                  {t(item.key)}
                  <Icon name="arrow" size={20} className="text-sky" />
                </a>
              ))}
            </nav>
            <div className="container-x mt-8 flex flex-col gap-3 pb-10">
              <a href={site.phone.href} className="text-2xl font-bold">
                {site.phone.display}
              </a>
              <p className="-mt-2 text-sm text-muted">{site.hours[locale]}</p>
              <button
                type="button"
                className={buttonClass("primary", "lg", "mt-2 w-full")}
                onClick={() => {
                  setOpen(false);
                  openModal({ source: "header_callback" });
                }}
              >
                {t("callback")}
              </button>
              <div>
                <LocaleSwitcher />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
