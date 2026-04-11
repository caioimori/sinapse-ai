# Checklist: PR Quality Gate

> Purpose: Validate pull requests meet size, convention, and review standards
> Used by: @devops (Pipeline), @quality-gate (Litmus)
> When: Before merging any PR to main

---

## PR Size & Structure

- [ ] PR is under 400 lines changed (optimal: 50-200 lines)
- [ ] If > 400 lines, justified in PR description (or split into stacked PRs)
- [ ] PR addresses a single logical change (not multiple unrelated changes)
- [ ] PR title follows format: `type(scope): description` (< 70 chars)
- [ ] PR description includes Summary, Story Reference, and Test Plan

## Commit Conventions

- [ ] All commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- [ ] Commit messages have imperative mood description (< 72 chars)
- [ ] No WIP or fixup commits in final PR (squash before merge)
- [ ] Breaking changes use `!` suffix or `BREAKING CHANGE:` footer
- [ ] Story ID referenced in commit or PR body

## DORA Metrics Alignment

- [ ] PR open-to-merge time target: < 24 hours
- [ ] Time to first review target: < 4 hours
- [ ] Review cycles: <= 2 rounds before approval
- [ ] No PR blocked for > 48 hours without escalation

## Code Review

- [ ] At least 1 human reviewer approved
- [ ] CODEOWNERS review satisfied (if configured)
- [ ] Review comments use standard prefixes (`nit:`, `issue:`, `blocker:`)
- [ ] All `blocker:` and `issue:` comments resolved before merge
- [ ] Self-review completed by author before requesting review

## CI/CD Checks

- [ ] All required status checks pass (lint, typecheck, test, build)
- [ ] No new lint warnings introduced
- [ ] Test coverage not decreased
- [ ] No `npm audit` critical/high vulnerabilities introduced
- [ ] Branch is up-to-date with main (no stale merges)

## AI-Specific Checks

- [ ] AI-generated commits include `Co-Authored-By:` trailer
- [ ] Agent identity clear in PR (which agent created the changes)
- [ ] AI-generated code reviewed for hallucinated imports or APIs
- [ ] No placeholder or template text left in generated code

## Merge Strategy

- [ ] Squash-and-merge used as default (clean history)
- [ ] Merge commit used only for major features (preserves branch history)
- [ ] Feature branch deleted after merge

## Verdict

| All sections pass | Decision |
|-------------------|----------|
| Yes | MERGE |
| CI fails | BLOCKED — fix CI first |
| Review pending | BLOCKED — wait for approval |
| Size > 600 lines | BLOCKED — split PR |

---

*PR Quality Checklist v1.0 — Sources: Google eng-practices, DORA 2024, Graphite research*
