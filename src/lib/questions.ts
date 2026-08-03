import * as p from "@clack/prompts";

import type { WizardAnswers } from "./types.js";

export const DEFAULT_ANSWERS: WizardAnswers = {
  projectName: "",
  framework: "None",
  databases: [],
  orms: [],
  auth: "None",
  infra: [],
  securityStandards: [],
  generateDocs: true,
  ci: "None",
  docker: false,
  extraSkills: [],
  agents: [],
};

export async function runWizard(projectName: string): Promise<WizardAnswers> {
  const brief = await p.text({
    message: "Project brief? (one line - what it is and the problem it solves)",
    placeholder: "Support-desk ticketing API",
  });
  if (p.isCancel(brief)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const projectType = await p.select({
    message: "What kind of project is this?",
    options: [
      { value: "Monorepo", label: "Monorepo", hint: "multiple packages/apps managed in a single repository" },
      { value: "Single project", label: "Single project" },
    ],
  });
  if (p.isCancel(projectType)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const agenticTools = await p.multiselect({
    message: "Which agentic coding tool(s) will you use?",
    options: [
      { value: "Claude Code", label: "Claude Code", hint: "CLAUDE.md + .claude/{skills,agents}" },
      { value: "Cursor", label: "Cursor", hint: ".cursor/rules" },
      { value: "OpenCode", label: "OpenCode", hint: "AGENTS.md" },
      { value: "OpenAI Codex / Codex CLI", label: "OpenAI Codex / Codex CLI" },
      { value: "GitHub Copilot (Agent Mode)", label: "GitHub Copilot (Agent Mode)" },
      { value: "Windsurf", label: "Windsurf" },
      { value: "Cline", label: "Cline" },
      { value: "Aider", label: "Aider" },
      { value: "Gemini CLI", label: "Gemini CLI" },
      { value: "Amazon Q Developer", label: "Amazon Q Developer" },
      { value: "Continue.dev", label: "Continue.dev" },
      { value: "JetBrains AI Assistant", label: "JetBrains AI Assistant" },
      { value: "Replit Agent", label: "Replit Agent" },
    ],
  });
  if (p.isCancel(agenticTools)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const framework = await p.select({
    message: "Which framework does your project use?",
    options: [
      { value: "React", label: "React" },
      { value: "Vue", label: "Vue" },
      { value: "Angular", label: "Angular" },
      { value: "Svelte", label: "Svelte" },
      { value: "Next.js", label: "Next.js" },
      { value: "Nuxt.js", label: "Nuxt.js" },
      { value: "Express", label: "Express" },
      { value: "Fastify", label: "Fastify" },
      { value: "NestJS", label: "NestJS" },
      { value: "None", label: "None / Other" },
    ],
  });
  if (p.isCancel(framework)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const databases = await p.multiselect({
    message: "Which databases does your project use?",
    options: [
      { value: "PostgreSQL", label: "PostgreSQL" },
      { value: "MySQL", label: "MySQL" },
      { value: "SQLite", label: "SQLite" },
      { value: "MongoDB", label: "MongoDB" },
      { value: "Redis", label: "Redis" },
      { value: "DynamoDB", label: "DynamoDB" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(databases)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const vectorStores = await p.multiselect({
    message: "Select vector store(s) to include:",
    options: [
      { value: "Chroma", label: "Chroma", hint: "self-hosted vector database" },
      { value: "pgvector", label: "pgvector", hint: "Postgres + vectors" },
      { value: "Qdrant", label: "Qdrant" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(vectorStores)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const orms = await p.multiselect({
    message: "Which ORMs / data layers does your project use?",
    options: [
      { value: "Prisma", label: "Prisma" },
      { value: "Drizzle", label: "Drizzle" },
      { value: "TypeORM", label: "TypeORM" },
      { value: "Sequelize", label: "Sequelize" },
      { value: "Mongoose", label: "Mongoose" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(orms)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const storage = await p.multiselect({
    message: "Select storage option(s) to include:",
    options: [
      { value: "AWS S3", label: "AWS S3", hint: "object storage, cloud" },
      { value: "MinIO", label: "MinIO", hint: "S3-compatible" },
      { value: "SeaweedFS", label: "SeaweedFS", hint: "S3-compatible" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(storage)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const auth = await p.select({
    message: "Which authentication solution do you use?",
    options: [
      { value: "Auth.js", label: "Auth.js / NextAuth" },
      { value: "Lucia", label: "Lucia" },
      { value: "Clerk", label: "Clerk" },
      { value: "Supabase Auth", label: "Supabase Auth" },
      { value: "Firebase Auth", label: "Firebase Auth" },
      { value: "Kinde", label: "Kinde" },
      { value: "Custom JWT", label: "Custom JWT" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(auth)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const infra = await p.multiselect({
    message: "Which infrastructure / IaC tools do you use?",
    options: [
      { value: "Terraform", label: "Terraform" },
      { value: "Pulumi", label: "Pulumi" },
      { value: "AWS CDK", label: "AWS CDK" },
      { value: "CloudFormation", label: "CloudFormation" },
      { value: "Serverless Framework", label: "Serverless Framework" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(infra)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const securityStandards = await p.multiselect({
    message: "Which security standards do you follow?",
    options: [
      { value: "OWASP Top 10", label: "OWASP Top 10" },
      { value: "CWE/SANS", label: "CWE/SANS Top 25" },
      { value: "PCI-DSS", label: "PCI-DSS" },
      { value: "HIPAA", label: "HIPAA" },
      { value: "SOC 2", label: "SOC 2" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(securityStandards)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const extraSkills = await p.multiselect({
    message: "Which additional skills should we generate?",
    options: [
      { value: "Engineering Standards", label: "Engineering Standards" },
      { value: "Knowledge Base", label: "Knowledge Base" },
      { value: "Code Reviewer", label: "Code Reviewer" },
      { value: "Security Reviewer", label: "Security Reviewer" },
      { value: "Architecture", label: "Architecture" },
      { value: "Testing Standards", label: "Testing Standards" },
    ],
  });
  if (p.isCancel(extraSkills)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const agents = await p.multiselect({
    message: "Which AI agent personas should we define?",
    options: [
      { value: "Principal Engineer", label: "Principal Engineer" },
      { value: "Tech Lead", label: "Tech Lead" },
      { value: "QA Engineer", label: "QA Engineer" },
      { value: "DevSecOps Engineer", label: "DevSecOps Engineer" },
      { value: "Solution Architect", label: "Solution Architect" },
    ],
  });
  if (p.isCancel(agents)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const generateDocs = await p.confirm({
    message: "Generate project documentation?",
    initialValue: true,
  });
  if (p.isCancel(generateDocs)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const ci = await p.select({
    message: "Which CI/CD platform do you use?",
    options: [
      { value: "GitHub Actions", label: "GitHub Actions" },
      { value: "GitLab CI/CD", label: "GitLab CI/CD" },
      { value: "Jenkins", label: "Jenkins" },
      { value: "CircleCI", label: "CircleCI" },
      { value: "None", label: "None" },
    ],
  });
  if (p.isCancel(ci)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const docker = await p.confirm({
    message: "Do you use Docker?",
    initialValue: false,
  });
  if (p.isCancel(docker)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const cleanMulti = <T>(val: T | symbol, fallback: T): T =>
    typeof val === "symbol" ? fallback : val;

  return {
    projectName,
    framework: cleanMulti(framework, "None") as string,
    databases: cleanMulti(databases, []) as string[],
    orms: cleanMulti(orms, []) as string[],
    auth: cleanMulti(auth, "None") as string,
    infra: cleanMulti(infra, []) as string[],
    securityStandards: cleanMulti(securityStandards, []) as string[],
    generateDocs: cleanMulti(generateDocs, true) as boolean,
    ci: cleanMulti(ci, "None") as string,
    docker: cleanMulti(docker, false) as boolean,
    extraSkills: cleanMulti(extraSkills, []) as string[],
    agents: cleanMulti(agents, []) as string[],
  };
}
