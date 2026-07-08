export function ProgressBar({
  value,
  accent = "#0e8a0e",
  height = 8,
  showLabel = false,
}: {
  value: number; // 0..100
  accent?: string;
  height?: number;
  showLabel?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-full overflow-hidden rounded-full bg-slate-200"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
          {pct}%
        </span>
      )}
    </div>
  );
}
