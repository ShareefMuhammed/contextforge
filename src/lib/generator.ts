import { existsSync, readFileSync } from "node:fs";
import { mkdirp, outputFile } from "fs-extra";
import { resolve, dirname } from "node:path";

import type { WizardAnswers } from "./types.js";
import { TOOL_MAPPINGS } from "./types.js";
import { TEMPLATES, getToolTemplate } from "../templates/index.js";
import { mergeMarkdown, previewMarkdown, previewFile } from "./merger.js";
import type { PreviewAction } from "./merger.js";

const MARKDOWN_FILES = new Set([
  ".md",
]);

const MARKDOWN_NAKED = new Set([
  ".windsurfrules",
]);

export function isMarkdown(path: string): boolean {
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  if (MARKDOWN_FILES.has(ext)) return true;
  for (const naked of MARKDOWN_NAKED) {
    if (path.endsWith(naked)) return true;
  }
  return false;
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await mkdirp(dirname(filePath));
  await outputFile(filePath, content, "utf-8");
}

function readCreatedAt(path: string): string {
  try {
    const existing = JSON.parse(readFileSync(path, "utf-8")) as { createdAt?: string };
    return existing.createdAt ?? new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function generateUserFiles(
  answers: WizardAnswers,
  projectRoot: string,
): Promise<string[]> {
  const generated: string[] = [];

  // knowledge + skills templates (markdown — merge)
  for (const tpl of TEMPLATES) {
    const targetPath = resolve(projectRoot, tpl.path);
    await mergeMarkdown(targetPath, tpl.render(answers));
    generated.push(tpl.path);
  }

  // tool-specific files
  for (const tool of TOOL_MAPPINGS) {
    const content = getToolTemplate(tool, answers);
    const targetPath = resolve(projectRoot, tool.filePath);
    if (isMarkdown(tool.filePath)) {
      await mergeMarkdown(targetPath, content);
    } else {
      await writeFile(targetPath, content);
    }
    generated.push(tool.filePath);
  }

  // Docker stubs
  const dockerStub = "# Docker configuration\n# TODO: Add Dockerfile and compose.yml";
  await writeFile(resolve(projectRoot, "Dockerfile"), dockerStub);
  await writeFile(resolve(projectRoot, "docker-compose.yml"), "# TODO: Add docker-compose configuration");
  generated.push("Dockerfile (stub)");
  generated.push("docker-compose.yml (stub)");

  // CI stubs
  const ciStub = "# CI/CD configuration\n# TODO: Add CI pipeline configuration";
  await writeFile(resolve(projectRoot, ".github/workflows/ci.yml"), ciStub);
  generated.push(".github/workflows/ci.yml (stub)");

  // .devcontext.json
  const devContextPath = resolve(projectRoot, ".devcontext.json");
  const createdAt = existsSync(devContextPath)
    ? readCreatedAt(devContextPath)
    : new Date().toISOString();
  const devContext = {
    generatedBy: "user" as const,
    version: "0.1.0",
    createdAt,
    answers,
  };
  await writeFile(
    devContextPath,
    JSON.stringify(devContext, null, 2),
  );
  generated.push(".devcontext.json");

  return generated;
}

export interface DryRunEntry {
  path: string;
  action: PreviewAction;
}

export function dryRunUserFiles(
  answers: WizardAnswers,
  projectRoot: string,
): DryRunEntry[] {
  const entries: DryRunEntry[] = [];

  const add = (filePath: string, action: PreviewAction): void => {
    entries.push({ path: filePath, action });
  };

  for (const tpl of TEMPLATES) {
    const targetPath = resolve(projectRoot, tpl.path);
    add(tpl.path, previewMarkdown(targetPath));
  }

  for (const tool of TOOL_MAPPINGS) {
    const targetPath = resolve(projectRoot, tool.filePath);
    if (isMarkdown(tool.filePath)) {
      add(tool.filePath, previewMarkdown(targetPath));
    } else {
      add(tool.filePath, previewFile(targetPath));
    }
  }

  add("Dockerfile", previewFile(resolve(projectRoot, "Dockerfile")));
  add("docker-compose.yml", previewFile(resolve(projectRoot, "docker-compose.yml")));
  add(".github/workflows/ci.yml", previewFile(resolve(projectRoot, ".github/workflows/ci.yml")));
  add(".devcontext.json", previewFile(resolve(projectRoot, ".devcontext.json")));

  return entries;
}
