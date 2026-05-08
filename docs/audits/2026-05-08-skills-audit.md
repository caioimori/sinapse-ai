# Skills Audit — 2026-05-08

> **Sessao 2 / Categoria 5.3**
> Read-only audit — no behavior changes
> Baseline: `docs/audits/audit-dim-09-skills.md` (2026-04-19, verdict PASS)
> Goal stated in handoff: "separar `~/.claude/` pessoal do framework público"

## Scope

Confirm that:
1. Framework-public skills live where the framework expects (project tree).
2. Personal skills (the maintainer's `~/.claude/skills/`) are NOT leaking into the framework npm package.
3. Skills shipped via npm reach end users correctly.
4. No personal patterns (like `obsidian-skills/`, `sinapse-curar`, business-vertical packs) accidentally show up in the public framework.

## 1. Inventory

### Framework-public skills (committed to the repo)

| Location | Count | Style | Shipped via npm? |
|---|---:|---|---|
| `.claude/skills/` (project, Claude Code) | 17 | 10 single-file + 7 directory | **NO** — not in `package.json#files` |
| `.codex/skills/` (codex mirror) | 30 | All directory-packaged (`SKILL.md`) | **YES** — `.codex/skills/` is in `package.json#files` |
| `.sinapse-ai/development/skills/` (canonical source) | 12 | All single-file | **YES** — `.sinapse-ai/` is in `package.json#files` |

The 17 `.claude/skills/` entries (api-review, clone-mind, component-check, course-generation-workflow, db-review, enhance-workflow, ralph, squad, story-update, test-guard, architect-first/, checklist-runner/, coderabbit-review/, mcp-builder/, skill-creator/, synapse/, tech-search/) are visible in this session — meaning they work for `git clone` users, but not for `npm i sinapse-ai` users.

### Personal skills (the maintainer's machine, `~/.claude/skills/`)

Observed top-level entries (NOT in repo, NOT in package):

```
Creative Skills/        Cro Skills/             Facebook Ads Skills/
Google Ads Skills/      Marketing Skills/       Measurement Skills/
Orchestrator/           Social Media Ads Skills/ Strategy Skills/
aidesigner-frontend/    design-md/              design-md-deep/
find-skills/            gsap/                   hyperframes/
hyperframes-cli/        hyperframes-registry/   obsidian-skills/
sinapse-curar/          website-to-hyperframes/
```

Plus claude-mem plugin skills surfaced at runtime (`claude-mem:make-plan`, `claude-mem:do`, etc.).

### Plugin / runtime skills (not under any of the above)

`update-config`, `keybindings-help`, `simplify`, `fewer-permission-prompts`, `loop`, `schedule`, `claude-api`, `find-skills`, plus the terminal-bus session pack (`checkpoint`, `inbox`, `msg`, `resume`, `session`, `sessions`).

## 2. Leak check (the central question of 5.3)

For each personal skill on the maintainer's machine, verify it does NOT appear in the repo:

| Personal skill | In repo? | In npm `files`? | Status |
|---|:-:|:-:|---|
| Creative Skills, Cro Skills, Facebook Ads Skills, Google Ads Skills, Marketing Skills, Measurement Skills, Social Media Ads Skills, Strategy Skills | NO | NO | clean |
| Orchestrator (personal one) | NO | NO | clean |
| aidesigner-frontend, design-md, design-md-deep | NO | NO | clean |
| hyperframes, hyperframes-cli, hyperframes-registry | NO | NO | clean |
| obsidian-skills | NO | NO | clean |
| sinapse-curar (private curation skill) | NO | NO | clean |
| website-to-hyperframes | NO | NO | clean |

**Verdict:** zero personal-skill leaks into the framework. The `validate:no-personal-leaks` lint guard (present since Wave 2 PR-8) reinforces this at push time.

## 3. Asymmetry finding

| IDE surface | Skills count | In `package.json#files`? |
|---|---:|:-:|
| Codex (`.codex/skills/`) | 30 | YES |
| Claude Code (`.claude/skills/`) | 17 | **NO** |

`package.json` ships `.claude/CLAUDE.md`, `.claude/rules/`, `.claude/hooks/` — but NOT `.claude/skills/`. The 17 framework-public skills under `.claude/skills/` reach `git clone` users (because they're tracked in git) but are absent from the npm tarball.

**Three plausible explanations** (audit doesn't pick one — that's a follow-up decision):

a. **Intentional:** these skills are project-scoped and meant to be authored per-project, not shipped as defaults.
b. **Mirror gap:** `.codex/skills/` was added to `files` at some point but `.claude/skills/` was missed.
c. **Sync mechanism:** maybe they're synced into a user's project via a different installer path that doesn't need them in the npm tarball.

There is no `.claude/skills/`-aware logic in `bin/cli.js`, `bin/postinstall.js`, or `packages/sinapse-install/src/capabilities/*.js`, which weakly favors explanation (b).

## 4. Delta vs previous audit (2026-04-19)

| Dimension | 2026-04-19 | 2026-05-08 | Change |
|---|---|---|---|
| Project skills count (`.claude/skills/`) | 17 | 17 | none |
| Codex mirror count | not measured | 30 | first-time observation |
| Personal-skill leaks | 0 | 0 | none |
| Sync mechanism | "user-managed" | "user-managed" | none |
| `.claude/skills/` in npm `files`? | not flagged | not present | first-time observation |

## 5. Findings

### 🟡 MEDIUM — `.claude/skills/` not shipped via npm

17 framework skills under `.claude/skills/` are committed to git but absent from the npm tarball. `.codex/skills/` IS shipped. Either decision could be correct, but the asymmetry is undocumented. Recommendation: pick one of (a) ship `.claude/skills/` to match `.codex/skills/`, or (b) document why claude-code skills are not packaged.

### 🟢 INFO — Zero personal-skill leaks

None of the maintainer's `~/.claude/skills/` entries (business verticals, obsidian, hyperframes, etc.) appear in the repo or the npm package. Lint guard `validate:no-personal-leaks` is doing its job.

### 🟢 INFO — Codex mirror is healthy

All 30 SINAPSE agents have a corresponding `sinapse-{agent}/SKILL.md` under `.codex/skills/`, kept in sync via `npm run sync:skills:codex`. Validation runs in CI via `validate:codex-skills`.

### 🟢 INFO — Plugin skills correctly out of scope

`claude-mem:*` and the runtime/plugin pack (`update-config`, `loop`, `schedule`, etc.) are user-installed plugins outside SINAPSE governance. No action.

## 6. Verdict

**PASS with one MEDIUM recommendation.**

- No GA blocker.
- The MEDIUM is a packaging decision, not a correctness bug — both options are defensible.
- Personal/framework separation is clean (the central question of this audit).

## 7. Recommendations

1. **Decide** whether `.claude/skills/` should be in `package.json#files`. If YES → 1-line PR adding it. If NO → add a comment in `package.json` or a `docs/installation/skills.md` explaining the choice.
2. **Re-run** this audit if a new IDE-skill surface gets added (only Claude Code + Codex are mirrored today).

## References

- Previous audit: `docs/audits/audit-dim-09-skills.md` (2026-04-19)
- Personal-leak guard: `scripts/validate-no-personal-leaks.js`
- Codex skill sync: `.sinapse-ai/infrastructure/scripts/codex-skills-sync/`
- Skills source of truth: `.sinapse-ai/development/skills/`
