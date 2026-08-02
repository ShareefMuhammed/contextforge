import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdirp, outputFile } from "fs-extra";
import { dirname } from "node:path";

export const MARKER_START = "<!-- devcontext:start -->";
export const MARKER_END = "<!-- devcontext:end -->";

function wrapWithMarkers(inner: string): string {
  const trimmed = inner.replace(/\s+$/, "");
  return `${MARKER_START}\n${trimmed}\n${MARKER_END}`;
}

export async function mergeMarkdown(
  targetPath: string,
  innerContent: string,
): Promise<void> {
  const block = wrapWithMarkers(innerContent);

  if (!existsSync(targetPath)) {
    await mkdirp(dirname(targetPath));
    await outputFile(targetPath, block + "\n", "utf-8");
    return;
  }

  const existing = readFileSync(targetPath, "utf-8");

  const startIdx = existing.indexOf(MARKER_START);
  const endIdx = existing.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    const sep = existing.endsWith("\n") ? "" : "\n";
    await outputFile(targetPath, existing + sep + "\n" + block + "\n", "utf-8");
    return;
  }

  const before = existing.slice(0, startIdx);
  const after = existing.slice(endIdx + MARKER_END.length);
  await outputFile(targetPath, before + block + after, "utf-8");
}

export type PreviewAction = "create" | "update" | "append" | "overwrite";

export function previewMarkdown(targetPath: string): PreviewAction {
  if (!existsSync(targetPath)) return "create";
  const existing = readFileSync(targetPath, "utf-8");
  if (existing.includes(MARKER_START)) return "update";
  return "append";
}

export function previewFile(targetPath: string): PreviewAction {
  return existsSync(targetPath) ? "overwrite" : "create";
}

export function mergePackageJson(
  targetPath: string,
  newData: Record<string, unknown>,
): void {
  if (!existsSync(targetPath)) {
    writeFileSync(targetPath, JSON.stringify(newData, null, 2) + "\n", "utf-8");
    return;
  }

  const raw = readFileSync(targetPath, "utf-8");

  const indentMatch = raw.match(/"\s*:\s*[{\[]/);
  const indent = indentMatch ? 2 : guessIndent(raw);

  const existing = JSON.parse(raw);

  for (const key of Object.keys(newData)) {
    if (!(key in existing)) {
      existing[key] = newData[key];
    }
  }

  const reindented = JSON.stringify(existing, null, indent) + "\n";
  writeFileSync(targetPath, reindented, "utf-8");
}

function guessIndent(raw: string): number {
  const match = raw.match(/\n( +)/);
  return match ? match[1].length : 2;
}
