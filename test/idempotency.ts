import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, rmSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");
const TEST_APP_NAME = "test-app";
const TEST_APP_DIR = join(PROJECT_ROOT, TEST_APP_NAME);

const CLI = `node "${resolve(PROJECT_ROOT, "dist/index.js")}"`;
const FILES_TO_CHECK = [
  "knowledge/project-context.md",
  "knowledge/architecture.md",
  "knowledge/coding-guidelines.md",
  "skills/engineering-standards.md",
  "skills/knowledge-base.md",
  "skills/code-reviewer.md",
  "skills/security-reviewer.md",
  "CLAUDE.md",
  ".cursor/rules/project-rules.md",
  ".github/copilot-instructions.md",
  ".windsurfrules",
  ".continue/config.json",
  ".codeium.md",
  ".amazonq/rules.md",
  ".tabnine.md",
  "Dockerfile",
  "docker-compose.yml",
  ".github/workflows/ci.yml",
  ".devcontext.json",
];

function sha256(filePath: string): string {
  try {
    return createHash("sha256").update(readFileSync(filePath)).digest("hex");
  } catch {
    return "FILE_NOT_FOUND";
  }
}

console.log("=== Idempotency Test ===");
console.log("");

// Clean any previous test-app run
rmSync(TEST_APP_DIR, { recursive: true, force: true });

// Run 1
console.log(`>>> Run 1: contextforge boot ${TEST_APP_NAME} --yes`);
execSync(`${CLI} boot ${TEST_APP_NAME} --yes`, { cwd: PROJECT_ROOT, stdio: "pipe" });

const hashes1 = Object.fromEntries(
  FILES_TO_CHECK.map((f) => [f, sha256(resolve(TEST_APP_DIR, f))]),
);

const missing1 = Object.entries(hashes1)
  .filter(([, h]) => h === "FILE_NOT_FOUND")
  .map(([f]) => f);

if (missing1.length > 0) {
  console.error("FAIL: Files missing after first run:", missing1.join(", "));
  process.exit(1);
}
console.log("  All files created.");

// Run 2
console.log(`>>> Run 2: contextforge boot ${TEST_APP_NAME} --yes`);
execSync(`${CLI} boot ${TEST_APP_NAME} --yes`, { cwd: PROJECT_ROOT, stdio: "pipe" });

const hashes2 = Object.fromEntries(
  FILES_TO_CHECK.map((f) => [f, sha256(resolve(TEST_APP_DIR, f))]),
);

const mismatches = FILES_TO_CHECK.filter((f) => hashes1[f] !== hashes2[f]);

if (mismatches.length > 0) {
  console.error("FAIL: Byte mismatch on files:", mismatches.join(", "));
  process.exit(1);
}

console.log("  All files byte-identical between runs.");
console.log("");
console.log("PASS: contextforge is idempotent.");

// Cleanup
rmSync(TEST_APP_DIR, { recursive: true, force: true });
console.log(`(Cleaned up ${TEST_APP_DIR})`);
