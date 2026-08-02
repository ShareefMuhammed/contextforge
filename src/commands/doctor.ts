import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";

import { TOOL_MAPPINGS } from "../lib/types.js";
import { TEMPLATES } from "../templates/index.js";

interface CheckResult {
  label: string;
  ok: boolean;
}

export async function doctorCmd(projectRoot: string): Promise<void> {
  const devContextPath = resolve(projectRoot, ".devcontext.json");

  if (!existsSync(devContextPath)) {
    console.error(
      pc.red("✗") +
        " No .devcontext.json found in " +
        projectRoot +
        "\n\n" +
        "  Run " +
        pc.cyan("npx contextforge init") +
        " first to generate project context.",
    );
    process.exit(1);
  }

  let answers: Record<string, unknown>;
  try {
    const raw = readFileSync(devContextPath, "utf-8");
    answers = JSON.parse(raw).answers ?? JSON.parse(raw);
  } catch {
    console.error(pc.red("✗") + " .devcontext.json is corrupted or invalid JSON.");
    process.exit(1);
  }

  const results: CheckResult[] = [];

  for (const tpl of TEMPLATES) {
    const fullPath = resolve(projectRoot, tpl.path);
    results.push(checkFile(tpl.path, fullPath));
  }

  for (const tool of TOOL_MAPPINGS) {
    const fullPath = resolve(projectRoot, tool.filePath);
    results.push(checkFile(tool.filePath, fullPath));
  }

  results.push(checkFile("Dockerfile", resolve(projectRoot, "Dockerfile")));
  results.push(checkFile("docker-compose.yml", resolve(projectRoot, "docker-compose.yml")));
  results.push(checkFile(".github/workflows/ci.yml", resolve(projectRoot, ".github/workflows/ci.yml")));

  console.log(pc.bold("\ncontextforge doctor — " + projectRoot + "\n"));

  let passed = 0;
  let failed = 0;

  for (const r of results) {
    if (r.ok) {
      console.log("  " + pc.green("✓") + "  " + r.label);
      passed++;
    } else {
      console.log("  " + pc.red("✗") + "  " + r.label);
      failed++;
    }
  }

  console.log(
    pc.bold(
      "\n" +
        (failed > 0 ? pc.red(`${failed} failed`) : pc.green("All passed")) +
        ` · ${passed + failed} total` +
        "\n",
    ),
  );

  if (failed > 0) process.exit(1);
}

function checkFile(label: string, fullPath: string): CheckResult {
  if (!existsSync(fullPath)) {
    return { label, ok: false };
  }
  try {
    const st = statSync(fullPath);
    if (st.size === 0) {
      return { label, ok: false };
    }
  } catch {
    return { label, ok: false };
  }
  return { label, ok: true };
}
