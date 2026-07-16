# Manual macOS verification

Use this checklist when validating a release candidate on a physical or hosted
macOS machine. Automated CI remains the required baseline; this guide adds
human evidence for the public package experience.

## Prerequisites

- macOS 13 or newer.
- Native `x86_64` or `arm64` Node.js 18+; Node.js 22 LTS is recommended.
- npm 9+ and Git.
- A disposable repository or temporary directory.
- Claude Code, Codex, or both for the activation check.

Record the environment without secrets:

```bash
sw_vers
uname -m
node --version
npm --version
```

## Validate the current checkout

From the repository root, run the architecture-specific smoke test:

```bash
# Intel
tests/macos/test-intel-installation.sh

# Apple Silicon
tests/macos/test-apple-silicon-installation.sh
```

These scripts pack the current checkout, use a temporary `HOME`, install both
provider surfaces, and remove the temporary workspace on exit.

Run the remaining automated checks:

```bash
tests/macos/run-all-tests.sh
```

Expected result: zero failed acceptance criteria and a report under
`/tmp/sinapse-macos-test-report-*.txt`.

## Validate the public command

In a disposable project, install the published version:

```bash
mkdir sinapse-public-smoke
cd sinapse-public-smoke
git init
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Run the same install command a second time. It must detect the existing
installation, preserve provider selection and project-owned files, and complete
without requiring manual cleanup.

## Validate provider activation

Claude Code:

```text
@sinapse-orqx
Route a small software-engineering task and show the selected workflow.
```

Codex:

```text
$snps
Route a small software-engineering task and show the selected workflow.
```

Confirm that the orchestrator delegates instead of performing specialist work
directly. Confirm direct Codex resolution with `$sinapse-agent developer`.

## Acceptance checklist

- Local tarball smoke passes on the machine's native architecture.
- Public install and idempotent re-run both complete.
- `status`, `doctor`, `--version`, and `--help` return successfully.
- `.claude/CLAUDE.md`, `AGENTS.md`, and `.agents/skills/` exist in the project.
- Claude Code and Codex can activate the SINAPSE router.
- Existing project files remain unchanged unless explicitly managed by SINAPSE.
- No credentials, home-directory paths, or private repository data appear in
  attached logs.

## Troubleshooting

Run the diagnostic first:

```bash
npx sinapse-ai@latest doctor
npx sinapse-ai@latest doctor --fix
```

If installation still fails, open an issue using the bug template and attach:

- macOS and architecture;
- Node.js and npm versions;
- the failing command and exit code;
- a minimal reproduction; and
- redacted logs from `/tmp/sinapse-test-*.log`.

Never attach tokens, `.env` files, private keys, or unredacted home paths. See
[SECURITY.md](../../SECURITY.md) for vulnerability reports and
[SUPPORT.md](../../SUPPORT.md) for normal support.
