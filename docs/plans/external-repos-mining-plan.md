# External Repos Mining Plan — claude-code-best-practice + claude-mem

> **Plan ID:** EXT-MINING-V1
> **Author:** @sinapse-orqx (Imperator)
> **Created:** 2026-04-12
> **Status:** PROPOSAL — awaiting maintainer approval to execute
> **Companion epic stub:** `docs/epics/epic-external-mining-v1.md` (created alongside this plan)

---

## 0. Purpose

This plan defines how to systematically mine two external Claude-related repositories for content, patterns and capabilities that could strengthen SINAPSE — without polluting the framework with low-signal noise or licence-incompatible material.

The plan does **not** execute extraction. It defines the analysis, governance, and decision pipeline that a future session would run.

---

## 1. Target Repositories

### 1.1 shanraisshan/claude-code-best-practice

**URL:** https://github.com/shanraisshan/claude-code-best-practice
**Inferred from name:** A community-curated collection of patterns and conventions for working with Claude Code (Anthropic's CLI / IDE assistant).

#### Hypotheses of Value

1. **Prompt patterns** — battle-tested system prompt structures and instructional patterns that other operators use with Claude Code daily
2. **Hooks and slash commands** — community-contributed hooks for `pre-commit`, `pre-push`, `session-start`, etc., that may improve our existing `.claude/hooks/`
3. **Settings and configuration** — model routing rules, context management patterns, MCP configurations
4. **Workflow patterns** — multi-agent orchestration recipes, specifically how others structure their `@agent` invocations
5. **Anti-patterns and footguns** — documented mistakes to avoid (this is high-leverage because it shortcuts our own learning curve)

#### Extraction Criteria (qualifies as "bring to SINAPSE")

- Concrete and copy-pastable (not abstract advice)
- Compatible with our 18-squad orchestration model (or adaptable with minimal change)
- Adds capability that we don't already have (cross-reference required against `squads/squad-claude/` and `claude-code-mastery/`)
- Has clear MIT/Apache/CC0 licence allowing use + redistribution
- Pattern that survives a "is this a real signal or just one person's preference?" test

#### Rejection Criteria (do NOT bring)

- Patterns that conflict with SINAPSE constitutional articles (especially Article III Documentation-First, Article VIII Mandatory Delegation)
- Abstract opinions without working examples
- Patterns tied to a specific tech stack we don't use
- Anything requiring a paid third-party service we don't already have
- Hooks that override our existing safe-collaboration / push-authority enforcement

#### Risks

- **Sobreposição com squad-claude** — squad-claude already exists with 8 agents and 26 tasks. Most of what this repo offers may already be there. Cross-reference is essential.
- **Tone and voice mismatch** — community advice tends to be informal/incomplete; SINAPSE canon is structured/comprehensive. Direct copy would dilute our standards.
- **Licence ambiguity** — many community repos have no LICENSE file, which legally means "all rights reserved".

### 1.2 thedotmack/claude-mem

**URL:** https://github.com/thedotmack/claude-mem
**Inferred from name:** A memory system for Claude — likely a hooks/middleware approach to giving Claude persistent memory across sessions.

#### Hypotheses of Value

1. **Memory architecture** — how the author structures persistent memory (file-based, vector store, hybrid?)
2. **Compaction strategies** — rules for what to remember vs forget over time
3. **Retrieval patterns** — how memory is recalled at session start (auto-injection, query-on-demand, hybrid?)
4. **Cross-session continuity** — handoff protocols similar to our `agent-handoff.md` rules
5. **Schema and storage format** — file layouts, JSON/YAML schemas, naming conventions

#### Extraction Criteria

- Mechanisms that complement (not duplicate) our existing memory layer:
  - `.sinapse-ai/development/agents/{id}/MEMORY.md` (per-agent memory)
  - `~/.claude/projects/.../memory/` (per-project auto-memory)
  - Vault grounding hook (`vault-grounding.cjs`)
- Memory governance patterns: what to keep, what to forget, how to verify
- Privacy-respecting designs (memory should not silently exfiltrate context to external services)
- Concrete schemas and code, not abstract architecture diagrams

#### Rejection Criteria

- Designs requiring vendor lock-in (specific vector DB, specific cloud)
- Memory that bypasses our Article X Security & Data Protection (ex: silent telemetry)
- Memory that contradicts the "Memory as hints, not ground truth" principle in CLAUDE.md
- Anything that conflicts with the vault-grounding flow Caio depends on

#### Risks

- **Conflict with vault-grounding** — User's external memory source (e.g. Obsidian vault) is the canonical memory source. A second memory system could create confusion or contradiction.
- **Conflict with agent-handoff protocol** — we already have a 379-token handoff template. A different memory schema could fragment the system.
- **Security exposure** — memory systems often have weak access controls; need to validate before adopting any storage layer.

---

## 2. Analysis Process (Sequenced)

### Phase 0 — Pre-flight (5 minutes)

- Verify current network access from sandbox
- Confirm git is available
- Confirm `git clone` from public github URLs works without auth

### Phase 1 — Clone and Map (15 minutes)

```
Workspace dir: C:\Users\Caio Imori\Workspace\external-reference\
  ├── claude-code-best-practice/   (cloned)
  └── claude-mem/                  (cloned)
```

For each repo, capture:
- `tree -L 3` or equivalent directory listing
- `README.md` full text
- `LICENSE` file (CRITICAL — extraction blocked if missing or restrictive)
- `package.json` / `pyproject.toml` / `setup.py` (dependencies, language, scope)
- `.claude/`, `hooks/`, `commands/`, `prompts/` if present
- Any `examples/`, `templates/`, `patterns/` directories
- Last commit date + commit count (signal of active maintenance)

### Phase 2 — Analyst Cataloging (@analyst Scope)

Delegate to `@analyst (Scope)`. Output: `docs/research/external-mining-catalog.md` (gitignored workspace artifact). Catalog format per repo:

```yaml
repo: shanraisshan/claude-code-best-practice
license: ...
last_commit: ...
maintenance_signal: active|stale|abandoned
features_catalogued:
  - feature_id: cmd-pre-commit-1
    type: hook|pattern|command|prompt|workflow
    location: path/to/file
    description: "..."
    dependencies: [...]
    licence_compatible: true|false|unknown
    sinapse_overlap: "compares to squads/squad-claude/{...}.md"
    extraction_difficulty: low|medium|high
```

### Phase 3 — Council Pressurization (@council-orqx Zenith)

Delegate to `@council-orqx (Zenith)`. The council pressurizes the catalog with one question: **"Of the catalogued features, which are real signal and which are noise?"**

Output: `docs/research/external-mining-pressurization.md`. Format: ranked list with verdict per feature: SIGNAL | MAYBE | NOISE, plus rationale.

Council's job is to be skeptical. Default to NOISE unless the feature clearly fills a gap that SINAPSE identified during the diagnostic of the framework upgrade v2.

### Phase 4 — Cross-Reference with squad-claude

Manual scan: every catalog entry classified as SIGNAL or MAYBE is checked against `squads/squad-claude/` to detect duplication. Three outcomes per entry:

| Outcome | Action |
|---------|--------|
| Already in squad-claude | DROP (don't re-import) |
| Partially in squad-claude | MERGE (extend existing file with the new pattern) |
| Not in squad-claude | NEW (candidate for fresh import) |

### Phase 5 — Extraction Proposal

Generate `docs/research/external-mining-extraction-proposal.md` with a ranked list:

| Rank | Feature | Source repo | Type | Effort | Impact | Decision Needed From |
|------|---------|-------------|------|--------|--------|---------------------|
| 1 | ... | ... | ... | S/M/L | S/M/L | Caio / @devops / @architect |

### Phase 6 — Epic Decomposition

Group accepted features into clusters by squad/domain. Each cluster becomes a story in `epic-external-mining-v1`. Example:

- Story 1: import 3 prompt patterns into squad-claude
- Story 2: import memory schema into agent-handoff layer
- Story 3: adopt 2 hook patterns into `.claude/hooks/`

Each story goes through normal SDC (draft → validate → implement → QA → push) with proper attribution per §3.

---

## 3. Governance

### 3.1 Licence Verification (NON-NEGOTIABLE)

Before extracting **any** content:

1. Read `LICENSE` file in the source repo
2. Verify the licence allows: (a) copying, (b) modification, (c) redistribution under SINAPSE's licence
3. If LICENSE missing → DEFAULT to "all rights reserved" → BLOCK extraction; escalate to Caio with the option to ask the author for clarification
4. If LICENSE present but incompatible (GPL into MIT-published, or NC into commercial) → BLOCK extraction; escalate

### 3.2 Attribution

For every extracted item:

1. Inline file comment header:
   ```
   # Adapted from {repo-url} (commit {sha}) under {licence}
   # Original author: {github-username}
   # Imported into SINAPSE: 2026-MM-DD by Story EXT-MINING-V1.{n}
   ```
2. Aggregate attribution in `NOTICE.md` at repo root, listing every imported source with: original repo, licence, commit reference, date imported, files affected

### 3.3 Constitutional Scope Guard

Every imported item is checked against:

- **Article III (Documentation-First):** does the imported pattern require any operation that would skip the story-first workflow? If yes → REJECT or refactor.
- **Article VIII (Mandatory Delegation):** does the pattern encourage orchestrators to do specialist work directly? If yes → REJECT.
- **Article X (Security & Data Protection):** does the pattern introduce silent telemetry, weak credential handling, or unverifiable third-party calls? If yes → REJECT.

A pattern that fails any of the three is rejected regardless of how useful it seems otherwise.

---

## 4. Plan Deliverables (these are the deliverables of the PLAN, not the execution)

| Deliverable | Path | Status |
|-------------|------|--------|
| This plan | `docs/plans/external-repos-mining-plan.md` | DELIVERED (this turn) |
| Epic stub | `docs/epics/epic-external-mining-v1.md` | DELIVERED (this turn) |
| Effort estimate | §5 below | DELIVERED |
| Dependencies | §6 below | DELIVERED |

---

## 5. Effort Estimate (for the EXECUTION of the plan, not the plan itself)

| Phase | Effort | Notes |
|-------|--------|-------|
| 0. Pre-flight | 5 min | One-shot |
| 1. Clone + map | 30 min | Both repos |
| 2. Analyst cataloging | 1 session (~60-90 min) | Could be split per repo |
| 3. Council pressurization | 30 min | Single pass |
| 4. Cross-reference | 30 min | Manual scan against squad-claude |
| 5. Extraction proposal | 30 min | Ranked output |
| 6. Epic decomposition | 30 min | Story drafting |
| Per imported item | 1-3 hours | Depends on item complexity (story → impl → QA → push) |

**Total for Phases 0-6:** ~4-5 hours of focused work, fits in **1-2 sessions**.

**Total for execution of imported items:** depends on volume — assume 5-15 items at 2 hours each → **10-30 hours, 3-5 sessions** spread over a week.

---

## 6. Dependencies

### 6.1 Hard Dependencies (must be in place BEFORE running this plan)

- **Network access** to clone public github repos (verified)
- **Disk space** in `C:\Users\Caio Imori\Workspace\external-reference\` (2 small repos, < 100MB)
- **squad-claude is canonical** — the cross-reference in Phase 4 assumes squad-claude is the current reference for Claude Code patterns. If squad-claude is in flux, run this plan AFTER it stabilizes.

### 6.2 Soft Dependencies (recommended but not required)

- **EPIC-framework-upgrade-v2 should be in a stable state** — running this plan in the middle of a heavy upgrade adds coordination overhead. Recommendation: wait until fw-v2.2/2.3/2.5 are either Done or formally paused.
- **Governance decision on the squads-gitignore finding** (raised in fw-v2.4 QA gate) — if external mining produces patterns destined for squad-claude, we need to know whether squad-claude is publishable in this repo or lives elsewhere.

### 6.3 Anti-dependencies (things that would BLOCK this plan)

- Caio not having time to make the licence/governance go/no-go calls
- @devops bandwidth tied up on pipeline emergencies
- A surprise security advisory on either source repo

---

## 7. Recommendation: When to Execute

**My recommendation: WAIT for v2 to stabilize, then execute.**

Reasoning:

1. **Governance prerequisite** — the squads-gitignore decision raised by fw-v2.4 must be resolved first. Mining squad-claude content is pointless if we can't ship it.
2. **Cognitive load** — running mining in parallel with v2 upgrade execution doubles the contextual surface @sinapse-orqx and the squads must hold simultaneously. Quality > parallelism per project standing directive.
3. **Canonical reference** — Phase 4 cross-references against squad-claude. If squad-claude is being upgraded as part of v2 (it isn't currently in v2, but is a candidate for v3), the reference is stable now and it's a good moment to capture it.
4. **Low urgency** — neither external repo is going anywhere; the cost of waiting 1-2 sessions is approximately zero.

**Concrete order of operations:**

1. Caio + @devops resolve the squads-gitignore governance question (decision affects fw-v2.2/2.3/2.5 and any future squad-claude work)
2. Execute fw-v2.2, fw-v2.3, fw-v2.5 once governance is clear (or formally pause them with rationale)
3. Run this mining plan (Phases 0-6) in 1 focused session
4. Execute the resulting epic-external-mining-v1 stories incrementally over 3-5 sessions

If Caio prefers parallel execution despite the recommendation, the plan will run anyway — just with more coordination overhead.

---

## 8. Open Questions for Caio

Before execution, three explicit yes/no decisions are needed:

1. **Run now or wait?** (My recommendation: wait until v2 stabilizes)
2. **Licence cap?** Are we willing to extract from MIT/Apache/BSD/CC0 only, or also from "no licence" repos by reaching out to authors for permission?
3. **Attribution model?** Inline-comment + NOTICE.md (my recommendation), or a different scheme Caio prefers?

---

## Change Log

- 2026-04-12 — Plan v1.0 authored by @sinapse-orqx Imperator alongside Story fw-v2.4 execution. Companion epic stub created at `docs/epics/epic-external-mining-v1.md`.
