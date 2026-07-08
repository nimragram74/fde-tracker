import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "#0a6ed1",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="label">{label}</div>
        {Icon && (
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            <Icon size={17} />
          </span>
        )}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}
