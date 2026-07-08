import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function cell(count: number): { bg: string; fg: string } {
  const scale = ["#eef1f6", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#16a34a"];
  const fg = count >= 4 ? "#ffffff" : count === 0 ? "#94a3b8" : "#166534";
  return { bg: scale[Math.min(5, count)], fg };
}

export default async function ProgressBoard() {
  const [participants, days] = await Promise.all([
    prisma.participant.findMany({
      orderBy: [{ pod: "asc" }, { name: "asc" }],
      include: { progress: { select: { dayId: true, status: true } } },
    }),
    prisma.day.findMany({ select: { id: true, weekNumber: true } }),
  ]);
  const dayWeek = new Map(days.map((d) => [d.id, d.weekNumber]));
  const weekNums = Array.from({ length: 16 }, (_, i) => i + 1);

  const rows = participants.map((p) => {
    const per = Array(17).fill(0);
    for (const pr of p.progress) if (pr.status === "DONE") {
      const w = dayWeek.get(pr.dayId);
      if (w) per[w]++;
    }
    return { p, per };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Progress board</h1>
        <p className="mt-1 text-sm text-slate-500">
          Days completed per week (0–5) for every engineer. Darker = further along.
        </p>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-[900px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 th">Engineer</th>
              {weekNums.map((w) => (
                <th key={w} className="th text-center">W{w}</th>
              ))}
              <th className="th text-center">Σ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, per }) => {
              const total = per.reduce((s, n) => s + n, 0);
              return (
                <tr key={p.id}>
                  <td className="sticky left-0 z-10 bg-white td whitespace-nowrap">
                    <Link href={`/participants/${p.id}`} className="font-semibold text-ink hover:text-azure">
                      {p.name}
                    </Link>
                    <div className="text-[11px] text-slate-400">{p.pod}</div>
                  </td>
                  {weekNums.map((w) => {
                    const c = cell(per[w]);
                    return (
                      <td key={w} className="border-b border-line/70 p-1 text-center">
                        <span
                          className="mx-auto grid h-7 w-7 place-items-center rounded-md text-[11px] font-bold"
                          style={{ backgroundColor: c.bg, color: c.fg }}
                          title={`Week ${w}: ${per[w]}/5 days`}
                        >
                          {per[w] || ""}
                        </span>
                      </td>
                    );
                  })}
                  <td className="border-b border-line/70 td text-center font-bold tabular-nums">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
