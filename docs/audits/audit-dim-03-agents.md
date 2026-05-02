# Clinical Audit — Dimension 3: Agents

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 4 (actors)
> **Executor:** @architect (Aria, Visionary)
> **Date:** 2026-04-28
> **Verdict:** **CONCERNS** — multiple drift findings, 0 P0 / 2 P1 / 5 P2 / 3 P3
> **Severity:** **MEDIUM-HIGH** — does not block GA on its own, but blocks pre-GA SNPS rename until reconciliation passes

## Scope

Every agent persona shipped in this repository: framework agents (`.sinapse-ai/development/agents/`), squad agents (`squads/*/agents/`), and the Claude Code subagent surface (`.claude/agents/`). Validates: (a) inventory consistency between filesystem, registry, and constitutional claims; (b) frontmatter sanity for files that are loaded as Claude Code subagents; (c) sync between squad manifests and on-disk agent files.

## 1. Inventory

### 1.1 Source of truth — actual files on disk

| Surface | Path | Count | Method |
|---|---|---:|---|
| Framework personas | `.sinapse-ai/development/agents/*.md` | 12 | `ls` (incl. `sinapse-orqx.md`, `squad-creator.md`, 10 framework personas) |
| Squad agent personas | `squads/*/agents/*.md` | 188 | `find squads -name "*.md" -path "*/agents/*"` |
| Claude Code subagent surface | `.claude/agents/*.md` | 178 | `ls` |
| Subagents w/ valid YAML frontmatter | `.claude/agents/*.md` w/ `^---` first line | 45 | `head -1 | grep ^---` |
| 4-line activator stubs | `.claude/agents/*.md` lines ≤ 5 | 132 | `wc -l` |
| Imperator + chiefs (frontmatter-less, multi-hundred-line) | `sinapse-orqx.md`, `squad-chief.md`, plus chief variants | 6 | manual sample |

### 1.2 Sources of truth — declared counts

| Claim | Cited Value | Source `file:line` |
|---|---|---|
| "18 squads (diretórios com squad.yaml)" | 18 | `.sinapse-ai/constitution.md:149` |
| "186 agentes (174 em squads + 1 master sinapse-orqx)" | 186 | `.sinapse-ai/constitution.md:150` |
| "20 comandos orqx (18 squad orqx + sinapse-orqx + tools-orqx)" | 20 | `.sinapse-ai/constitution.md:151` |
| Imperator persona: "all 18 specialized squads (186 agents total)" | 186 / 18 | `.sinapse-ai/development/agents/sinapse-orqx.md` (ACTIVATION-NOTICE block, line ≈3) |
| Imperator persona footer: "18 squads · 186 agents · 1,430 tasks" | 186 | same file (multiple lines) |
| Squad orqx files (`squads/*/agents/*-orqx.md`) | 21 | `find squads -name "*-orqx.md"` (note: `swarm-orqx.md` exists in BOTH `claude-code-mastery` AND `squad-claude` — duplicate basename) |
| Squad directories (`squads/*/`) | 19 | `ls squads/` |
| Entity registry agent count | 12 | `.sinapse-ai/data/entity-registry.yaml:12688` (`agents:` section, 12 children) |

## 2. Contract

The constitution and Imperator persona claim a stable agent count; the install manifest is regenerated from disk; the entity registry is authoritative for framework agents only.

| Contract | Source |
|---|---|
| Authoritative agent inventory for L2 framework | `.sinapse-ai/data/entity-registry.yaml:12688` (`agents:` block) |
| Framework agent files MUST live in `.sinapse-ai/development/agents/` | `~/.claude/rules/agent-authority.md` (delegation matrix) |
| Squad agent files MUST live in `squads/{squad}/agents/` and be enumerated in the squad manifest | each `squads/{name}/squad.yaml` (`metadata.agents_count` field) |
| Claude Code subagents in `.claude/agents/` MUST have `name:`, `description:`, `model:`, `tools:` frontmatter | Anthropic Claude Code subagent spec; observed in 45/178 files |
| Constitutional totals must match ground truth | `.sinapse-ai/constitution.md:149-151` |
| Mind clones (real-person personas) require DNA extraction before file creation | `.claude/hooks/mind-clone-governance.py:1-25` |

## 3. Reality (this session)

### 3.1 Filesystem truth

```
squads/                              19 dirs (find squads -maxdepth 1 -type d | wc -l = 20 incl. squads/ itself)
squads/*/agents/*.md                 188 files
.sinapse-ai/development/agents/*.md  12 files
.claude/agents/*.md                  178 files
```

Total persona universe (framework + squad, no double-count): **200 persona definitions**. The `.claude/agents/` surface is a *projection* (subagent activator + chief stubs) — not a separate count.

