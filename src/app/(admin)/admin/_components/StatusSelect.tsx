"use client";

import { useTransition } from "react";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from "@/lib/leads/sources";
import { updateStatusAction } from "../actions";

/** Inline status switcher: saves on change. */
export function StatusSelect({ id, status, label }: { id: number; status: LeadStatus; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      aria-label={label}
      defaultValue={status}
      disabled={pending}
      onChange={(event) => {
        const data = new FormData();
        data.set("id", String(id));
        data.set("status", event.target.value);
        startTransition(() => updateStatusAction(data));
      }}
      className="h-9 rounded-xl border border-line bg-white px-2 text-sm font-medium outline-none focus:border-blue disabled:opacity-60"
    >
      {LEAD_STATUSES.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
