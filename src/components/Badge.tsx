import type { ReactNode } from "react";

type Tone = "slate" | "green" | "amber" | "azure" | "red" | "gold" | "grape";

const tones: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-600 border-slate-300",
  green: "bg-emerald-50 text-emerald-700 border-emerald-300",
  amber: "bg-amber-50 text-amber-700 border-amber-300",
  azure: "bg-sky-50 text-sky-700 border-sky-300",
  red: "bg-rose-50 text-rose-700 border-rose-300",
  gold: "bg-gold/15 text-[#8a6400] border-gold/60",
  grape: "bg-violet-50 text-violet-700 border-violet-300",
};

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

// Shared status → tone maps used across pages.
export const participantTone: Record<string, Tone> = {
  ACTIVE: "green",
  AT_RISK: "amber",
  COMPLETED: "azure",
  DROPPED: "red",
};
export const certTone: Record<string, Tone> = {
  PLANNED: "slate",
  IN_PROGRESS: "amber",
  PASSED: "green",
  FAILED: "red",
};
export const capstoneTone: Record<string, Tone> = {
  PLANNED: "slate",
  BUILDING: "amber",
  EVALUATED: "grape",
  DEPLOYED: "azure",
  PRESENTED: "green",
};

export function labelize(s: string) {
  return s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}
