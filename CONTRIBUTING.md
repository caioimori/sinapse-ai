# Contributing to SINAPSE AI

Thank you for improving SINAPSE AI. This guide describes the public contribution
path; framework authority, release ownership, and decision policy are documented
in [GOVERNANCE.md](GOVERNANCE.md).

## Start with the right channel

| Intent | Channel |
|---|---|
| Ask for help or validate an idea | [GitHub Discussions](https://github.com/caioimori/sinapse-ai/discussions) |
| Report a reproducible bug | [Bug report](https://github.com/caioimori/sinapse-ai/issues/new?template=1-bug-report.yml) |
| Propose a user-facing capability | [Feature request](https://github.com/caioimori/sinapse-ai/issues/new?template=2-feature-request.yml) |
| Report a vulnerability | [Private vulnerability report](https://github.com/caioimori/sinapse-ai/security/advisories/new) |

Do not put secrets, customer data, access tokens, or undisclosed vulnerabilities
in issues, discussions, commits, or test fixtures.

## Development setup

Requirements:

- Node.js 18 or newer;
- npm 9 or newer;
- Git;
- Claude Code or Codex when changing provider integration.

```bash
git clone https://github.com/caioimori/sinapse-ai.git
cd sinapse-ai
npm ci
npm test
```

Before installing any new dependency, verify the exact package with `npm view`
and inspect its publisher and release history. Dependency additions require a
clear reason in the pull request.

## GitHub Flow

`main` is always expected to be releasable. Work happens on short-lived branches
and reaches `main` only through a pull request.

```text
issue or discussion
  -> short-lived branch
  -> story when implementation is involved
  -> focused commits
  -> pull request
  -> automated gates + review
  -> squash merge
```

Recommended branch names:

```text
dev/feat/<short-description>
dev/fix/<short-description>
dev/docs/<short-description>
caio/<type>/<short-description>
soier/<type>/<short-description>
```

The required owner prefix is `caio`, `soier`, or `dev`; provider and change type
belong after that prefix. Do not work directly on `main`, force-push a shared
branch, or mix unrelated changes.

The detailed model is in [docs/guides/gitflow.md](docs/guides/gitflow.md).

## Documentation-first development

Code changes require a validated story unless the applicability classifier marks
the work as documentation-only or another explicit exception. Stories live in
`docs/stories/` and move through:

```text
Draft -> Ready -> InProgress -> InReview -> Done
```

The normal delivery cycle is:

```text
@sprint-lead draft
  -> @product-lead validate
  -> @developer develop
  -> @quality-gate gate
  -> @devops push / PR / release
```

In Codex, use `$snps` for routing or `$sinapse-agent <agent-id>` for a direct
specialist. Provider adapters must remain semantically equivalent.

## Ownership boundaries

The repository has four layers:

| Layer | Examples | Contribution rule |
|---|---|---|
| L1 | framework core and Constitution | Protected; no direct edits |
| L2 | canonical templates and workflows | Extend through the documented workflow |
| L3 | configuration and adapters | Mutable with parity and compatibility checks |
| L4 | stories, packages, squads, tests, public docs | Normal contribution surface |

If a change appears to require L1/L2 modification, open a proposal first. Do not
work around the boundary by copying protected content to a new path.

## Quality gates

Run the checks appropriate to the changed surface. The full local baseline is:

```bash
npm run lint
npm run typecheck
npm test
npm run validate:parity
npm run validate:docs
npm run validate:all
npm pack --dry-run
```

Documentation-only changes should at minimum run link/document validators and
`git diff --check`. Provider or installer changes also require an isolated install
test for Claude Code, Codex, and the default dual-provider path.

Tests must assert behavior. Do not silence failures with `|| true`, broad
`continue-on-error`, or skipped suites without explaining the exception.

## Pull requests

Keep a pull request small enough to review as one coherent change. Its description
must state:

- problem and user impact;
- approach and important tradeoffs;
- validation commands and results;
- affected providers, platforms, and ownership layers;
- screenshots for visible UI or documentation changes;
- linked issue/story when applicable.

Use a Conventional Commit title because pull requests are squash-merged.
Implementation changes require a story reference:

```text
feat: add provider-aware installation summary [Story 2.1]
fix: preserve Codex skills during update [Story 2.2]
```

A story reference is optional only for a validated documentation-only change,
for example `docs: rebuild the public product surface`.

Breaking changes use `!` or a `BREAKING CHANGE:` footer. Review conversations
must be resolved before merge. Maintainer review applies whenever repository
ownership or branch-protection rules require it.

## Agent, task, and squad contributions

Use the canonical source formats and validators already present in the repository.
Do not hand-maintain generated Claude/Codex adapters.

```bash
npm run sync:providers
npm run validate:parity
npm run validate:squad-schema:strict
node .codex/scripts/resolve-codex-agent.js --stats
```

New agents and squads need a documented purpose, non-overlapping authority,
resolvable task pointers, tests, and both provider surfaces. See
[docs/guides/contributing-squads.md](docs/guides/contributing-squads.md).

## Releases

Only the DevOps maintainer role can publish packages, create release tags, or
push release commits. Contributors do not edit versions manually. The canonical
release process is documented in
[docs/guides/release-process.md](docs/guides/release-process.md).

## License and attribution

By contributing, you agree that your contribution is distributed under the
[MIT License](LICENSE). Preserve third-party notices and update [NOTICE.md](NOTICE.md)
when introducing derived work that requires attribution.

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
