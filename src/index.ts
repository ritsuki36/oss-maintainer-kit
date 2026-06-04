#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const checks = [
  {
    id: "readme",
    label: "README",
    paths: ["README.md", "readme.md"],
    weight: 20,
    detail: "Explains what the project does and how to use it."
  },
  {
    id: "license",
    label: "LICENSE",
    paths: ["LICENSE", "LICENSE.md", "COPYING"],
    weight: 15,
    detail: "Makes reuse terms clear."
  },
  {
    id: "contributing",
    label: "CONTRIBUTING",
    paths: ["CONTRIBUTING.md", ".github/CONTRIBUTING.md"],
    weight: 15,
    detail: "Shows contributors how to open issues and pull requests."
  },
  {
    id: "security",
    label: "SECURITY",
    paths: ["SECURITY.md", ".github/SECURITY.md"],
    weight: 15,
    detail: "Gives reporters a safe path for vulnerabilities."
  },
  {
    id: "codeOfConduct",
    label: "CODE_OF_CONDUCT",
    paths: ["CODE_OF_CONDUCT.md", ".github/CODE_OF_CONDUCT.md"],
    weight: 10,
    detail: "Sets community expectations."
  },
  {
    id: "packageMetadata",
    label: "package metadata",
    paths: ["package.json", "pyproject.toml", "Cargo.toml", "go.mod"],
    weight: 10,
    detail: "Helps users and tools identify the project."
  }
];

const usage = `oss-maintainer-kit

Usage:
  oss-maintainer-kit check [path]
  oss-maintainer-kit application [path] --repo <url> --role <text> [--org-id <id>] [--output <file>]
  oss-maintainer-kit template

Local source usage:
  node bin/oss-maintainer-kit.mjs check [path]
  node bin/oss-maintainer-kit.mjs application [path] --repo <url> --role <text> [--org-id <id>] [--output <file>]
  node bin/oss-maintainer-kit.mjs template

Commands:
  check        Check local OSS repository readiness.
  application Generate a Codex for Open Source application draft.
  template    Print the static application template.
`;

main(process.argv.slice(2));

function main(args) {
  const command = args[0] ?? "help";

  if (command === "check") {
    const root = resolve(args[1] ?? ".");
    printCheck(root);
    return;
  }

  if (command === "application") {
    const root = resolve(args[1] && !args[1].startsWith("--") ? args[1] : ".");
    const options = parseOptions(args.slice(args[1] && !args[1].startsWith("--") ? 2 : 1));
    printApplication(root, options);
    return;
  }

  if (command === "template") {
    printTemplate();
    return;
  }

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(usage);
    return;
  }

  console.error(`Unknown command: ${command}\n`);
  console.error(usage);
  process.exitCode = 1;
}

function parseOptions(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    const value = args[index + 1];

    if (key === "--repo") {
      options.repo = value;
      index += 1;
    } else if (key === "--role") {
      options.role = value;
      index += 1;
    } else if (key === "--org-id") {
      options.orgId = value;
      index += 1;
    } else if (key === "--output" || key === "-o") {
      options.output = value;
      index += 1;
    }
  }

  return options;
}

function printCheck(root) {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`Repository path does not exist: ${root}`);
    process.exitCode = 1;
    return;
  }

  const result = analyzeRepository(root);

  console.log(`OSS maintainer readiness: ${result.name}`);
  console.log(`Path: ${root}`);
  console.log(`Score: ${result.score}/${result.maxScore}`);
  console.log("");

  for (const item of result.items) {
    const mark = item.present ? "OK" : "MISSING";
    console.log(`${mark.padEnd(7)} ${item.label} - ${item.detail}`);
  }

  console.log("");
  if (result.missing.length === 0) {
    console.log("Next step: the basic maintainer files are present. Add project-specific adoption and maintenance evidence to your application draft.");
  } else {
    console.log(`Next step: add ${result.missing.map((item) => item.label).join(", ")} before asking contributors or reviewers to rely on the project.`);
  }
}

