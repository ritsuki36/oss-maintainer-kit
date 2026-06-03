#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "src", "index.ts");
const args = ["--disable-warning=ExperimentalWarning", "--experimental-strip-types", source, ...process.argv.slice(2)];
const result = spawnSync(process.execPath, args, { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
