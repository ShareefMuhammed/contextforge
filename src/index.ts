#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { cac } from "cac";

import { boot } from "./commands/boot.js";
import { initCmd } from "./commands/init.js";
import { doctorCmd } from "./commands/doctor.js";
import { addCmd } from "./commands/add.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let pkg: { name: string; version: string; description: string };

try {
  pkg = JSON.parse(
    readFileSync(resolve(__dirname, "../package.json"), "utf-8"),
  );
} catch {
  pkg = { name: "contextforge", version: "0.1.0", description: "" };
}

const cli = cac(pkg.name);

cli
  .command("boot [projectName]", "Bootstrap a new project context")
  .option("-y, --yes", "Skip all prompts, use safe defaults")
  .option("--dry-run", "Preview changes without writing")
  .action(async (projectName?: string, options?: { yes?: boolean; dryRun?: boolean }) => {
    if (!projectName) {
      console.error("error: project name is required\n  npx contextforge boot <project-name>");
      process.exit(1);
    }
    await boot(projectName, options ?? {}, join(process.cwd(), projectName));
  });

cli
  .command("init", "Initialize context for the current directory")
  .option("-y, --yes", "Skip all prompts, use safe defaults")
  .option("--dry-run", "Preview changes without writing")
  .action(async (options?: { yes?: boolean; dryRun?: boolean }) => {
    await initCmd(options ?? {}, process.cwd());
  });

cli
  .command("doctor", "Check generated files are present and valid")
  .action(async () => {
    await doctorCmd(process.cwd());
  });

cli
  .command("add <component>", "Add a single skill or agent component")
  .action(async (component: string) => {
    await addCmd(component, process.cwd());
  });

cli.help();
cli.version(pkg.version);

const rawArgs = process.argv.slice(2);
if (rawArgs[0] && rawArgs[0].startsWith("--")) {
  const flag = rawArgs[0].slice(2);
  if (["boot", "init", "doctor", "add"].includes(flag)) {
    rawArgs[0] = flag;
  }
}

cli.parse(process.argv.slice(0, 2).concat(rawArgs));

