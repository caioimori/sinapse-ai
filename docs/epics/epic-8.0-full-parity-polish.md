# Epic 8.0: SINAPSE-AI Full Parity & Polish

> **Status:** In Progress
> **Version Target:** v8.0.0
> **Created:** 2026-04-04
> **Owner:** Imperator (sinapse-orqx)
> **Scope:** Claude Code + Codex CLI | PT + EN | Open-source ready
> **Complexity:** COMPLEX (~19 stories, 5 phases)

---

## Objective

Close all framework gaps, polish public-facing infrastructure, and establish SINAPSE-AI as a professional open-source project ready for community adoption. Zero external references to competing frameworks. 100% original identity.

## Constraints

- **IDEs:** Claude Code + Codex CLI only (no Gemini, Cursor, Copilot)
- **Languages:** Portuguese (primary) + English
- **Preservation:** All 18 squads, 186 agents, 1,430 tasks remain UNTOUCHED
- **Approach:** Pragmatic (no git history rewrite). New commits on affected files replace old commit messages on GitHub.
- **Identity:** 100% original. Zero mentions of competing frameworks.
- **Meta-Agent:** REJECTED. SINAPSE governance (Constitution + hooks) is architecturally superior to prompt-based self-modification.

---

## Phase 1: Identity & Foundation (prerequisite)

### Story 8.1: Identity Purge & Persona Consistency
- [x] Rename @product-lead persona from "Pax" to "Axis" (approved)
- [x] Update .claude/CLAUDE.md (project) with correct persona names: Pixel, Litmus, Stratum, Beacon, Axis, Sync, Scope, Tensor, Mosaic, Pipeline, Imperator, Loom
- [x] Update ~/.claude/CLAUDE.md (global) with correct persona names
- [x] Update ALL rules referencing old persona names (agent-authority, mandatory-delegation, security-data-protection, mcp-usage)
- [x] Clean CHANGELOG.md — remove competing framework references
- [x] Clean docs/orqx-plan.md — rewritten to remove all competing refs
- [x] Touch ALL config files showing old rebrand commits on GitHub (.prettierrc, .releaserc.json, eslint.config.js, jest.config.js, tsconfig.json)
- [x] Grep entire repo for remaining competing framework refs (only LICENSE MIT chain remains — legally required)
- [ ] Verify: zero competing framework references visible on GitHub page

### Story 8.2: Rules Path Frontmatter Optimization
- [x] Add paths: frontmatter to agent-memory-imports.md
- [x] Add paths: frontmatter to coderabbit-integration.md
- [x] Add paths: frontmatter to ids-principles.md
- [x] Add paths: frontmatter to story-lifecycle.md
- [x] Add paths: frontmatter to tool-response-filtering.md
- [x] Add paths: frontmatter to security-scanning.md
- [x] Verify rules only load when working on matching paths
- [x] Estimated token savings: 15-20% per prompt

### Story 8.3: PR Template Professional Upgrade
- [x] Add Security section (3 checkboxes: reviewed for vulns, no new issues, no sensitive data)
- [x] Add Quality Gates table (Lint/TypeCheck/Tests/Coverage/CodeRabbit status)
- [x] Add CodeRabbit severity gate instructions
- [x] Add Art. X pre-deploy reminder
- [x] Add Story reference (required field)
- [x] Bilingual (PT primary + EN section names)

---

## Phase 2: CI/CD Pipeline Expansion (parallel with Phase 3 & 4)

### Story 8.4: CodeQL SAST Workflow
- [x] Create .github/workflows/codeql.yml
- [x] Languages: javascript-typescript + actions
- [x] Triggers: push main, PR to main, weekly Monday 06:00
- [x] Permissions: security-events: write
- [ ] Verify: first scan completes successfully

### Story 8.5: CI Pipeline Enhancement
- [x] Add path-based job skipping (dorny/paths-filter)
- [x] Add story checkbox validation job
- [x] Add brownfield install test job (simulates npm install in /tmp)
- [x] Add compatibility parity gate (Claude + Codex sync check)
- [x] Add concurrency groups with cancel-in-progress
- [x] Verify: docs-only PRs skip code jobs

### Story 8.6: Community Automation Workflows
- [x] Create welcome.yml (first PR/issue greeting)
- [x] Create stale.yml (30d issues, 45d PRs, exempt P1/in-progress)
- [x] Create pr-labeling.yml (auto-label by path: agents, tests, squads, docs)
- [ ] Create issue-labeler.yml (auto-label by body content)
- [x] Configure dependabot.yml (npm + actions, weekly Monday 9am BRT)

### Story 8.7: Quarterly Gap Audit Workflow
- [x] Create quarterly-gap-audit.yml (quarterly + manual dispatch)
- [x] Parse: agents, tasks, templates, tools, workflows
- [x] Validate tool references and cross-references
- [x] Generate trend report artifact
- [x] Auto-create GitHub issue with findings

### Story 8.8: Semantic Release + Husky Security Backstop
- [x] Create semantic-release.yml (workflow_dispatch, Conventional Commits)
- [x] Create .husky/pre-commit: framework-guard + secret-scan
- [x] Create .husky/pre-push: manifest validation
- [x] Verify: defense-in-depth (host-level backup of Claude Code hooks)

---

## Phase 3: External Security (parallel with Phase 2 & 4)

### Story 8.9: Ed25519 Manifest Signing
- [x] Implement manifest-signature.js (Ed25519 via Node crypto)
- [x] Public key pinned in source code (not loaded from files)
- [x] Verify signature BEFORE YAML parse
- [x] Path traversal prevention (../, absolute paths, null bytes)
- [x] DoS protection (max 10MB, 50K files, 50 dir levels)
- [ ] Symlink rejection
- [x] YAML FAILSAFE_SCHEMA for parsing
- [ ] Integrate into installer flow

