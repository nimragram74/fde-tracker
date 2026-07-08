import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/db";
import { ProgressBar } from "@/components/ProgressBar";
import { Badge, participantTone, labelize } from "@/components/Badge";
import { TOTAL_DAYS } from "../../../../lib/program";
import { ArrowLeft, CalendarDays, UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CohortDetail({ params }: { params: { id: string } }) {
  const c = await prisma.cohort.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              progress: { where: { status: "DONE" } },
              certifications: true,
            },
          },
        },
      },
    },
  });
  if (!c) notFound();

  const n = c.participants.length;
  const avg =
    n > 0
      ? Math.round(
          (c.participants.reduce((s, p) => s + p._count.progress, 0) / (n * TOTAL_DAYS)) * 100,
        )
      : 0;

  return (
    <div className="space-y-6">
      <Link href="/cohorts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-azure">
        <ArrowLeft size={15} /> Cohorts
      </Link>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="h-page">{c.name}</h1>
            <div className="mt-1 font-mono text-xs text-slate-400">{c.code}</div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} /> {c.startDate.toLocaleDateString()} →{" "}
                {c.endDate.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <UserCog size={14} /> Pod lead: {c.podLead ?? "—"}
              </span>
              <span>Track: {c.track}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{avg}%</div>
            <div className="label">avg. completion</div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-5 py-3">
          <h2 className="font-semibold">Participants ({n})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Pod</th>
                <th className="th">Status</th>
                <th className="th">Target cert</th>
                <th className="th w-52">Completion</th>
              </tr>
            </thead>
            <tbody>
              {c.participants.map((p) => {
                const pct = Math.round((p._count.progress / TOTAL_DAYS) * 100);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="td">
                      <Link href={`/participants/${p.id}`} className="font-semibold text-ink hover:text-azure">
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-slate-500">{p.title}</div>
                    </td>
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
