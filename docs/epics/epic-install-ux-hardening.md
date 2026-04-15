# Epic: Install UX Hardening

> **Status:** Draft
> **Version Target:** v10.0.0-rc.4 → promote to `latest`
> **Created:** 2026-04-15
> **Owner:** Beacon (@project-lead)
> **Scope:** Install pipeline, CLI output, agent activation, handoff runtime
> **Branch:** `caio/feat/epic-install-ux-hardening`
> **Complexity:** STANDARD (7 stories, 3 phases)
> **Blocks:** v1.0.0 GA · agent rename · Caio's full walkthrough audit

---

## Objective

Fix the 7 concrete bottlenecks identified in the internal install/invocation/handoff audit (2026-04-14) so that a non-technical user can:

1. Run `npm install -g sinapse-ai` (or `npx sinapse-ai`, or local install) on **Windows / macOS / Linux**
2. See a **minimal, friendly** install output (≤ 10 lines by default)
3. Immediately invoke `@developer` (or any agent) and have it work — **no manual sync step**
4. Run `sinapse doctor` on a fresh install and get **PASS**

This epic is the last blocker before the agent rename, Caio's deep walkthrough audit, and the v1.0.0 GA release.

---

## Root Cause Summary (from audit 2026-04-14)

The install UX failures all trace back to **two architectural decisions**:

1. **Install is passive** — the framework relies on git hooks (pre-commit, pre-push) to run `sync:ide`. Fresh installs without a commit leave agents orphaned in `.sinapse-ai/development/agents/` and never copied to `.claude/commands/SINAPSE/agents/`. Result: `@developer` fails silently.
2. **Output is verbose by default** — 336 `console.log` calls across `bin/cli.js` (164) and `bin/sinapse.js` (172), plus ASCII art header and enumeration of the 1.151-entry `install-manifest.yaml`. Result: ~400-500 lines of output that scares non-technical users.

---

## Gargalos Addressed

| # | Gargalo | Severity | Story |
|---|---|---|---|
| G1 | No `postinstall` script in `package.json` | CRITICAL | A.1 |
| G2 | Agents not copied to `.claude/commands/SINAPSE/agents/` post-install | CRITICAL | A.1 |
| G3 | 336 `console.log` + 1.151-entry manifest = ~400-500 lines of output | HIGH | A.2 + B.1 |
| G4 | Doctor cascade FAIL — `catch` marks any exception as FAIL | HIGH | A.3 |
| G5 | Manifest says 23 agents, reality is 12 agents | MEDIUM | A.4 |
| G6 | Windows `.cmd` wrapper fragility | MEDIUM | A.5 |
| G7 | `.sinapse/handoffs/` runtime dir not created on install | LOW | A.1 |

---

## Constraints

- **NO breaking changes** to existing users upgrading from v10.0.0-rc.3
- **Framework boundary (L1/L2)** unchanged — this is L3 (config) + L4 (runtime) + `bin/` work
- **Backward compat** — `sinapse` and `sinapse-ai` bin names preserved
- **Open-source first** — no telemetry without explicit opt-in
- **Windows parity** — every fix MUST be validated on Windows, macOS, and Linux

---

## Phase 1: Install Activation (P0 — sequential)

### Story A.1: Postinstall Script & Runtime Dirs
**Resolves:** G1, G2, G7
**Estimated complexity:** Medium (2-3 days)

**Acceptance Criteria:**
- [ ] `package.json` has `scripts.postinstall` that runs automatically on `npm install` (global, local, and `npx`)
- [ ] Postinstall executes in order: `sync:ide --ide claude-code` → create `.sinapse/handoffs/` → create `.sinapse/scratchpad/` → `sinapse doctor --quiet`
- [ ] After `npm install -g sinapse-ai` on a fresh machine, `.claude/commands/SINAPSE/agents/developer.md` exists and is readable
- [ ] Invoking `@developer` in Claude Code resolves the agent file successfully
- [ ] Postinstall fails LOUDLY (non-zero exit) if `sync:ide` or `doctor` detect critical issues
- [ ] Postinstall respects `SINAPSE_SKIP_POSTINSTALL=1` env var (for CI / advanced users)
- [ ] Does NOT run on `npm install --ignore-scripts` (documented behavior)

**Out of scope:** Refactoring the `sync:ide` script itself (covered by existing ideSync infra).

---

### Story A.2: Logger & Verbose Flag Refactor
**Resolves:** G3 (partial — structural half)
**Estimated complexity:** Medium (2 days)

