import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "bin", "oss-maintainer-kit.mjs");

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function checkJson(fixture) {
  return JSON.parse(run(["check", join("test", "fixtures", fixture), "--format", "json"]));
}

const healthy = checkJson("healthy-repo");
assert.equal(healthy.name, "healthy-repo");
assert.equal(healthy.score, 100);
assert.equal(healthy.maxScore, 100);
assert.deepEqual(healthy.missing, []);

const minimal = checkJson("minimal-repo");
assert.equal(minimal.name, "minimal-repo");
assert.equal(minimal.score, 20);
assert.ok(minimal.missing.some((item) => item.label === "LICENSE"));
assert.ok(minimal.missing.some((item) => item.label === "GitHub Actions"));

const help = run(["--help"]);
assert.match(help, /--format text\|json/);

console.log("All CLI tests passed.");
