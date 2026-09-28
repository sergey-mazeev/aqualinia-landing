"use client";

import { useEffect } from "react";
import { sessionFlag, wasSubmitted } from "./client-utils";
import { useLeadModal } from "./LeadModalProvider";

const SHOWN_KEY = "exit_popup_shown";
const ARM_DELAY_MS = 10_000;

/** Desktop-only, once per session, never after a lead was sent or while another modal is open. */
export function ExitIntent() {
  const { open, isOpen } = useLeadModal();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
    if (sessionFlag(SHOWN_KEY) || wasSubmitted()) return;

    const armedAt = Date.now() + ARM_DELAY_MS;
    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0) return;
      if (Date.now() < armedAt || isOpen) return;
      if (sessionFlag(SHOWN_KEY) || wasSubmitted()) return;
      sessionFlag(SHOWN_KEY, true);
      open({ source: "exit_popup" });
    };
    document.documentElement.addEventListener("mouseout", onMouseOut);
    return () => document.documentElement.removeEventListener("mouseout", onMouseOut);
  }, [open, isOpen]);

  return null;
}
