// The 16-week Microsoft AI FDE Program curriculum — the single source of truth
// used to seed the Week/Day tables and to render the Curriculum page.

export type ProgramDay = { label: string; dow: string; focus: string };
export type ProgramWeek = {
  number: number;
  code: string;
  title: string;
  goal: string;
  layer: string;
  cert: string;
  accent: string;
  days: ProgramDay[];
};

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const d = (labels: string[]): ProgramDay[] =>
  labels.map((focus, i) => ({ label: "", dow: DOW[i], focus }));

export const PROGRAM: ProgramWeek[] = [
  {
    number: 1, code: "FND-100 · Foundations",
    title: "The FDE operating model & the Azure AI platform",
    goal: "Internalise the Microsoft AI FDE motion — embedded, outcome-led, hypervelocity — then learn the Azure AI platform and ship a first SDK app.",
    layer: "Cross-cutting · Models", cert: "AI-901", accent: "#2f6fc0",
    days: d([
      "The Microsoft AI FDE motion + LLMs & tokens",
      "Provision Azure OpenAI + first deployment",
      "The chat completions API with the SDK",
      "Streaming, multimodal & parameters",
      "Ship: Week-1 mini-app + checkpoint",
    ]),
  },
  {
    number: 2, code: "DEV-150 · Developer Layer",
    title: "AI-native software engineering with GitHub Copilot",
    goal: "Master the delivery rig: GitHub Copilot, spec-to-code, AI-assisted PR review, code modernisation, and an AI-native SDLC.",
    layer: "Developer Layer", cert: "GitHub Copilot", accent: "#5a3fa0",
    days: d([
      "GitHub Copilot: chat, inline & agent mode",
      "Spec-to-code & test generation",
      "AI-assisted PR review & code quality",
      "Code modernisation with AI",
      "Ship: an AI-native SDLC pipeline",
    ]),
  },
  {
    number: 3, code: "MDL-200 · Models & Foundry",
    title: "Models, Model Router & Phi SLMs",
    goal: "Go deep on the intelligence layer: the Foundry catalog, selection economics, the Model Router, and Phi small language models.",
    layer: "AI Models & Foundry", cert: "AI-901 → AI-103", accent: "#1856a6",
    days: d([
      "The Foundry model catalog",
      "Model selection economics",
      "Model Router — dynamic routing",
      "Phi SLMs — small language models",
      "Ship: a model-routing gateway",
    ]),
  },
  {
    number: 4, code: "PE-300 · Prompt engineering",
    title: "Prompt engineering, structured output & first evals",
    goal: "Disciplined prompting — system prompts, few-shot, CoT, structured output — made measurable with Prompt flow and a golden test set.",
    layer: "Cross-cutting craft", cert: "AI-103", accent: "#6b2fb3",
    days: d([
      "Prompt anatomy & system messages",
      "Structure, delimiters & few-shot",
      "Chain-of-thought & reasoning models",
      "Structured output & anti-hallucination",
      "Ship: Prompt flow + versioned prompt (first evals)",
    ]),
  },
  {
    number: 5, code: "TOOL-400 · Tools & MCP",
    title: "Function calling & the Model Context Protocol",
    goal: "Give the model hands: function calling, parallel tool calls, and MCP — the open standard for connecting agents to tools.",
    layer: "Orchestration & Dev", cert: "AI-103", accent: "#1f7a8c",
    days: d([
      "Function calling basics",
      "Multiple & parallel tool calls",
      "Model Context Protocol (MCP)",
      "Tools over real data + guardrails",
      "Ship: a tool-using micro-agent",
    ]),
  },
  {
    number: 6, code: "RAG-500 · Retrieval",
    title: "RAG with Azure AI Search",
    goal: "Retrieval-augmented generation: embeddings, a vector + hybrid index, the semantic ranker, and grounded answers with citations.",
    layer: "Data & Knowledge", cert: "AI-103 · Applied", accent: "#1d5a92",
    days: d([
      "Embeddings & semantic similarity",
      "Azure AI Search: index & vectorize",
      "The RAG loop + grounded answers",
      "Hybrid search, semantic ranker & recall",
      "Ship: a 'chat with your docs' service",
    ]),
  },
  {
    number: 7, code: "DATA-600 · Enterprise data",
    title: "Fabric, OneLake, Dataverse & Graph connectors",
    goal: "Ground AI in real enterprise data: Fabric & OneLake, Dataverse & Power Platform, and Graph connectors.",
    layer: "Data & Knowledge", cert: "DP-600 / DP-700", accent: "#123f6b",
    days: d([
      "Microsoft Fabric & OneLake",
      "Dataverse & Power Platform data",
      "Graph connectors & external content",
      "Ground an agent on governed enterprise data",
      "Ship: an enterprise knowledge service",
    ]),
  },
  {
    number: 8, code: "ORCH-700 · Orchestration",
    title: "Semantic Kernel, AutoGen & the M365 Agents SDK",
    goal: "Orchestrate with the three Microsoft frameworks: Semantic Kernel, AutoGen, and the M365 Agents SDK.",
    layer: "Orchestration & Dev", cert: "AI-103", accent: "#17868f",
    days: d([
      "What is an agent? + Semantic Kernel",
      "SK plugins, functions & memory",
      "AutoGen — multi-agent",
      "The M365 Agents SDK",
      "Ship: an orchestrated task agent",
    ]),
  },
  {
    number: 9, code: "AGT-800 · Agent Service",
    title: "Managed agents with the Foundry Agent Service",
    goal: "Production-grade hosted agents: tools, connected knowledge, code interpreter, threads, multi-agent, and tracing.",
    layer: "AI Models & Foundry", cert: "AI-103 · Applied", accent: "#1856a6",
    days: d([
      "Why a managed agent service?",
      "Tools & the code interpreter",
      "Connected knowledge (AI Search grounding)",
      "Multi-agent, connected agents & tracing",
      "Ship: a grounded, tool-using agent",
    ]),
  },
  {
    number: 10, code: "EXP-900 · Agent & Experience",
    title: "Copilot Studio, M365 Copilot, Agent 365 & Teams AI",
    goal: "Meet users where they work: Copilot Studio, declarative agents, the Teams AI Library, and Agent 365 at scale.",
    layer: "Agent & Experience", cert: "PL-400/600 · Applied", accent: "#0b3b73",
    days: d([
      "Copilot Studio + M365 Copilot fundamentals",
      "Declarative agents extending M365 Copilot",
      "Teams AI Library — pro-code in Teams",
      "Agent 365 — manage agents at scale",
      "Ship: an enterprise Copilot in a channel",
    ]),
  },
  {
    number: 11, code: "GOV-1000 · Governance & Trust",
    title: "Evals, safety, identity & the governance stack",
    goal: "Make AI measurable and safe: the Evaluation SDK, Content Safety, Responsible AI, and Entra / Purview / Defender / Priva.",
    layer: "Governance & Trust", cert: "SC-500 · Applied", accent: "#1273d4",
    days: d([
      "Evaluation at scale — the Evaluation SDK",
      "AI Content Safety & prompt injection",
      "Responsible AI in practice",
      "Identity & data governance: Entra, Purview, Priva",
      "Ship: security posture + governance scorecard",
    ]),
  },
  {
    number: 12, code: "PROD-1100 · Production",
    title: "From notebook to Azure production",
    goal: "Real Azure infrastructure: secure API backend, Cosmos DB, Functions & APIM, Container Apps/AKS, observability, CI/CD with eval gates.",
    layer: "Infrastructure", cert: "AI-200 / AI-300", accent: "#4a5fa8",
    days: d([
      "API backend · Key Vault · Cosmos DB",
      "Azure Functions & API Management",
      "Containerise & deploy: Container Apps vs AKS",
      "Reliability & observability",
      "Ship: go live + CI/CD with eval gates",
    ]),
  },
  {
    number: 13, code: "ADOPT-1200 · Adoption & Change",
    title: "Adoption, change & the Frontier Firm",
    goal: "An agent no one uses ships zero value: Frontier-Firm model, change management, Viva enablement, cost-per-outcome value tracking.",
    layer: "Adoption & Change", cert: "AB-731 / AB-730", accent: "#b7541f",
    days: d([
      "The Frontier Firm & the adoption imperative",
      "Change management for AI",
      "Microsoft Viva & enablement",
      "Value tracking & cost-per-outcome",
      "Ship: an adoption & value plan",
    ]),
  },
  {
    number: 14, code: "DELIV-1300 · Delivery craft",
    title: "Microsoft AI FDE delivery craft & the 4–90 day embed",
    goal: "The consulting half of Code Monday / CXO Friday: discovery, scoping ≤5 agents, defending to CISO/CFO, exec demos, estimation, catalog.",
    layer: "Microsoft AI FDE delivery motion", cert: "AB-100 (prep)", accent: "#2a6f97",
    days: d([
      "The embed: discovery & scoping ≤5 agents",
      "Solution design & defending it",
      "Demoing to executives & stakeholder management",
      "Estimation, SLAs & the agent catalog",
      "Ship: the Microsoft AI FDE embed playbook",
    ]),
  },
  {
    number: 15, code: "CAP-1400 · Capstone build",
    title: "Capstone I — the embed simulation",
    goal: "Run a simulated embed against the Week-14 proposal: build up to two production-grade agents, integrate data/tools, evaluate & govern.",
    layer: "End-to-end · all layers", cert: "all Applied Skills", accent: "#e8590c",
    days: d([
      "Kickoff, finalise scope & data",
      "Build agent 1 — the core",
      "Build agent 2 + integrate data/tools",
      "Evaluate, secure & govern",
      "Mid-capstone review & hardening",
    ]),
  },
  {
    number: 16, code: "CAP-1450 · Capstone & graduation",
    title: "Capstone II — deploy, prove, hand over & present",
    goal: "Close the embed like an FDE: deploy on Azure, prove value with cost-per-outcome, hand over a runbook, certify readiness, present.",
    layer: "Deploy · prove · hand over", cert: "AB-900 · readiness", accent: "#b7541f",
    days: d([
      "Deploy on Azure via CI/CD",
      "Prove value — cost-per-outcome telemetry",
      "Handover runbook & catalog contribution",
      "Certification readiness review",
      "Demo day, handover & graduation",
    ]),
  },
];

