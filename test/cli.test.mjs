import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cli = join(root, "bin", "oss-maintainer-kit.mjs");

function runResult(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });

  return result;
}

function run(args) {
  const result = runResult(args);
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

const passingThreshold = runResult(["check", join("test", "fixtures", "healthy-repo"), "--min-score", "100"]);
assert.equal(passingThreshold.status, 0);

const failingThreshold = runResult(["check", join("test", "fixtures", "minimal-repo"), "--format", "json", "--min-score", "80"]);
assert.equal(failingThreshold.status, 1);
assert.match(failingThreshold.stderr, /below the required minimum of 80/);

const invalidThreshold = runResult(["check", ".", "--min-score", "101"]);
assert.equal(invalidThreshold.status, 1);
assert.match(invalidThreshold.stderr, /integer between 0 and 100/);

const missingValue = runResult(["check", ".", "--format"]);
assert.equal(missingValue.status, 1);
assert.match(missingValue.stderr, /Missing value for --format/);

const unknownOption = runResult(["check", ".", "--unknown", "value"]);
assert.equal(unknownOption.status, 1);
assert.match(unknownOption.stderr, /Unknown option: --unknown/);

const help = run(["--help"]);
assert.match(help, /--format text\|json/);
assert.match(help, /--min-score 0-100/);

console.log("All CLI tests passed.");
