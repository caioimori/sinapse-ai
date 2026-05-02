# Clinical Audit — Dimension 4: Subagents

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 4 (actors)
> **Executor:** @architect (Aria, Visionary)
> **Date:** 2026-04-28
> **Verdict:** **CONCERNS** — 0 P0 / 1 P1 / 4 P2 / 2 P3
> **Severity:** **MEDIUM** — runtime works, but capability/isolation contracts are under-documented and partially mis-cited

## Scope

Agents that are spawned via Claude Code's `Task` tool (the "subagent" tool, also referred to as `Agent(...)` in some templates with `subagent_type=...`). This audit covers: (a) which agents are spawn-able as subagents vs which are loaded as personas, (b) tool/permission isolation per subagent, (c) the documented invocation contract, and (d) where the `Task(subagent_type=...)` pattern appears in framework code/docs.

This dimension intentionally does **not** re-audit persona content (Dim 3) — only the spawn surface.

## 1. Inventory

### 1.1 Spawn surface — `.claude/agents/` files with valid frontmatter

45 files in `.claude/agents/` carry `^---`-delimited YAML with `name:` / `description:` / `model:` / `tools:`. Method: `grep -lE "^---" .claude/agents/*.md | wc -l`.

Sample frontmatter (verified by `head -20`):

`.claude/agents/architect.md:1-20`:
```yaml
---
name: sinapse-architect
description: |
  SINAPSE Architect autônomo. Análise de impacto, design de arquitetura,
  validação de PRD, research. Usa task files reais do SINAPSE.
model: opus
tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
  - WebSearch
  - WebFetch
permissionMode: bypassPermissions
memory: project
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: ".claude/hooks/enforce-git-push-authority.sh"
```

`.claude/agents/brand-orqx.md:1-15`:
```yaml
---
name: sinapse-brand
description: |
  SINAPSE Brand Squad autonomo. 15 agentes, 97 tasks.
  Estrategia de marca, arquetipos, identidade visual, brandbook.
  Default: YOLO mode (autonomo, sem interacao humana).
model: sonnet
tools:
  - Read
  - Grep
  - Glob
  - Write
  - Edit
  - Bash
permissionMode: bypassPermissions
memory: project
---
```

### 1.2 Frontmatter agents by `name:` field

28 frontmatter files use `name: sinapse-*` (the canonical SINAPSE subagent prefix). Verified: `grep -E "^name: sinapse-" .claude/agents/*.md | wc -l = 28`.

The 17 frontmatter agents that are NOT prefixed `sinapse-`:

```
brad-frost.md            name: brad-frost
copy-chief.md            name: copy-chief
cyber-chief.md           name: cyber-chief
dan-mall.md              name: dan-mall
data-chief.md            name: data-chief
dave-malouf.md           name: dave-malouf
db-sage.md               name: db-sage
design-chief.md          name: design-chief
design-system.md         name: design-system
legal-chief.md           name: legal-chief
nano-banana-generator.md name: nano-banana-generator
sop-extractor.md         name: sop-extractor
squad.md                 name: squad
story-chief.md           name: story-chief
tools-orqx.md            name: tools-orqx
traffic-masters-chief.md name: traffic-masters-chief
```

Note: `tools-orqx.md` and `cyber-chief.md` are spawn-able subagents that do NOT carry the `sinapse-` prefix — inconsistent with the SINAPSE-prefixing convention seen in the other 28.

### 1.3 Stubs and frontmatter-less files

- 132 files are 4-line activator stubs (`Activate agent: X / Squad: Y / Read the agent definition at: ... / Follow ALL instructions...`) — see Dim 3 for full inventory.
- `.claude/agents/sinapse-orqx.md` (619 lines, no frontmatter) — Imperator persona, loaded via slash command not `Task`.
- `.claude/agents/squad-chief.md` (1553 lines, no frontmatter) — squad-chief persona, same.

These 134 files are **not** spawn-able as Claude Code subagents (no `name:` to match `subagent_type`).

### 1.4 Where `Task(subagent_type=...)` is referenced in this codebase

