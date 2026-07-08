"use server";

import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/rbac";
import { revalidatePath } from "next/cache";

const FEATURE_KEYS = ["analytics", "sso", "exports", "api", "prioritySupport", "customBranding"] as const;

/** Switch the org's active subscription plan. */
export async function setActivePlan(formData: FormData) {
  await requireAdmin();
  const planKey = String(formData.get("planKey"));
  const org = await prisma.org.findFirst();
  if (org) await prisma.org.update({ where: { id: org.id }, data: { planKey } });
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

/** Edit a plan's price, limits, and feature flags. */
export async function updatePlan(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key"));
  const features = Object.fromEntries(
    FEATURE_KEYS.map((k) => [k, formData.get(`feat_${k}`) === "on"]),
  );
  await prisma.plan.update({
    where: { key },
    data: {
      name: String(formData.get("name") || key),
      priceMonthly: parseInt(String(formData.get("priceMonthly") || "0"), 10) || 0,
      maxCohorts: parseInt(String(formData.get("maxCohorts") || "1"), 10) || 1,
      maxParticipants: parseInt(String(formData.get("maxParticipants") || "25"), 10) || 25,
      features,
    },
  });
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

/** Rename the organisation. */
export async function updateOrgName(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("orgName") || "").trim();
  if (!name) return;
  const org = await prisma.org.findFirst();
  if (org) await prisma.org.update({ where: { id: org.id }, data: { name } });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

/** Record the intended DB provider label (informational; actual switch is env/schema). */
export async function updateDbProviderLabel(formData: FormData) {
  await requireAdmin();
  const provider = String(formData.get("provider") || "postgresql");
  await prisma.appSetting.upsert({
    where: { key: "db.provider" },
    update: { value: provider },
    create: { key: "db.provider", value: provider },
  });
  revalidatePath("/admin/settings");
}
