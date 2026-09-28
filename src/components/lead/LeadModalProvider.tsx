"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { LeadSource } from "@/lib/leads/sources";
import { Icon } from "@/components/ui/Icon";
import { captureAttribution } from "./client-utils";
import { LeadForm } from "./LeadForm";
import { ProductSummary } from "./ProductSummary";
import { Quiz } from "./Quiz";

export type OpenLeadModal = { source: LeadSource; productSku?: string };

type ContextValue = {
  open: (options: OpenLeadModal) => void;
  close: () => void;
  isOpen: boolean;
};

const LeadModalContext = createContext<ContextValue | null>(null);

export function useLeadModal(): ContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal must be used inside LeadModalProvider");
  return ctx;
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(OpenLeadModal & { key: number }) | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (state && !dialog.open) dialog.showModal();
    if (!state && dialog.open) dialog.close();
  }, [state]);

  const open = useCallback((options: OpenLeadModal) => {
    setState((prev) => ({ ...options, key: (prev?.key ?? 0) + 1 }));
  }, []);
  const close = useCallback(() => setState(null), []);

  const value = useMemo(() => ({ open, close, isOpen: state !== null }), [open, close, state]);

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="lead-modal-title"
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[calc(100dvh-24px)] w-[min(560px,calc(100vw-24px))] overflow-hidden rounded-[28px] bg-white p-0 text-deep shadow-lift open:animate-fade-up"
      >
        {state && <ModalBody key={state.key} source={state.source} productSku={state.productSku} onClose={close} />}
      </dialog>
    </LeadModalContext.Provider>
  );
}

function ModalBody({ source, productSku, onClose }: OpenLeadModal & { onClose: () => void }) {
  const t = useTranslations("form");
  const subtitle = t(`subtitles.${source}`);
  const isQuiz = source === "hero_quiz" || source === "quiz";

  return (
    <div className="max-h-[calc(100dvh-24px)] overflow-y-auto overscroll-contain">
      <div className="relative bg-linear-to-br from-pale to-mint/60 px-6 pt-7 pb-6 md:px-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/80 text-deep transition hover:bg-white"
        >
          <Icon name="close" size={20} />
        </button>
        {source === "exit_popup" && (
          <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-white text-sea">
            <Icon name="gift" />
          </span>
        )}
        <h2 id="lead-modal-title" className="pr-10 text-2xl leading-tight font-bold md:text-[1.75rem]">
          {t(`titles.${source}`)}
        </h2>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </div>
      <div className="px-6 pt-6 pb-7 md:px-8">
        {isQuiz ? (
          <Quiz source={source} onClose={onClose} />
        ) : (
          <>
            {source === "product" && productSku && <ProductSummary sku={productSku} />}
            <LeadForm
              source={source}
              productSku={productSku}
              showQuantity={source === "product"}
              showComment={source === "product"}
              onClose={onClose}
              autoFocus
            />
          </>
        )}
      </div>
    </div>
  );
}
