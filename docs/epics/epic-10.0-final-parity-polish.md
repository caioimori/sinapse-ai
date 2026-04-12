# Epic 10.0: Final Parity & Professional Polish

> **Status:** InProgress
> **Version Target:** v10.0.0
> **Created:** 2026-04-05
> **Owner:** Imperator (sinapse-orqx)
> **Scope:** Claude Code + Codex CLI | PT + EN | Open-source ready
> **Branch:** caio/feat/epic-10-final-parity
> **Complexity:** COMPLEX (~12 stories, 5 phases)

---

## Objective

Achieve professional installer maturity with Claude Code + Codex as supported targets. Deliver idempotent install, self-repair diagnostics (doctor), cross-IDE parity validation, and comprehensive quality gates. Final polish pass before v10.0.0 release.

## Constraints

- **IDEs:** Claude Code + Codex CLI only (remove .gemini/, .cursor/, .antigravity/)
- **Languages:** Portuguese (primary) + English
- **Preservation:** All 18 squads, 186 agents, 1,430 tasks remain UNTOUCHED
- **Identity:** 100% original. Zero mentions of competing frameworks.
- **Quality:** All quality gates must pass before publish.

---

## Phase 1: Cleanup & Structure (prerequisite)

### Story 10.1: IDE Artifact Cleanup
- [ ] Remove .gemini/ directory completely
- [ ] Remove .cursor/ directory completely
- [ ] Remove .antigravity/ directory completely
- [ ] Clean IDE sync scripts (remove references to unsupported IDEs)
- [ ] Verify only Claude Code + Codex configurations remain

### Story 10.2: Documentation Reorganization
- [ ] Reorganize docs/ folder structure
- [ ] Ensure consistent naming conventions across docs/
- [ ] Remove outdated or duplicate documentation files
- [ ] Update cross-references between docs

### Story 10.3: Legacy Reference Cleanup
- [ ] Grep for remaining competing framework references
- [ ] Remove or replace any found references
- [ ] Clean commit messages visible on GitHub (touch affected files)
- [ ] Verify zero competing framework refs on GitHub page

---

## Phase 2: Quality Gates Module (after Phase 1)

### Story 10.4: Quality Gates 3-Layer System
- [ ] Create core/quality-gates/ directory structure
- [ ] Implement Layer 1: Pre-commit gates (lint, typecheck, secret scan)
- [ ] Implement Layer 2: Pre-push gates (tests, coverage threshold)
- [ ] Implement Layer 3: Pre-deploy gates (full security checklist)
- [ ] Document quality gates in docs/

### Story 10.5: Quality Gate Integration
- [ ] Integrate quality gates with existing hook system
- [ ] Add gate bypass mechanism for emergencies (with audit trail)
- [ ] Verify gates work in CI pipeline
- [ ] Test gate failure and recovery flows

---

## Phase 3: Testing & CI (parallel with Phase 2)

### Story 10.6: Backward Compatibility Tests
- [ ] Create comprehensive backward compat test suite
- [ ] Test agent definition schema stability
- [ ] Test task definition schema stability
- [ ] Test installer backward compatibility
- [ ] Verify no breaking changes from v9.x

### Story 10.7: Codecov Integration & Coverage
- [ ] Configure Codecov reporting in CI
- [ ] Add coverage badges to README
- [ ] Set minimum coverage thresholds
- [ ] Verify coverage reports on PRs

### Story 10.8: Hook Parity Table
- [ ] Document all hooks with parity table (Claude Code vs Codex)
- [ ] Identify and fix any hook gaps between IDEs
- [ ] Verify all constitutional hooks work in both environments
- [ ] Update hook-governance.md with parity status

---

## Phase 4: README & Polish (after Phase 1)

### Story 10.9: Professional README Rewrite
- [ ] Badge strip (npm version, license, node, CI, coverage, docs)
- [ ] Aspirational tagline and value proposition
- [ ] "10-Minute Quick Start" with binary success criteria
- [ ] Intent-based navigation ("What would you like to do?")
- [ ] Terminal output examples (install, doctor, agent greeting)
- [ ] IDE matrix (Claude Code + Codex)
- [ ] Agent table (12 core + 18 squads overview)
- [ ] Legal/governance table
- [ ] ~500-750 lines, polished, bilingual (PT primary + EN)

### Story 10.10: Agent Activation Verification
- [ ] Verify all 12 core agents activate correctly
- [ ] Verify all 18 squad orchestrators respond to @mention
- [ ] Document any activation issues found
- [ ] Fix agent loading/greeting for any broken agents

### Story 10.11: sinapse-minimal.js
- [ ] Create sinapse-minimal.js for lightweight installations
- [ ] Include only essential core (agents, tasks, hooks)
- [ ] Exclude squads, pro/, advanced features
- [ ] Document minimal vs full installation in README

---

## Phase 5: QA & Publish (final)

### Story 10.12: Final QA Gate & Release
- [ ] Run full QA gate on all changes
- [ ] Run npm test, lint, typecheck — all passing
- [ ] Run security scan (secret scanning, dependency audit)
- [ ] CodeRabbit review on final PR
- [ ] Push, create PR, merge to main
- [ ] Tag v10.0.0, publish to NPM
- [ ] Verify published package installs correctly

---

## Phase Summary

| Phase | Stories | Focus | Parallel? |
|-------|---------|-------|-----------|
| 1 | 10.1-10.3 | Cleanup & Structure | First (prerequisite) |
| 2 | 10.4-10.5 | Quality Gates Module | Yes (after Phase 1) |
| 3 | 10.6-10.8 | Testing & CI | Yes (after Phase 1) |
| 4 | 10.9-10.11 | README & Polish | Yes (after Phase 1) |
| 5 | 10.12 | QA & Publish | After Phases 1-4 |

**Total: 12 stories | 5 phases | ~3 sprints if parallel**
