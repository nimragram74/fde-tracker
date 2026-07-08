import { prisma } from "./db";
import type { Plan } from "@prisma/client";

export type PlanFeatures = {
  analytics: boolean;
  sso: boolean;
  exports: boolean;
  api: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
};

export const FEATURE_META: { key: keyof PlanFeatures; label: string; description: string }[] = [
  { key: "analytics", label: "Advanced analytics", description: "Charts, trends, at-risk detection & cohort comparisons." },
  { key: "sso", label: "Open access", description: "No SSO required for this deployment." },
  { key: "exports", label: "Data exports", description: "CSV / report exports of progress & certifications." },
  { key: "api", label: "API access", description: "Programmatic read access for downstream tools." },
  { key: "prioritySupport", label: "Priority support", description: "Faster support SLAs for the CoE." },
  { key: "customBranding", label: "Custom branding", description: "Org logo, colours & certificate branding." },
];

export async function getOrg() {
  return prisma.org.findFirst({ include: { plan: true } });
}

export async function getActivePlan(): Promise<Plan | null> {
  const org = await getOrg();
  return org?.plan ?? null;
}

export function planFeatures(plan: Plan | null): PlanFeatures {
  const f = (plan?.features ?? {}) as Partial<PlanFeatures>;
  return {
    analytics: !!f.analytics,
    sso: !!f.sso,
    exports: !!f.exports,
    api: !!f.api,
    prioritySupport: !!f.prioritySupport,
    customBranding: !!f.customBranding,
  };
}

export async function hasFeature(key: keyof PlanFeatures): Promise<boolean> {
  return planFeatures(await getActivePlan())[key];
}

// Usage vs the active plan's limits — powers the plan gauge on the dashboard.
export async function planUsage() {
  const plan = await getActivePlan();
  const [cohorts, participants] = await Promise.all([
    prisma.cohort.count(),
    prisma.participant.count(),
  ]);
  return {
    plan,
    cohorts,
    participants,
    maxCohorts: plan?.maxCohorts ?? 1,
    maxParticipants: plan?.maxParticipants ?? 25,
    cohortsPct: plan ? Math.min(100, Math.round((cohorts / plan.maxCohorts) * 100)) : 0,
    participantsPct: plan ? Math.min(100, Math.round((participants / plan.maxParticipants) * 100)) : 0,
  };
}
