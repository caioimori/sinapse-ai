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
  -> automated gates + CODEOWNERS review
  -> resolve conversations
  -> squash merge
  -> delete branch
```

## Branch names

Use `<type>/<slug>` for human contributions and `<actor>/<type>/<slug>` for
managed AI sessions:

```text
feat/provider-diagnostics
fix/update-preserves-skills
docs/public-install-guide
codex/docs/public-product-surface
claude/fix/codex-parity
```

Allowed types normally follow Conventional Commits: `feat`, `fix`, `docs`,
`test`, `refactor`, `perf`, `build`, `ci`, and `chore`.

## Pull-request rules

- Link the issue or story when one exists.
- Keep one coherent change per PR.
- Use a Conventional Commit title; squash merge turns it into the final commit.
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
