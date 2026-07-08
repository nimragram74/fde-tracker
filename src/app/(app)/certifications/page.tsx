import Link from "next/link";
import { prisma } from "../../../lib/db";
import { StatCard } from "@/components/StatCard";
import { Badge, certTone, labelize } from "@/components/Badge";
import { CERT_LADDER } from "../../../lib/program";
import { Award, CheckCircle2, Clock, ListChecks } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const certs = await prisma.certification.findMany({
    orderBy: [{ code: "asc" }],
    include: { participant: { select: { id: true, name: true, pod: true } } },
  });

  const passed = certs.filter((c) => c.status === "PASSED").length;
  const inProgress = certs.filter((c) => c.status === "IN_PROGRESS").length;
  const planned = certs.filter((c) => c.status === "PLANNED").length;
  const appliedPassed = certs.filter((c) => c.isAppliedSkill && c.status === "PASSED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Certifications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tracked against the 2026 Microsoft agentic-AI certification ladder.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Passed" value={passed} icon={CheckCircle2} accent="#0e8a0e" />
        <StatCard label="In progress" value={inProgress} icon={Clock} accent="#e8a90c" />
        <StatCard label="Planned" value={planned} icon={Award} accent="#6b2fb3" />
        <StatCard label="Applied Skills passed" value={appliedPassed} icon={ListChecks} accent="#0a6ed1" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-line px-5 py-3">
            <h2 className="font-semibold">All certification records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Engineer</th>
                  <th className="th">Cert</th>
                  <th className="th">Type</th>
                  <th className="th text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="td">
                      <Link href={`/participants/${c.participant.id}`} className="font-semibold text-ink hover:text-azure">
                        {c.participant.name}
                      </Link>
                      <div className="text-[11px] text-slate-400">{c.participant.pod}</div>
                    </td>
                    <td className="td">
                      <span className="font-mono text-xs font-semibold">{c.code}</span>
                      <div className="text-[11px] text-slate-500">{c.name}</div>
                    </td>
                    <td className="td">
                      {c.isAppliedSkill ? <span className="chip">Applied Skill</span> : <span className="text-xs text-slate-500">Exam</span>}
                    </td>
                    <td className="td text-right">
                      <Badge tone={certTone[c.status]}>{labelize(c.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-3 font-semibold">2026 certification ladder</h2>
          <ul className="space-y-2">
            {CERT_LADDER.map((c) => (
              <li key={c.code} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2">
                <span className="font-mono text-xs font-bold text-azure-deep">{c.code}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700">{c.name}</span>
                <span className="chip">{c.tier}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            Validate exact live codes with your Microsoft partner contact before publishing the
            Microsoft AI FDE Program ladder; the 2026 portfolio is still settling.
          </p>
        </div>
      </div>
    </div>
  );
}
