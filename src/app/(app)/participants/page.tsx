import Link from "next/link";
import { prisma } from "../../../lib/db";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge, participantTone, labelize } from "@/components/Badge";
import { TOTAL_DAYS } from "../../../lib/program";

export const dynamic = "force-dynamic";

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status?.toUpperCase();
  const participants = await prisma.participant.findMany({
    where: status && ["ACTIVE", "AT_RISK", "COMPLETED", "DROPPED"].includes(status)
      ? { status: status as never }
      : undefined,
    orderBy: [{ cohort: { code: "asc" } }, { name: "asc" }],
    include: {
      cohort: { select: { name: true, code: true } },
      _count: { select: { progress: { where: { status: "DONE" } }, certifications: true } },
    },
  });

  const filters = ["all", "active", "at_risk", "completed", "dropped"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="h-page">Participants</h1>
          <p className="mt-1 text-sm text-slate-500">{participants.length} engineers shown.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const active = (status?.toLowerCase() ?? "all") === f;
            return (
              <Link
                key={f}
                href={f === "all" ? "/participants" : `/participants?status=${f}`}
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                  active
                    ? "border-azure bg-azure text-white"
                    : "border-line bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.replace("_", " ")}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Cohort</th>
                <th className="th">Pod</th>
                <th className="th">Status</th>
                <th className="th">Target cert</th>
                <th className="th w-52">Completion</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => {
                const pct = Math.round((p._count.progress / TOTAL_DAYS) * 100);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="td">
                      <Link href={`/participants/${p.id}`} className="font-semibold text-ink hover:text-azure">
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-slate-500">{p.title}</div>
                    </td>
                    <td className="td text-slate-600">{p.cohort.name}</td>
                    <td className="td text-slate-600">{p.pod}</td>
                    <td className="td">
                      <Badge tone={participantTone[p.status]}>{labelize(p.status)}</Badge>
                    </td>
                    <td className="td">
                      <span className="chip">{p.targetCert}</span>
                    </td>
                    <td className="td">
                      <ProgressBar value={pct} showLabel />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
