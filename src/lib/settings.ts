import { prisma } from "./db";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const s = await prisma.appSetting.findUnique({ where: { key } });
  return s?.value ?? fallback;
}

export async function setSetting(key: string, value: string) {
  return prisma.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

// Configurable-DB info surfaced on the Settings page (read-only display).
export async function getDbInfo() {
  return {
    provider: await getSetting("db.provider", process.env.DATABASE_PROVIDER || "postgresql"),
    host: await getSetting("db.displayHost", "not configured"),
  };
}

export async function getOrgName() {
  const org = await prisma.org.findFirst();
  return org?.name ?? process.env.DEFAULT_ORG_NAME ?? "Microsoft AI FDE Program";
}
