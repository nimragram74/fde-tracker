targetScope = 'resourceGroup'

// ── Parameters (azd supplies environmentName & location) ─────────────
@minLength(1)
@description('Name of the azd environment; used to derive resource names.')
param environmentName string

@minLength(1)
@description('Azure region for all resources.')
param location string

@secure()
@description('PostgreSQL administrator password.')
param databasePassword string

@secure()
@description('Auth.js secret (generate: openssl rand -base64 32).')
param authSecret string

@description('Entra ID application (client) ID.')
param authClientId string = ''

@secure()
@description('Entra ID client secret value.')
param authClientSecret string = ''

@description('Entra ID issuer, e.g. https://login.microsoftonline.com/<tenant>/v2.0')
param authIssuer string = ''

@description('Comma-separated admin emails granted the Admin role on first sign-in.')
param adminEmails string = ''

// ── Naming ───────────────────────────────────────────────────────────
var resourceToken = toLower(uniqueString(subscription().id, resourceGroup().id, environmentName))
var webName = 'fde-web-${resourceToken}'
var pgName = 'fde-pg-${resourceToken}'
var dbName = 'fdetracker'
var pgAdmin = 'fdeadmin'
var webHost = '${webName}.azurewebsites.net'
var databaseUrl = 'postgresql://${pgAdmin}:${databasePassword}@${pgName}.postgres.database.azure.com:5432/${dbName}?sslmode=require'
var tags = { 'azd-env-name': environmentName, project: 'fde-tracker' }

// ── Observability ────────────────────────────────────────────────────
resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'fde-logs-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appi 'Microsoft.Insights/components@2020-02-02' = {
  name: 'fde-ai-${resourceToken}'
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logs.id
  }
}

// ── PostgreSQL Flexible Server ───────────────────────────────────────
resource pg 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: pgName
  location: location
  tags: tags
  sku: { name: 'Standard_B1ms', tier: 'Burstable' }
  properties: {
    version: '16'
    administratorLogin: pgAdmin
    administratorLoginPassword: databasePassword
    storage: { storageSizeGB: 32 }
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
    highAvailability: { mode: 'Disabled' }
    network: { publicNetworkAccess: 'Enabled' }
  }
}

resource pgDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: pg
  name: dbName
  properties: { charset: 'UTF8', collation: 'en_US.utf8' }
}

// Allow other Azure services (incl. App Service) to reach the server.
resource pgFwAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: pg
  name: 'AllowAllAzureServices'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '0.0.0.0' }
}

// DEMO ONLY — lets the deployer's machine run the seed hook. Tighten to your
// office/VPN CIDR (or remove and seed from Cloud Shell) for production.
resource pgFwAll 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: pg
  name: 'AllowAll-demo-tighten-me'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '255.255.255.255' }
}

// ── App Service (Linux · Node 20) ────────────────────────────────────
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: 'fde-plan-${resourceToken}'
  location: location
  tags: tags
  sku: { name: 'B1', tier: 'Basic' }
  kind: 'linux'
  properties: { reserved: true }
}

resource web 'Microsoft.Web/sites@2023-12-01' = {
  name: webName
  location: location
  // azd maps the 'web' service in azure.yaml to this app via this tag.
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      healthCheckPath: '/api/health'
      // Just start Next — the app is prebuilt on the deploy machine (azure.yaml
      // prepackage hook) and the DB schema is applied there too (postprovision
      // hook). Running `prisma db push` here would make App Service download the
      // Prisma CLI at boot (devDependency isn't deployed), hanging startup.
      appCommandLine: 'npm run start'
      appSettings: [
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'false' }
        { name: 'ENABLE_ORYX_BUILD', value: 'false' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~20' }
        { name: 'NODE_ENV', value: 'production' }
        { name: 'NEXT_TELEMETRY_DISABLED', value: '1' }
        { name: 'AUTH_TRUST_HOST', value: 'true' }
        { name: 'NEXTAUTH_URL', value: 'https://${webHost}' }
        { name: 'DATABASE_PROVIDER', value: 'postgresql' }
        { name: 'DEFAULT_ORG_NAME', value: 'Wipro × Microsoft FDE Academy' }
        { name: 'ADMIN_EMAILS', value: adminEmails }
        { name: 'AUTH_MICROSOFT_ENTRA_ID_ID', value: authClientId }
        { name: 'AUTH_MICROSOFT_ENTRA_ID_ISSUER', value: authIssuer }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appi.properties.ConnectionString }
        // Secrets resolved at runtime from Key Vault via managed identity.
        { name: 'DATABASE_URL', value: '@Microsoft.KeyVault(SecretUri=${secretDbUrl.properties.secretUri})' }
        { name: 'AUTH_SECRET', value: '@Microsoft.KeyVault(SecretUri=${secretAuth.properties.secretUri})' }
        { name: 'AUTH_MICROSOFT_ENTRA_ID_SECRET', value: '@Microsoft.KeyVault(SecretUri=${secretClient.properties.secretUri})' }
      ]
    }
  }
}

// ── Key Vault (secrets, resolved by the web app's identity) ──────────
// The vault is declared with NO inline access policy so it does not depend
// on the web app. The web app depends on the vault's secret URIs, and the
// access-policy grant below depends on both — a linear chain, not a cycle.
resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: 'kv${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableSoftDelete: true
    enableRbacAuthorization: false
    accessPolicies: []
  }
}

// Grant the web app's system-assigned identity read access to secrets.
// Declared separately (kv → web → this) to avoid the kv ⇄ web dependency cycle.
resource kvAccess 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  parent: kv
  name: 'add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: web.identity.principalId
        permissions: { secrets: ['get', 'list'] }
      }
    ]
  }
}

resource secretDbUrl 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'DATABASE-URL'
  properties: { value: databaseUrl }
}
resource secretAuth 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AUTH-SECRET'
  properties: { value: authSecret }
}
resource secretClient 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'AUTH-CLIENT-SECRET'
  properties: { value: empty(authClientSecret) ? 'placeholder-set-me' : authClientSecret }
}

// ── Outputs ──────────────────────────────────────────────────────────
output WEB_URI string = 'https://${webHost}'
output SERVICE_WEB_NAME string = web.name
output AZURE_KEY_VAULT_NAME string = kv.name
output APPLICATIONINSIGHTS_CONNECTION_STRING string = appi.properties.ConnectionString
// Contains the DB password — consumed locally by the azd seed hook only.
output DATABASE_URL string = databaseUrl
