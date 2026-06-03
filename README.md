# oss-maintainer-kit

A small CLI and template pack for open-source maintainers preparing repository hygiene checks and Codex for Open Source applications.

## Why this exists

Open-source maintainers often need to explain the value of their projects, keep maintenance files healthy, and prepare concise application text for support programs. `oss-maintainer-kit` keeps that work lightweight:

- checks basic OSS repository readiness
- highlights missing maintainer-facing files
- generates a starter Codex for Open Source application draft
- works locally without API keys or external dependencies

## Install

Clone the repository and run the CLI with Node.js 22 or newer:

```bash
git clone https://github.com/ritsuki36/oss-maintainer-kit.git
cd oss-maintainer-kit
npm run check -- .
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

Print the static application template:

```bash
node bin/oss-maintainer-kit.mjs template
```

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

### `template`

Prints `templates/codex-for-oss-application.md`.

## Japanese note

Codex for Open Source 申請用に、OSSリポジトリの基本的な整備状況を確認し、申請文のたたき台を作るための小さなツールです。スター数が少ないプロジェクトでも、役割・利用価値・保守実績を説明しやすくすることを目的にしています。

## License

MIT
