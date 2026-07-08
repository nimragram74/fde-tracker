import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { currentUser } from "../../../../lib/rbac";
import { Heatmap, type HeatWeek } from "@/components/Heatmap";
import { StatCard } from "@/components/StatCard";
import { Badge, participantTone, certTone, capstoneTone, labelize } from "@/components/Badge";
import { TOTAL_DAYS } from "../../../../lib/program";
import { setDayStatus } from "../../actions";
import { ArrowLeft, GraduationCap, CheckCircle2, Star, Award, Rocket } from "lucide-react";

export const dynamic = "force-dynamic";

const progressTone: Record<string, "green" | "azure" | "slate"> = {
  DONE: "green",
  IN_PROGRESS: "azure",
  NOT_STARTED: "slate",
};

export default async function ParticipantDetail({ params }: { params: { id: string } }) {
  const [p, weeks, me] = await Promise.all([
    prisma.participant.findUnique({
      where: { id: params.id },
      include: {
        cohort: true,
        progress: true,
        certifications: { orderBy: { code: "asc" } },
        capstones: true,
      },
    }),
    prisma.week.findMany({ orderBy: { number: "asc" }, include: { days: { orderBy: { orderIndex: "asc" } } } }),
    currentUser(),
  ]);
  if (!p) notFound();

  const canEdit = me?.role === "ADMIN" || me?.role === "MENTOR";
  const byDay = new Map(p.progress.map((pr) => [pr.dayId, pr]));
  const doneList = p.progress.filter((pr) => pr.status === "DONE");
  const done = doneList.length;
  const completion = Math.round((done / TOTAL_DAYS) * 100);
  const scored = doneList.filter((pr) => pr.score != null);
  const avgScore = scored.length
    ? Math.round(scored.reduce((s, pr) => s + (pr.score ?? 0), 0) / scored.length)
    : 0;
  const certsPassed = p.certifications.filter((c) => c.status === "PASSED").length;
  const capstone = p.capstones[0];

  const heat: HeatWeek[] = weeks.map((w) => ({
    number: w.number,
    code: w.code,
    days: w.days.map((d) => ({
      label: d.label,
      focus: d.focus,
      status: byDay.get(d.id)?.status ?? "NOT_STARTED",
    })),
  }));

  return (
    <div className="space-y-6">
      <Link href="/participants" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-azure">
        <ArrowLeft size={15} /> Participants
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-700 text-lg font-bold text-white">
              {p.name.split(" ").slice(0, 2).map((s) => s[0]).join("")}
            </div>
            <div>
              <h1 className="h-page">{p.name}</h1>
              <div className="mt-0.5 text-sm text-slate-500">{p.title}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <Badge tone={participantTone[p.status]}>{labelize(p.status)}</Badge>
                <span className="chip">{p.pod}</span>
                <Link href={`/cohorts/${p.cohortId}`} className="chip hover:text-azure">
                  {p.cohort.name}
                </Link>
                <span className="chip">Target: {p.targetCert}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{completion}%</div>
            <div className="label">complete</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Days done" value={`${done}/${TOTAL_DAYS}`} icon={CheckCircle2} accent="#0e8a0e" />
        <StatCard label="Avg. quiz score" value={`${avgScore}%`} icon={Star} accent="#e8a90c" />
        <StatCard label="Certs passed" value={certsPassed} icon={Award} accent="#6b2fb3" />
        <StatCard label="Capstone" value={capstone ? labelize(capstone.status) : "—"} icon={Rocket} accent="#e8590c" />
      </div>

      {/* Heatmap */}
      <div className="card p-5">
        <h2 className="mb-4 font-semibold">Progress heatmap · 16 weeks × 5 days</h2>
        <Heatmap weeks={heat} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Certifications */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <GraduationCap size={16} className="text-grape" />
            <h2 className="font-semibold">Certifications</h2>
          </div>
          <table className="w-full">
            <tbody>
              {p.certifications.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="td">
                    <span className="font-mono text-xs font-semibold">{c.code}</span>
                    {c.isAppliedSkill && <span className="ml-2 chip">Applied Skill</span>}
                    <div className="text-[11px] text-slate-500">{c.name}</div>
                  </td>
                  <td className="td w-28 text-right">
                    <Badge tone={certTone[c.status]}>{labelize(c.status)}</Badge>
                  </td>
                </tr>
              ))}
              {p.certifications.length === 0 && (
                <tr><td className="td text-slate-500">No certifications tracked.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Capstone */}
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Rocket size={16} className="text-ship" />
            <h2 className="font-semibold">Capstone</h2>
          </div>
          {capstone ? (
            <div className="space-y-3">
              <div className="font-medium">{capstone.title}</div>
              <div className="flex items-center gap-2">
                <Badge tone={capstoneTone[capstone.status]}>{labelize(capstone.status)}</Badge>
                <span className="text-xs text-slate-500">
                  {capstone.agentsShipped}/{capstone.agentsPlanned} agents shipped
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <MiniStat label="Eval score" value={capstone.evalScore != null ? `${capstone.evalScore}%` : "—"} />
                <MiniStat label="Adoption" value={capstone.adoptionScore != null ? `${capstone.adoptionScore}%` : "—"} />
              </div>
              {capstone.deployUrl && (
                <a href={capstone.deployUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-azure hover:underline">
                  {capstone.deployUrl} →
                </a>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No capstone yet (begins Week 15).</div>
          )}
        </div>
      </div>

      {/* Editable progress log */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-semibold">Progress log</h2>
          <span className="text-xs text-slate-500">
            {canEdit ? "Mentor/Admin — click ○ ◐ ● to update" : "Read-only"}
          </span>
        </div>
        <div className="divide-y divide-line">
          {weeks.map((w) => {
            const wDone = w.days.filter((d) => byDay.get(d.id)?.status === "DONE").length;
            return (
              <details key={w.number} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3 hover:bg-slate-50">
                  <span className="grid h-7 w-7 place-items-center rounded-md text-xs font-bold text-white" style={{ background: w.accent }}>
                    {w.number}
                  </span>
                  <span className="font-medium">{w.title}</span>
                  <span className="ml-auto text-xs text-slate-500">{wDone}/5 done</span>
                </summary>
                <div className="space-y-1 px-5 pb-4">
                  {w.days.map((d) => {
                    const st = byDay.get(d.id)?.status ?? "NOT_STARTED";
                    return (
                      <div key={d.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                        <span className="w-9 shrink-0 font-mono text-[11px] font-semibold text-azure-deep">{d.label}</span>
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{d.focus}</span>
                        {canEdit ? (
                          <form action={setDayStatus} className="flex shrink-0 gap-1">
                            <input type="hidden" name="participantId" value={p.id} />
                            <input type="hidden" name="dayId" value={d.id} />
                            <StatusButton value="NOT_STARTED" active={st === "NOT_STARTED"} glyph="○" />
                            <StatusButton value="IN_PROGRESS" active={st === "IN_PROGRESS"} glyph="◐" />
                            <StatusButton value="DONE" active={st === "DONE"} glyph="●" />
                          </form>
                        ) : (
                          <Badge tone={progressTone[st]}>{labelize(st)}</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-slate-50 p-3">
      <div className="label">{label}</div>
      <div className="mt-0.5 text-lg font-bold">{value}</div>
    </div>
  );
}

function StatusButton({ value, active, glyph }: { value: string; active: boolean; glyph: string }) {
  const color =
    value === "DONE" ? "#0e8a0e" : value === "IN_PROGRESS" ? "#0a6ed1" : "#94a3b8";
  return (
    <button
      name="status"
      value={value}
      title={value.replace("_", " ").toLowerCase()}
      className={`grid h-7 w-7 place-items-center rounded-md border text-sm transition ${
        active ? "border-transparent text-white" : "border-line bg-white hover:bg-slate-100"
      }`}
      style={active ? { backgroundColor: color } : { color }}
    >
      {glyph}
    </button>
  );
}