**Acceptance Criteria:**
- [ ] New `.sinapse-ai/core/logger/index.js` module with levels: `error`, `warn`, `info`, `debug`
- [ ] Default level in `bin/cli.js` and `bin/sinapse.js` is `warn` (shows only warnings and errors)
- [ ] `--verbose` flag promotes level to `info`; `--debug` promotes to `debug`; `--quiet` suppresses all but `error`
- [ ] All 336 existing `console.log/warn/error` calls migrated to the logger
- [ ] ASCII art header only shown on `--verbose` OR on first-run
- [ ] Fresh install default output is ≤ 10 lines (measured in A.2 test)
- [ ] `--json` output mode emits structured JSON (for CI / automation)

**Out of scope:** Redesigning the output content itself (that's B.1).

---

### Story A.3: Doctor Exception Classification
**Resolves:** G4
**Estimated complexity:** Small (1 day)

**Acceptance Criteria:**
- [ ] `.sinapse-ai/core/doctor/index.js:56-62` refactored — generic `catch` no longer marks all exceptions as `FAIL`
- [ ] Each check module declares its own failure severity via exported `onError: 'fail' | 'warn' | 'skip'`
- [ ] `entity-registry`, `agent-memory`, `git-hooks` checks marked `warn` in fresh-install context
- [ ] `node-version`, `npm-packages`, `settings-json` remain `fail` (truly blocking)
- [ ] Doctor exit codes: `0` PASS, `1` WARN only, `2` FAIL, `3` internal error
- [ ] Fresh install on clean machine returns exit code `0` (PASS)
- [ ] Unit tests cover each severity classification

---

### Story A.4: Install Manifest Parity & Regeneration
**Resolves:** G5
**Estimated complexity:** Small (1 day)

**Acceptance Criteria:**
- [ ] Script `.sinapse-ai/infrastructure/scripts/validate-manifest-parity.js` compares `install-manifest.yaml` against real files in `.sinapse-ai/development/agents/`, `tasks/`, `templates/`, `checklists/`
- [ ] Script run in `pre-push` hook — blocks push if manifest drifts
- [ ] `install-manifest.yaml` regenerated: accurate agent count (12, not 23), accurate hashes
- [ ] `entity-registry.yaml` cross-validated against manifest (both must agree)
- [ ] `npm run validate:manifest` script added to `package.json`
- [ ] CI job added to run parity check on every PR

---

### Story A.5: Windows Wrapper & Cross-Platform Test Matrix
**Resolves:** G6
**Estimated complexity:** Medium (2-3 days) — **GATE for rc→latest**

**Acceptance Criteria:**
- [ ] Custom `.cmd` wrapper investigated; if npm auto-gen is sufficient, document the finding
- [ ] Test matrix executed on clean environments:
  - Windows 11 × (npm, pnpm, yarn) × (global, npx, local) = 9 combos
  - macOS × (npm, pnpm, yarn) × (global, npx, local) = 9 combos
  - Linux × (npm, pnpm, yarn) × (global, npx, local) = 9 combos
- [ ] For each combo, document: `sinapse` resolvable in PATH? `@developer` callable? `doctor` PASS? Output line count?
- [ ] Test matrix persisted in `docs/audits/install-matrix-{date}.md`
- [ ] Gate: **all 27 combos must PASS** before rc promotes to `latest`
- [ ] GitHub Actions workflow added for automated matrix validation on release PRs

---

## Phase 2: Output Polish (P1 — depends on A.2)

### Story B.1: Minimalist Install Output Design
**Resolves:** G3 (content half)
**Estimated complexity:** Small (1 day)

**Acceptance Criteria:**
- [ ] Default install output matches this spec (≤ 8 lines):
  ```
  SINAPSE {version} instalado ✓
  {N} agents · {M} squads prontos

  Teste:   sinapse doctor
  Começar: @sinapse no Claude Code

  Docs:    https://sinapse.club
  ```
- [ ] `--verbose` shows full current relatório (preserved for power users)
- [ ] `--json` emits structured output for CI/automation
- [ ] Copy reviewed for non-technical user voice (Portuguese primary)
- [ ] No ASCII art in default mode; ASCII art preserved in `--verbose`
- [ ] First-run detection shows "Bem-vindo ao SINAPSE!" extra line (once per machine)

---

## Phase 3: Observability & Safety Net (P1 — parallel with Phase 2)

### Story C.1: Exit Codes, Auto-Doctor & Opt-in Telemetry
**Resolves:** install silent-failure risk
**Estimated complexity:** Medium (2 days)

**Acceptance Criteria:**
- [ ] Install script exits with correct code: `0` success, `1` partial (warnings), `2` failed
- [ ] `sinapse doctor --quiet` runs automatically at end of postinstall
- [ ] If doctor fails, user sees a one-liner: `"Instalação parcial — rode 'sinapse doctor' pra ver o quê"`
- [ ] Opt-in telemetry module `.sinapse-ai/core/telemetry/` — **disabled by default**
- [ ] Opt-in via `sinapse telemetry enable` (explicit) or `SINAPSE_TELEMETRY=1` env var
- [ ] Telemetry payload: anonymized (no paths, no usernames), only failure category + platform + version
- [ ] Privacy policy documented in `docs/TELEMETRY.md`
- [ ] Telemetry endpoint TBD — stub implementation ok for this story, real endpoint is follow-up

---

## Execution Order

```
A.1 (postinstall + dirs)
  ↓
A.2 (logger refactor)
  ↓
A.3 (doctor fix) ─┐
                  ├─→ A.4 (manifest parity)
                  │     ↓
                  │   A.5 (test matrix) ← GATE for rc→latest
                  │     ↓
                  └─→ B.1 (output design) ─→ C.1 (observability)
```

**Critical path:** A.1 → A.2 → A.3 → A.4 → A.5 (5 sequential stories, ~8-10 days)
**Parallel:** B.1 can start after A.2 completes; C.1 can start after A.3 completes.

---

## Epic-Level Acceptance Criteria

The epic is DONE when ALL of these pass on a clean machine:

1. **Install works:** `npm install -g sinapse-ai` on fresh Win/Mac/Linux → `sinapse` command resolvable in PATH
2. **Agents callable:** After install, `@developer` in Claude Code resolves and runs — no manual step needed
3. **Output minimal:** Default install output ≤ 10 lines
4. **Doctor passes:** `sinapse doctor` on fresh install returns exit code 0 (PASS)
5. **Test matrix green:** All 27 combos in A.5 matrix pass
6. **Manifest truthful:** `npm run validate:manifest` passes; install-manifest.yaml reflects reality
7. **Exit codes correct:** Install fails loudly (non-zero exit) when something is actually broken
8. **No regressions:** Existing rc.3 users can upgrade to rc.4 without data loss or reconfiguration

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `postinstall` breaks on `npm install --ignore-scripts` | Document; add `sinapse init` manual fallback |
| Logger refactor regression (hidden log dependency) | Full test suite + manual smoke test on each bin command |
| Windows test matrix infrastructure cost | Use GitHub Actions matrix builds; cache node_modules |
| Telemetry privacy concerns | Opt-in only; documented payload; privacy policy |
| Rename of agents invalidates A.5 matrix | Run A.5 AFTER rename; epic explicitly gates rc promotion |

---

## Dependencies

- **Depends on:** nothing (can start immediately)
- **Blocks:** agent rename epic, Caio's walkthrough audit, v1.0.0 GA release
- **Related:** Epic 10.0 (Final Parity) — this is a follow-up hardening pass

---

## Story Delegation

Per SINAPSE workflow (Beacon creates epics, Sync creates stories):

1. **@sprint-lead** (Sync) — Create 7 story files using this epic as the source:
   - `docs/stories/A.1.postinstall-runtime-dirs.story.md`
   - `docs/stories/A.2.logger-verbose-refactor.story.md`
   - `docs/stories/A.3.doctor-exception-classification.story.md`
   - `docs/stories/A.4.manifest-parity-regeneration.story.md`
   - `docs/stories/A.5.windows-wrapper-test-matrix.story.md`
   - `docs/stories/B.1.minimalist-install-output.story.md`
   - `docs/stories/C.1.exit-codes-auto-doctor-telemetry.story.md`

2. **@product-lead** (Axis) — Validate each story via 10-point checklist before marking `Ready`.

3. **@developer** (Pixel) — Implement in the execution order above. A.5 is the rc→latest gate.

4. **@quality-gate** (Litmus) — Run qa-gate on each story; run full epic-level regression on completion.

5. **@devops** (Pipeline) — Own the rc.4 release, test matrix CI, and rc→latest promotion.

---

## Post-Epic Roadmap

After this epic closes:
1. **Agent rename epic** (planned — Caio initiates)
2. **Caio's deep walkthrough audit** (Caio reads every agent, workflow, squad)
3. **Clinical audit 17+1 dimensions** (add "install/activation/handoff health" as dimension 18)
4. **v1.0.0 GA release** (reset from 10.x beta to 1.0.0 official)

---

*Created by Beacon (@project-lead) · SINAPSE Epic Template v1.0*
