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

  const generateDocs = await p.confirm({
    message: "Generate project documentation?",
    initialValue: true,
  });

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

  const docker = await p.confirm({
    message: "Do you use Docker?",
    initialValue: false,
  });

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