### 3.2 Per-squad agent count vs `squad.yaml`

```
claude-code-mastery     declared=(missing)   actual=8
squad-animations        declared=9           actual=9    ✓
squad-artdir            declared=14          actual=14   ✓
squad-brand             declared=15          actual=15   ✓
squad-claude            declared=10          actual=10   ✓
squad-cloning           declared=8           actual=9    ✗ +1
squad-commercial        declared=11          actual=11   ✓
squad-content           declared=7           actual=7    ✓
squad-copy              declared=(missing)   actual=14
squad-council           declared=11          actual=11   ✓
squad-courses           declared=8           actual=8    ✓
squad-cybersecurity     declared=9           actual=9    ✓
squad-design            declared=(missing)   actual=15
squad-finance           declared=5           actual=5    ✓
squad-growth            declared=7           actual=7    ✓
squad-paidmedia         declared=9           actual=10   ✗ +1
squad-product           declared=7           actual=7    ✓
squad-research          declared=7           actual=8    ✗ +1
squad-storytelling      declared=10          actual=11   ✗ +1
```

Method: `grep -m1 "agents_count" {squad}/squad.yaml` (first match) vs `find {squad}/agents -maxdepth 1 -name "*.md" | wc -l`.

Cross-squad orchestrator file `squads/squad-claude/agents/swarm-orqx.md` AND `squads/claude-code-mastery/agents/swarm-orqx.md` share basename → not a unique identifier. Found via `find squads -name "*-orqx.md"`.

### 3.3 Constitutional totals vs reality

| Claim | Cited at | Reality | Δ |
|---|---|---|---|
| 18 squads | `constitution.md:149`, `sinapse-orqx.md` (activation banner) | 19 dirs in `squads/` | +1 |
| 186 agents (174 + 1) | `constitution.md:150`, `sinapse-orqx.md` (activation banner) | 188 squad + 12 framework = 200 personas; 178 in `.claude/agents/` | +14 personas vs claim, OR -8 vs the 178 surface (depends which "agent" is meant) |
| 20 orqx commands | `constitution.md:151` | 21 `*-orqx.md` files in squads (one duplicate basename `swarm-orqx`) + 1 `sinapse-orqx` | +1 to +2 |

### 3.4 Claude Code subagent frontmatter sanity

`.claude/agents/` contains 178 files, of which:

- **45 have valid `^---`-delimited YAML frontmatter** with `name:`, `description:`, `model:`, `tools:`. Verified via `head -1 | grep ^---` then `awk` to extract first `name:` after first `---`.
- **132 are 4-line activator stubs** (no frontmatter, content `Activate agent: X / Squad: Y / Read the agent definition at: ... / Follow ALL instructions...`). Sample file: `.claude/agents/ad-copywriter.md` (4 lines, line 1 = `Activate agent: ad-copywriter`).
- **1 file is the Imperator** (`.claude/agents/sinapse-orqx.md`, 619 lines, no `^---` frontmatter — starts with `# Agent: Imperator`).
- **1 file is the squad-chief** (`.claude/agents/squad-chief.md`, 1553 lines, no `^---` frontmatter — starts with `# squad-chief`).

Claude Code's published subagent contract requires YAML frontmatter at the top of the file. **132 + 2 = 134 of 178 files in `.claude/agents/` are not invokable as Claude Code subagents** as currently documented. They are pointers / persona prompts, not subagent definitions. Whether this is intentional (activator pattern shipped via slash commands) or a bug depends on how each file is invoked.

### 3.5 Entity-registry coverage

`.sinapse-ai/data/entity-registry.yaml` lists 12 entries under `agents:` (line 12688 onward). Verified by counting `^    [a-z][a-z-]*:$` matches inside the agents block: **12 entries**, all framework agents. Squad agents (188 files) are **not registered** in the entity registry. Compare to `tasks: 212`, `templates: 46`, `infra-scripts: 105` — squad personas are the only large entity class fully outside the registry.

`metadata.entityCount: 753` (line 4) and `lastUpdated: '2026-05-01T16:26:51.800Z'` (line 3 of file). The 753 figure does not include squad agents at all.

### 3.6 Mind-clone governance hook

`.claude/hooks/mind-clone-governance.py:1-25` blocks creation of mind-clone personas (real-person agents) that lack a corresponding DNA extraction. The hook is in `.claude/settings.json` (verified via grep). 14 known person-name personas exist (e.g. `brad-frost.md`, `dan-mall.md`, `dave-malouf.md`, `derek-sivers.md`, `blake-snyder.md` in `.claude/agents/`). Their DNA artifacts in `squads/squad-cloning/` are out of scope for this dimension (Dim 7 covers).

