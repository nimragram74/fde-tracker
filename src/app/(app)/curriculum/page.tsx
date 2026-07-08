import { prisma } from "../../../lib/db";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const weeks = await prisma.week.findMany({
    orderBy: { number: "asc" },
    include: { days: { orderBy: { orderIndex: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-white">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 lg:p-8">
            <h1 className="h-page">Microsoft AI FDE Curriculum</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              The 16-week Microsoft AI FDE Program includes {weeks.length} weeks and{" "}
              {weeks.reduce((s, w) => s + w.days.length, 0)} learning days. Open any day
              for learning outcomes, official references, videos, labs, quizzes, and deliverables.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">Learner single pane</span>
              <span className="chip">Daily labs</span>
              <span className="chip">Quiz checks</span>
            </div>
          </div>
          <img
            src="/images/microsoft-ai-fde-hero.png"
            alt="Microsoft AI FDE learning and lab visual"
            className="h-full min-h-[220px] w-full object-cover"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {weeks.map((w) => (
          <div key={w.number} className="card overflow-hidden">
            <div
              className="flex items-start gap-3 px-5 py-4 text-white"
              style={{ background: `linear-gradient(135deg, #0a2f63, ${w.accent})` }}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/15 text-lg font-black">
                {w.number}
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-gold">{w.code}</div>
                <h2 className="font-semibold leading-snug">{w.title}</h2>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    {w.layer}
                  </span>
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#20130a]">
                    {w.certAnchor}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-3 text-[13px] text-slate-600">{w.goal}</p>
              <ol className="space-y-1.5">
                {w.days.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/curriculum/${w.number}/${encodeURIComponent(d.label)}`}
                      className="group flex items-start gap-2.5 rounded-md px-1.5 py-1.5 text-sm transition hover:bg-slate-50"
                    >
                      <span className="mt-0.5 grid h-5 w-9 shrink-0 place-items-center rounded bg-slate-100 font-mono text-[11px] font-semibold text-azure-deep group-hover:bg-azure group-hover:text-white">
                        {d.label}
                      </span>
                      <span className="min-w-0 flex-1 text-slate-700">
                        <span className="mr-1.5 text-[10px] font-semibold uppercase text-slate-400">
                          {d.dow}
                        </span>
                        {d.focus}
                      </span>
                      <ArrowRight size={14} className="mt-1 shrink-0 text-slate-300 group-hover:text-azure" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {weeks.length === 0 && (
        <div className="card grid place-items-center p-12 text-center text-slate-500">
          <BookOpen className="mb-2" />
          No curriculum loaded. Run <code className="mx-1 rounded bg-slate-100 px-1">npm run seed</code>.
        </div>
      )}
    </div>
  );
}
