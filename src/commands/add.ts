import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdirp, outputFile } from "fs-extra";
import { resolve, dirname } from "node:path";
import pc from "picocolors";

import { COMPONENTS } from "../lib/components.js";
import type { ComponentDef } from "../lib/components.js";
import { mergeMarkdown } from "../lib/merger.js";
import { isMarkdown } from "../lib/generator.js";

const CONFIG_FILE = ".devcontext.json";

function readConfig(projectRoot: string): Record<string, unknown> {
  const path = resolve(projectRoot, CONFIG_FILE);
  if (!existsSync(path)) {
    console.error(
      pc.red("✗") +
        " No .devcontext.json found.\n\n" +
        "  Run " +
        pc.cyan("npx contextforge init") +
        " first to generate project context.",
    );
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    console.error(pc.red("✗") + " .devcontext.json is corrupted or invalid JSON.");
    process.exit(1);
  }
}

function writeConfig(projectRoot: string, config: Record<string, unknown>): void {
  writeFileSync(
    resolve(projectRoot, CONFIG_FILE),
    JSON.stringify(config, null, 2) + "\n",
    "utf-8",
  );
}

function listValid(): string {
  return COMPONENTS.map((c) => `  ${pc.dim(c.type + ":")} ${c.id}`).join("\n");
}

export async function addCmd(
  componentId: string,
  projectRoot: string,
): Promise<void> {
  const config = readConfig(projectRoot);
  const answers = (config.answers ?? config) as Record<string, unknown>;

  const comp = COMPONENTS.find((c) => c.id === componentId);
  if (!comp) {
    console.error(
      pc.red("✗") +
        ` Unknown component "${componentId}".\n\nValid components:\n\n${listValid()}\n`,
    );
    process.exit(1);
  }

  const targetPath = resolve(projectRoot, comp.filePath);
  const content = comp.render(answers as never);
  const label = comp.name;

  await mkdirp(dirname(targetPath));

  if (isMarkdown(comp.filePath)) {
    await mergeMarkdown(targetPath, content);
  } else {
    await outputFile(targetPath, content, "utf-8");
  }

  const listKey = comp.type === "agent" ? "agents" : "extraSkills";
  const list = (answers[listKey] as string[]) ?? [];
  if (!list.includes(comp.name)) {
    list.push(comp.name);
    answers[listKey] = list;
    config.answers = answers;
    writeConfig(projectRoot, config);
  }

  console.log(
    `  ${pc.green("✓")}  ${label} → ${comp.filePath}` +
      (list.includes(comp.name) ? "" : "") +
      "\n" + pc.dim(`  (recorded in ${CONFIG_FILE})`),
  );
}