## 4. Delta

| Item | Contract | Reality | Status | Severity |
|---|---|---|---|---|
| Constitution: "18 squads" | 18 | 19 dirs | DRIFT | P1 |
| Constitution: "186 agentes" | 186 | 188 squad + 12 framework = 200, OR 178 subagent surface | DRIFT | P1 |
| Constitution: "20 comandos orqx" | 20 | 21 `*-orqx.md` (incl. duplicate `swarm-orqx` basename in 2 squads) | DRIFT | P2 |
| Imperator activation banner | "18 squads / 186 agents / 1,430 tasks" | 19 / 200 / 212 (registry tasks) | DRIFT | P2 |
| `squad-cloning/squad.yaml` agents_count | 8 | 9 | DRIFT | P2 |
| `squad-paidmedia/squad.yaml` agents_count | 9 | 10 | DRIFT | P2 |
| `squad-research/squad.yaml` agents_count | 7 | 8 | DRIFT | P2 |
| `squad-storytelling/squad.yaml` agents_count | 10 | 11 | DRIFT | P2 |
| `squad.yaml` missing `agents_count` | required by manifest pattern | missing in `claude-code-mastery`, `squad-copy`, `squad-design` | MISSING | P2 |
| `.claude/agents/` subagent frontmatter | YAML required | 134/178 files lack it (132 stubs + Imperator + squad-chief) | DRIFT-by-design or BROKEN | P1 (needs decision) |
| Entity registry coverage of squad agents | implied by being authoritative agent inventory | 0/188 squad agents registered | MISSING | P3 (registry intentionally L2-only?) |
| Duplicate basename `swarm-orqx.md` | implicit unique IDs | 2 files | DRIFT | P3 |

Severity legend: P0 = blocks GA · P1 = fix before GA · P2 = tech debt · P3 = cosmetic / documentation.

## 5. Findings (concrete file:line citations)

### Finding F3-1 — Constitutional drift (P1)

- `.sinapse-ai/constitution.md:149` says `18 squads`. `ls squads/` returns 19 dirs.
- `.sinapse-ai/constitution.md:150` says `186 agentes (174 em squads + 1 master)`. Reality: 188 squad agent files, 12 framework agents, 178 entries in `.claude/agents/`.
- `.sinapse-ai/constitution.md:151` says `20 comandos orqx`. Reality: 21 `*-orqx.md` in squads + 1 `sinapse-orqx` = 22; or 20 if you collapse `swarm-orqx` duplicate.

Single biggest risk: a v1 GA cannot ship a constitution that contradicts `ls`. First-impression credibility damage.

### Finding F3-2 — Imperator persona broadcasts wrong totals (P1)

`.sinapse-ai/development/agents/sinapse-orqx.md` activation banner (top of file, ACTIVATION-NOTICE block, ≈line 3) says "all 18 specialized squads (186 agents total)". The footer of the same file repeats `18 squads · 186 agents · 1,430 tasks` and `Coordinates with: All 18 squad orchestrators`. Every session that activates `sinapse-orqx` outputs these numbers.

### Finding F3-3 — Squad manifests drift from disk (P2)

Per §3.2: 4 squads under-count (cloning, paidmedia, research, storytelling), 3 squads omit `agents_count` entirely (claude-code-mastery, squad-copy, squad-design). The `squad-validator` story 10.43 (commit 3167776) just fixed schema drift across 19 squads — that PR did not catch these arithmetic drifts.

### Finding F3-4 — Subagent surface is mostly stubs (P1, needs explicit decision)

134/178 `.claude/agents/*.md` files lack the YAML frontmatter that Claude Code uses to register a subagent. They function as persona-load pointers via slash commands, not as native subagents. Two paths:
- (a) **Intentional**: ratify the activator pattern in docs, mark the 132 stubs explicitly as "loaded via `/SINAPSE:agents:*`, not as `Task(subagent_type=...)`", and document the 45 frontmatter agents as the spawn surface.
- (b) **Bug**: every `squads/*/agents/*.md` should also have a corresponding frontmatter file in `.claude/agents/`, currently broken.

This decision **must** precede the SNPS rename to avoid renaming 132 files in (a) for nothing or 132 in (b) without fixing the underlying bug.

### Finding F3-5 — Entity registry excludes squad agents (P3)

`.sinapse-ai/data/entity-registry.yaml` lists 12 framework agents (line 12688 → 12 children). 188 squad agents are not registered. The IDS principles rule (`~/.claude/rules/ids-principles.md`) requires consultation of the registry before creating new agents — but if the registry holds 0 squad agents, the consultation is structurally blind to 94% of the persona universe.

