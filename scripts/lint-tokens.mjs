#!/usr/bin/env node
/**
 * Token-only enforcement gate. Fails if a hardcoded color / px / arbitrary
 * Tailwind value appears in src/**.{ts,tsx}. Literals are sanctioned ONLY in
 * src/styles/** and brands/ ** /theme.css.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIR = join(ROOT, "src");
const ALLOW_DIR = join(ROOT, "src", "styles");

const PATTERNS = [
  { re: /#[0-9a-fA-F]{3,8}\b/, label: "hex color" },
  { re: /\b(?:rgb|rgba|hsl|hsla|oklch)\(/, label: "color function" },
  { re: /\[[^\]]*(?:#|rgb|hsl|oklch|\d(?:px|rem|em))[^\]]*\]/, label: "arbitrary Tailwind value" },
  { re: /(?<![\w-])\d+px\b/, label: "px literal" },
];

/** @param {string} dir */
function walk(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      files.push(...walk(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

let violations = 0;
for (const file of walk(SCAN_DIR)) {
  if (file.startsWith(ALLOW_DIR)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    // skip comment-only lines to reduce false positives
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
    for (const { re, label } of PATTERNS) {
      if (re.test(line)) {
        violations++;
        const rel = relative(ROOT, file).split(sep).join("/");
        console.error(`${rel}:${i + 1}  ${label}: ${trimmed.slice(0, 100)}`);
        break;
      }
    }
  });
}

if (violations > 0) {
  console.error(`\n✖ lint:tokens found ${violations} hardcoded value(s). Use tokens from src/styles/tokens.css.`);
  process.exit(1);
}
console.log("✔ lint:tokens: no hardcoded color/px/arbitrary values in src/.");