// Fill day labels ("W.D") and a global order index.
let _order = 0;
for (const w of PROGRAM) {
  w.days.forEach((day, i) => {
    day.label = `${w.number}.${i + 1}`;
    (day as ProgramDay & { orderIndex?: number }).orderIndex = ++_order;
  });
}

export const TOTAL_DAYS = _order; // 80
export const TOTAL_WEEKS = PROGRAM.length; // 16

// The 2026 certification ladder (for the Certifications page reference panel).
export const CERT_LADDER = [
  { code: "AB-100", name: "Agentic AI Business Solutions Architect", tier: "Expert" },
  { code: "AB-900", name: "Copilot & Agent Administration Fundamentals", tier: "Baseline" },
  { code: "AB-731", name: "AI Transformation Leader", tier: "Business" },
  { code: "AI-103", name: "Azure AI App & Agent Developer", tier: "Associate" },
  { code: "AI-200", name: "Azure AI Cloud Developer", tier: "Associate" },
  { code: "AI-300", name: "MLOps Engineer", tier: "Associate" },
  { code: "AI-901", name: "Azure AI Fundamentals", tier: "Fundamentals" },
  { code: "SC-500", name: "Cloud & AI Security Engineer", tier: "Security" },
  { code: "DP-600", name: "Microsoft Fabric Analytics Engineer", tier: "Data" },
  { code: "PL-400", name: "Power Platform Developer", tier: "Low-code" },
];
