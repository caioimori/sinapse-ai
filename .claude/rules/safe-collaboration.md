# Safe Collaboration — Git Safety Net (NON-NEGOTIABLE)

> **Applies to ALL agents, ALL projects using SINAPSE.**
> Users (Caio and Matheus) are product builders, NOT git experts.
> Agents MUST handle ALL git complexity automatically and safely.

## Golden Rule

**Users focus on WHAT to build. Agents handle HOW to save and share it safely.**

Users should NEVER need to:
- Resolve merge conflicts manually
- Decide which branch to use
- Remember to pull before working
- Worry about overwriting each other's code
- Understand git rebase, cherry-pick, or force-push

## Automatic Safety Protocol (every session)

### 1. Session Start — Auto-Sync (MANDATORY)

Before ANY work begins in a session, the agent MUST:

```
1. git fetch origin
2. Check if local main is behind origin/main
3. If behind → git pull origin main (fast-forward only)
4. If diverged → STOP, inform user, resolve safely
5. Create work branch if not already on one
```

**NEVER start work on `main` directly.** Always create a feature branch.

### 2. Branch Naming — Automatic

The agent creates the branch. The user never needs to name it.

| Who | Branch Pattern | Example |
|-----|---------------|---------|
| Caio's session | `caio/{type}/{short-desc}` | `caio/feat/installer-ux` |
| Matheus's session | `soier/{type}/{short-desc}` | `soier/fix/agent-config` |
| Unknown | `dev/{type}/{short-desc}` | `dev/feat/new-feature` |

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

**Detection:** Check `git config user.name` or `$USERNAME` or `$USER` to determine who is working.

### 3. Before Every Commit — Safety Checks

```
1. git status — verify only expected files changed
2. git diff --stat — show summary to user
3. Confirm no .env, credentials, or secrets in staged files
4. Commit with conventional message + story reference
```

### 4. Before Push — Conflict Prevention (MANDATORY)

```
1. git fetch origin main
2. git merge origin/main --no-edit (into feature branch)
3. If conflicts → AGENT resolves them (not the user)
   - For simple conflicts (whitespace, imports): auto-resolve
   - For complex conflicts: show both versions, ask user which to keep
4. Run tests after merge
5. Only then: git push origin {branch}
```

### 5. PR Creation — Automatic

After push, the agent MUST:
```
1. gh pr create with clear title and description
2. Auto-assign the OTHER person as reviewer
3. Inform the user: "PR criado, {outro} precisa aprovar"
```

### 6. After PR Merge — Cleanup

```
1. git checkout main
2. git pull origin main
3. Delete local feature branch
4. Inform user: "Branch limpa, pronto para proximo trabalho"
```

## Conflict Resolution Rules

| Scenario | Agent Action |
|----------|-------------|
| Same file, different sections | Auto-merge (git handles) |
| Same file, same lines | Show diff, ask user which version to keep |
| Package.json version conflict | Always take higher version |
| Generated files (lock, build) | Regenerate after merge |
| Story/doc files | Merge both contents (additive) |

**NEVER use `--force` or `--force-push` unless explicitly authorized by user.**

## Communication Protocol

When working in parallel, agents MUST inform users about:

| Event | Message |
|-------|---------|
| Session start | "Main esta X commits atras. Sincronizando..." |
| Branch created | "Criada branch `caio/feat/xxx`. Trabalho seguro." |
| Pre-push conflict found | "Soier mudou {file}. Resolvendo automaticamente..." |
| PR created | "PR #N criado. Soier precisa aprovar." |
| PR merged by other | "Soier mergou PR #N. Atualizando sua main..." |

## Anti-Patterns (FORBIDDEN)

- Letting user work on `main` directly
- Pushing to `main` without PR (branch protection enforces this)
- Ignoring `git fetch` at session start
- Letting conflicts accumulate (merge frequently)
- Using `git push --force` (use `--force-with-lease` only if absolutely necessary)
- Assuming the other person isn't working on the same area
- Committing without checking `git status` first
- Skipping tests after resolving conflicts

## For Projects Using SINAPSE (not just sinapse-ai repo)

These same rules apply to ANY project where SINAPSE agents operate:
1. Auto-branch before work
2. Auto-sync before starting
3. Auto-resolve simple conflicts
4. Auto-PR with reviewer assignment
5. User never touches git directly

## User Cheat Sheet (the ONLY git they need to know)

```
! git push origin main          ← when agent can't push (hook block)
! npm publish                   ← when publishing to NPM
```

Everything else: **ask the agent to do it.**
