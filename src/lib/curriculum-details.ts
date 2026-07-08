import type { ProgramWeek } from "./program";

export type LearningResource = {
  title: string;
  url: string;
  source: "Microsoft Learn" | "Docs" | "GitHub" | "YouTube" | "Reference";
  why: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type DayLearningPlan = {
  summary: string;
  outcomes: string[];
  agenda: string[];
  resources: LearningResource[];
  lab: {
    title: string;
    scenario: string;
    setup: string[];
    exercises: string[];
    evidence: string[];
    stretch: string[];
  };
  quiz: QuizQuestion[];
  deliverables: string[];
};

const BASE_RESOURCES: LearningResource[] = [
  {
    title: "Azure AI Foundry documentation",
    url: "https://learn.microsoft.com/azure/ai-foundry/",
    source: "Microsoft Learn",
    why: "Primary product documentation for Azure AI apps, projects, model deployment, and agent workflows.",
  },
  {
    title: "Azure OpenAI Service documentation",
    url: "https://learn.microsoft.com/azure/ai-services/openai/",
    source: "Microsoft Learn",
    why: "Core reference for deployments, model APIs, SDK usage, safety, quota, and production operations.",
  },
  {
    title: "Microsoft Developer YouTube: Azure AI search",
    url: "https://www.youtube.com/results?search_query=Microsoft+Developer+Azure+AI+Foundry+tutorial",
    source: "YouTube",
    why: "Use as a video playlist search for current Microsoft demos related to the topic.",
  },
];

const WEEK_RESOURCES: Record<number, LearningResource[]> = {
  1: [
    learn("Get started with Azure OpenAI Service", "https://learn.microsoft.com/training/modules/get-started-openai/"),
    docs("Azure OpenAI chat completions", "https://learn.microsoft.com/azure/ai-services/openai/how-to/chatgpt"),
    github("Azure OpenAI samples", "https://github.com/Azure-Samples/openai"),
    youtube("Azure OpenAI SDK tutorial", "https://www.youtube.com/results?search_query=Azure+OpenAI+SDK+chat+completions+tutorial"),
  ],
  2: [
    docs("GitHub Copilot documentation", "https://docs.github.com/copilot"),
    docs("GitHub Actions documentation", "https://docs.github.com/actions"),
    learn("GitHub Copilot fundamentals", "https://learn.microsoft.com/training/paths/copilot/"),
    youtube("GitHub Copilot agent mode tutorial", "https://www.youtube.com/results?search_query=GitHub+Copilot+agent+mode+tutorial"),
  ],
  3: [
    docs("Model catalog in Azure AI Foundry", "https://learn.microsoft.com/azure/ai-foundry/how-to/model-catalog-overview"),
    docs("Azure AI Foundry models", "https://learn.microsoft.com/azure/ai-foundry/concepts/models"),
    docs("Phi models", "https://learn.microsoft.com/azure/ai-foundry/how-to/deploy-models-phi"),
    youtube("Azure AI Foundry model catalog", "https://www.youtube.com/results?search_query=Azure+AI+Foundry+model+catalog+Phi"),
  ],
  4: [
    docs("Prompt engineering concepts", "https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering"),
    docs("Prompt flow in Azure AI Foundry", "https://learn.microsoft.com/azure/ai-foundry/how-to/prompt-flow"),
    docs("Structured outputs", "https://learn.microsoft.com/azure/ai-services/openai/how-to/structured-outputs"),
    youtube("Azure AI prompt engineering tutorial", "https://www.youtube.com/results?search_query=Azure+OpenAI+prompt+engineering+structured+outputs"),
  ],
  5: [
    docs("Function calling with Azure OpenAI", "https://learn.microsoft.com/azure/ai-services/openai/how-to/function-calling"),
    docs("Model Context Protocol", "https://modelcontextprotocol.io/docs/getting-started/intro"),
    github("MCP servers repository", "https://github.com/modelcontextprotocol/servers"),
    youtube("Model Context Protocol tutorial", "https://www.youtube.com/results?search_query=Model+Context+Protocol+MCP+tutorial"),
  ],
  6: [
    docs("Azure AI Search vector search", "https://learn.microsoft.com/azure/search/vector-search-overview"),
    docs("Retrieval augmented generation with Azure AI Search", "https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview"),
    github("Azure Search OpenAI demo", "https://github.com/Azure-Samples/azure-search-openai-demo"),
    youtube("Azure AI Search RAG tutorial", "https://www.youtube.com/results?search_query=Azure+AI+Search+RAG+tutorial"),
  ],
  7: [
    docs("Microsoft Fabric documentation", "https://learn.microsoft.com/fabric/"),
    docs("Microsoft Dataverse documentation", "https://learn.microsoft.com/power-apps/maker/data-platform/"),
    docs("Microsoft Graph connectors", "https://learn.microsoft.com/microsoftsearch/connectors-overview"),
    youtube("Microsoft Fabric OneLake Dataverse AI", "https://www.youtube.com/results?search_query=Microsoft+Fabric+OneLake+Dataverse+AI"),
  ],
  8: [
    docs("Semantic Kernel documentation", "https://learn.microsoft.com/semantic-kernel/overview/"),
    github("Semantic Kernel repository", "https://github.com/microsoft/semantic-kernel"),
    github("AutoGen repository", "https://github.com/microsoft/autogen"),
    youtube("Semantic Kernel AutoGen agents tutorial", "https://www.youtube.com/results?search_query=Semantic+Kernel+AutoGen+agents+tutorial"),
  ],
  9: [
    docs("Azure AI Foundry Agent Service", "https://learn.microsoft.com/azure/ai-foundry/agents/overview"),
    docs("Tools in Azure AI Foundry Agent Service", "https://learn.microsoft.com/azure/ai-foundry/agents/how-to/tools/overview"),
    docs("Tracing for agents", "https://learn.microsoft.com/azure/ai-foundry/how-to/develop/trace-application"),
    youtube("Azure AI Foundry Agent Service tutorial", "https://www.youtube.com/results?search_query=Azure+AI+Foundry+Agent+Service+tutorial"),
  ],
  10: [
    docs("Copilot Studio documentation", "https://learn.microsoft.com/microsoft-copilot-studio/"),
    docs("Microsoft 365 Copilot extensibility", "https://learn.microsoft.com/microsoft-365-copilot/extensibility/"),
    docs("Teams AI library", "https://learn.microsoft.com/microsoftteams/platform/teams-ai-library/welcome"),
    youtube("Copilot Studio declarative agents Teams AI", "https://www.youtube.com/results?search_query=Copilot+Studio+declarative+agents+Teams+AI"),
  ],
  11: [
    docs("Azure AI evaluation SDK", "https://learn.microsoft.com/azure/ai-foundry/how-to/develop/evaluate-sdk"),
    docs("Azure AI Content Safety", "https://learn.microsoft.com/azure/ai-services/content-safety/"),
    docs("Microsoft Purview documentation", "https://learn.microsoft.com/purview/"),
    youtube("Azure AI evaluation content safety responsible AI", "https://www.youtube.com/results?search_query=Azure+AI+evaluation+content+safety+responsible+AI"),
  ],
  12: [
    docs("Azure App Service Node.js", "https://learn.microsoft.com/azure/app-service/configure-language-nodejs"),
    docs("Azure Key Vault documentation", "https://learn.microsoft.com/azure/key-vault/"),
    docs("Azure Container Apps documentation", "https://learn.microsoft.com/azure/container-apps/"),
    youtube("Azure App Service Container Apps CI CD Node.js", "https://www.youtube.com/results?search_query=Azure+App+Service+Container+Apps+CI+CD+Node.js"),
  ],
  13: [
    docs("Microsoft Adoption resources", "https://adoption.microsoft.com/"),
    docs("Microsoft Viva documentation", "https://learn.microsoft.com/viva/"),
    docs("Microsoft 365 Copilot adoption", "https://adoption.microsoft.com/copilot/"),
    youtube("Microsoft Copilot adoption change management Viva", "https://www.youtube.com/results?search_query=Microsoft+Copilot+adoption+change+management+Viva"),
  ],
  14: [
    docs("Microsoft Cloud Adoption Framework", "https://learn.microsoft.com/azure/cloud-adoption-framework/"),
    docs("Azure Well-Architected Framework", "https://learn.microsoft.com/azure/well-architected/"),
    docs("Responsible AI resources", "https://www.microsoft.com/ai/responsible-ai-resources"),
    youtube("Azure Well Architected AI solution design", "https://www.youtube.com/results?search_query=Azure+Well+Architected+AI+solution+design"),
  ],
  15: [
    docs("Azure AI Foundry end-to-end development", "https://learn.microsoft.com/azure/ai-foundry/how-to/develop/sdk-overview"),
    docs("Evaluate generative AI applications", "https://learn.microsoft.com/azure/ai-foundry/concepts/evaluation-approach-gen-ai"),
    docs("Azure deployment environments", "https://learn.microsoft.com/azure/deployment-environments/"),
    youtube("Azure AI capstone agent deployment", "https://www.youtube.com/results?search_query=Azure+AI+agent+deployment+capstone"),
  ],
  16: [
    docs("Azure Monitor documentation", "https://learn.microsoft.com/azure/azure-monitor/"),
    docs("Application Insights for Node.js", "https://learn.microsoft.com/azure/azure-monitor/app/nodejs"),
    docs("GitHub Actions for Azure", "https://learn.microsoft.com/azure/developer/github/github-actions"),
    youtube("Azure AI demo day deployment runbook", "https://www.youtube.com/results?search_query=Azure+AI+deployment+runbook+demo"),
  ],
};

export function getDayLearningPlan(week: ProgramWeek, dayIndex: number): DayLearningPlan {
  const day = week.days[dayIndex];
  const topic = day.focus.replace(/^Ship:\s*/i, "");
  const isShipDay = /^Ship:/i.test(day.focus) || dayIndex === 4;
  const resources = uniqueResources([
    ...(WEEK_RESOURCES[week.number] ?? BASE_RESOURCES),
    ...BASE_RESOURCES,
    youtube(`${topic} video walkthrough`, `https://www.youtube.com/results?search_query=${encodeURIComponent(`Microsoft ${topic} tutorial`)}`),
  ]).slice(0, 7);

  return {
    summary: `${day.label} focuses on ${topic}. Learners should leave with a usable artifact, a short decision record, and evidence that the concept works in a Microsoft AI FDE-style customer scenario.`,
    outcomes: [
      `Explain where ${topic} fits in the ${week.layer} layer.`,
      "Identify the Azure or Microsoft 365 service boundaries, required permissions, and common failure modes.",
      "Build a small working artifact that can be reused in the capstone.",
      "Capture evaluation criteria, risks, and next steps in a concise engineering note.",
    ],
    agenda: [
      "15 min: context, vocabulary, and architecture sketch.",
      "35 min: guided demo using the official documentation.",
      "70 min: hands-on lab in pairs or pods.",
      "25 min: quiz, peer review, and evidence upload.",
      "15 min: FDE reflection: customer value, security, cost, and operational readiness.",
    ],
    resources,
    lab: {
      title: isShipDay ? `Ship a ${week.code} working artifact` : `Hands-on lab: ${topic}`,
      scenario: `You are embedded with a customer team that needs ${topic.toLowerCase()} to accelerate an AI delivery outcome. Build the smallest credible proof that a Microsoft AI FDE could demo on Friday.`,
      setup: [
        "Use the academy Azure subscription or a local sandbox approved by the mentor.",
        "Create or reuse a GitHub repo folder for the week and add a README for the day.",
        "Record resource names, model names, URLs, prompts, and configuration choices.",
      ],
      exercises: buildExercises(week.number, topic, isShipDay),
      evidence: [
        "Screenshot or terminal output proving the main workflow ran successfully.",
        "README section with architecture, setup steps, assumptions, and known gaps.",
        "One paragraph explaining how this maps to customer business value.",
        "One risk or governance note: data, identity, cost, safety, reliability, or adoption.",
      ],
      stretch: [
        "Add telemetry, error handling, or a cost estimate.",
        "Create a reusable template or script for another pod.",
        "Write three eval cases that would catch a bad implementation.",
      ],
    },
    quiz: buildQuiz(topic, week.layer),
    deliverables: [
      "Working demo or documented dry-run.",
      "Day README with links to all references used.",
      "Quiz answers and one follow-up question for the mentor.",
      isShipDay ? "A 3-minute demo script for the weekly checkpoint." : "A short implementation note for the weekly artifact.",
    ],
  };
}

function buildExercises(weekNumber: number, topic: string, isShipDay: boolean) {
  const shared = [
    `Create a one-page concept map for ${topic}.`,
    "Follow one official reference and reproduce the core workflow.",
    "Change one parameter, policy, prompt, data source, or tool and record the result.",
    "Document what would break in production and how you would detect it.",
  ];

  const byWeek: Record<number, string[]> = {
    1: ["Call a deployed model from code and capture request/response examples.", "Add a simple streaming or parameter-tuning experiment."],
    2: ["Use Copilot to generate tests, then review and improve the generated code.", "Open a PR and add an AI-assisted review checklist."],
    3: ["Compare two model choices by latency, cost, quality, and fit.", "Route one request to a cheaper model and one to a stronger model."],
    4: ["Create a prompt version with expected structured output.", "Run at least five golden test cases and score failures."],
    5: ["Define a JSON tool schema or MCP tool contract.", "Execute a tool call and validate arguments before side effects."],
    6: ["Ingest sample documents, create chunks, and run a grounded answer query.", "Compare keyword, vector, and hybrid retrieval results."],
    7: ["Map an enterprise data source to access rules and freshness needs.", "Prototype a governed data grounding pattern."],
    8: ["Implement a plugin/function and call it through an orchestrator.", "Add memory or multi-agent handoff notes."],
    9: ["Create an agent with one knowledge source and one tool.", "Inspect traces and identify where the answer came from."],
    10: ["Design a user-facing agent experience in Teams or Copilot Studio.", "Write the channel-specific conversation flow."],
    11: ["Build an eval rubric and run a safety/adversarial test set.", "Document mitigations for prompt injection or data leakage."],
    12: ["Deploy a minimal API or app component with secrets outside source code.", "Add health checks and a rollback note."],
    13: ["Create an adoption journey and stakeholder map.", "Define success metrics and cost-per-outcome tracking."],
    14: ["Write an FDE discovery brief and scope no more than five agents.", "Prepare a CISO/CFO objection-handling note."],
    15: ["Build or integrate one capstone component end to end.", "Evaluate the component and log hardening tasks."],
    16: ["Prepare deployment evidence, runbook, and demo script.", "Prove value with telemetry or a before/after workflow metric."],
  };

  return [...shared, ...(byWeek[weekNumber] ?? []), ...(isShipDay ? ["Package the week's artifact and rehearse the checkpoint demo."] : [])];
}

function buildQuiz(topic: string, layer: string): QuizQuestion[] {
  return [
    {
      question: `What is the main purpose of ${topic} in a Microsoft AI FDE delivery?`,
      options: ["To produce a reusable customer outcome", "To add unrelated tooling", "To skip validation", "To replace stakeholder review"],
      answer: "To produce a reusable customer outcome",
    },
    {
      question: `Which concern should be checked before moving ${topic} into production?`,
      options: ["Identity, data access, cost, safety, and observability", "Only UI colour", "Only model name", "Only slide formatting"],
      answer: "Identity, data access, cost, safety, and observability",
    },
    {
      question: `How should learners prove they completed the ${layer} lab?`,
      options: ["Evidence, README, eval notes, and a short demo", "A verbal claim only", "A screenshot with no context", "No artifact required"],
      answer: "Evidence, README, eval notes, and a short demo",
    },
    {
      question: "What is the best next step after a lab works once?",
      options: ["Add tests or evals and document failure modes", "Delete the repo", "Ignore security", "Hard-code secrets"],
      answer: "Add tests or evals and document failure modes",
    },
  ];
}

function learn(title: string, url: string): LearningResource {
  return { title, url, source: "Microsoft Learn", why: "Structured module for guided learning and checkpoint review." };
}

function docs(title: string, url: string): LearningResource {
  return { title, url, source: "Docs", why: "Authoritative implementation reference for the lab." };
}

function github(title: string, url: string): LearningResource {
  return { title, url, source: "GitHub", why: "Sample code or reference implementation to compare against." };
}

function youtube(title: string, url: string): LearningResource {
  return { title, url, source: "YouTube", why: "Video walkthrough search for learners who prefer demo-first learning." };
}

function uniqueResources(resources: LearningResource[]) {
  const seen = new Set<string>();
  return resources.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
