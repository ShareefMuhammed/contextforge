import * as p from "@clack/prompts";
import pc from "picocolors";
const { cyan, green, dim, yellow } = pc;

import type { WizardAnswers } from "../lib/types.js";
import { DEFAULT_ANSWERS, runWizard } from "../lib/questions.js";
import { generateUserFiles, dryRunUserFiles } from "../lib/generator.js";
import type { PreviewAction } from "../lib/merger.js";

const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const ACTION_SYMBOL: Record<PreviewAction, string> = {
  create: yellow("+"),
  update: yellow("~"),
  append: yellow("+"),
  overwrite: yellow("~"),
};

const ACTION_LABEL: Record<PreviewAction, string> = {
  create: "create",
  update: "update",
  append: "append",
  overwrite: "overwrite",
};

export async function boot(
  projectName: string,
  options: { yes?: boolean; dryRun?: boolean },
  projectRoot: string,
): Promise<void> {
  p.intro(cyan("contextforge — bootstrap project context"));

  // validate
  if (!KEBAB_CASE.test(projectName)) {
    p.cancel(
      `Invalid project name "${projectName}". Must be kebab-case (lowercase letters and hyphens only).`,
    );
    process.exit(1);
  }

  let answers: WizardAnswers;

  if (options.yes) {
    answers = { ...DEFAULT_ANSWERS, projectName };
    p.note(`Using safe defaults for ${projectName}`, "Auto‑mode");
  } else {
    p.note(`Bootstrapping context for ${projectName}`, "contextforge");

    answers = await runWizard(projectName);

    const proceed = await p.confirm({
      message: "Generate files with these answers?",
      initialValue: true,
    });
    if (typeof proceed !== "boolean" || !proceed) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
  }

  if (options.dryRun) {
    const files = dryRunUserFiles(answers, projectRoot);
    const lines = files.map(
      (f) => `  ${ACTION_SYMBOL[f.action]} ${f.path}  ${dim(`(${ACTION_LABEL[f.action]})`)}`,
    );
    p.note(lines.join("\n"), "Dry run — no files written");
    p.outro(cyan("Run without --dry-run to apply these changes."));
  } else {
    const spinner = p.spinner();
    spinner.start("Generating files...");

    try {
      const generated = await generateUserFiles(answers, projectRoot);
      spinner.stop(green("Done!"));

      p.note(
        generated.map((f) => `  • ${f}`).join("\n"),
        "Generated files",
      );

      p.outro(
        green(
          `Project context for ${projectName} is ready. Run npx contextforge doctor to verify.`,
        ),
      );
    } catch (err) {
      spinner.stop("Failed");
      p.cancel(`Error: ${err}`);
      process.exit(1);
    }
  }
}
