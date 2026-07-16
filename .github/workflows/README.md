# GitHub Actions

This directory contains the active automation for the public repository. GitHub
branch protection, not this document, is the source of truth for required checks.

## Pull-request gates

| Workflow | Purpose |
|---|---|
| `ci.yml` | Aggregate lint, typecheck, tests, stories, installer, docs, parity, and security validation |
| `article-gates.yml` | Constitution Articles VII, VIII, and XI |
| `codeql.yml` | JavaScript/TypeScript and Actions security analysis |
| `lint-guards.yml` | Repository-wide guards, agent validation, and conditional provider parity |
| `manifest-parity.yml` | Install manifest and entity registry drift detection |
| `install-matrix.yml` | Isolated provider/platform installation combinations |
| `macos-testing.yml` | Intel and Apple Silicon installation and compatibility tests |
| `pr-automation.yml` | Read-only coverage execution plus a bot-authored PR summary |
| `pr-labeling.yml` | Path-based labels without executing pull-request code |
| `pr-size-check.yml` | Change-size visibility |

Skipped jobs are valid only when their path filter is intentionally false. The
aggregate `Validation Summary` fails for `failure`, `cancelled`, or timed-out
dependencies.

## Scheduled and maintenance workflows

| Workflow | Purpose |
|---|---|
| `codeql.yml` | Weekly security scan in addition to PR/push runs |
| `quarterly-gap-audit.yml` | Quarterly inventory/gap issue based on its implemented checks |
| `stale.yml` | Issue and pull-request lifecycle reminders |
| `welcome.yml` | First-contribution guidance and triage labeling |

## Release workflows

There is one release writer:

1. `release-prepare.yml` calculates the next semantic version, updates
   `package.json`, `package-lock.json`, and `CHANGELOG.md`, then opens a release PR.
2. The release PR passes normal branch protection and is merged.
3. `semantic-release.yml` verifies the prepared state and, under the protected
   `npm-production` environment, publishes npm, creates the tag/GitHub Release,
   and runs an isolated public installation smoke test.

The workflows are manual because release authority belongs to DevOps. Tag-driven
legacy publishers are stored as `.disabled` files under `archived/` for audit
history and cannot execute.

## Supply-chain policy

- Active third-party Actions are pinned to full commit SHAs.
- Dependabot proposes Action updates.
- Pull-request code runs with read-only repository permissions.
- A job that comments or labels receives only the narrow write permission it needs
  and does not execute code from the pull-request branch.
- Package installation uses `npm ci` and the committed lockfile.

See [the GitHub Flow guide](../../docs/guides/gitflow.md) and
[release process](../../docs/guides/release-process.md).
