import { Crown } from "lucide-react";

const styles: Record<string, string> = {
  free: "bg-slate-100 text-slate-600 border-slate-300",
  pro: "bg-azure/10 text-azure-deep border-azure/40",
  enterprise: "bg-gold/15 text-[#8a6400] border-gold/60",
};

export function PlanBadge({ planKey, name }: { planKey: string; name: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
        styles[planKey] ?? styles.free
      }`}
    >
      <Crown size={13} />
      {name}
    </span>
  );
}