### Story 8.10: Security Test Suite
- [x] Create tests/security/secret-scanning.test.js (20+ patterns)
- [x] Create tests/security/hook-security.test.js (fail-open verification)
- [x] Create tests/security/path-traversal.test.js
- [x] Create tests/security/manifest-signing.test.js
- [ ] Achieve min 80% coverage on security hooks
- [ ] All tests pass: npm test

### Story 8.11: Security Documentation
- [x] Create SECURITY.md (root) — responsible disclosure, 48h ack SLA, 30d fix SLA, safe harbor
- [x] Create docs/security.md (EN) — how SINAPSE handles secrets, MCP trust model, agent boundaries
- [x] Create docs/pt/security.md (PT) — same content
- [x] Create .sinapse-ai/data/rls-security-patterns.md (standalone reference)

---

## Phase 4: Public Documentation & Community (parallel with Phase 2 & 3)

### Story 8.12: Community Infrastructure
- [x] Create CONTRIBUTING.md (fork model, agent/squad/task contributions, branch naming, commit format)
- [x] Create CODE_OF_CONDUCT.md (Contributor Covenant v2.1 adapted)
- [x] Create .github/ISSUE_TEMPLATE/1-bug-report.yml
- [x] Create .github/ISSUE_TEMPLATE/2-feature-request.yml
- [x] Create .github/ISSUE_TEMPLATE/3-squad-proposal.md
- [x] Create .github/ISSUE_TEMPLATE/config.yml
- [x] Create .github/DISCUSSION_TEMPLATE/ (ideas, Q&A, show-and-tell, troubleshooting)
- [ ] Enable GitHub Discussions

### Story 8.13: Legal Documentation
- [x] Create docs/legal/privacy.md (politica de privacidade, LGPD aligned)
- [x] Create docs/legal/terms.md (termos de uso)
- [x] Create docs/legal/license-clarification.md (MIT core, Pro proprietary, upstream attribution chain)
- [ ] Bilingual (PT + EN versions)

### Story 8.14: README Professional Rewrite
- [ ] Badge strip (npm version, license, node, CI, docs)
- [ ] Aspirational tagline (not just agent count)
- [ ] "10-Minute Quick Start" with binary success criteria
- [ ] "What would you like to do?" intent-based navigation
- [ ] Terminal output examples (install, doctor, agent greeting)
- [ ] IDE matrix (Claude Code + Codex)
- [ ] Agent table (12 core + 18 squads overview)
- [ ] Legal/governance table
- [ ] Contributor recognition section
- [ ] ~500-750 lines, polished, bilingual (PT primary + EN)

### Story 8.15: Public Guides
- [x] Create docs/guiding-principles.md (framework philosophy)
- [x] Create docs/feature-process.md (how to propose features)
- [x] Create docs/architecture-overview.md (with ASCII diagram)
- [x] Create docs/guides/agent-reference.md (navigable index of all agents)
- [x] Create docs/guides/workflows-overview.md (4 primary workflows, visual)

### Story 8.16: Getting Started Rewrite
- [x] "10-Minute First-Value" path (install -> agent -> command -> verify)
- [x] Inline troubleshooting
- [x] Greenfield vs Brownfield paths
- [ ] IDE-specific activation (Claude Code + Codex)
- [ ] Binary PASS/FAIL criteria

---

## Phase 5: Quality & Testing Enhancement (after Phases 1-3)

### Story 8.17: Agent Backward Compatibility Tests
- [x] Create tests/agents/backward-compatibility.test.js
- [x] Validate: schema, required fields, persona format for all 12 core agents
- [x] Ensure agent definitions don't break between releases

### Story 8.18: Pipeline Benchmarks + Codecov
- [x] Create tests/benchmarks/pipeline-benchmark.test.js
- [x] Integrate Codecov (badge + bot comment on PRs) -- already configured in ci.yml (codecov/codecov-action@v4)
- [ ] Add coverage badge to README

### Story 8.19: Collaboration Hardening
- [x] Update CODEOWNERS with explicit security paths
- [x] Protect: .sinapse-ai/core/, constitution, hooks, rules
- [x] Protect: squads/squad-cybersecurity/ explicitly
- [x] Caio (@caioimori) as lead maintainer
- [x] Soier (@Matheus-soier) as co-maintainer
- [x] Verify: branch protection rules active on main

---

## Phase Summary

| Phase | Stories | Focus | Parallel? |
|-------|---------|-------|-----------|
| 1 | 8.1-8.3 | Identity & Foundation | First (prerequisite) |
| 2 | 8.4-8.8 | CI/CD Pipeline | Yes (after Phase 1) |
| 3 | 8.9-8.11 | External Security | Yes (after Phase 1) |
| 4 | 8.12-8.16 | Public Docs & Community | Yes (after Phase 1) |
| 5 | 8.17-8.19 | Quality & Testing | After Phases 1-3 |

**Total: 19 stories | 5 phases | ~4 sprints if parallel**

---

## Meta-Agent Decision

**REJECTED.** Research concluded that competing framework's "Meta-Agent" is prompt-based self-modification (LLM edits own prompts), not autonomous improvement. SINAPSE's approach — deterministic Constitution + hooks + story-driven evolution — is architecturally superior. If self-improvement is desired later, build a metrics-driven suggestion engine that proposes stories, not an agent that edits its own definitions.
