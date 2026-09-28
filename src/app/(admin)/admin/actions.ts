"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateLead } from "@/lib/db/leads-repo";
import { LEAD_STATUSES } from "@/lib/leads/sources";

const statusInput = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(LEAD_STATUSES),
});

const noteInput = z.object({
  id: z.coerce.number().int().positive(),
  note: z.string().max(2000),
});

export async function updateStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = statusInput.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  await updateLead(parsed.data.id, { status: parsed.data.status });
  revalidatePath("/admin", "layout");
}

export async function updateNoteAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = noteInput.safeParse({ id: formData.get("id"), note: formData.get("note") ?? "" });
  if (!parsed.success) return;
  await updateLead(parsed.data.id, { adminNote: parsed.data.note.trim() || null });
  revalidatePath("/admin", "layout");
}
