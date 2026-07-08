# Deploying Microsoft AI FDE Program Portal to Azure (GitHub Actions + azd)

Repo: `nimragram74/fde-tracker` · Tenant: `wipro365crm` · Region: **East US** · Env: `fde-prod`

The deploy runs entirely in GitHub Actions ([.github/workflows/azure-dev.yml](.github/workflows/azure-dev.yml)).
The runner installs `azd`, logs in via OIDC federated credentials, and runs `azd up`
to provision the Bicep infra ([infra/main.bicep](infra/main.bicep)) and deploy the app.
**No local Azure CLI is required.**

---

## Step 1 — Push the code

```bash
git push -u origin main
```

## Step 2 — Create the federated identity (Azure Portal)

**Entra ID → App registrations → New registration** → name `fde-tracker-github`.

In the app → **Certificates & secrets → Federated credentials → Add credential**
→ scenario **GitHub Actions deploying Azure resources**:

| Field | Value |
|-------|-------|
| Organization | `nimragram74` |
| Repository | `fde-tracker` |
| Entity type | **Branch** |
| Branch | `main` |

This produces subject: `repo:nimragram74/fde-tracker:ref:refs/heads/main`

> Tip: add a **second** federated credential with Entity type **Pull request**
> if you later want deploy-on-PR, and one for Entity **Environment** if you gate
> on a GitHub environment.

Then grant the app rights to deploy:
**Subscriptions → (your subscription) → Access control (IAM) → Add role assignment
→ Contributor → assign to `fde-tracker-github`.**

## Step 3 — GitHub repo variables & secrets

Repo → **Settings → Secrets and variables → Actions**.

**Variables** (Variables tab):

| Name | Value |
|------|-------|
| `AZURE_CLIENT_ID` | App registration's Application (client) ID |
| `AZURE_TENANT_ID` | Entra tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Target subscription ID |
| `AZURE_ENV_NAME` | `fde-prod` |
| `AZURE_LOCATION` | `eastus` |
| `ADMIN_EMAILS` | `raghuram.nimishakavi@wipro.com` |

**Secrets** (Secrets tab) — generated values, rotate anytime:

| Name | Value |
|------|-------|
| `DATABASE_PASSWORD` | `C7P7WdnPW3MLwT4hhNxPkaCoZ5ct` |
| `AUTH_SECRET` | `2M+IezNwQJtOwFC7FuBDzsGDMFQ213YEpHK1uk0ZMQ0=` |

SSO is **not** required for the current demo flow — leave `AUTH_MICROSOFT_ENTRA_ID_ID`,
`AUTH_MICROSOFT_ENTRA_ID_SECRET`, `AUTH_MICROSOFT_ENTRA_ID_ISSUER` unset.
Bicep defaults them to empty; the app deploys but sign-in won't work until
you add an Entra App Registration for the app and set these three (see below).

## Step 4 — Deploy

Repo → **Actions → "Deploy (azd)" → Run workflow** (branch `main`), or just push to `main`.
First run takes ~10–15 min. When it finishes, the app URL is in the job log
(`WEB_URI`) — shape `https://fde-web-<token>.azurewebsites.net`.

---

## What gets created (East US)

| Resource | SKU | ~Cost/mo |
|----------|-----|----------|
| App Service Plan (Linux) | B1 Basic, alwaysOn | ~$13 |
| PostgreSQL Flexible Server | Standard_B1ms Burstable, 32 GB | ~$15–18 |
| Key Vault | Standard | ~$0 |
| App Insights + Log Analytics | PerGB2018, 30-day retention | ~$2–5 |

Persistent, billable stack (~$30–40/mo). To tear it all down later:
`az group delete -n rg-fde-prod` (the azd-created resource group), or delete
the resource group in the Portal.

## Optional SSO later

1. Entra ID → App registrations → New registration for the **app itself**
   (separate from the CI identity). Add a **Web** redirect URI:
   `https://<app>.azurewebsites.net/api/auth/callback/microsoft-entra-id`
2. Create a client secret.
3. Add GitHub variables `AUTH_MICROSOFT_ENTRA_ID_ID` (client ID),
   `AUTH_MICROSOFT_ENTRA_ID_ISSUER`
   (`https://login.microsoftonline.com/<tenant-id>/v2.0`), and secret
   `AUTH_MICROSOFT_ENTRA_ID_SECRET`.
4. Re-run the workflow.

## Note on this environment

Local install of `azd`/`az`/`gh` was blocked — the corporate network terminates
large binary downloads from the GitHub CDN (winget, direct download, and BITS all
failed mid-transfer, while small HTTPS requests succeed). That's why this uses the
GitHub-hosted runner, which downloads `azd` from inside GitHub's network. If you
later need the tools locally, install them from an unrestricted network or request
an IT/proxy exception for `github.com` release assets.