### Finding F3-6 — Duplicate basename `swarm-orqx.md` (P3)

`squads/claude-code-mastery/agents/swarm-orqx.md` and `squads/squad-claude/agents/swarm-orqx.md` share basename. If `.claude/agents/swarm-orqx.md` is generated/synced from one of them, the other is silently dropped. Verified: a `.claude/agents/swarm-orqx.md` exists with `name: sinapse-swarm` — only one of the two squad sources is being projected.

### Finding F3-7 — Imperator + squad-chief lack frontmatter (P2)

`.claude/agents/sinapse-orqx.md` (619 lines) and `.claude/agents/squad-chief.md` (1553 lines) start with `#` headings, not `---`. Both are large persona prompts. If the user invokes `Task(subagent_type="sinapse-orqx")`, Claude Code may not match (no `name:` registered). If they are invoked solely via slash command, the documentation should say so explicitly.

## 6. Severity Roll-Up

- **P0:** 0
- **P1:** 3 (F3-1, F3-2, F3-4) — block SNPS rename and v1 GA messaging until reconciled
- **P2:** 3 (F3-3, F3-7, plus the manifest-missing trio inside F3-3)
- **P3:** 2 (F3-5, F3-6)

## 7. Recommendations

| # | Action | Owner | Window |
|---|---|---|---|
| R1 | Author a single `agents-truth.yaml` (or extend entity-registry to include squad agents) — generated from `find squads -name "*.md" -path "*/agents/*"` and `find .sinapse-ai/development/agents -name "*.md"`. Make this the only allowed source of "X agents / Y squads" claims. | @architect | Pre-GA, before SNPS rename |
| R2 | Replace the constitutional numerals on `constitution.md:149-151` with a `<!-- generated -->` block populated by a script. Same for the Imperator activation banner. Acceptance: `npm run validate:counts` exits 0 only if doc claims match disk. | @architect + @devops | Pre-GA |
| R3 | Update the 4 drifted squad manifests (cloning, paidmedia, research, storytelling) and add `agents_count` to the 3 missing ones (claude-code-mastery, squad-copy, squad-design). Add a CI check (extend the existing `squad-validator` from PR #116) that fails on drift. | @sprint-lead | Pre-GA, in same PR as R1 |
| R4 | Decide explicitly: are the 132 stub files in `.claude/agents/` a *feature* (activator pattern, OK) or a *bug* (every squad agent should also be a Claude Code subagent)? Document the decision in `.claude/agents/README.md` (currently absent) and reference from `agent-authority.md`. **Block SNPS rename until this decision is made.** | @architect → Caio | Pre-GA, before any rename |
| R5 | Rename `squads/squad-claude/agents/swarm-orqx.md` to `squad-claude-swarm-orqx.md` (or fold one of the two `swarm-orqx` files). Otherwise the projection logic into `.claude/agents/` is silently lossy. | @sprint-lead | Pre-GA |
| R6 | Add Imperator + squad-chief to the registry-or-decision-set: either add YAML frontmatter so they are spawn-able as subagents, or document them as "slash-command-only personas". | @architect | Same window as R4 |
| R7 | (Post-GA) Decide whether squad agents belong in `entity-registry.yaml`. Consequence: the IDS REUSE > ADAPT > CREATE check today is structurally blind to 94% of personas. | @architect | Post-GA |

## 8. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **3. Agents** | **CONCERNS** | Zero P0 / 3 P1 / 3 P2 / 2 P3. The P1 items (constitutional drift, Imperator banner drift, undecided subagent surface) do not break runtime — agents activate, stories execute. But shipping v1.0.0 GA with a constitution that contradicts `ls`, and renaming agents (SNPS) on a surface that is half stubs, would each cause downstream pain. **Must clear R1–R4 before SNPS rename.** R5–R6 fold into the same PR cycle. R7 deferable. |

## 9. Blocks rename SNPS → SNPS?

**Yes — soft block.** The SNPS rename will touch every persona. Doing so before R1 (single source of truth) and R4 (decision on the stub surface) means renaming 200 personas on a surface with three different schemas: 12 framework (clean), 188 squad (clean), 178 `.claude/agents/` (45 frontmatter + 132 stubs + 1 Imperator + 1 squad-chief). Renaming the 132 stubs is trivial; renaming the 45 frontmatter files requires also updating the `name: sinapse-X` field; the Imperator/squad-chief require manual handling. Without R1 + R4 first, the rename PR will either miss files or rename inconsistently.

## Change Log

- 2026-04-28 — Dim 3 audit completed (Block 2 of pre-GA clinical audit). CONCERNS, soft-blocks SNPS rename until R1–R4 cleared. @architect (Aria, Visionary).
