import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge, capstoneTone, labelize } from "@/components/Badge";
import { Rocket, CheckCircle2, Gauge, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CapstonesPage() {
  const capstones = await prisma.capstone.findMany({
    orderBy: { updatedAt: "desc" },
    include: { participant: { select: { id: true, name: true, pod: true } } },
  });

  const live = capstones.filter((c) => c.status === "DEPLOYED" || c.status === "PRESENTED").length;
  const evalScores = capstones.filter((c) => c.evalScore != null).map((c) => c.evalScore as number);
  const adoptionScores = capstones.filter((c) => c.adoptionScore != null).map((c) => c.adoptionScore as number);
  const avg = (a: number[]) => (a.length ? Math.round(a.reduce((s, n) => s + n, 0) / a.length) : 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Capstones</h1>
        <p className="mt-1 text-sm text-slate-500">
          The two-week embed simulation — up to 5 agents per engagement, shipped and proven.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Capstones" value={capstones.length} icon={Rocket} accent="#e8590c" />
        <StatCard label="Live (deployed/presented)" value={live} icon={CheckCircle2} accent="#0e8a0e" />
        <StatCard label="Avg. eval score" value={`${avg(evalScores)}%`} icon={Gauge} accent="#0a6ed1" />
        <StatCard label="Avg. adoption" value={`${avg(adoptionScores)}%`} icon={Users} accent="#6b2fb3" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capstones.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <Badge tone={capstoneTone[c.status]}>{labelize(c.status)}</Badge>
              <span className="text-xs text-slate-500">
                {c.agentsShipped}/{c.agentsPlanned} agents
              </span>
            </div>
            <h2 className="mt-2 font-semibold leading-snug">{c.title}</h2>
            <Link href={`/participants/${c.participant.id}`} className="text-xs text-slate-500 hover:text-azure">
              {c.participant.name} · {c.participant.pod}
            </Link>

            <div className="mt-4 space-y-2.5">
              <ScoreRow label="Eval" value={c.evalScore} accent="#0a6ed1" />
              <ScoreRow label="Adoption" value={c.adoptionScore} accent="#0e8a0e" />
            </div>

            {c.deployUrl && (
              <a href={c.deployUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-azure hover:underline">
                View deployment →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreRow({ label, value, accent }: { label: string; value: number | null; accent: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="tabular-nums text-slate-500">{value != null ? `${value}%` : "—"}</span>
      </div>
      <ProgressBar value={value ?? 0} accent={accent} height={6} />
    </div>
  );
}
