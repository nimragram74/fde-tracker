import { PrismaClient, ProgressStatus, ParticipantStatus, CertStatus, CapstoneStatus } from "@prisma/client";
import { PROGRAM } from "../src/lib/program";

const prisma = new PrismaClient();

const CERT_NAMES: Record<string, string> = {
  "AI-103": "Azure AI App & Agent Developer",
  "PL-400": "Power Platform Developer",
  "DP-600": "Microsoft Fabric Analytics Engineer",
  "SC-500": "Cloud & AI Security Engineer",
  "AB-100": "Agentic AI Business Solutions Architect",
  "AB-731": "AI Transformation Leader",
  "AB-900": "Copilot & Agent Administration Fundamentals",
};

const PARTICIPANTS = [
  { name: "Sourav Kamila", title: "Enterprise Architect", pod: "Pod Alpha", cert: "AI-103" },
  { name: "Pravin Shastrakar", title: "Modern Workplace Specialist", pod: "Pod Alpha", cert: "PL-400" },
  { name: "Aarti Menon", title: "AI Engineer", pod: "Pod Alpha", cert: "AI-103" },
  { name: "Rohan Gupta", title: "Data / Fabric Engineer", pod: "Pod Alpha", cert: "DP-600" },
  { name: "Nisha Verma", title: "Security / Purview Specialist", pod: "Pod Alpha", cert: "SC-500" },
  { name: "Karthik Iyer", title: "FDE Lead / Copilot Architect", pod: "Pod Beta", cert: "AB-100" },
  { name: "Meera Nair", title: "Adoption / Change Lead", pod: "Pod Beta", cert: "AB-731" },
  { name: "Vikram Singh", title: "AI Engineer", pod: "Pod Beta", cert: "AI-103" },
  { name: "Priya Raman", title: "Copilot / Power Platform Eng", pod: "Pod Beta", cert: "PL-400" },
  { name: "Ahmed Khan", title: "Data / Fabric Engineer", pod: "Pod Beta", cert: "DP-600" },
  { name: "Sneha Kulkarni", title: "AI Engineer", pod: "Pod Gamma", cert: "AI-103" },
  { name: "Rahul Deshpande", title: "Security / Purview Specialist", pod: "Pod Gamma", cert: "SC-500" },
  { name: "Anjali Rao", title: "FDE Lead / Copilot Architect", pod: "Pod Gamma", cert: "AB-100" },
  { name: "Deepak Joshi", title: "Adoption / Change Lead", pod: "Pod Gamma", cert: "AB-731" },
];

