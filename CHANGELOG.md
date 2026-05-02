# Changelog

All notable changes to SINAPSE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [10.0.0-rc.10] — 2026-04-19

Release candidate capturing the first nine dimensions of the pre-GA Clinical Audit (Phases 1 through 3) and one rule-drift correction surfaced by the audit. Zero runtime changes — all deliverables here are documentation / governance artifacts that land ahead of the Fase C agent-rename work scheduled for 2026-04-23.

### Added — Clinical Audit coverage (9/17 dimensions)

- **Dim 13 Gitflows — PASS.** Branch protection, husky hooks (pre-commit + pre-push), and CI status checks verified against `safe-collaboration.md`. Admin-bypass flow exercised 7 times this session (PRs #98–#107) without issue. One MEDIUM logged (session-start auto-fetch is a convention, not a hook — post-GA stub). Evidence in `docs/audits/audit-dim-13-gitflows.md`. (PR #108)
- **Dim 11 Plugins — CONCERNS.** Installer footprint on plugin system confirmed zero (as intended). Two MEDIUMs: no plugin trust/review rule, no version-pinning guidance. Both are post-GA docs stories, not GA blockers. `docs/audits/audit-dim-11-plugins.md`. (PR #109)
- **Dim 12 MCP — PASS.** Chrome Brain MCP stack validated stable post-rc.8 (SessionStart hook in place). Installer idempotency observed. Two MEDIUMs: upstream figma-console instability (out of SINAPSE locus of control) and rule-drift in `mcp-usage.md` (fixed in PR #112). `docs/audits/audit-dim-12-mcp.md`. (PR #109)
- **Dim 1 Features — PASS.** Inventory of user-facing features validated against CLI help text + installer code. One MEDIUM (partial canonical-CLI parity, tracked as item #9 dual-CLI). `docs/audits/audit-dim-01-features.md`. (PR #110)
- **Dim 8 Commands — CONCERNS.** Dual CLI drift confirmed (`npx sinapse-ai` narrower than `sinapse`). Agent-subcommand audit deferred to Phase 4 per epic ordering (post-SNPS-rename). `docs/audits/audit-dim-08-commands.md`. (PR #110)
- **Dim 9 Skills — PASS.** All 17 authored skills + plugin + third-party skills load cleanly. One LOW (no top-level skill index doc). `docs/audits/audit-dim-09-skills.md`. (PR #110)
- **Dim 2 Workflows — PASS.** Four primary workflows (SDC, QA Loop, Spec Pipeline, Brownfield Discovery) have corresponding YAML definitions; 210 task files present. One MEDIUM (per-task contract quality not covered by shell audit — folded into Phase 5 follow-up). `docs/audits/audit-dim-02-workflows.md`. (PR #111)
- **Dim 10 Tools — PASS.** Hook coverage matches `hook-governance.md`; 74 hook-security tests pass; native-first discipline observed throughout session. One LOW (hook timeout guidance unwritten). `docs/audits/audit-dim-10-tools.md`. (PR #111)
- **Dim 16 Token Economy — PASS.** All 9 sections of the NON-NEGOTIABLE rule aligned with observed session behavior. One LOW (compaction threshold is convention, not hook — intentional). `docs/audits/audit-dim-16-token-economy.md`. (PR #111)

### Fixed

- **`.claude/rules/mcp-usage.md` drift** — Rule no longer claims Docker MCP Toolkit is the "primary MCP infrastructure"; relabeled as an optional acceleration layer. The "Direct in Claude Code" table now lists the three MCPs the SINAPSE installer actually registers (`chrome-devtools`, `dev-browser`, `terminal-bus`) instead of the previous `playwright` + `desktop-commander` entries that no installer path produces. Doc-only, no runtime change. (PR #112)

### Audit summary

Across the 9 dimensions audited pre-rename: **zero CRITICAL, zero HIGH, zero GA blockers.** Findings breakdown: 7 MEDIUM (all docs-only or tracked elsewhere) + 3 LOW (all optional polish). The remaining 8 dimensions (3 Agents, 4 Subagents, 5 Workers, 6 Squads, 7 Clones, 14 Research, 15 Knowledge Base, 17 Hallucinations) are deferred to Phase 4 + Phase 5 per the epic's ordering rule: "Rename (Fase C) executed between audit Phase 3 and Phase 4" to avoid auditing names that will churn.

## [10.0.0-rc.9] — 2026-04-19

Release candidate closing Fase B (Hardening): CLI surface parity, NSN guard enforcement at the hook layer, and the plan-first clinical audit epic. No new user-facing features — this is trust-infrastructure work ahead of GA.

### Added

- **Story 10.43** — `init <name>` on the canonical `npx sinapse-ai` entry. The greenfield scaffolder was reachable through the legacy `sinapse` binary but missing from `npx sinapse-ai`. Fixed with a thin `case 'init'` that forwards via `spawnSync` to the existing wizard — single source of truth, identical flags (`--force`, `--skip-install`, `--template default|minimal|enterprise`). Help text updated. (PR #103)
- **Story 10.44** — NSN Mode guard hook (`.claude/hooks/enforce-nsn-guard.cjs`). Scans `.md/.mdx/.txt` content on Write/Edit PreToolUse for NSN anti-patterns ("abra o dashboard manualmente", "siga esses passos manualmente", "não consigo acessar a interface", "você precisa abrir/clicar", "I can't do this"). WARN mode (stderr + exit 0) — gives agents visibility without false-positive blocking. Registered in `.claude/settings.json` and documented in `hook-governance.md`. (PR #104)
- **Epic: Clinical Audit (Pre-GA)** — `docs/epics/epic-clinical-audit-pre-ga.md`. Plan-first deliverable per explicit directive ("IA não pode alucinar — plano ANTES da execução"). Defines 17-dimension audit scope, per-dimension execution protocol (Inventory → Contract → Reality → Delta → Severity → Recommendation → Gate), phased dependency chain, and citation discipline (file:line required for every Reality claim). Audit execution does NOT begin with this merge — individual dimension stories must be written + validated Ready first. (PR #105)

### Changed

- **CLI help surface** — `npx sinapse-ai --help` now lists `init <name>` as the first command, reflecting the greenfield path now has parity.

### Unblocked

With rc.9, the pre-GA backlog is reduced to: (1) execute the clinical audit (blocked on explicit go-ahead per epic), (2) dual-CLI consolidation (separate story, not a GA blocker), (3) Fase C SNPS rename (separate epic).

## [10.0.0-rc.8] — 2026-04-19

Release candidate clearing the rc.8 gate: the three pre-GA blockers (Dependabot, Doctor FAIL on fresh project, Yarn v1 Windows platform exception) are resolved or durably triaged.

### Fixed

- **Story 10.41** — Chrome Brain SessionStart hook. The `chrome-devtools` MCP is configured with `--browser-url=http://127.0.0.1:9222`, so it tries to connect to an already-running Chrome at boot. Before this release the installer only registered `PreToolUse` / `PostToolUse` hooks — both fire **after** MCP init — so the MCP would fail, mark itself disconnected, and never auto-reconnect (user had to restart Claude Code). Installer now registers a `SessionStart` hook (`timeout=15s`) that runs `chrome-ensure` before MCP startup, and deduplicates hooks by `(matcher + command)` so the `matcher=""` slot does not collide with other modules (e.g. vault-grounding). Uninstall drops SessionStart entries by matching `chrome-ensure` in the command. Applied to both installer entrypoints (`bin/modules/chrome-brain-installer.js` + `packages/sinapse-install/src/capabilities/chrome-brain.js`). (PR #98)
- **Story 10.42 / Bug 3** — Doctor fresh-project detection. Running `sinapse doctor` in a directory where SINAPSE was never installed previously produced 11 FAIL entries — every check fired because no artifact existed. New users read that as "the framework is broken" on first contact. Fix: pre-flight `detectInstallState` in `.sinapse-ai/core/doctor/index.js`. If ALL THREE markers are absent (`<projectRoot>/.sinapse-ai/`, `~/.sinapse/`, `~/.claude/commands/SINAPSE/`), doctor short-circuits with a three-line NOT_INSTALLED block ("SINAPSE is not installed in this project. Run: npx sinapse-ai install") and exits code **4** (distinct from 0/1/2/3). JSON output carries `notInstalled: true` + `installCommand`. `--homeDir` option and `SINAPSE_DOCTOR_HOME` env override added for test isolation. Any single marker present → full 15-check suite runs unchanged. 5 new unit tests. (PR #100)

### Changed

- **Story 10.34 — re-executed + hardened.** GitHub Dependabot open-alert count already 0 (all 12 rc.1-era alerts closed). `npm audit --omit=dev` is clean. The 2 remaining advisories on the full tree (`picomatch@4.0.3` HIGH, `brace-expansion@5.0.4` MODERATE) are bundled inside `npm@11.12.1` within `@semantic-release/npm` — outside the reach of root `overrides`. Accepted with audit trail at `docs/security/dependabot-triage.md`. CI gate upgraded per Constitution Art. X Tier 1 #7: new job `npm audit --omit=dev --audit-level=high` (HIGH/CRITICAL in prod deps blocks); existing `--audit-level=critical` full-tree job retained. (PR #99)
- **Install matrix Yarn v1 Windows exception re-affirmed for GA.** `docs/audits/install-matrix-2026-04-16.md` sign-off updated: Dependabot + Doctor FAIL blockers cleared, gate decision marked durable through GA 1.0.0 with explicit revalidation triggers. 24/27 combo matrix stands. (PR #101)

### Infrastructure

- **Doctor exit code table expanded.** `0=PASS, 1=WARN, 2=FAIL, 3=internal-error, 4=NOT_INSTALLED`. Release notes for downstream scripts that branch on exit code.
- **CI security gate** now enforces zero HIGH/CRITICAL in production deps on every PR that touches `package-lock.json`.

## [10.0.0-rc.4] — 2026-04-16

Release candidate closing the pre-v1.0.0 GA gate. Three blockers resolved today:

### Fixed

- **Story 10.39** — Postinstall exit code fix. Fresh `npm install sinapse-ai` no longer fails with `npm error command failed` when the framework is operational but doctor reports non-critical WARN findings. Exit 1 removed from the contract; only critical failures (sync:ide error, doctor exit ≥ 2) now produce non-zero exit. `--json` output still carries `status: warn` for pipelines that want strict behavior. (PR #82)
- **Story 10.34** — Dependabot vulnerabilities cleanup. Root lockfile now overrides `serialize-javascript ^7.0.5`, `picomatch ^4.0.4`, `brace-expansion ^5.0.5`. Health-dashboard subpackage lockfile regenerated against current `package.json` (vite@7.3.1, react@18.2). `npm audit --omit=dev` on root = 0 vulnerabilities; `npm audit` on health-dashboard = 0 vulnerabilities. Remaining dev-only vulns inside bundled npm CLI (via `@semantic-release/npm`) dismissed as tolerable risk. (PR #83)

### Changed

- **Story A.5 closed** — Windows Wrapper & Cross-Platform Test Matrix accepted with 24/27 PASS. The 3 FAIL combos are all Windows × Yarn v1 (classic), documented as an unsupported platform: Yarn v1 has been in maintenance mode since 2020 with Yarn Berry (v2+) as successor. Windows users should migrate to Yarn v2+ or use npm/pnpm. macOS/Linux on Yarn v1 remain supported. (PR #80)
- `README.md` — "Supported Platforms" matrix published under installation FAQ, documenting the Yarn v1 Windows exception.
- `docs/audits/install-matrix-2026-04-16.md` — full decision record for the A.5 gate.

## [Previous Unreleased]

Epic `install-ux-hardening` — hardens the install pipeline, CLI output,
agent activation and handoff runtime so a non-technical user can
`npm install -g sinapse-ai` on Windows / macOS / Linux, see a minimal
friendly output, invoke `@developer` immediately, and get a clean
`sinapse doctor` on a fresh machine. 6 stories Done, 1 (A.5) InReview
gated on rc.4 CI matrix execution. Resolves gargalos G1-G7 from the
2026-04-14 internal install audit. Blocks v1.0.0 GA.

### Added

- **Story A.1** — Postinstall orchestrator (`bin/postinstall.js`). Fresh
  `npm install -g sinapse-ai` now automatically runs `sync:ide --ide
  claude-code`, creates `.sinapse/handoffs/` and `.sinapse/scratchpad/`
  runtime dirs, and runs `sinapse doctor --quiet`. No manual sync step
  needed after install. Respects `SINAPSE_SKIP_POSTINSTALL=1`
  (explicit opt-out) and auto-skips on common CI env vars
  (`CI=true`, `GITHUB_ACTIONS`, etc.) unless
  `SINAPSE_FORCE_POSTINSTALL=1` is set. Fails loudly (exit 2) on
  critical failures (sync:ide error, doctor FAIL). Resolves G1, G2, G7.
- **Story A.2** — Structured logger (`.sinapse-ai/core/logger/`) with
  levels `error | warn | info | debug`. Default level is `warn` so
  fresh installs emit ≤ 10 lines of output. `--verbose` promotes to
  `info`, `--debug` to `debug`, `--quiet` suppresses all but `error`,
  `--json` emits structured output for CI/automation. All 336
  existing `console.*` calls in `bin/cli.js` and `bin/sinapse.js`
  migrated to the logger. ASCII art header only shown on `--verbose`
  or first-run. Resolves structural half of G3.
- **Story A.3** — Doctor exception classification. Each check module
  now declares its own failure severity via `onError: 'fail' | 'warn'
  | 'skip'`. The generic `catch` in `.sinapse-ai/core/doctor/index.js`
  no longer marks every exception as FAIL. `entity-registry`,
  `agent-memory`, `git-hooks` are `warn` in fresh-install context;
  `node-version`, `npm-packages`, `settings-json` remain `fail`.
  Doctor exit codes: `0` PASS, `1` WARN only, `2` FAIL, `3` internal.
  Fresh install on clean machine now returns exit code `0`. Resolves
  G4.
- **Story A.4** — Manifest parity validation. New script
  `.sinapse-ai/infrastructure/scripts/validate-manifest-parity.js`
  compares `install-manifest.yaml` against real files in
  `.sinapse-ai/development/{agents,tasks,templates,checklists}/`.
  Wired into `pre-push` hook and `npm run validate:manifest`. CI
  workflow `.github/workflows/manifest-parity.yml` runs parity check
  on every PR. `install-manifest.yaml` regenerated with accurate
  counts (12 agents, not 23) and hashes. Resolves G5.
- **Story A.5** — Cross-platform install test matrix infra
  (`.github/workflows/install-matrix.yml` + local harness
  `scripts/test-install-matrix-local.sh`). 27 combos (Win/Mac/Linux ×
  npm/pnpm/yarn × global/npx/local). Gated behind release label —
  execution deferred to rc.4 CI run (A.5 remains `InReview` until
  matrix is green). Resolves G6 (infra only).
- **Story B.1** — Minimalist install output. Default `sinapse install`
  output is ≤ 8 lines: version, agent/squad count, `sinapse doctor`
  hint, `@sinapse` hint, docs URL. `--verbose` preserves full
  relatório for power users, `--json` for CI, first-run detection
  adds a "Bem-vindo ao SINAPSE!" line once per machine. Copy reviewed
  for non-technical PT-BR voice. Resolves content half of G3.
- **Story C.1** — Exit codes, auto-doctor and opt-in telemetry stub.
  Install script exits `0` success, `1` partial (warnings), `2`
  failed. `sinapse doctor --quiet` runs at end of postinstall with a
  one-liner on failure. New `.sinapse-ai/core/telemetry/` module —
  **disabled by default**, opt-in via `sinapse telemetry enable` or
  `SINAPSE_TELEMETRY=1`. Anonymized payload (no paths, no usernames):
  failure category + platform + version only. Privacy policy in
  `docs/TELEMETRY.md`. Real endpoint is follow-up work.

### Notes

- **Story A.5 (`InReview`)** — workflow infrastructure is merged; the
  27-combo matrix itself will execute as part of the rc.4 release
  cycle. A.5 is promoted to `Done` only after the matrix passes
  green, per the epic-level gate for `rc → latest` promotion.

## [10.0.0-rc.3] - 2026-04-13

Critical UX fix: installer can no longer destroy user config.

### Fixed

- **Story 10.38** — Installer merge-only policy. Existing `CLAUDE.md`,
  `.env` and other known config files are ALWAYS merged during
  install — never overwritten, never prompted. User customizations
  (custom rules, env values) are preserved by default and
  unconditionally. Files without a registered merge strategy are
  backed up (`<file>.backup.<ts>`) before any change. Legacy fallback
  installer (`bin/sinapse-init.js`) now also runs `MarkdownMerger` on
  existing `CLAUDE.md` instead of plain `fse.copy`. The old
  `--merge` / `--no-merge` flags are accepted as no-ops for
  backward compatibility.

## [10.0.0-rc.2] - 2026-04-13

Bug fix: `--reconfigure` flag for `npx sinapse-ai install`.

### Fixed

- **Story 10.35** — `npx sinapse-ai install --reconfigure` re-prompts
  language and LLM choice without wiping existing install. Upsert fast
  path (plain `install`) is unchanged. Non-TTY guard preserved. PR #69.

## [10.0.0-rc.1] - 2026-04-13

Phase 0 + Phase 1 closeout for the v10.0.0 release. 15 stories shipped
across 5 cycles, +130 tests, zero regressions, deterministic working
tree, idempotent installer + updater, doctor reachable from canonical
CLI, hardened cross-IDE parity, and full release-readiness aggregator.

### Added

- **Story 10.17** — External-refs CI guard (`scripts/validate-no-external-refs.js`)
  scanning 100% of git-tracked files, plus Phase 0 authorial hygiene
  pass and Epic 11.0 placeholder. PR #51.
- **Story 10.18** — Cross-IDE parity hardening: self-sufficient
  `validate-parity.js` error reporting, new `validate:parity:fast`
  pre-push guard with smart short-circuit, compatibility contract
  versioning policy (`sinapse-current.yaml`). PR #52.
- **Story 10.19** — Coverage floor ratchet (jest.config.js policy
  comment + 23/21/23/25 floors) and story-meta linter
  (`scripts/validate-story-meta.js`). PR #53.
- **Story 10.20** — Install upsert idempotente in `bin/cli.js`:
  `syncDirSync`, `detectExistingInstall`, `--force` escape hatch.
  Re-running install preserves `installedAt` and reuses prior
  language/LLM choices. PR #54.
- **Story 10.21** — `npx sinapse-ai doctor` wired into the canonical
  CLI with `--fix`, `--dry-run`, `--json`, `--quiet`, `--deep`,
  `--help` flags. Mirrors legacy `bin/sinapse.js` wiring but uses
  `process.exitCode` for clean stdout flush. PR #55.
- **Story 10.22** — Update upsert idempotente: `cmdUpdateGlobal`
  reuses settings, calls `syncDirSync`, preserves `installedAt`,
  prints "Update complete" summary mirroring 10.20 install upsert. PR #56.
- **Story 10.23** — Squad allow-list cleanup. 5 of 6 pre-existing
  fork attribution files rewritten in authorial voice; the 6th
  (`skill-craftsman.md`) kept as permanent allow-list entry with
  documented rationale. PR #57.
- **Story 10.25** — Coverage Report Summary script
  (`scripts/coverage-report-summary.js`) replaces the no-op CI step;
  emits a Markdown table to `$GITHUB_STEP_SUMMARY` so PR reviewers
  see coverage at a glance. PR #59.
- **Story 10.28** — Squad orqx activation verification
  (`scripts/validate-squad-orqx.js`) covering 21 squad orchestrators
  across 4 distinct file formats. Companion to the existing
  `validate-agents.js` for core framework agents. PR #61.
- **Story 10.29** — Release readiness aggregator
  (`scripts/release-readiness.js`) wraps every validator built
  throughout Epic 10.0 into one pre-release report. PR #62.
- **Story 10.31** — Surgical README polish: CLI Reference now matches
  the canonical command surface, badges include test count and
  Constitution. PR #64.
- **Story 10.32** — This release prep: bump to 10.0.0-rc.1 +
  CHANGELOG entry summarizing all of Phase 0 + Phase 1.

### Fixed

- **Story 10.24** — Registry write idempotency. Changed
  `_writeRegistry` from `sortKeys: false` to `sortKeys: true`. Two
  writes of the same data now produce byte-identical files,
  eliminating the recurring `M entity-registry.yaml` churn that
  polluted git status throughout cycles 1-2. PR #58.
- **Story 10.27** — Pre-commit manifest auto-regen. The IDS
  post-commit hook now also regenerates `install-manifest.yaml`
  after any `.sinapse-ai/` change, and `generate-install-manifest.js`
  no longer writes a non-deterministic `generated_at` timestamp
  into the file body. The recurring "manifest outdated" warning
  is gone. PR #60.

### Changed

- **Story 10.30** — `sinapse-minimal` and `sinapse-graph` removed
  from `package.json` `bin`. The .js files stay for one release
  cycle as direct-node fallbacks, then are deleted entirely in
  v11. The canonical surface is now exactly two binaries:
  `sinapse` (legacy router) and `sinapse-ai` (canonical CLI). PR #63.

### Quality Metrics

- Tests: 10599 → 10729 (+130 across cycles 1-5, 0 regressions)
- Coverage actual: statements 34.9%, branches 32.47%, lines 35.03%,
  functions 37.73% (all above the 23/21/23/25 ratchet floors)
- Working tree determinism: every commit converges to clean state
- CI: 32-33 checks pass per PR (the only "fail" is the standalone
  CodeQL standalone scan unrelated to PR content)
- Allow-list shrunk from 6 → 1 permanent entry
- 6 new validators / scripts in production

### Breaking Changes

None. v10.0.0-rc.1 is fully backward-compatible with 9.x. The only
removal (`sinapse-minimal` / `sinapse-graph` bin entries) is for
binaries that have been deprecated since v3.11.1 with runtime
warnings.

---

## [6.0.0] - 2026-03-25

### Breaking Changes
- Standardized agent IDs to full names: `developer`, `quality-gate`, `project-lead`, `product-lead`, `sprint-lead`
- Unified orchestrator naming to `sinapse-orqx`
- Wizard simplified: PT-BR only, single LLM question, auto-detect everything
- Removed Spanish (ES) and Chinese (ZH) language support
- Only 19 orqx agents visible as commands (specialist agents are backend-only)

### Added
- Immersive SINAPSE AI welcome screen with ASCII art banner
- Auto-detection of project type (greenfield/brownfield/upgrade)
- Auto-detection of tech preset from project files
- LLM selection: Claude Code / Codex CLI / Both
- 19 global agent definitions installed to ~/.claude/agents/
- 18 orqx command files in .claude/commands/SINAPSE/agents/

### Changed
- Default language hardcoded to Portuguese (PT-BR)
- Installation wizard reduced to 1 interactive question
- CODEOWNERS updated to @caioimori & @eusoier
- Welcome banner updated to SINAPSE AI branding

### Removed
- All legacy external references cleaned from codebase
- Spanish (docs/es/) and Chinese (docs/zh/) documentation
- 11 core agent commands (dev, qa, pm, po, sm, etc.) — now backend-only
- Language selection from wizard (hardcoded PT-BR)
- User profile selection from wizard (hardcoded Quick Mode)
- Project type selection from wizard (auto-detected)
- Tech preset selection from wizard (auto-detected)

### Security
- LICENSE updated with complete MIT copyright chain
- Zero external references in codebase (verified via automated scan)

## [4.2.11] - 2026-02-16

### Added

- Squad agent commands are now automatically installed to active IDEs during pro scaffolding (`installSquadCommands`).
- Supports Claude Code (`.claude/commands/{squad}/`), Codex CLI (`.codex/agents/`), Gemini CLI (`.gemini/rules/{squad}/`), and Cursor (`.cursor/rules/`).
- Installed files are tracked in `pro-installed-manifest.yaml` and `pro-version.json`.

## [4.2.10] - 2026-02-16

### Fixed

- Handle `ALREADY_ACTIVATED` license status gracefully instead of throwing error.
- Fix error envelope parsing in pro license client — correctly extracts error messages from API responses.

## [4.2.9] - 2026-02-16

### Fixed

- Pass `targetDir` correctly to `runProWizard` — fixes pro install failing in non-CWD projects.
- Surface pro install errors to user instead of silently swallowing them.

## [4.2.8] - 2026-02-16

### Fixed

- Exclude `mmos-squad` (private) from pro scaffolding via `SCAFFOLD_EXCLUDES`.
- Merge `pro-config.yaml` sections into `core-config.yaml` during pro install (`mergeProConfig`).

## [4.2.7] - 2026-02-16

### Fixed

- Pro wizard (`npx sinapse-ai install`) now auto-installs `@sinapse-fullstack/pro` package during Step 2, fixing "Pro package not found" error in greenfield and brownfield projects.
- Greenfield projects without `package.json` now get `npm init -y` automatically before pro install.
- Removed unused `headings` import in `pro-setup.js`.

## [Unreleased]

### Added

- `docs/glossary.md` with official SINAPSE taxonomy terms:
  - `squad`
  - `flow-state`
  - `confidence gate`
  - `execution profile`
- `scripts/semantic-lint.js` for semantic terminology regression checks.
- `tests/unit/semantic-lint.test.js` for semantic lint rule validation.

### Changed

- CI now includes a `Semantic Lint` job (`npm run validate:semantic-lint`).
- Pre-commit markdown pipeline now runs semantic lint through `lint-staged`.

### Migration Notes

- Deprecated terminology replacements:
  - `expansion pack` -> `squad`
  - `permission mode` -> `execution profile`
  - `workflow state` -> `flow-state` (warning-level migration)

---

## [3.9.0] - 2025-12-26

### Highlights

This release introduces **Squad Continuous Improvement** capabilities with analyze and extend commands, plus a massive codebase cleanup removing 116K+ lines of deprecated content.

### Added

#### Story SQS-11: Squad Analyze & Extend
- **`*analyze-squad` command** - Analyze squad structure, coverage, and get improvement suggestions
- **`*extend-squad` command** - Add new components (agents, tasks, workflows, etc.) incrementally
- **New Scripts:**
  - `squad-analyzer.js` - Inventory and coverage analysis
  - `squad-extender.js` - Component creation with templates
- **8 Component Templates:**
  - `agent-template.md`, `task-template.md`, `workflow-template.yaml`
  - `checklist-template.md`, `template-template.md`
  - `tool-template.js`, `script-template.js`, `data-template.yaml`
- **New Tasks:**
  - `squad-creator-analyze.md`
  - `squad-creator-extend.md`

### Changed

#### Story TD-1: Tech Debt Cleanup
- Fixed ESLint warnings in 5 core files
- Removed 284 deprecated files (~116,978 lines deleted)
- Cleaned `.github/deprecated-docs/` directory
- Removed obsolete backup files

### Fixed
- ESLint `_error` variable warnings in test utilities
- Context loader error handling improvements

---

## [3.8.0] - 2025-12-26

*Previous release with WIS and SQS features.*

---

## [2.2.3] - 2025-12-22

### Highlights

This release marks the **Open-Source Community Readiness** milestone, preparing SINAPSE for public contribution while introducing the **Squad System** for extensibility.

### Added

#### Epic OSR: Open-Source Community Readiness (10 Stories)

- **Legal Foundation** (OSR-3)
  - `PRIVACY.md` / `PRIVACY-PT.md` - Privacy policies (EN/PT)
  - `TERMS.md` / `TERMS-PT.md` - Terms of use (EN/PT)
  - `CODE_OF_CONDUCT.md` - Community guidelines with contact info

- **Community Process** (OSR-6)
  - Feature request templates and triage process
  - Issue labeling standards

- **Public Roadmap** (OSR-7)
  - Public roadmap documentation
  - Community visibility into planned features

- **Squads Guide** (OSR-8)
  - Comprehensive guide for creating community squads
  - Examples and best practices

- **Rebranding to SINAPSE** (OSR-9)
  - Brand investigation complete
  - Namespace updated to SinapseAI

- **Release Checklist** (OSR-10)
  - GitHub configuration validated
  - CodeQL security scanning active (30+ alerts addressed)
  - Branch protection rules configured
  - Smoke test passed on clean clone

#### Epic SQS: Squad System Enhancement (Sprint 7)

- **Squad Designer Agent** (SQS-9)
  - New `@squad-creator` agent for guided squad creation
  - Interactive wizard with `*create-squad` command
  - AI-powered naming and structure suggestions

- **Squad Loader Utility** (SQS-2)
  - Local squad resolution from `./squads/` directory
  - Simplified loading without complex caching

- **Squad Validator + Schema** (SQS-3)
  - JSON Schema for squad manifest validation
  - `*validate-squad` command for compliance checking

- **Squad Creator Tasks** (SQS-4)
  - `*create-squad` - Interactive squad creation
  - `*validate-squad` - Manifest validation
  - `*list-squads` - Local squad discovery

#### Infrastructure & Documentation

- **Documentation Integrity System** (6.9)
  - Automated cross-reference validation
  - Link checking in CI pipeline

- **MCP Governance Consolidation** (6.14)
  - Unified MCP configuration rules
  - `.claude/rules/mcp-usage.md` guidance

- **Agent Config Path Fix** (6.15)
  - Resolved path resolution issues across platforms

- **Scripts Path Consolidation** (6.16)
  - Standardized script locations under `.sinapse-ai/scripts/`

- **Semantic Release Automation** (6.17)
  - Automated versioning on merge to main
  - Conventional commit parsing
  - Automatic CHANGELOG generation

- **Agent Command Rationalization** (Story 6.1.2.3)
  - Command consolidation: `sinapse-orqx` 44→30 commands (32% reduction)
  - Command consolidation: `data-engineer` 31→28 commands (9.7% reduction)
  - New consolidated tasks: `security-audit`, `analyze-performance`, `test-as-user`, `setup-database`
  - Migration guide: `docs/guides/command-migration-guide.md`
  - Agent selection guide: `docs/guides/agent-selection-guide.md`

- **Dynamic Project Status Context** (Story 6.1.2.4)
  - Git branch, modified files, and recent commits shown in agent greetings
  - Current story and epic detection from `docs/stories/`
  - 60-second cache mechanism (<100ms first load, <10ms cached)
  - Cross-platform support (Windows/Linux/macOS)

### Changed

- **Agent Delegation Guidance** - All agents now include "NOT for" sections in `whenToUse`
- **PR Title Format** - DevOps `*create-pr` now generates Conventional Commits format titles
- **Scripts Location** - Consolidated under `.sinapse-ai/scripts/` for consistency
- **MCP Configuration** - Unified rules in `.claude/rules/mcp-usage.md`

### Fixed

- **Agent Config Paths** (6.15) - Resolved path resolution issues on Windows
- **Script References** (6.16) - Fixed broken script imports across agents

### Security

- **CodeQL Scanning** - Active with 30+ alerts reviewed
- **Branch Protection** - Enabled on main (1 approver, dismiss stale reviews)

### Documentation

- **Squads Guide** - Complete guide for community squad creation
- **Feature Process** - Templates and triage workflow documented
- **Public Roadmap** - Community visibility into planned features
- **Legal Documents** - Privacy policy, Terms of Use (EN/PT)

---

## [4.32.0] - 2025-11-12

### Removed
- **Private squads** - Moved to separate private repository (`sinapse-squads`)
  - Removed `squads/creator/` (CreatorOS)
  - Removed `squads/innerlens/`
  - Removed `squads/mmos-mapper/`
  - Removed `squads/sinapse-infrastructure-devops/`
  - Removed `squads/meeting-notes/`
  - Repository: https://github.com/SinapseAI/sinapse-squads (PRIVATE)
- **Internal development tools** - Moved to separate private repository (`sinapse-dev-tools`)
  - Removed analysis scripts: `analyze-batches.js`, `analyze-decision-patterns.js`, `analyze-epic3.js`, etc.
  - Removed consolidation scripts: `consolidate-entities.js`, `consolidate-results.js`, etc.
  - Removed extraction scripts: `extract-all-claude-backups.js`, `extract-claude-history.js`
  - Removed generation scripts: `generate-entity-summary.js`, `generate-entity-table.js`
  - Repository: https://github.com/SinapseAI/sinapse-dev-tools (PRIVATE)
- **hybrid-ops squad** - Moved to separate repository for independent maintenance
  - Removed `squads/hybrid-ops/` directory
  - Removed `.hybrid-ops/` directory
  - Updated `core-config.yaml` to reference external repository
  - Updated `install-manifest.yaml` (removed 47 file entries)
  - Repository: https://github.com/SinapseAI/sinapse-hybrid-ops

### Changed
- README.md - hybrid-ops now listed under "Squads Externos"
- Squad can now be installed independently via GitHub
- **Squad naming convention** - Applied consistent `{agent-id}-` prefix to agent-specific tasks across all 6 squads
  - ETL pack: 4 tasks renamed (youtube-specialist, social-specialist, web-specialist)
  - Creator pack: 4 tasks already renamed (pre-existing migration)
  - Innerlens pack: 4 tasks renamed (fragment-extractor, psychologist, quality-assurance)
  - Mmos-mapper pack: 7 tasks renamed (cognitive-analyst, research-specialist, system-prompt-architect, emulator, mind-pm)
  - Sinapse-infrastructure-devops pack: 2 tasks already renamed (pre-existing)
  - Meeting-notes pack: 1 task already renamed (pre-existing)
  - All agent dependencies updated to reference new task names
  - Shared tasks correctly have NO prefix (conservative approach)

### Technical
- Story: 4.6 - Move Hybrid-Ops to Separate Repository
- Breaking Change: hybrid-ops no longer bundled with sinapse-ai
- Migration: Users can install from external repo to `squads/hybrid-ops/`
- Story: 4.7 - Removed `squads/hybrid-ops.legacy/` directory (legacy backup no longer needed)
- Story: 4.5.3 - Squads Naming Convention Migration
  - Applied naming convention from Story 4.5.2 to all 6 squads
  - Total: 15 tasks renamed (11 new + 4 pre-existing)
  - 18 agent files updated with new dependencies
  - Validation: 100% compliance, 0 broken references

## [4.31.1] - 2025-10-22

### Added
- NPX temporary directory detection with defense-in-depth architecture
- PRIMARY detection layer in `tools/sinapse-npx-wrapper.js` using `__dirname`
- SECONDARY fallback detection in `tools/installer/bin/sinapse.js` using `process.cwd()`
- User-friendly help message with chalk styling when NPX temp directory detected
- Regex patterns to identify macOS NPX temporary paths (`/private/var/folders/.*/npx-/`, `/.npm/_npx/`)
- JSDoc documentation for NPX detection functions

### Fixed
- NPX installation from temporary directory no longer attempts IDE detection
- Clear error message guides users to correct installation directory
- Prevents confusion when running `npx sinapse-ai install` from home directory

### Changed
- Early exit with `process.exit(1)` when NPX temporary context detected
- Help message provides actionable solution: `cd /path/to/your/project && npx sinapse-ai install`

### Technical
- Story: 2.3 - NPX Installation Context Detection & Help Text (macOS)
- Defense in depth: Two independent detection layers provide redundancy
- macOS-specific implementation (other platforms unaffected)
- Non-breaking change (patch version)

## [4.31.0] - Previous Release

*(Previous changelog entries to be added)*