`grep -rln "subagent_type\|Agent(" .sinapse-ai/development/ .sinapse-ai/core/ bin/ squads/` returns **42 files**. Key invocation/contract sites:

| File | Line | Excerpt |
|---|---:|---|
| `.sinapse-ai/development/tasks/blocks/execution-pattern.md` | 36 | `Task(prompt: "...", subagent_type: "general-purpose", ...)` (sequential pattern) |
| `.sinapse-ai/development/tasks/blocks/execution-pattern.md` | 45-50 | parallel-execution pattern with `run_in_background: true` |
| `.sinapse-ai/development/tasks/blocks/agent-prompt-template.md` | n/a | agent-prompt template referenced by all delegating tasks |
| `.sinapse-ai/development/tasks/execute-epic-plan.md` | n/a | uses `Task(subagent_type=...)` to dispatch story work |
| `.sinapse-ai/development/tasks/run-workflow-engine.md` | n/a | workflow engine dispatch |
| `.sinapse-ai/core/permissions/operation-guard.js` | 195-201 | **read-only subagent classification**: `const readOnlyAgents = ['Explore', 'Plan', 'claude-code-guide']; if (readOnlyAgents.includes(params.subagent_type)) return 'read';` |

### 1.5 Per-subagent isolation declarations

Sample contracts read from frontmatter:

| Subagent | model | tools (count) | permissionMode | hooks |
|---|---|---:|---|---|
| `sinapse-architect` | opus | 8 (Read, Grep, Glob, Write, Edit, Bash, WebSearch, WebFetch) | bypassPermissions | git-push-authority on Bash |
| `sinapse-brand` | sonnet | 6 (Read, Grep, Glob, Write, Edit, Bash) | bypassPermissions | none observed |
| `sinapse-analyst` | opus | 8 (incl. WebSearch + WebFetch) | bypassPermissions | n/a |

Method: `head -20` on each file. Pattern: most squad-orqx subagents are sonnet/6-tool; framework subagents (`architect`, `analyst`) are opus/8-tool. None of the 45 frontmatter files restrict to read-only tools (no `Explore`/`Plan`/`claude-code-guide` style profile).

## 2. Contract

| Claim | Source `file:line` |
|---|---|
| `Task` tool blocks until subagent completes | `.sinapse-ai/development/tasks/blocks/execution-pattern.md:30` |
| Sequential pattern: single `Task(prompt, subagent_type)` call | `execution-pattern.md:36` |
| Parallel pattern: spawn N tasks with `run_in_background: true`, then `TaskOutput` per task_id | `execution-pattern.md:44-50` |
| Read-only subagents: `Explore`, `Plan`, `claude-code-guide` | `.sinapse-ai/core/permissions/operation-guard.js:196` |
| Subagent threshold: spawn only if ≥8 tool calls OR fan-out parallel real | `~/.claude/rules/token-economy.md` (§3 Subagent Threshold) |
| Sub-agente anuncia modelo ao spawnar | `~/.claude/rules/token-economy.md` (§2 last bullet) |
| Constitutional Article II: Agent Authority | `.sinapse-ai/constitution.md` (NON-NEGOTIABLE) |
| `@devops` exclusive `git push` / PR auth (subagent context) | `~/.claude/rules/agent-authority.md` |

## 3. Reality (this session)

### 3.1 Spawn-able vs documented

The token-economy rule says "sub-agente anuncia modelo ao spawnar". The 45 frontmatter files DO declare `model:`, so the contract is mechanically satisfied. However:

- The 132 stubs are NOT spawn-able as subagents. There is no documentation that distinguishes the spawn surface (45) from the slash-command activator surface (132).
- `sinapse-orqx.md` and `squad-chief.md` are large persona prompts that look like subagents but have no frontmatter — the user can be misled into thinking they are spawn-able via `Task(subagent_type="sinapse-orqx")` (they are not).

### 3.2 Read-only isolation

