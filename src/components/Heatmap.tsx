// Server component — renders a 16-week × 5-day completion grid.
// status: DONE | IN_PROGRESS | NOT_STARTED

const cellColor: Record<string, string> = {
  DONE: "#0e8a0e",
  IN_PROGRESS: "#0a6ed1",
  NOT_STARTED: "#e2e6ee",
};

export type HeatWeek = {
  number: number;
  code: string;
  days: { label: string; focus: string; status: string }[];
};

export function Heatmap({ weeks }: { weeks: HeatWeek[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1.5">
        {weeks.map((w) => (
          <div key={w.number} className="flex flex-col items-center gap-1.5">
            <div className="flex flex-col gap-1.5">
              {w.days.map((d) => (
                <div
                  key={d.label}
                  title={`${d.label} · ${d.focus} — ${d.status.replace("_", " ").toLowerCase()}`}
                  className="h-5 w-5 rounded-[4px] ring-1 ring-black/5"
                  style={{ backgroundColor: cellColor[d.status] ?? cellColor.NOT_STARTED }}
                />
              ))}
            </div>
            <div className="text-[10px] font-semibold text-slate-400">{w.number}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: cellColor.DONE }} /> Done
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: cellColor.IN_PROGRESS }} /> In progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[3px]" style={{ background: cellColor.NOT_STARTED }} /> Not started
        </span>
      </div>
    </div>
  );
}
