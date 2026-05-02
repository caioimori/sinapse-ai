# Clinical Audit — Dimension 6: Squads

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 4 (actors)
> **Executor:** @architect (Aria, Visionary)
> **Date:** 2026-04-28
> **Verdict:** **CONCERNS** — 0 P0 / 2 P1 / 4 P2 / 2 P3
> **Severity:** **MEDIUM-HIGH** — manifest drift is widespread, but no runtime breakage; handoff layer is partially specified

## Scope

The 19 squad directories under `squads/`, their orchestrators (`*-orqx`), their members, the `squad.yaml` manifest contract, and the cross-squad handoff layer (template, tasks, routing rules). Validates: (a) manifest <-> disk sync per squad, (b) orqx <-> member relationship consistency, (c) handoff contract presence and completeness, (d) cross-squad routing rules vs reality.

This audit overlaps with Dim 3 on agent counts but focuses on the *squad* as a unit — its manifest, its workflows, its handoffs.

## 1. Inventory

### 1.1 Squad directories

`ls squads/` returns 19 directories:

```
claude-code-mastery/        squad-cloning/        squad-finance/
squad-animations/           squad-commercial/     squad-growth/
squad-artdir/               squad-content/        squad-paidmedia/
squad-brand/                squad-copy/           squad-product/
squad-claude/               squad-council/        squad-research/
                            squad-courses/        squad-storytelling/
                            squad-cybersecurity/
                            squad-design/
```

19 dirs. Constitution claims 18 (`.sinapse-ai/constitution.md:149`). +1 drift, same as Dim 3 §3.3.

### 1.2 Squad manifest files

Every squad has a `squad.yaml`:

```
$ find squads -maxdepth 2 -name "squad.yaml" | wc -l
19
```

Verified: each of the 19 squads has exactly one `squad.yaml`. No squad is missing the manifest file itself.

### 1.3 Per-squad declared vs actual counts

Method: `grep -m1 "{key}_count" squads/*/squad.yaml | awk '{print $NF}'` for declared; `find squads/{squad}/{subdir} -maxdepth 2 -name "*.md" -o -name "*.yaml" | wc -l` for actual.