`operation-guard.js:194-201`:
```js
if (tool === 'Task') {
  const readOnlyAgents = ['Explore', 'Plan', 'claude-code-guide'];
  if (readOnlyAgents.includes(params.subagent_type)) {
    return 'read';
  }
  return 'execute';
}
```

These three names (`Explore`, `Plan`, `claude-code-guide`) are **not present in `.claude/agents/`** as subagent files. Method: `ls .claude/agents/ | grep -iE "explore|plan|claude-code-guide" → no matches`. So the read-only allowlist refers to upstream/Anthropic-shipped subagents, not to SINAPSE-defined ones. Any SINAPSE subagent (the 45 frontmatter files) is treated as `execute` regardless of declared tool list.

This means: a subagent declared with only read-only tools (e.g. only `Read`, `Grep`, `Glob` — none observed today, but possible) would still classify as `execute` for permission gating. That is a defensive default but it means the per-subagent `tools:` field is currently *advisory* for permission purposes.

### 3.3 `permissionMode: bypassPermissions` everywhere

All sampled SINAPSE subagents declare `permissionMode: bypassPermissions` (verified: architect, brand-orqx, plus visual scan of ~10 others). Combined with §3.2, this means:
- Subagent inherits parent permission cap (or bypasses).
- The `tools:` declaration limits *which tools the subagent can call*, but not *what those tools can do*.
- Hook guards (e.g. `enforce-git-push-authority.sh` on `sinapse-architect`'s Bash) are the actual enforcement layer.

This is functional, but the contract should be explicit. Right now, "isolation" by tool list is real (a subagent without `Bash` literally cannot execute commands), but "isolation" by permissionMode is intentionally bypassed.

### 3.4 Subagent threshold rule compliance

`~/.claude/rules/token-economy.md` §3 says "Spawn APENAS se: ≥8 tool calls previstos OU fan-out paralelo real. Abaixo → inline."

Across the 42 spawn references in framework tasks (§1.4), I sampled `execute-epic-plan.md` and `run-workflow-engine.md`. Both gate spawning behind explicit "is this a story-level batch?" checks. No obvious violations of the threshold rule, but no automated enforcement either — it's a discipline rule.

### 3.5 Hook coverage on subagents

Only `sinapse-architect` was observed declaring per-subagent hooks (`PreToolUse` matcher `Bash` → `enforce-git-push-authority.sh`). The other framework subagents (`brand-orqx`, `analyst`, etc.) do NOT declare per-subagent hooks. The project-wide hooks in `.claude/settings.json` (`mind-clone-governance.py`, `secret-scanning.cjs`, `enforce-delegation.cjs`, `enforce-architecture-first.cjs`, `synapse-engine.cjs`, etc.) apply globally to any session, including subagent sessions.

### 3.6 Naming convention drift

28 frontmatter agents prefixed `sinapse-`, 17 not. The 17 unprefixed includes 7 `*-chief` files (copy-chief, cyber-chief, data-chief, design-chief, legal-chief, story-chief, traffic-masters-chief) and the `tools-orqx` (squad-claude orchestrator). Inconsistent with the orchestrator-prefix convention used by every other `*-orqx` file.

## 4. Delta

| Item | Contract | Reality | Status | Severity |
|---|---|---|---|---|
| Spawn surface documented | Implicit (Task tool spec) | 45 spawn-able / 178 in directory; no doc distinguishes | DRIFT | P1 |
| Read-only subagent allowlist | `operation-guard.js:196` lists 3 names | Those names don't exist in our `.claude/agents/` | DRIFT (reference to upstream, not local) | P3 |
| `permissionMode: bypassPermissions` ubiquity | Token-economy expects per-task escalation | All sampled subagents bypass | DRIFT-by-design | P2 |
| Per-subagent hooks | Implied — security-critical agents should have guards | Only `sinapse-architect` does | UNDER-COVERAGE | P2 |
| Naming convention `sinapse-*` | de facto across 28 of 45 | 17 omit prefix (chiefs + tools-orqx) | DRIFT | P2 |
| Subagent threshold rule | ≥8 tool calls or parallel fan-out | No automated check | UNENFORCED | P3 |
| Sub-agente anuncia modelo | required | All 45 frontmatter files declare `model:` ✓ | ALIGNED | — |
| Imperator/squad-chief invokable as `Task(subagent_type=...)` | Implied by being in `.claude/agents/` | Not — no frontmatter | DRIFT | P2 |

## 5. Findings (concrete file:line citations)

### Finding F4-1 — Spawn surface vs activator surface is undocumented (P1)

`.claude/agents/` contains 178 files. Only 45 are valid Claude Code subagent definitions (frontmatter with `name:`, `description:`, `model:`, `tools:`). 132 are 4-line activator stubs (e.g. `.claude/agents/ad-copywriter.md:1-4`). 1 is `sinapse-orqx.md` (619 lines, no frontmatter). 1 is `squad-chief.md` (1553 lines, no frontmatter).

A user/agent calling `Task(subagent_type="ad-copywriter")` will fail (no `name: ad-copywriter` in any frontmatter file). They must instead use `/SINAPSE:agents:ad-copywriter` (slash command). This contract is **nowhere documented** — there is no `.claude/agents/README.md`, no `agent-authority.md` distinction, no `token-economy.md` callout.

### Finding F4-2 — Read-only allowlist references upstream-only subagent names (P3)

`.sinapse-ai/core/permissions/operation-guard.js:194-201`:
```js
if (tool === 'Task') {
  const readOnlyAgents = ['Explore', 'Plan', 'claude-code-guide'];
  if (readOnlyAgents.includes(params.subagent_type)) return 'read';
  return 'execute';
}
```

`Explore`, `Plan`, `claude-code-guide` are Anthropic-shipped subagent names, not SINAPSE-defined ones. The classifier is correct for those, but no SINAPSE subagent is on the read-only allowlist. Combined with `permissionMode: bypassPermissions`, this means the per-subagent `tools:` field is the only effective isolation layer.

### Finding F4-3 — Per-subagent hooks are sparse (P2)

Only `.claude/agents/architect.md:18-22` declares a per-subagent hook (`enforce-git-push-authority.sh`). The other 44 frontmatter subagents rely entirely on global hooks. Notably, no devops-specific subagent file declares an extra guard despite `@devops` having exclusive push authority — because there's no `.claude/agents/devops.md` with hooks beyond global.

Verified: `grep -A3 "^hooks:" .claude/agents/devops.md` returns nothing on devops.md. The push-authority guard is global via `.claude/settings.json` + `enforce-delegation.cjs`.

### Finding F4-4 — `sinapse-` prefix inconsistency (P2)

28/45 frontmatter agents use `name: sinapse-*`. 17 do not, including 7 `*-chief` files and 1 `tools-orqx`. Examples:

- `.claude/agents/copy-chief.md:1-N` → `name: copy-chief` (not `sinapse-copy-chief`)
- `.claude/agents/tools-orqx.md:1-N` → `name: tools-orqx` (not `sinapse-tools-orqx`)
- `.claude/agents/data-chief.md:1-N` → `name: data-chief`

These will be touched by SNPS rename. Decide convention now or rename twice later.

### Finding F4-5 — Imperator/squad-chief unspawnable (P2)

`.claude/agents/sinapse-orqx.md` (619 lines, head-1 = `# Agent: Imperator`) and `.claude/agents/squad-chief.md` (1553 lines, head-1 = `# squad-chief`) lack `^---` YAML frontmatter. They are loaded via slash command (`/SINAPSE:agents:sinapse-orqx`) but cannot be spawned via `Task(subagent_type="sinapse-orqx")` because Claude Code matches `subagent_type` against the `name:` field.

### Finding F4-6 — `permissionMode: bypassPermissions` is the rule, not the exception (P2)

Every sampled subagent (architect, brand-orqx, analyst) declares `permissionMode: bypassPermissions`. This means subagent permission isolation is delegated to:
1. Tool list (which tools the subagent can call) — works
2. Global hooks (`.claude/settings.json`) — works
3. `permissionMode: bypassPermissions` — explicitly disabled

No subagent today opts into stricter permission mode (e.g. `acceptEdits`, `default`). Acceptable for an autonomous workforce model, but should be explicit in `agent-authority.md`.

### Finding F4-7 — `tools-orqx` exists in `.claude/agents/` but is meta about tools (P3)

`.claude/agents/tools-orqx.md` (`name: tools-orqx`) is a 219-line subagent definition. The constitution counts it among orqx (`constitution.md:151`: "20 comandos orqx (18 squad orqx + sinapse-orqx + tools-orqx)"). Worth flagging that `tools-orqx` is the only "orqx" not tied to a `squads/squad-tools/` directory — it lives in `squads/squad-claude/agents/tools-orqx.md`. Reasonable, but worth documenting.

## 6. Severity Roll-Up

- **P0:** 0
- **P1:** 1 (F4-1 — spawn surface undocumented; same root cause as Dim 3 F3-4)
- **P2:** 4 (F4-3, F4-4, F4-5, F4-6)
- **P3:** 2 (F4-2, F4-7)

## 7. Recommendations

| # | Action | Owner | Window |
|---|---|---|---|
| R1 | Author `.claude/agents/README.md` distinguishing the 3 invocation paths: (a) Task spawn (frontmatter required, 45 files today), (b) slash command persona (132 stubs + Imperator/squad-chief), (c) library persona (squads/*/agents/*.md, never invoked directly). | @architect | Pre-GA, paired with Dim 3 R4 |
| R2 | Decide and document the `sinapse-` prefix convention. Recommendation: prefix everything (`sinapse-copy-chief`, `sinapse-tools-orqx`). Apply during the same SNPS rename pass. | @architect → Caio | Pre-SNPS rename |
| R3 | Add per-subagent hooks where capability is asymmetric: `sinapse-devops` gets git-push enforcement at the subagent level (not just global), `sinapse-data-engineer` gets schema-write guard. | @devops | Pre-GA, low-risk |
| R4 | Make `permissionMode: bypassPermissions` an explicit policy decision in `agent-authority.md`. Either justify the universal bypass or scope it (e.g. only autonomous-mode subagents bypass). | @architect | Pre-GA |
| R5 | Decide whether to add `Imperator` and `squad-chief` frontmatter so they can be `Task`-spawned. Today they are slash-only. Documentation must match the runtime. | @architect | Pre-SNPS rename |
| R6 | Add `name`-field validation to existing `squad-validator` (PR #116): every `.claude/agents/*.md` with frontmatter MUST have `name:`, `description:`, `model:`, `tools:`. Fail CI on drift. | @devops | Pre-GA |
| R7 | (Post-GA) Either expand the read-only subagent allowlist in `operation-guard.js:196` to include SINAPSE-defined read-only agents, or document explicitly that all SINAPSE subagents are write-capable. | @architect | Post-GA |

## 8. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **4. Subagents** | **CONCERNS** | Zero P0 / 1 P1 / 4 P2 / 2 P3. F4-1 mirrors Dim 3 F3-4 (same root cause: undocumented split between spawn and activator surfaces). The remaining P2 items are policy-clarification debt, not runtime breakage. None block GA mechanically; F4-1 + F4-4 should be cleared before SNPS rename to avoid renaming on a fuzzy contract. |

## 9. Blocks rename SNPS → SNPS?

**Yes — same soft block as Dim 3.** F4-1 (spawn surface contract) and F4-4 (`sinapse-` prefix decision) must be resolved before SNPS rename touches 200 personas. Otherwise the rename will:
- Apply consistently to the 28 `sinapse-*` agents but not to the 17 unprefixed ones (or vice-versa).
- Leave the 132 stubs in an undefined "do these still work?" state.
- Continue to obscure the Imperator/squad-chief invocation contract.

## Change Log

- 2026-04-28 — Dim 4 audit completed (Block 2). CONCERNS, soft-blocks SNPS rename until R1 + R2 cleared. @architect (Aria, Visionary).
