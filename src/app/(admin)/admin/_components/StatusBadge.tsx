import { STATUS_LABELS, type LeadStatus } from "@/lib/leads/sources";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-blue text-white",
  in_progress: "bg-[#fdf1d6] text-[#7a4f00]",
  won: "bg-mint text-sea",
  lost: "bg-slate-100 text-slate-600",
  spam: "bg-[#fdecea] text-sale",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
