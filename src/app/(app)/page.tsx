import Link from "next/link";
import { prisma } from "../../lib/db";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusDonut, WeeklyBars } from "@/components/charts";
import { Badge, participantTone, labelize } from "@/components/Badge";
import { planUsage, hasFeature } from "../../lib/plans";
import { TOTAL_DAYS } from "../../lib/program";
import { Users, GraduationCap, Award, Rocket, AlertTriangle, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [participants, days, certsPassed, capstonesLive, usage, analytics] = await Promise.all([
    prisma.participant.findMany({ include: { progress: true, cohort: true } }),
    prisma.day.findMany({ select: { id: true, weekNumber: true } }),
    prisma.certification.count({ where: { status: "PASSED" } }),
    prisma.capstone.count({ where: { status: { in: ["DEPLOYED", "PRESENTED"] } } }),
    planUsage(),
    hasFeature("analytics"),
  ]);

  const dayWeek = new Map(days.map((d) => [d.id, d.weekNumber]));
  const doneOf = (p: (typeof participants)[number]) =>
    p.progress.filter((x) => x.status === "DONE").length;
  const completion = (p: (typeof participants)[number]) =>
    Math.round((doneOf(p) / TOTAL_DAYS) * 100);

  const active = participants.filter((p) => p.status !== "DROPPED");
  const avgCompletion = active.length
    ? Math.round(active.reduce((s, p) => s + completion(p), 0) / active.length)
    : 0;

  const count = (s: string) => participants.filter((p) => p.status === s).length;
  const donut = [
    { name: "Active", value: count("ACTIVE"), color: "#0e8a0e" },
    { name: "At risk", value: count("AT_RISK"), color: "#e8a90c" },
    { name: "Completed", value: count("COMPLETED"), color: "#0a6ed1" },
    { name: "Dropped", value: count("DROPPED"), color: "#e05656" },
  ].filter((d) => d.value > 0);

  const weekly = Array.from({ length: 16 }, (_, i) => ({ week: `W${i + 1}`, done: 0 }));
  for (const p of participants)
    for (const pr of p.progress)
      if (pr.status === "DONE") {
        const w = dayWeek.get(pr.dayId);
        if (w) weekly[w - 1].done++;
      }

  const atRisk = participants
    .filter((p) => p.status === "AT_RISK")
    .sort((a, b) => completion(a) - completion(b));
  const top = [...active].sort((a, b) => completion(b) - completion(a)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="h-page">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Live view across {usage.cohorts} cohort{usage.cohorts === 1 ? "" : "s"} · program is
            a 16-week ({TOTAL_DAYS}-day) build path.
          </p>
        </div>
        <Link href="/participants" className="btn btn-ghost text-sm">
          View all participants
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active engineers" value={active.length} sub={`${participants.length} enrolled total`} icon={Users} accent="#0a6ed1" />
        <StatCard label="Avg. completion" value={`${avgCompletion}%`} sub={`of ${TOTAL_DAYS} days`} icon={GraduationCap} accent="#0e8a0e" />
        <StatCard label="Certifications passed" value={certsPassed} sub="incl. Applied Skills" icon={Award} accent="#6b2fb3" />
        <StatCard label="Capstones live" value={capstonesLive} sub="deployed or presented" icon={Rocket} accent="#e8590c" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-semibold">Day completions by week</h2>
            {!analytics && <LockedChip />}
          </div>
          {analytics ? (
            <WeeklyBars data={weekly} />
          ) : (
            <UpgradeBlock feature="Advanced analytics" />
          )}
        </div>
        <div className="card p-5">
          <h2 className="mb-1 font-semibold">Participant status</h2>
          {donut.length ? <StatusDonut data={donut} /> : <Empty />}
          <div className="mt-3 flex flex-wrap gap-2">
            {donut.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} · {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Plan usage */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Plan usage — {usage.plan?.name ?? "—"}</h2>
          <Link href="/admin/plans" className="text-xs font-semibold text-azure hover:underline">
            Manage plan
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <UsageRow label="Cohorts" used={usage.cohorts} max={usage.maxCohorts} pct={usage.cohortsPct} />
          <UsageRow label="Participants" used={usage.participants} max={usage.maxParticipants} pct={usage.participantsPct} />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-semibold">At-risk engineers</h2>
            <span className="ml-auto text-xs text-slate-500">{atRisk.length}</span>
          </div>
          {atRisk.length ? (
            <table className="w-full">
              <tbody>
                {atRisk.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="td">
                      <Link href={`/participants/${p.id}`} className="font-semibold text-ink hover:text-azure">
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-slate-500">{p.pod}</div>
                    </td>
                    <td className="td w-40">
                      <ProgressBar value={completion(p)} accent="#e8a90c" showLabel />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-sm text-slate-500">No at-risk engineers. 🎉</div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line px-5 py-3">
            <h2 className="font-semibold">Top progress</h2>
          </div>
          <table className="w-full">
            <tbody>
              {top.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="td">
                    <Link href={`/participants/${p.id}`} className="font-semibold text-ink hover:text-azure">
                      {p.name}
                    </Link>
                    <div className="text-[11px] text-slate-500">{p.title}</div>
                  </td>
                  <td className="td w-24 text-right">
                    <Badge tone={participantTone[p.status]}>{labelize(p.status)}</Badge>
                  </td>
                  <td className="td w-40">
                    <ProgressBar value={completion(p)} showLabel />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsageRow({ label, used, max, pct }: { label: string; used: number; max: number; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="tabular-nums text-slate-500">
          {used} / {max >= 100000 ? "∞" : max}
        </span>
      </div>
      <ProgressBar value={pct} accent={pct > 85 ? "#e8590c" : "#0a6ed1"} />
    </div>
  );
}

function LockedChip() {
  return (
    <span className="chip">
      <Lock size={12} /> Pro
    </span>
  );
}
function UpgradeBlock({ feature }: { feature: string }) {
  return (
    <div className="grid h-[220px] place-items-center rounded-lg border border-dashed border-line bg-slate-50 text-center">
      <div>
        <Lock className="mx-auto mb-2 text-slate-400" />
        <div className="text-sm font-semibold">{feature} is a Pro feature</div>
        <Link href="/admin/plans" className="mt-1 inline-block text-xs font-semibold text-azure hover:underline">
          Upgrade plan →
        </Link>
      </div>
    </div>
  );
}
function Empty() {
  return <div className="grid h-[220px] place-items-center text-sm text-slate-400">No data yet</div>;
}
