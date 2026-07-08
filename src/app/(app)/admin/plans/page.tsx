import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/rbac";
import { getOrg, FEATURE_META, planFeatures, type PlanFeatures } from "@/lib/plans";
import { setActivePlan, updatePlan } from "../actions";
import { Check, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  if (!(await isAdmin())) return <Restricted />;

  const [plans, org] = await Promise.all([
    prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    getOrg(),
  ]);
  const activeKey = org?.planKey;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Plans &amp; billing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure subscription tiers, limits, and feature-gating. Active plan:{" "}
          <span className="font-semibold text-ink">{org?.plan.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const active = plan.key === activeKey;
          const feats = planFeatures(plan);
          return (
            <div
              key={plan.key}
              className={`card p-5 ${active ? "ring-2 ring-azure" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold capitalize">{plan.name}</h2>
                {active ? (
                  <span className="chip bg-azure/10 text-azure-deep">Active</span>
                ) : (
                  <form action={setActivePlan}>
                    <input type="hidden" name="planKey" value={plan.key} />
                    <button className="btn btn-ghost px-2.5 py-1 text-xs">Set active</button>
                  </form>
                )}
              </div>

              <form action={updatePlan} className="mt-4 space-y-3">
                <input type="hidden" name="key" value={plan.key} />
                <Field label="Display name" name="name" defaultValue={plan.name} />
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Price $/mo" name="priceMonthly" type="number" defaultValue={String(plan.priceMonthly)} />
                  <Field label="Max cohorts" name="maxCohorts" type="number" defaultValue={String(plan.maxCohorts)} />
                  <Field label="Max seats" name="maxParticipants" type="number" defaultValue={String(plan.maxParticipants)} />
                </div>

                <div className="pt-1">
                  <div className="label mb-1.5">Features</div>
                  <div className="space-y-1.5">
                    {FEATURE_META.map((f) => (
                      <label key={f.key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={`feat_${f.key}`}
                          defaultChecked={feats[f.key as keyof PlanFeatures]}
                          className="h-4 w-4 rounded border-slate-300 text-azure"
                        />
                        <span className="text-slate-700">{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary w-full text-sm">Save changes</button>
              </form>
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="mb-3 font-semibold">Feature reference</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {FEATURE_META.map((f) => (
            <div key={f.key} className="flex items-start gap-2 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-grass" />
              <div>
                <span className="font-medium">{f.label}</span>
                <span className="text-slate-500"> — {f.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-azure focus:ring-1 focus:ring-azure"
      />
    </label>
  );
}

function Restricted() {
  return (
    <div className="card grid place-items-center p-12 text-center">
      <ShieldAlert className="mb-2 text-amber-500" />
      <div className="font-semibold">Admin access required</div>
      <p className="mt-1 text-sm text-slate-500">
        Your account needs the Admin role to manage plans. Add your email to <code>ADMIN_EMAILS</code>.
      </p>
    </div>
  );
}
