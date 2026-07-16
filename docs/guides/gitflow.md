# GitHub Flow

SINAPSE AI uses a short-lived-branch GitHub Flow. `main` is protected, is the
target of every contribution, and must remain releasable.

## Standard path

```text
issue / story
  -> sync main
  -> create short-lived branch
  -> implement and validate
  -> open pull request
  -> automated gates + maintainer review when required
  -> resolve conversations
  -> squash merge
  -> delete branch
```

## Branch names

Use `<owner>/<type>/<slug>`. The approved owner prefix is `caio`, `soier`, or
`dev`; provider names may appear after the owner prefix when useful:

```text
dev/feat/provider-diagnostics
dev/fix/update-preserves-skills
dev/docs/public-install-guide
caio/codex/public-product-surface
soier/claude/codex-parity
```

Allowed types normally follow Conventional Commits: `feat`, `fix`, `docs`,
`test`, `refactor`, `perf`, `build`, `ci`, and `chore`.

## Pull-request rules

- Link the issue or story when one exists.
- Keep one coherent change per PR.
- Use `type: description [Story X.Y]` for implementation PRs; squash merge turns
  the title into the final commit. Validated documentation-only work may omit the
  story reference.
- Do not rewrite shared history after review begins without notifying reviewers.
- Resolve review conversations and rerun invalidated gates.
- Never place secrets, customer data, or undisclosed vulnerabilities in a PR.

Required checks are configured by branch protection. Workflow documentation must
not claim a check is blocking unless GitHub actually requires it.

## Sync and conflicts

Update from `origin/main` before handoff and before final merge. Prefer a clean
rebase for private branches; use a normal merge when rebasing would rewrite a
branch already shared with other contributors.

Never use destructive reset or force-push to repair a shared branch. When a
conflict crosses ownership boundaries, stop and involve the relevant CODEOWNER.

## Releases

Contributors do not create version tags or publish packages. Merging to `main`
makes a change eligible for the canonical release workflow, which is executed by
the DevOps maintainer. See [release-process.md](release-process.md).
