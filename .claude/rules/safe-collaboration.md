# Safe Collaboration — Git Safety Net (NON-NEGOTIABLE)

> **Applies to ALL agents, ALL projects using SINAPSE.**
> Users are product builders, NOT git experts.
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
6. Verify branch protection is active on main
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

**User Detection (priority order):**
1. `git config user.name` -> lookup in mapping table (case-insensitive)
2. `$USERNAME` (Windows) or `$USER` (Unix) -> lookup in mapping table
3. Fallback: `dev/`

**Mapping Table:**

| git config / env var contains | Branch prefix |
|-------------------------------|---------------|
| caio (case-insensitive)       | `caio/`       |
| matheus OR soier              | `soier/`      |
| (anything else)               | `dev/`        |

### 3. Before Every Commit — Safety Checks (MANDATORY)

```
1. git status — verify only expected files changed
2. git diff --stat — show summary to user
3. SECRET SCAN — reject if ANY of these are staged:
   - .env files (except .env.example with placeholders)
   - Files containing API keys, tokens, passwords in plaintext
   - Private keys (RSA, SSH, PGP)
   - Database connection strings with credentials
   - Webhook URLs with embedded tokens
4. Commit with conventional message + story reference
```

**If secrets detected → BLOCK commit, warn user, remove file from staging.**

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
1. gh pr create with clear title and description (uses PR template)
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

**NEVER use `--force` push. Use `--force-with-lease` ONLY as last resort with user confirmation.**

## Communication Protocol

When working in parallel, agents MUST inform users about:

| Event | Message |
|-------|---------|
| Session start | "Atualizando seu projeto... X mudancas novas do {outro}." |
| Branch created | "Criada area segura para trabalhar: `caio/feat/xxx`" |
| Pre-push conflict found | "{outro} mudou {file}. Resolvendo automaticamente..." |
| Secret detected | "BLOQUEADO: encontrei {tipo} em {file}. Removendo antes de salvar." |
| PR created | "Enviei para revisao. {outro} precisa aprovar no GitHub." |
| PR merged by other | "{outro} aprovou suas mudancas. Atualizando seu projeto..." |

## Destructive Operations — BLOCKED BY DEFAULT

These operations require EXPLICIT user confirmation before execution:

| Operation | Risk | Confirmation Required |
|-----------|------|----------------------|
| `git push --force` / `--force-with-lease` | Overwrite remote history | YES + explain risk |
| `git reset --hard` | Destroy local uncommitted work | YES + explain risk |
| `git branch -D` | Delete branch with unmerged commits | YES + explain risk |
| `git clean -f` | Delete untracked files permanently | YES + explain risk |
| Delete remote branch | Affects other collaborators | YES |

## Anti-Patterns (FORBIDDEN)

- Letting user work on `main` directly
- Pushing to `main` without PR (branch protection enforces this)
- Ignoring `git fetch` at session start
- Letting conflicts accumulate (merge frequently)
- Using `git push --force` without explicit user confirmation
- Assuming the other person isn't working on the same area
- Committing without checking `git status` first
- Skipping tests after resolving conflicts
- Committing files containing secrets or credentials
- Running destructive git operations without user confirmation

## For Projects Using SINAPSE (not just sinapse-ai repo)

These same rules apply to ANY project where SINAPSE agents operate:
1. Auto-branch before work
2. Auto-sync before starting
3. Secret scan before every commit
4. Auto-resolve simple conflicts
5. Auto-PR with reviewer assignment
6. User never touches git directly

## User Cheat Sheet (the ONLY things users do manually)

```
! git push origin main          ← when agent can't push (hook block)
! npm publish                   ← when publishing to NPM
```

Everything else: **ask the agent to do it.**
