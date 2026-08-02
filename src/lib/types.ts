export interface WizardAnswers {
  projectName: string;
  framework: string;
  databases: string[];
  orms: string[];
  auth: string;
  infra: string[];
  securityStandards: string[];
  generateDocs: boolean;
  ci: string;
  docker: boolean;
  extraSkills: string[];
  agents: string[];
}

export interface ToolMapping {
  id: string;
  name: string;
  filePath: string;
}

export const TOOL_MAPPINGS: ToolMapping[] = [
  { id: "claude", name: "Claude Code", filePath: "CLAUDE.md" },
  { id: "cursor", name: "Cursor", filePath: ".cursor/rules/project-rules.md" },
  { id: "copilot", name: "GitHub Copilot", filePath: ".github/copilot-instructions.md" },
  { id: "windsurf", name: "Windsurf", filePath: ".windsurfrules" },
  { id: "continue", name: "Continue.dev", filePath: ".continue/config.json" },
  { id: "codeium", name: "Codeium", filePath: ".codeium.md" },
  { id: "amazonq", name: "Amazon Q Developer", filePath: ".amazonq/rules.md" },
  { id: "tabnine", name: "Tabnine", filePath: ".tabnine.md" },
];
