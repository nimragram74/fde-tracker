# FDE Tracker — Wipro × Microsoft FDE Academy

A **multi-page, server-rendered** web app (Next.js App Router — *not* a SPA) to
**track & monitor** the 16-week Microsoft AI Forward Deployed Engineer program:
cohorts, participants, day-by-day progress, certifications, and capstones — with
**Microsoft Entra ID SSO**, a **configurable database**, and **configurable
subscription plans** (feature-gating + limits).

Built to deploy to **your Azure subscription** with a single `azd up`.

---

## ✨ What's inside

| Area | Detail |
|------|--------|
| **Framework** | Next.js 14 (App Router, React Server Components, server actions) |
| **UI** | Tailwind CSS · Recharts · lucide icons · Fluent-inspired design |
| **Auth** | Microsoft Entra ID SSO via Auth.js (NextAuth v5), edge-safe middleware |
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
- An **Entra ID app registration** (below)

### 1. Register an Entra ID app (for SSO)
1. Entra admin center → **App registrations** → **New registration**.
2. Redirect URI (Web) — add **both** once you know the app URL:
   - `https://<app-name>.azurewebsites.net/api/auth/callback/microsoft-entra-id`
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id` (local dev)
   > Tip: run `azd provision` first to learn the app URL, then add the redirect URI.
3. **Certificates & secrets** → new client secret → copy the **value**.
4. Note the **Application (client) ID** and **Directory (tenant) ID**.

### 2. Set deployment parameters
```bash
azd init            # if starting fresh in this folder; else skip
azd env new fde-prod

azd env set DATABASE_PASSWORD "$(openssl rand -base64 24)"
azd env set AUTH_SECRET "$(openssl rand -base64 32)"
azd env set AUTH_MICROSOFT_ENTRA_ID_ID "<application-client-id>"
azd env set AUTH_MICROSOFT_ENTRA_ID_SECRET "<client-secret-value>"
azd env set AUTH_MICROSOFT_ENTRA_ID_ISSUER "https://login.microsoftonline.com/<tenant-id>/v2.0"
azd env set ADMIN_EMAILS "raghuram.nimishakavi@wipro.com"
```

### 3. Provision + deploy
```bash
azd up
```
This provisions the infrastructure, deploys the app, and (via the `postprovision`
hook) applies the Prisma schema and seeds the demo cohort. When it finishes, azd
prints the **WEB_URI** — open it and sign in with Microsoft.

> After the first `azd provision`, add the real
> `https://<app>.azurewebsites.net/...callback...` redirect URI to your Entra app.

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
│  ├─ auth.ts / auth.config.ts / middleware.ts   # Entra ID SSO
│  ├─ lib/                   # db, plans, settings, program, rbac
│  ├─ components/            # Sidebar, TopBar, charts, cards…
│  └─ app/
│     ├─ (app)/…             # authed shell + all tracking pages
│     ├─ login/              # SSO sign-in
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

- **Sign-in loops / redirect error** → the Entra redirect URI must exactly match
  `https://<app>/api/auth/callback/microsoft-entra-id`, and `NEXTAUTH_URL` must be
  the app's HTTPS URL (set automatically by Bicep).
- **`/api/health` returns 503** → the app can't reach Postgres; check the firewall
  rules and that `DATABASE_URL` resolved from Key Vault.
- **Empty dashboard** → the seed didn't run; from a machine allowed by the firewall
  run `npm run db:push && npm run seed` with `DATABASE_URL` set.

---

_Generated for the Wipro × Microsoft FDE Center of Excellence._
