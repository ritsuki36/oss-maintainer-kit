# oss-maintainer-kit

[![CI](https://github.com/ritsuki36/oss-maintainer-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/ritsuki36/oss-maintainer-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small CLI for open-source maintainers who want to check repository readiness and generate a starter Codex for Open Source application draft.

## Why this exists

Open-source maintainers often need to explain the value of their projects, keep maintenance files healthy, and prepare concise application text for support programs. `oss-maintainer-kit` keeps that work lightweight:

- checks basic OSS repository readiness
- highlights missing maintainer-facing files
- generates a starter Codex for Open Source application draft you can edit for the 500-character form fields
- works locally without API keys or external dependencies

## Who this is for

- maintainers preparing for Codex for Open Source
- developers publishing a new OSS repository
- contributors checking whether a project has basic maintainer files
- people who want a simple repo health checklist before asking for feedback

## Install

Clone the repository and run the CLI with Node.js 22 or newer:

```bash
git clone https://github.com/ritsuki36/oss-maintainer-kit.git
cd oss-maintainer-kit
npm run check -- .
```

Example output:

```text
OSS maintainer readiness: oss-maintainer-kit
Score: 100/100

OK      README - Explains what the project does and how to use it.
OK      LICENSE - Makes reuse terms clear.
OK      CONTRIBUTING - Shows contributors how to open issues and pull requests.
OK      SECURITY - Gives reporters a safe path for vulnerabilities.
OK      CODE_OF_CONDUCT - Sets community expectations.
OK      package metadata - Helps users and tools identify the project.
OK      GitHub Actions - Runs repeatable checks for contributors and maintainers.
```

You can also run the source file directly:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types src/index.ts check /path/to/repo
```

## Usage

Check a repository:

```bash
node bin/oss-maintainer-kit.mjs check .
```

Generate a Codex for Open Source application draft:

```bash
node bin/oss-maintainer-kit.mjs application . --repo https://github.com/owner/repo --role "core maintainer"
```

Save the draft to a file:

```bash
node bin/oss-maintainer-kit.mjs application . --repo https://github.com/owner/repo --role "core maintainer" --output draft.md
```

Print the static application template:

```bash
node bin/oss-maintainer-kit.mjs template
```

## Examples

- [`examples/check-output.txt`](examples/check-output.txt)
- [`examples/application-draft.md`](examples/application-draft.md)

## Commands

### `check [path]`

Scores a local repository against simple maintainer-readiness signals:

- README
- LICENSE
- CONTRIBUTING guide
- SECURITY policy
- CODE_OF_CONDUCT
- GitHub Actions workflows
- package metadata

### `application [path]`

Creates a short, editable application draft using local repository signals. It does not submit anything and does not call OpenAI or GitHub APIs.

Options:

- `--repo <url>`: repository URL to include in the draft
- `--role <text>`: your maintainer role
- `--org-id <id>`: optional OpenAI organization ID placeholder
- `--output <file>` or `-o <file>`: save the generated draft instead of printing it

### `template`

Prints `templates/codex-for-oss-application.md`.

## Japanese note

Codex for Open Source 申請用に、OSSリポジトリの基本的な整備状況を確認し、申請文のたたき台を作るための小さなツールです。スター数が少ないプロジェクトでも、役割・利用価値・保守実績を説明しやすくすることを目的にしています。

## License

MIT
