import { prisma } from "../../../../lib/db";
import { isAdmin } from "../../../../lib/rbac";
import { getDbInfo, getOrgName } from "../../../../lib/settings";
import { updateOrgName, updateDbProviderLabel } from "../actions";
import { Database, Building2, ShieldAlert, Server } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  if (!(await isAdmin())) {
    return (
      <div className="card grid place-items-center p-12 text-center">
        <ShieldAlert className="mb-2 text-amber-500" />
        <div className="font-semibold">Admin access required</div>
      </div>
    );
  }

  const [orgName, db, counts] = await Promise.all([
    getOrgName(),
    getDbInfo(),
    Promise.all([prisma.cohort.count(), prisma.participant.count(), prisma.progress.count()]),
  ]);
  const [cohorts, participants, progressRows] = counts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h-page">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Organisation, database, and environment configuration.</p>
      </div>

      {/* Organisation */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Building2 size={17} className="text-azure" />
          <h2 className="font-semibold">Organisation</h2>
        </div>
        <form action={updateOrgName} className="flex flex-wrap items-end gap-3">
          <label className="min-w-[280px] flex-1">
            <span className="label">Organisation name</span>
            <input
              name="orgName"
              defaultValue={orgName}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-azure focus:ring-1 focus:ring-azure"
            />
          </label>
          <button className="btn btn-primary">Save</button>
        </form>
      </div>

      {/* Configurable database */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Database size={17} className="text-grass" />
          <h2 className="font-semibold">Database (configurable)</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="label">Active connection</div>
            <div className="mt-1 flex items-center gap-2 font-mono text-sm">
              <Server size={14} className="text-slate-400" /> {db.host}
            </div>
            <div className="mt-3 label">Provider</div>
            <form action={updateDbProviderLabel} className="mt-1 flex items-center gap-2">
              <select
                name="provider"
                defaultValue={db.provider}
                className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
              >
                <option value="postgresql">PostgreSQL (Azure Flexible Server)</option>
                <option value="sqlserver">Azure SQL Database</option>
                <option value="cockroachdb">CockroachDB</option>
              </select>
              <button className="btn btn-ghost px-3 py-1.5 text-xs">Save label</button>
            </form>
          </div>
          <div className="rounded-lg border border-dashed border-line p-4 text-[13px] text-slate-600">
            <div className="mb-1 font-semibold text-ink">How to switch database engine</div>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Set <code className="rounded bg-slate-100 px-1">provider</code> in <code className="rounded bg-slate-100 px-1">prisma/schema.prisma</code> (e.g. <code className="rounded bg-slate-100 px-1">sqlserver</code>).</li>
              <li>Point <code className="rounded bg-slate-100 px-1">DATABASE_URL</code> at the new instance.</li>
              <li>Run <code className="rounded bg-slate-100 px-1">npm run db:push</code> then <code className="rounded bg-slate-100 px-1">npm run seed</code>.</li>
              <li>Redeploy — no code changes required.</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Cohorts" value={cohorts} />
          <Stat label="Participants" value={participants} />
          <Stat label="Progress rows" value={progressRows} />
        </div>
      </div>

      {/* Environment */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Server size={17} className="text-grape" />
          <h2 className="font-semibold">Environment</h2>
        </div>
        <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <Row k="Auth" v="Microsoft Entra ID SSO" />
          <Row k="Hosting" v="Azure App Service (Linux · Node 20)" />
          <Row k="Runtime" v={process.env.NODE_ENV ?? "development"} />
          <Row k="App Insights" v={process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ? "connected" : "not configured"} />
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-3 text-center">
      <div className="text-xl font-bold tabular-nums">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line/60 py-1.5">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-medium capitalize">{v}</dd>
    </div>
  );
}
