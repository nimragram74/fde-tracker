import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge } from "@/components/Badge";
import { TOTAL_DAYS } from "@/lib/program";
import { Boxes, CalendarDays, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const statusTone: Record<string, "green" | "slate" | "azure"> = {
  ACTIVE: "green",
  PLANNED: "slate",
  COMPLETED: "azure",
};

export default async function CohortsPage() {
  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: "desc" },
    include: {
      participants: {
        select: { status: true, _count: { select: { progress: { where: { status: "DONE" } } } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Cohorts</h1>
        <p className="mt-1 text-sm text-slate-500">
          {cohorts.length} cohort{cohorts.length === 1 ? "" : "s"} running the FDE Academy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cohorts.map((c) => {
          const n = c.participants.length;
          const avg =
            n > 0
              ? Math.round(
                  (c.participants.reduce((s, p) => s + p._count.progress, 0) / (n * TOTAL_DAYS)) *
                    100,
                )
              : 0;
          const atRisk = c.participants.filter((p) => p.status === "AT_RISK").length;
          return (
            <Link key={c.id} href={`/cohorts/${c.id}`} className="card p-5 transition hover:shadow-pop">
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-azure/10 text-azure">
                  <Boxes size={19} />
                </span>
                <Badge tone={statusTone[c.status] ?? "slate"}>{c.status.toLowerCase()}</Badge>
              </div>
              <h2 className="mt-3 font-semibold">{c.name}</h2>
              <div className="font-mono text-[11px] text-slate-400">{c.code}</div>

              <div className="mt-3 space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {c.startDate.toLocaleDateString()} → {c.endDate.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} />
                  {n} participants
                  {atRisk > 0 && <span className="text-amber-600"> · {atRisk} at risk</span>}
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-slate-600">Avg. completion</span>
                  <span className="font-semibold tabular-nums">{avg}%</span>
                </div>
                <ProgressBar value={avg} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