| Squad | agents (decl/actual) | tasks (decl/actual) | templates (decl/actual) | KB (decl/actual) | workflows (decl/actual) |
|---|---|---|---|---|---|
| claude-code-mastery | —/8 | —/26 | —/5 | —/1 | —/3 |
| squad-animations | 9/9 ✓ | 75/75 ✓ | 5/5 ✓ | 14/**15** ✗ | 5/5 ✓ |
| squad-artdir | 14/14 ✓ | 13/13 ✓ | 1/1 ✓ | 8/8 ✓ | 3/3 ✓ |
| squad-brand | 15/15 ✓ | 97/97 ✓ | 6/6 ✓ | 30/30 ✓ | 4/4 ✓ |
| squad-claude | 10/10 ✓ | 49/49 ✓ | 0/0 ✓ | 5/**14** ✗ | 2/2 ✓ |
| squad-cloning | 8/**9** ✗ | 54/54 ✓ | 5/5 ✓ | 8/**16** ✗ | 6/6 ✓ |
| squad-commercial | 11/11 ✓ | 85/85 ✓ | 6/6 ✓ | 13/**22** ✗ | 6/6 ✓ |
| squad-content | 7/7 ✓ | 90/90 ✓ | 7/7 ✓ | 32/32 ✓ | 6/6 ✓ |
| squad-copy | —/14 | 0/**81** ✗ | —/7 | —/24 | —/6 |
| squad-council | 11/11 ✓ | 56/56 ✓ | 0/0 ✓ | 3/**11** ✗ | 2/2 ✓ |
| squad-courses | 8/8 ✓ | (not sampled) | (n.s.) | (n.s.) | 6/6 ✓ |
| squad-cybersecurity | 9/9 ✓ | (n.s.) | (n.s.) | (n.s.) | 2/2 ✓ |
| squad-design | —/15 | (n.s.) | (n.s.) | (n.s.) | —/6 |
| squad-finance | 5/5 ✓ | (n.s.) | (n.s.) | (n.s.) | 4/4 ✓ |
| squad-growth | 7/7 ✓ | (n.s.) | (n.s.) | (n.s.) | 6/6 ✓ |
| squad-paidmedia | 9/**10** ✗ | (n.s.) | (n.s.) | (n.s.) | 5/5 ✓ |
| squad-product | 7/7 ✓ | (n.s.) | (n.s.) | (n.s.) | 6/6 ✓ |
| squad-research | 7/**8** ✗ | (n.s.) | (n.s.) | (n.s.) | 6/6 ✓ |
| squad-storytelling | 10/**11** ✗ | (n.s.) | (n.s.) | (n.s.) | 2/2 ✓ |

✗ = drift (declared ≠ actual). ✓ = aligned. — = field missing in `squad.yaml`.

### 1.4 Drift summary across the 19 squads

- **3 squads omit `agents_count`, `tasks_count`, `templates_count`, `knowledge_bases_count`, and `workflows_count` entirely**: `claude-code-mastery`, `squad-copy`, `squad-design`. This is partial drift — they have the manifest file, just no metric block.
- **4 squads have wrong `agents_count`**: cloning (8/9), paidmedia (9/10), research (7/8), storytelling (10/11). All under-count by 1.
- **5 squads have wrong `knowledge_bases_count`**: animations (14/15), claude (5/14), cloning (8/16), commercial (13/22), council (3/11). Most are large under-counts.
- **1 squad has wildly wrong `tasks_count`**: squad-copy declares 0 tasks, has 81. (Possibly because the metric block is incomplete — the only listed metric is `tasks_count: 0`.)

### 1.5 Orqx files

`find squads -name "*-orqx.md"` returns 21 files. Per-squad orqx mapping:

```
squads/claude-code-mastery/agents/swarm-orqx.md       (intra-squad orchestrator)
squads/squad-animations/agents/animations-orqx.md
squads/squad-artdir/agents/artdir-orqx.md
squads/squad-brand/agents/brand-orqx.md
squads/squad-claude/agents/claude-orqx.md             (canonical)
squads/squad-claude/agents/swarm-orqx.md              (DUPLICATE basename, second instance)
squads/squad-claude/agents/tools-orqx.md              (extra orchestrator inside squad-claude)
squads/squad-cloning/agents/cloning-orqx.md
squads/squad-commercial/agents/commercial-orqx.md
squads/squad-content/agents/content-orqx.md
squads/squad-copy/agents/copy-orqx.md
squads/squad-council/agents/council-orqx.md
squads/squad-courses/agents/courses-orqx.md
squads/squad-cybersecurity/agents/cyber-orqx.md
squads/squad-design/agents/design-orqx.md
squads/squad-finance/agents/finance-orqx.md
squads/squad-growth/agents/growth-orqx.md
squads/squad-paidmedia/agents/paidmedia-orqx.md
squads/squad-product/agents/product-orqx.md
squads/squad-research/agents/research-orqx.md
squads/squad-storytelling/agents/storytelling-orqx.md
```

19 squads × 1 primary orqx + `tools-orqx` (extra) + `swarm-orqx` (in 2 squads) = 21 files. Two squads have multiple orqx (squad-claude has claude-orqx + swarm-orqx + tools-orqx; claude-code-mastery has swarm-orqx). The duplicate `swarm-orqx.md` basename is the issue logged in Dim 3 F3-6.

### 1.6 Handoff layer

| Component | File | Status |
|---|---|---|
| Generic handoff template | `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml:1-30+` | Present, 500-token cap declared |
| Cross-squad routing rules | `~/.claude/rules/cross-squad-routing.md` | Present, defines patterns: `brand_launch`, `go_to_market`, `strategic_pivot`, `full_digital_presence`, `security_compliance_audit`, `content_campaign`, `course_launch` |
| Squad-cloning handoff task | `squads/squad-cloning/tasks/generate-cross-squad-handoffs.md` | Present |
| Squad-commercial handoff task | `squads/squad-commercial/tasks/manage-commercial-handoffs.md` | Present |
| Squad-design handoff tasks | `squads/squad-design/tasks/manage-cross-squad-handoffs.md`, `produce-design-handoff-specs.md` | Present |
| Squad-design handoff template | `squads/squad-design/templates/design-handoff-template.md` | Present (squad-specific override) |
| Squad-growth handoff task | `squads/squad-growth/tasks/manage-growth-handoffs.md` | Present |
| Squad-product handoff workflow | `squads/squad-product/.backup/pre-workflow-wrap-...yaml/workflows/product-handoff-cycle.yaml` | **In `.backup/` only** — not active |
| Squad-product handoff tasks | `squads/squad-product/tasks/initiate-product-handoff.md`, `prepare-product-handoff-package.md` | Present |
| Squad-product handoff checklist | `squads/squad-product/checklists/product-handoff-completeness-checklist.md` | Present |

5 of 19 squads (cloning, commercial, design, growth, product) have explicit handoff artifacts. **14 of 19 squads do NOT have a documented handoff contract** beyond the generic template.

### 1.7 Cross-squad routing rules vs reality

`~/.claude/rules/cross-squad-routing.md` declares 7 multi-squad patterns. Spot-check:

- `brand_launch` → "brand + design + content + copy + animations" — all 5 squads exist ✓
- `go_to_market` → "product + commercial + content + paidmedia + growth" — all 5 squads exist ✓
- `strategic_pivot` → "council + research + finance + product" — all 4 squads exist ✓
- `security_compliance_audit` → "cybersecurity + research" — both exist ✓

All 7 patterns reference squads that exist on disk. No dangling references.

## 2. Contract

| Claim | Source `file:line` |
|---|---|
| 18 squads | `.sinapse-ai/constitution.md:149` |
| Each squad has `squad.yaml` with `metadata.{agents,tasks,templates,knowledge_bases,workflows,checklists}_count` | de facto pattern from `squads/squad-brand/squad.yaml:30-37` |
| `squad-validator` enforces schema across all 19 squads | commit 3167776 (Story 10.43, PR #116) |
| Handoff artifact ≤ 500 tokens | `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml:5` |
| 7 cross-squad patterns documented | `~/.claude/rules/cross-squad-routing.md` |
| Single primary orqx per squad | de facto (1 per squad in 17 of 19 cases) |
| Manifest is regenerated by squad-creator on changes | `squads/squad-brand/squad.yaml:28` (`created_by: squad-creator (Craft)`) |

## 3. Reality (this session)

### 3.1 Manifest drift is widespread (10/19 squads)

Per §1.3:

- 3 squads omit metric block entirely (claude-code-mastery, squad-copy, squad-design)
- 4 squads have wrong `agents_count` (cloning, paidmedia, research, storytelling)
- 5 squads have wrong `knowledge_bases_count` (animations, claude, cloning, commercial, council)
- 1 squad has wildly wrong `tasks_count` (squad-copy declares 0, has 81)

Total: **10 of 19 squads** have at least one drifted/missing metric. The squad-validator (PR #116) caught schema drift but not numerical drift. Filed as F6-1.

The pattern of drift is consistent: **declared counts are stale, actual counts are higher**. New tasks/KBs were added to squad directories without updating the manifest. The KB drift is largest because KB authoring is decentralized and lower-friction than agent authoring (which has the mind-clone-governance hook).

### 3.2 squad-claude declares 0 templates correctly, but 5 KB vs 14 actual

`squads/squad-claude/squad.yaml:11`: `description` says "Squad especialista em Claude Code: hooks, MCP servers, subagents, skills, ...". Has `knowledge_bases_count: 5` but disk shows 14 KB files. This is the largest KB drift in absolute terms (along with cloning 8→16 and commercial 13→22).

### 3.3 squad-copy is the worst-drifted squad

`squads/squad-copy/squad.yaml` declares `tasks_count: 0` while disk has 81 task files. This is either a manifest authoring error or a deliberate "I'll fill this later" placeholder that was never filled. squad-validator (PR #116) did not catch arithmetic drift, only schema drift — so a `tasks_count: 0` is schematically valid even if numerically absurd.

### 3.4 Handoff layer is half-built

5 of 19 squads have explicit handoff artifacts (cloning, commercial, design, growth, product). 14 squads rely on the generic template at `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml`. The generic template is not a contract — it is a fillable form. Squads without a custom handoff task have no enforcement that incoming-agent expectations are met.

The cross-squad routing rule (`~/.claude/rules/cross-squad-routing.md`) lists 7 patterns. Each pattern implies a handoff chain (e.g. `brand_launch` = brand → design → content → copy → animations, 4 handoffs). None of those handoffs have explicit acceptance criteria documented in the rule or in any squad's `squad.yaml`.

`squads/squad-product/.backup/pre-workflow-wrap-...yaml/workflows/product-handoff-cycle.yaml` is in `.backup/` — meaning it was deliberately wrapped/disabled at some point. Worth verifying whether it was replaced or just removed.

### 3.5 Constitutional drift on squad count

`.sinapse-ai/constitution.md:149` says 18 squads. `ls squads/` returns 19. Same finding as Dim 3 F3-1, repeated here for completeness because it is *fundamentally* a squad-dimension fact.

### 3.6 squad-claude has 3 orqx files (claude-orqx, swarm-orqx, tools-orqx)

`squads/squad-claude/agents/` contains:
- `claude-orqx.md` — primary
- `swarm-orqx.md` — duplicate basename with `claude-code-mastery/agents/swarm-orqx.md`
- `tools-orqx.md` — secondary orchestrator (referenced in `constitution.md:151` as one of the "20 comandos orqx")

This is structurally fine (a squad CAN have multiple orchestrators) but undocumented. The `cross-squad-routing.md` does not mention which orqx in squad-claude should receive a routing — `@claude-orqx` is the canonical one but `@swarm-orqx` and `@tools-orqx` are siblings.

### 3.7 claude-code-mastery is structurally a squad but lacks the metric block

`squads/claude-code-mastery/squad.yaml` exists but does not declare `agents_count`, `tasks_count`, etc. It is therefore invisible to any tooling that aggregates "total agents across all squads". This squad has 8 agent files on disk — undeclared.

It is also not prefixed `squad-` (the convention used by the 18 others). Naming inconsistency.

## 4. Delta

| Item | Contract | Reality | Status | Severity |
|---|---|---|---|---|
| 18 squads (constitution) | 18 | 19 dirs | DRIFT | P1 (already F3-1) |
| `agents_count` accurate per squad | implied | wrong in 4, missing in 3 | DRIFT | P1 |
| `tasks_count` accurate per squad | implied | wrong in 1 (squad-copy: 0/81), missing in 3 | DRIFT | P1 |
| `knowledge_bases_count` accurate per squad | implied | wrong in 5, missing in 3 | DRIFT | P2 |
| All 19 squads have explicit handoff contract | implied by cross-squad routing | only 5 of 19 do | UNDER-COVERED | P2 |
| Handoff artifact ≤ 500 tokens | template:5 | template enforces; not validated at runtime | DRIFT-by-policy | P3 |
| Single primary orqx per squad | de facto | squad-claude has 3, claude-code-mastery has 1 | DRIFT | P3 |
| Squad naming convention `squad-X` | de facto for 18/19 | `claude-code-mastery` breaks convention | DRIFT | P2 |
| Backup files clean | implied | `squads/squad-product/.backup/...` retains old workflow | NOISE | P3 |
| Cross-squad patterns reference real squads | rule | all 7 patterns reference existing squads ✓ | ALIGNED | — |

## 5. Findings (concrete file:line citations)

### Finding F6-1 — Manifest drift in 10 of 19 squads (P1)

10 squads have at least one wrong or missing metric in `squad.yaml`. Specifically:

- **Wrong agents_count (under-counted by 1):**
  - `squads/squad-cloning/squad.yaml:30` declares 8, disk has 9 (`squads/squad-cloning/agents/*.md` count = 9)
  - `squads/squad-paidmedia/squad.yaml:17` declares 9, disk has 10
  - `squads/squad-research/squad.yaml:31` declares 7, disk has 8
  - `squads/squad-storytelling/squad.yaml:26` declares 10, disk has 11

- **Wrong knowledge_bases_count:**
  - `squads/squad-animations/squad.yaml` declares 14, disk has 15
  - `squads/squad-claude/squad.yaml` declares 5, disk has 14 (-9)
  - `squads/squad-cloning/squad.yaml` declares 8, disk has 16 (-8)
  - `squads/squad-commercial/squad.yaml` declares 13, disk has 22 (-9)
  - `squads/squad-council/squad.yaml` declares 3, disk has 11 (-8)

- **Missing entire metric block:**
  - `squads/claude-code-mastery/squad.yaml` (no agents/tasks/templates/KB counts)
  - `squads/squad-copy/squad.yaml` (declares `tasks_count: 0` despite 81 task files; other counts missing)
  - `squads/squad-design/squad.yaml` (no metric block)

The squad-validator from PR #116 (commit 3167776) did not catch arithmetic drift. It validated schema (YAML-parses, has required keys) but not values.

### Finding F6-2 — Constitution claims 18 squads (P1, mirror of F3-1)

`.sinapse-ai/constitution.md:149`: "18 squads (diretórios com squad.yaml)". `ls squads/` = 19 dirs, all with `squad.yaml`. Already logged in Dim 3 F3-1; repeated here because it is the squad-dimension's most-cited claim.

### Finding F6-3 — squad-copy `tasks_count: 0` is absurd (P1, sub-finding of F6-1)

`squads/squad-copy/squad.yaml` declares `tasks_count: 0`. Disk has 81 task files. This is not 0±N drift — it is a placeholder that was never filled. Any tooling that aggregates "total tasks across all squads" will under-count by 81.

### Finding F6-4 — 14 of 19 squads lack explicit handoff contract (P2)

5 squads have explicit handoff artifacts (squad-cloning has `tasks/generate-cross-squad-handoffs.md`, squad-commercial has `tasks/manage-commercial-handoffs.md`, squad-design has 2 handoff tasks + a template, squad-growth has `tasks/manage-growth-handoffs.md`, squad-product has 2 tasks + a checklist).

The other 14 squads (animations, artdir, brand, claude, claude-code-mastery, content, copy, council, courses, cybersecurity, finance, paidmedia, research, storytelling) do not. They rely on the generic `.sinapse-ai/development/templates/agent-handoff-tmpl.yaml` (a fillable form, not a contract).

The 7 cross-squad patterns in `~/.claude/rules/cross-squad-routing.md` reference handoff chains that span squads without documented handoff contracts. E.g. `brand_launch` chains brand → design → content → copy → animations: brand and design have contracts, content/copy/animations do not.

### Finding F6-5 — squad-claude has 3 orqx, no canonical doc says which one to call (P3)

`squads/squad-claude/agents/` has `claude-orqx.md`, `swarm-orqx.md`, `tools-orqx.md`. The constitution counts them all (`constitution.md:151`: "20 comandos orqx (18 squad orqx + sinapse-orqx + tools-orqx)" — note "tools-orqx" called out separately). The cross-squad-routing rule says "Claude Code mastery → @claude-orqx (Nucleus)" (`~/.claude/rules/mandatory-delegation.md`). But within squad-claude, when does a request go to `swarm-orqx` vs `tools-orqx` vs `claude-orqx`? Undocumented.

### Finding F6-6 — `claude-code-mastery` breaks `squad-X` naming convention (P2)

18 of 19 squads are named `squad-{domain}`. `claude-code-mastery` is the outlier. Its `squad.yaml` is also the only one without a metric block (F6-1). Suggests it was authored before the manifest convention solidified and never harmonized.

This will be touched by the APSE rename — decide convention now to avoid a partial rename.

### Finding F6-7 — `.backup/` directories carry stale workflows (P3)

`squads/squad-product/.backup/pre-workflow-wrap-2026-04-19T22-46-56-863Z/workflows/product-handoff-cycle.yaml` exists. Similar `.backup/` directories likely exist in other squads (8 squads have `.backup/` per `find squads -name ".backup" -type d`). These are not active but they are shipped in the npm package (1161 files per `install-manifest.yaml:14`). Disk-space and confusion cost.

### Finding F6-8 — Cross-squad routing patterns reference real squads ✓ (no finding, positive control)

All 7 patterns in `~/.claude/rules/cross-squad-routing.md` reference squad names that exist on disk. No dangling references. This is the one squad-dimension thing that is fully aligned.

## 6. Severity Roll-Up

- **P0:** 0
- **P1:** 2 (F6-1 manifest drift, F6-2 constitution drift; F6-3 is a sub-finding of F6-1)
- **P2:** 4 (F6-4 handoff coverage, F6-6 naming inconsistency; plus the manifest-missing trio inside F6-1; plus `tasks_count: 0` worth its own line)
- **P3:** 2 (F6-5 multiple orqx in squad-claude, F6-7 `.backup/` noise)

## 7. Recommendations

| # | Action | Owner | Window |
|---|---|---|---|
| R1 | Extend squad-validator (PR #116 trajectory) to validate **arithmetic** counts: declared `agents_count` MUST equal `find squads/{squad}/agents -name "*.md" | wc -l`, etc. for tasks/templates/KB/workflows. Run in CI on every PR. | @devops | Pre-GA, blocks F6-1 |
| R2 | One-shot reconcile pass on the 10 drifted/incomplete squad manifests. Prefer auto-regeneration via the squad-creator script (`created_by: squad-creator`) so the fix is a one-line script run, not a 19-PR campaign. | @sprint-lead → @architect | Pre-GA, paired with R1 |
| R3 | Decide and apply naming convention: rename `claude-code-mastery/` → `squad-claude-code-mastery/` (or merge with `squad-claude/`). This is APSE-rename territory. | @architect → Caio | Pre-APSE rename |
| R4 | For the 14 squads without explicit handoff contract: at minimum, document in each `squad.yaml` which output domains the squad produces (so the next squad in a routing chain knows what to expect). Full handoff tasks per-squad is post-GA work. | @architect | Post-GA acceptable |
| R5 | Document orchestrator hierarchy inside squad-claude: when does claude-orqx vs swarm-orqx vs tools-orqx get invoked? Add to `squad-claude/squad.yaml` or `cross-squad-routing.md`. | @architect | Pre-GA |
| R6 | Decide whether `.backup/` directories ship in npm package. Either: (a) add `.backup/` to npm publish ignore list (`.npmignore`), or (b) delete `.backup/` directories entirely from the repo. | @devops | Pre-GA, low-risk |
| R7 | Add a constitution-counts auto-check (already proposed in Dim 3 R2). The constitution should not hand-encode "18 squads" — it should reference a generated stats block. | @architect + @devops | Pre-GA |

## 8. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **6. Squads** | **CONCERNS** | Zero P0 / 2 P1 / 4 P2 / 2 P3. Manifest drift in 10 of 19 squads (53%) is the headline number. None of this breaks runtime — squads still load, agents still activate, routing still works. But shipping v1 GA with 10 wrong manifests across what the constitution calls "18" squads (actually 19) is a credibility risk. R1 + R2 should ship in the same PR pre-GA. R3 must clear before APSE rename. |

## 9. Blocks rename APSE → SNPS?

**Yes — same soft block as Dim 3.** F6-1 and F6-6 in particular: the rename will touch persona names AND squad directory names. Renaming `claude-code-mastery/` to `squad-X/` is a directory move; combining that with persona-name churn means high blast-radius. R1 + R2 + R3 must clear before APSE rename to avoid renaming on a fuzzy manifest.

## Change Log

- 2026-04-28 — Dim 6 audit completed (Block 2). CONCERNS, soft-blocks APSE rename until R1 + R2 + R3 cleared. @architect (Aria, Visionary).
