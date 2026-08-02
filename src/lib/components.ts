import type { WizardAnswers } from "./types.js";

export interface ComponentDef {
  id: string;
  name: string;
  type: "skill" | "agent";
  filePath: string;
  render: (answers: WizardAnswers) => string;
}

const agentTemplate = (name: string, focus: string) => (a: WizardAnswers) =>
  [
    `# ${name}`,
    "",
    `Agent persona for the ${a.projectName} project.`,
    "",
    `## Focus`,
    "",
    focus,
    "",
    "## Stack Context",
    `- Framework: ${a.framework}`,
    `- Database: ${a.databases.join(", ") || "None"}`,
    `- Auth: ${a.auth}`,
    `- CI/CD: ${a.ci}`,
    "",
    "## Responsibilities",
    "",
    "<!-- Define the agent's specific responsibilities here -->",
    "",
  ].join("\n");

const skillTemplate = (title: string, body: string) => (a: WizardAnswers) =>
  [
    `# ${title}`,
    "",
    `Skill definition for the ${a.projectName} project.`,
    "",
    body,
    "",
    "## Stack Context",
    `- Framework: ${a.framework}`,
    `- Database: ${a.databases.join(", ") || "None"}`,
    `- Auth: ${a.auth}`,
    `- CI/CD: ${a.ci}`,
    "",
  ].join("\n");

export const COMPONENTS: ComponentDef[] = [
  // ---- Skills ----
  {
    id: "engineering-standards",
    name: "Engineering Standards",
    type: "skill",
    filePath: "skills/engineering-standards.md",
    render: skillTemplate(
      "Engineering Standards",
      [
        "### Code Quality",
        "- All code must pass lint and type checks before merging.",
        "- Avoid dead code and debugging artefacts in PRs.",
        "",
        "### Code Review",
        "- Every PR needs at least one approval.",
        "- Verify correctness, test coverage, and convention adherence.",
        "",
        "### Dependencies",
        "- Audit regularly for vulnerabilities.",
        "- Pin exact versions for reproducible builds.",
      ].join("\n"),
    ),
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    type: "skill",
    filePath: "skills/knowledge-base.md",
    render: skillTemplate(
      "Knowledge Base",
      [
        "Refer to the shared project context files:",
        "- knowledge/project-context.md",
        "- knowledge/architecture.md",
        "- knowledge/coding-guidelines.md",
        "",
        "### Domains",
        "<!-- List key domain concepts -->",
        "",
        "### Common Patterns",
        "<!-- Document recurring patterns -->",
        "",
        "### Glossary",
        "<!-- Project-specific terminology -->",
      ].join("\n"),
    ),
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    type: "skill",
    filePath: "skills/code-reviewer.md",
    render: skillTemplate(
      "Code Reviewer",
      [
        "### Review Checklist",
        "- [ ] Does the code compile / type-check?",
        "- [ ] Are there sufficient tests?",
        "- [ ] Is the code idiomatic for the stack?",
        "- [ ] Are error paths handled?",
        "- [ ] Secrets hardcoded anywhere?",
      ].join("\n"),
    ),
  },
  {
    id: "security-reviewer",
    name: "Security Reviewer",
    type: "skill",
    filePath: "skills/security-reviewer.md",
    render: skillTemplate(
      "Security Reviewer",
      [
        "### Security Checklist",
        "- [ ] Input validation on all user-facing endpoints?",
        "- [ ] Authentication on every protected route?",
        "- [ ] Authorisation checks?",
        "- [ ] No secrets in source code / logs?",
        "- [ ] Dependencies checked for CVEs?",
        "- [ ] Injection vectors reviewed?",
        "- [ ] CSRF protection in place?",
      ].join("\n"),
    ),
  },
  {
    id: "architecture",
    name: "Architecture",
    type: "skill",
    filePath: "skills/architecture.md",
    render: skillTemplate(
      "Architecture",
      [
        "### High-Level Architecture",
        "<!-- Describe your project's architecture here -->",
        "",
        "### Key Architectural Decisions",
        "<!-- Record ADRs here -->",
        "",
        "### Data Flow",
        "<!-- Document main data flow paths -->",
      ].join("\n"),
    ),
  },
  {
    id: "testing-standards",
    name: "Testing Standards",
    type: "skill",
    filePath: "skills/testing-standards.md",
    render: skillTemplate(
      "Testing Standards",
      [
        "### Test Strategy",
        "- Unit tests for business logic.",
        "- Integration tests for API / data layer boundaries.",
        "- E2E tests for critical user flows.",
        "",
        "### Coverage",
        "- Aim for meaningful coverage, not 100%.",
        "- Test behaviour, not implementation details.",
      ].join("\n"),
    ),
  },

  // ---- Agents ----
  {
    id: "backend-engineer",
    name: "Backend Engineer",
    type: "agent",
    filePath: "agents/backend-engineer.md",
    render: agentTemplate(
      "Backend Engineer",
      "Backend development, API design, data modelling, and server-side logic.",
    ),
  },
  {
    id: "principal-engineer",
    name: "Principal Engineer",
    type: "agent",
    filePath: "agents/principal-engineer.md",
    render: agentTemplate(
      "Principal Engineer",
      "Technical strategy, architecture decisions, cross-cutting concerns, and mentorship.",
    ),
  },
  {
    id: "tech-lead",
    name: "Tech Lead",
    type: "agent",
    filePath: "agents/tech-lead.md",
    render: agentTemplate(
      "Tech Lead",
      "Sprint planning, code review oversight, technical debt management, and team coordination.",
    ),
  },
  {
    id: "qa-engineer",
    name: "QA Engineer",
    type: "agent",
    filePath: "agents/qa-engineer.md",
    render: agentTemplate(
      "QA Engineer",
      "Test planning, automation strategy, regression testing, and quality gates.",
    ),
  },
  {
    id: "devsecops-engineer",
    name: "DevSecOps Engineer",
    type: "agent",
    filePath: "agents/devsecops-engineer.md",
    render: agentTemplate(
      "DevSecOps Engineer",
      "CI/CD pipeline security, infrastructure hardening, vulnerability scanning, and incident response.",
    ),
  },
  {
    id: "solution-architect",
    name: "Solution Architect",
    type: "agent",
    filePath: "agents/solution-architect.md",
    render: agentTemplate(
      "Solution Architect",
      "System design, technology selection, trade-off analysis, and cross-system integration.",
    ),
  },
];
