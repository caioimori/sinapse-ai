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
| `install-matrix.yml` | Release-label-only provider/platform installation combinations; no opened/synchronize/reopened PR trigger |
| `macos-testing.yml` | Manual Intel, Apple Silicon, and recovery validation for a release-candidate SHA |
| `pr-automation.yml` | Read-only coverage execution plus a bot-authored PR summary |
| `pr-labeling.yml` | Path-based labels without executing pull-request code |
| `pr-size-check.yml` | Change-size visibility |

Skipped jobs are valid only when their path filter is intentionally false. The
aggregate `Validation Summary` fails for `failure`, `cancelled`, or timed-out
dependencies.

## Free-tier cost policy

`macos-testing.yml` runs only by `workflow_dispatch`. DevOps must select the
candidate ref and provide the same exact 40-character SHA in the required
`candidate_sha` input. The workflow fails closed if the dispatch SHA, input, and
checked-out `HEAD` differ. Its run name, artifacts, and summary include that SHA;
results from an older SHA are invalid after a new commit.

`install-matrix.yml` runs by `workflow_dispatch` or the `pull_request:labeled`
event. Every retained job requires either manual dispatch or the label delivered
by that event to be exactly `release`. GitHub cannot filter a label value in the
event declaration, so another label may create a run whose jobs are all skipped;
it does not create a matrix runner. Opening, synchronizing, or reopening an
ordinary PR creates no run or job for this workflow. Manual dispatch requires
`candidate_sha`; release-label runs derive it from `pull_request.head.sha`.
Before the matrix starts, a fail-closed job validates 40 lowercase hexadecimal
characters, checks out that exact commit, and compares `git rev-parse HEAD`.

Before a release, DevOps must confirm the recorded `Tested head SHA` equals the
current candidate. If it differs, remove and reapply `release`, or dispatch the
workflow again on the current ref/SHA with the exact `candidate_sha`. The
explicit run retains 24 supported
platform/package-manager/method combinations, three clean provider installs,
three public-latest upgrades, and all three macOS validation areas.

The deterministic minimum reduction per relevant ordinary PR is four jobs:
three dedicated macOS runners plus the former Install Matrix label-check job.
The actual avoided set also includes dependent report/gate jobs. This is a job
count, not a billing estimate. Track runs and jobs from the Actions API; record
runner minutes and billable minutes only when authoritative billing data is
available, and never treat raw job duration as billable usage.

Remote state observed on 2026-07-28:

| Workflow | Local file | Remote state |
|---|---|---|
| PR Labeling | `pr-labeling.yml` | `disabled_manually` |
| Manage Stale Issues | `stale.yml` | `disabled_manually` |
| Welcome New Contributors | `welcome.yml` | `disabled_manually` |
| PR Size Check | `pr-size-check.yml` | `disabled_manually` |

Their local YAML files remain audit history. Only DevOps may reactivate or
disable remote workflows. For rollback, block release, revert the two trigger
changes in reviewable history, dispatch the affected essential checks on the
candidate SHA, and proceed only after `Validation Summary` and Articles VII,
VIII, and XI conclude green authoritatively.

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
3. Before publication (`dry_run: false`), `semantic-release.yml` queries
   check-runs for its exact `github.sha` and requires the latest `Gate Summary (24 combos + 3
   clean + 3 upgrades)` and `macOS Validation Gate` conclusions to be
   `completed/success`. API errors, missing checks, pending checks, failures, or
   checks belonging only to another SHA block the release. Preview-only dry runs
   remain available for configuration diagnosis because they cannot publish,
   tag, or create a release.
4. With those compatibility gates green, `semantic-release.yml` verifies the
   prepared state and, under the protected `npm-production` environment,
   publishes npm, creates the tag/GitHub Release, and runs an isolated public
   installation smoke test.

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
