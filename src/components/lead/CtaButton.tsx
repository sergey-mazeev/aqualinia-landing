"use client";

import type { ReactNode } from "react";
import type { LeadSource } from "@/lib/leads/sources";
import { useLeadModal } from "./LeadModalProvider";

export function CtaButton({
  source,
  productSku,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  source: LeadSource;
  productSku?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const { open } = useLeadModal();
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      data-source={source}
      onClick={() => open({ source, productSku })}
    >
      {children}
    </button>
  );
}
