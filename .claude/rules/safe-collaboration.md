# Safe Collaboration — Git Safety Net (NON-NEGOTIABLE)

> **Applies to ALL agents, ALL projects using SINAPSE.**
> Users are product builders, NOT git experts. Agents handle ALL git complexity.
> This is the always-on CORE (the law). Operational detail (branch naming tables,
> step-by-step checklists, conflict matrices, communication templates) lives in
> `safe-collaboration-reference.md` and loads when you work on files.

## Golden Rule

**Users focus on WHAT to build. Agents handle HOW to save and share it safely.**
Users NEVER resolve conflicts, pick branches, remember to pull, or touch rebase/force-push.

## The Law (every session, every commit, every push)

1. **Session start — auto-sync (MANDATORY):** `git fetch origin` → sync local with
   origin (fast-forward; if diverged → STOP and resolve safely) → create a work
   branch. **NEVER start work on `main` directly.**
2. **Auto-branch:** the agent creates and names the branch (`{user}/{type}/{desc}`);
   the user never needs to.
3. **Before every commit:** `git status` first; **SECRET SCAN — if any secret,
   credential, key, or real `.env` is staged → BLOCK the commit**, warn, unstage.
4. **Before push:** fetch + merge `origin/main` into the feature branch; the AGENT
   resolves conflicts (simple → auto; complex → show both versions, ask which to
   keep); run tests after merging; only then push.
5. **After push:** create the PR automatically with reviewer assignment; after
   merge, clean up and re-sync.
6. **Destructive operations are BLOCKED by default** (`--force`, `reset --hard`,
   `branch -D`, `clean -f`, deleting remote branches): they require EXPLICIT user
   confirmation plus a risk explanation. **NEVER `push --force`**;
   `--force-with-lease` only as a last resort with user confirmation.

## Anti-Patterns (FORBIDDEN)

- Letting the user work on `main` directly, or pushing to `main` without a PR
- Skipping `git fetch` at session start; letting conflicts accumulate
- Committing without checking `git status`; committing secrets or credentials
- Skipping tests after resolving conflicts
- Running destructive git operations without explicit user confirmation
- Assuming the other person isn't working on the same area

> **Detail (loads on file work):** branch naming + user-detection tables, per-phase
> checklists, conflict-resolution matrix, communication protocol messages, PR
> quality/DORA targets, user cheat sheet — see `safe-collaboration-reference.md`.