const emailFor = (name: string) => name.toLowerCase().replace(/\s+/g, ".") + "@wipro.com";
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log("Seeding Microsoft AI FDE Program Portal...€¦");

  // â”€â”€ Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await prisma.plan.upsert({
    where: { key: "free" },
    update: {},
    create: {
      key: "free", name: "Free", priceMonthly: 0, maxCohorts: 1, maxParticipants: 25, sortOrder: 0,
      features: { analytics: false, sso: true, exports: false, api: false, prioritySupport: false, customBranding: false },
    },
  });
  await prisma.plan.upsert({
    where: { key: "pro" },
    update: {},
    create: {
      key: "pro", name: "Pro", priceMonthly: 149, maxCohorts: 5, maxParticipants: 150, sortOrder: 1,
      features: { analytics: true, sso: true, exports: true, api: false, prioritySupport: false, customBranding: true },
    },
  });
  await prisma.plan.upsert({
    where: { key: "enterprise" },
    update: {},
    create: {
      key: "enterprise", name: "Enterprise", priceMonthly: 599, maxCohorts: 999, maxParticipants: 100000, sortOrder: 2,
      features: { analytics: true, sso: true, exports: true, api: true, prioritySupport: true, customBranding: true },
    },
  });

  // â”€â”€ Org (Enterprise plan) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const orgName = process.env.DEFAULT_ORG_NAME || "Wipro x Microsoft AI FDE Program";
  const existingOrg = await prisma.org.findFirst();
  const org = existingOrg
    ? await prisma.org.update({ where: { id: existingOrg.id }, data: { name: orgName, planKey: "enterprise" } })
    : await prisma.org.create({ data: { name: orgName, planKey: "enterprise" } });

  // â”€â”€ Curriculum (16 weeks Ã— 5 days) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const dayIdByLabel = new Map<string, string>();
  let order = 0;
  for (const w of PROGRAM) {
    await prisma.week.upsert({
      where: { number: w.number },
      update: { code: w.code, title: w.title, goal: w.goal, layer: w.layer, certAnchor: w.cert, accent: w.accent },
      create: { number: w.number, code: w.code, title: w.title, goal: w.goal, layer: w.layer, certAnchor: w.cert, accent: w.accent },
    });
    for (const day of w.days) {
      order += 1;
      const rec = await prisma.day.upsert({
        where: { weekNumber_label: { weekNumber: w.number, label: day.label } },
        update: { dow: day.dow, focus: day.focus, orderIndex: order },
        create: { weekNumber: w.number, label: day.label, dow: day.dow, focus: day.focus, orderIndex: order },
      });
      dayIdByLabel.set(day.label, rec.id);
    }
  }
  const allDays = [...dayIdByLabel.entries()]
    .map(([label, id], idx) => ({ label, id, orderIndex: idx + 1 }))
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const totalDays = allDays.length;

  // â”€â”€ Cohort â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const start = new Date();
  start.setDate(start.getDate() - 7 * 9); // ~9 weeks in
  const end = new Date(start);
  end.setDate(end.getDate() + 7 * 16);
  const cohort = await prisma.cohort.upsert({
    where: { code: "FDE-FY26-Q3-01" },
    update: { name: "Cohort 01 â€” FY26 Q3", startDate: start, endDate: end, status: "ACTIVE", podLead: "Ramachandran Padmanabhan" },
    create: {
      name: "Cohort 01 â€” FY26 Q3", code: "FDE-FY26-Q3-01", track: "16-week comprehensive",
      status: "ACTIVE", startDate: start, endDate: end, podLead: "Ramachandran Padmanabhan",
    },
  });

  const cohortCurrentDay = 45; // programme is ~day 45 of 80

  // â”€â”€ Participants + progress + certs + capstones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  for (let i = 0; i < PARTICIPANTS.length; i++) {
    const p = PARTICIPANTS[i];
    const variance = [8, -14, 3, -2, -20, 6, -4, 1, -6, 2, 5, -10, 7, -3][i] ?? 0;
    const personal = Math.max(2, Math.min(totalDays, cohortCurrentDay + variance));

    let status: ParticipantStatus = "ACTIVE";
    if (personal >= totalDays) status = "COMPLETED";
    else if (personal < cohortCurrentDay - 12) status = "AT_RISK";
    if (i === 4) status = "DROPPED"; // one dropped example

    const participant = await prisma.participant.upsert({
      where: { cohortId_email: { cohortId: cohort.id, email: emailFor(p.name) } },
      update: { name: p.name, title: p.title, pod: p.pod, status, targetCert: p.cert },
      create: {
        cohortId: cohort.id, name: p.name, email: emailFor(p.name),
        title: p.title, pod: p.pod, status, targetCert: p.cert,
      },
    });

    const effectiveDone = status === "DROPPED" ? Math.max(2, personal - 4) : personal;
    for (const day of allDays) {
      let st: ProgressStatus = "NOT_STARTED";
      let score: number | null = null;
      let completedAt: Date | null = null;
      if (day.orderIndex < effectiveDone) {
        st = "DONE"; score = rnd(66, 100);
        completedAt = new Date(start); completedAt.setDate(completedAt.getDate() + day.orderIndex);
      } else if (day.orderIndex === effectiveDone && status !== "DROPPED") {
        st = "IN_PROGRESS";
      }
      if (st === "NOT_STARTED") continue; // keep table lean
      await prisma.progress.upsert({
        where: { participantId_dayId: { participantId: participant.id, dayId: day.id } },
        update: { status: st, score, completedAt },
        create: { participantId: participant.id, dayId: day.id, status: st, score, completedAt },
      });
    }

    // Certifications â€” target cert + a baseline AB-900 + one Applied Skill
    const passedTarget = personal > 74;
    await upsertCert(participant.id, p.cert, CERT_NAMES[p.cert] ?? p.cert, passedTarget ? "IN_PROGRESS" : "PLANNED", false);
    await upsertCert(participant.id, "AB-900", CERT_NAMES["AB-900"], personal > 30 ? "PASSED" : "PLANNED", false);
    await upsertCert(participant.id, "Applied: Create an AI agent", "Applied Skill", personal > 50 ? "PASSED" : "PLANNED", true);

    // Capstone
    let cst: CapstoneStatus = "PLANNED";
    if (personal >= 80) cst = "PRESENTED";
    else if (personal >= 76) cst = "DEPLOYED";
    else if (personal >= 73) cst = "EVALUATED";
    else if (personal >= 71) cst = "BUILDING";
    const shipped = cst === "PLANNED" ? 0 : cst === "BUILDING" ? 1 : 2;
    await prisma.capstone.deleteMany({ where: { participantId: participant.id } });
    await prisma.capstone.create({
      data: {
        participantId: participant.id,
        title: `${p.pod} Â· ${["Grounded helpdesk agent", "SOW drafting Copilot", "Incident-triage agent", "Policy Q&A declarative agent"][i % 4]}`,
        agentsPlanned: 2, agentsShipped: shipped, status: cst,
        deployUrl: cst === "DEPLOYED" || cst === "PRESENTED" ? "https://contoso-fde-demo.azurewebsites.net" : null,
        evalScore: cst === "PLANNED" || cst === "BUILDING" ? null : rnd(72, 95),
        adoptionScore: cst === "DEPLOYED" || cst === "PRESENTED" ? rnd(40, 88) : null,
      },
    });
  }

  // â”€â”€ Admin users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const admins = (process.env.ADMIN_EMAILS || "raghuram.nimishakavi@wipro.com")
    .split(",").map((s) => s.trim()).filter(Boolean);
  for (const email of admins) {
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: { email, name: email.split("@")[0], role: "ADMIN" },
    });
  }

  // â”€â”€ App settings (configurable-DB display + org prefs) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  await setSetting("db.provider", process.env.DATABASE_PROVIDER || "postgresql");
  await setSetting("db.displayHost", maskHost(process.env.DATABASE_URL));
  await setSetting("org.id", org.id);

  console.log(`Seed complete: ${PROGRAM.length} weeks, ${totalDays} days, ${PARTICIPANTS.length} participants.`);
}

async function upsertCert(participantId: string, code: string, name: string, status: CertStatus, applied: boolean) {
  const existing = await prisma.certification.findFirst({ where: { participantId, code } });
  if (existing) {
    await prisma.certification.update({ where: { id: existing.id }, data: { status, name, isAppliedSkill: applied } });
  } else {
    await prisma.certification.create({ data: { participantId, code, name, status, isAppliedSkill: applied } });
  }
}

async function setSetting(key: string, value: string) {
  await prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

function maskHost(url?: string) {
  if (!url) return "not configured";
  try {
    const u = new URL(url.replace(/^postgres(ql)?:\/\//, "http://"));
    return `${u.hostname}:${u.port || "5432"}/${u.pathname.replace("/", "") || "fdetracker"}`;
  } catch {
    return "configured";
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
