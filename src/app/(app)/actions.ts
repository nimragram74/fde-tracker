"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import type { ProgressStatus } from "@prisma/client";

async function canEdit() {
  const u = await currentUser();
  return u?.role === "ADMIN" || u?.role === "MENTOR";
}

/** Mentor/Admin: set a participant's status for one curriculum day. */
export async function setDayStatus(formData: FormData) {
  if (!(await canEdit())) throw new Error("Forbidden: mentor or admin role required.");
  const participantId = String(formData.get("participantId"));
  const dayId = String(formData.get("dayId"));
  const status = String(formData.get("status")) as ProgressStatus;

  await prisma.progress.upsert({
    where: { participantId_dayId: { participantId, dayId } },
    update: { status, completedAt: status === "DONE" ? new Date() : null },
    create: {
      participantId,
      dayId,
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  revalidatePath(`/participants/${participantId}`);
}
