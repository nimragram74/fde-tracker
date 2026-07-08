import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  ListChecks,
  PlayCircle,
} from "lucide-react";
import { PROGRAM } from "../../../../../lib/program";
import { getDayLearningPlan, type LearningResource } from "../../../../../lib/curriculum-details";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default function CurriculumDayPage({
  params,
}: {
  params: { weekNumber: string; dayLabel: string };
}) {
  const weekNumber = Number(params.weekNumber);
  const dayLabel = decodeURIComponent(params.dayLabel);
  const week = PROGRAM.find((w) => w.number === weekNumber);
  const dayIndex = week?.days.findIndex((d) => d.label === dayLabel) ?? -1;
  if (!week || dayIndex < 0) notFound();

  const day = week.days[dayIndex];
  const plan = getDayLearningPlan(week, dayIndex);

  return (
    <div className="space-y-6">
      <Link href="/curriculum" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-azure">
        <ArrowLeft size={15} /> Curriculum
      </Link>

      <section className="overflow-hidden rounded-lg border border-line bg-white">
        <div
          className="px-6 py-5 text-white"
          style={{ background: `linear-gradient(135deg, #0a2f63, ${week.accent})` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-gold">{week.code}</div>
              <h1 className="mt-1 text-2xl font-bold leading-tight">
                Day {day.label}: {day.focus}
              </h1>
              <p className="mt-2 max-w-4xl text-sm text-white/80">{plan.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                {day.dow}
              </span>
              <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#20130a]">
                {week.cert}
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Learning Outcomes" icon={GraduationCap}>
            <Checklist items={plan.outcomes} />
          </Panel>
          <Panel title="Session Agenda" icon={ListChecks}>
            <Checklist items={plan.agenda} />
          </Panel>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <Panel title="Training References" icon={BookOpen}>
          <div className="space-y-3">
            {plan.resources.map((resource) => (
              <ResourceCard key={resource.url} resource={resource} />
            ))}
          </div>
        </Panel>

        <Panel title="Hands-On Lab" icon={FlaskConical}>
          <div className="space-y-4">
            <div>
              <div className="font-semibold">{plan.lab.title}</div>
              <p className="mt-1 text-sm text-slate-600">{plan.lab.scenario}</p>
            </div>
            <SectionList title="Setup" items={plan.lab.setup} />
            <SectionList title="Exercises" items={plan.lab.exercises} />
            <SectionList title="Evidence To Submit" items={plan.lab.evidence} />
            <SectionList title="Stretch Goals" items={plan.lab.stretch} />
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Panel title="Knowledge Check" icon={ClipboardCheck}>
          <div className="space-y-3">
            {plan.quiz.map((q, index) => (
              <details key={q.question} className="rounded-lg border border-line bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  {index + 1}. {q.question}
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {q.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
                <div className="mt-2 text-sm">
                  <span className="font-semibold text-grass">Answer:</span> {q.answer}
                </div>
              </details>
            ))}
          </div>
        </Panel>

        <Panel title="Daily Deliverables" icon={CheckCircle2}>
          <Checklist items={plan.deliverables} />
        </Panel>
      </section>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={17} className="text-azure" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-slate-700">
          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-grass" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="label mb-1.5">{title}</div>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

function ResourceCard({ resource }: { resource: LearningResource }) {
  const isVideo = resource.source === "YouTube";
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-lg border border-line p-3 transition hover:border-azure hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-azure">{isVideo ? <PlayCircle size={17} /> : <ExternalLink size={17} />}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-semibold leading-snug text-ink">{resource.title}</div>
            <Badge tone={isVideo ? "red" : "azure"}>{resource.source}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">{resource.why}</p>
          <div className="mt-1 truncate text-[11px] text-azure">{resource.url}</div>
        </div>
      </div>
    </a>
  );
}