function printApplication(root, options) {
  const result = existsSync(root) && statSync(root).isDirectory()
    ? analyzeRepository(root)
    : null;

  const repoName = result?.name ?? basename(root);
  const repositoryUrl = options.repo ?? inferGitRemote(root) ?? "[repository URL]";
  const role = options.role ?? "[primary maintainer / core maintainer]";
  const orgId = options.orgId ?? "[OpenAI organization ID, if requesting API credits]";
  const missing = result?.missing.map((item) => item.label).join(", ") || "none";
  const present = result?.items.filter((item) => item.present).map((item) => item.label).join(", ") || "not checked";
  const scoreLine = result ? `${result.score}/${result.maxScore}` : "not checked";

  const draft = buildApplicationDraft({ repoName, repositoryUrl, role, orgId, missing, present, scoreLine });

  if (options.output) {
    const outputPath = resolve(options.output);
    writeFileSync(outputPath, draft, "utf8");
    console.log(`Application draft written to ${outputPath}`);
    return;
  }

  console.log(draft);
}

function buildApplicationDraft({ repoName, repositoryUrl, role, orgId, missing, present, scoreLine }) {
  return `# Codex for Open Source Application Draft

## Project

- Repository: ${repositoryUrl}
- Project name: ${repoName}
- Maintainer role: ${role}
- OpenAI organization ID: ${orgId}

## Why this repository qualifies

${repoName} is an open-source project with maintainer-facing infrastructure that supports ongoing use and contribution. Current repository readiness score: ${scoreLine}. Present signals: ${present}. Missing signals to address or explain: ${missing}.

Replace this paragraph with concrete ecosystem evidence: stars, downloads, dependent projects, active users, production usage, educational usage, or why the project fills an important gap.

## Maintenance responsibilities

I maintain the project by reviewing issues and pull requests, keeping documentation current, and preparing releases or dependency updates. Replace this sentence with the actual recurring work you perform.

## How Codex or API credits would help

Codex would help reduce repetitive maintainer work by summarizing issues, drafting review comments, checking repository hygiene, producing release notes, and assisting with safe code or documentation changes.

If requesting API credits, describe the workflow you want to automate, such as pull request review, issue triage, release workflows, documentation maintenance, or security-oriented checks.

## Codex Security interest

If this repository has security-sensitive surfaces, explain them here. Mention dependencies, user data, deployment contexts, supply-chain exposure, or areas where deeper review would reduce risk.

## Anything else

Add concise context that does not fit above.
`;
}

function printTemplate() {
  const templatePath = new URL("../templates/codex-for-oss-application.md", import.meta.url);
  console.log(readFileSync(templatePath, "utf8"));
}

function analyzeRepository(root) {
  const items = checks.map((check) => ({
    ...check,
    present: hasAny(root, check.paths)
  }));

  items.push({
    id: "ci",
    label: "GitHub Actions",
    weight: 15,
    detail: "Runs repeatable checks for contributors and maintainers.",
    present: hasGitHubActions(root)
  });

  const score = items.reduce((total, item) => total + (item.present ? item.weight : 0), 0);
  const maxScore = items.reduce((total, item) => total + item.weight, 0);

  return {
    name: readProjectName(root),
    score,
    maxScore,
    items,
    missing: items.filter((item) => !item.present)
  };
}

function hasAny(root, candidates) {
  return candidates.some((candidate) => existsSync(join(root, candidate)));
}

function hasGitHubActions(root) {
  const workflowDir = join(root, ".github", "workflows");
  if (!existsSync(workflowDir) || !statSync(workflowDir).isDirectory()) {
    return false;
  }

  return readdirSync(workflowDir).some((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
}

function readProjectName(root) {
  const packagePath = join(root, "package.json");
  if (existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
      if (typeof packageJson.name === "string" && packageJson.name.trim() !== "") {
        return packageJson.name;
      }
    } catch {
      return basename(root);
    }
  }

  return basename(root);
}

function inferGitRemote(root) {
  const configPath = join(root, ".git", "config");
  if (!existsSync(configPath)) {
    return null;
  }

  const config = readFileSync(configPath, "utf8");
  const match = config.match(/url = (.+)/);
  if (!match) {
    return null;
  }

  return normalizeGitRemote(match[1].trim());
}

function normalizeGitRemote(remote) {
  if (remote.startsWith("git@github.com:")) {
    return `https://github.com/${remote.slice("git@github.com:".length).replace(/\.git$/, "")}`;
  }

  return remote.replace(/\.git$/, "");
}
