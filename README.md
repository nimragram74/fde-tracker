# Microsoft AI FDE Program Portal — Wipro × Microsoft AI FDE Program

A **multi-page, server-rendered** web app (Next.js App Router — *not* a SPA) to
**track & monitor** the 16-week Microsoft AI FDE Program:
cohorts, participants, day-by-day progress, certifications, and capstones — with
**built-in admin/learner persona switch**, a **configurable database**, and **configurable
subscription plans** (feature-gating + limits).

Built to deploy to **your Azure subscription** with a single `azd up`.

---

## ✨ What's inside

| Area | Detail |
|------|--------|
| **Framework** | Next.js 14 (App Router, React Server Components, server actions) |
| **UI** | Tailwind CSS · Recharts · lucide icons · Fluent-inspired design |
| **Auth** | built-in admin/learner persona switch via Auth.js (NextAuth v5), edge-safe middleware |
| **Database** | PostgreSQL via Prisma ORM — **swappable** (Azure SQL / Cockroach) |
| **Subscription plans** | Free / Pro / Enterprise with editable limits + feature-gating |
| **Hosting** | Azure App Service (Linux · Node 20) |
| **Infra** | Bicep + `azd` — App Service, PostgreSQL Flexible Server, Key Vault, App Insights, Managed Identity |
| **Observability** | Application Insights + `/api/health` probe |

### Pages
`/` Dashboard · `/curriculum` · `/cohorts` + detail · `/participants` + detail
(with progress **heatmap** & mentor editor) · `/progress` board ·
`/certifications` · `/capstones` · `/admin/plans` · `/admin/settings`.

---

## 🚀 Deploy to Azure (one command)

### Prerequisites
- [Azure Developer CLI (`azd`)](https://aka.ms/azd), [Azure CLI](https://aka.ms/azcli), Node 20+
- An Azure subscription you can create resources in

### 1. Set deployment parameters
```bash
azd init            # if starting fresh in this folder; else skip
azd env new fde-prod

azd env set DATABASE_PASSWORD "$(openssl rand -base64 24)"
azd env set AUTH_SECRET "$(openssl rand -base64 32)"
azd env set ADMIN_EMAILS "raghuram.nimishakavi@wipro.com"
```

### 2. Provision + deploy
```bash
azd up
```
This provisions the infrastructure, deploys the app, and (via the `postprovision`
hook) applies the Prisma schema and seeds the demo cohort. When it finishes, azd
prints the **WEB_URI**. Open it and use the header persona switch to move between
Learner and Admin views.

---

## 🖥️ Run locally

```bash
cp .env.example .env          # fill in the values
# start a local Postgres (example):
docker run --name fde-pg -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=fdetracker -p 5432:5432 -d postgres:16

npm install
npm run db:push               # create tables
npm run seed                  # load curriculum + demo cohort
npm run dev                   # http://localhost:3000
```

---

## 🔧 Configurable database

The DB is not hard-wired:
1. Change `datasource.provider` in `prisma/schema.prisma` (`postgresql` → `sqlserver`, etc.).
2. Point `DATABASE_URL` at the new instance.
3. `npm run db:push && npm run seed`.
4. Redeploy. No application code changes required.

The **Admin → Settings** page shows the active provider/host and records the
intended provider label.

## 💳 Configurable subscription plans

**Admin → Plans & billing** lets an admin:
- switch the org's **active plan** (Free / Pro / Enterprise),
- edit each plan's **price, cohort limit, seat limit**, and
- toggle **features** (advanced analytics, exports, API, priority support, custom branding).

Feature-gating is enforced server-side (e.g. the dashboard analytics chart is
locked below Pro). Plan usage vs limits is shown on the dashboard.

## 👤 Roles

| Role | Can |
|------|-----|
| **Admin** | Everything, incl. plans & settings. Granted to `ADMIN_EMAILS` on first sign-in. |
| **Mentor** | Edit participant day-by-day progress. |
| **Viewer** | Read-only. Default for new sign-ins. |

Change roles directly in the `User` table (or extend Admin → Settings).

---

## 📁 Structure

```
fde-tracker/
├─ azure.yaml                # azd config + seed hook
├─ infra/main.bicep          # App Service · PostgreSQL · Key Vault · App Insights
├─ prisma/
│  ├─ schema.prisma          # data model (configurable provider)
│  └─ seed.ts                # curriculum + demo cohort
├─ src/
│  ├─ auth.ts / auth.config.ts / middleware.ts   # demo personas and route guard
│  ├─ lib/                   # db, plans, settings, program, rbac
│  ├─ components/            # Sidebar, TopBar, charts, cards…
│  └─ app/
│     ├─ (app)/…             # authed shell + all tracking pages
│     ├─ login/              # demo redirect
│     └─ api/{auth,health}/  # Auth.js + health probe
└─ Dockerfile                # optional container path (Container Apps)
```

---

## 🔐 Security notes (for production)

- The Bicep adds a **`AllowAll-demo-tighten-me`** Postgres firewall rule so the
  seed hook can connect from your machine. **Remove it or scope it to your CIDR**
  after first deploy, keeping only `AllowAllAzureServices`.
- Secrets (`DATABASE_URL`, `AUTH_SECRET`, client secret) live in **Key Vault** and
  are read via the app's **Managed Identity** — never committed.
- Consider Private Endpoints for Postgres + Key Vault and Entra Conditional Access
  for a hardened deployment.

## 🩺 Troubleshooting

- **Learner cannot open admin pages** → expected behavior. Switch to Admin in the
  top bar to access dashboard, tracking, plans, and settings.
- **`/api/health` returns 503** → the app can't reach Postgres; check the firewall
  rules and that `DATABASE_URL` resolved from Key Vault.
- **Empty dashboard** → the seed didn't run; from a machine allowed by the firewall
  run `npm run db:push && npm run seed` with `DATABASE_URL` set.

---

_Generated for the Wipro × Microsoft AI FDE Center of Excellence._
