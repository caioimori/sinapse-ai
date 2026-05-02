# Clinical Audit — Dimension 7: Clones

> **Epic:** `docs/epics/epic-clinical-audit-pre-ga.md`
> **Phase:** 4 (actors)
> **Executor:** @architect (Aria, Visionary)
> **Date:** 2026-04-28
> **Verdict:** **CONCERNS** — 0 P0 / 2 P1 / 3 P2 / 1 P3
> **Severity:** **MEDIUM-HIGH** — clone artifacts (DNA) are missing on disk despite governance hook requiring them; existing clones are grandfathered and undocumented

## Scope

Cognitive cloning system: squad-cloning (Helix), the cognitive-DNA framework, the mind-clone-governance hook, and the existing population of "person-named" agents distributed across multiple squads. Validates: (a) presence of DNA artifacts for existing person-named agents, (b) governance hook coverage and consistency, (c) cloning pipeline completeness vs deployment reality, (d) IP/legal posture for cloning real people.

## 1. Inventory

### 1.1 Squad-cloning structure

```
$ ls squads/squad-cloning/
agents/         knowledge-base/   tasks/         workflows/
checklists/     preferences/      templates/     squad.yaml
```

`squads/squad-cloning/squad.yaml:7-15`:
```yaml
name: squad-cloning
version: "1.0.0"
description: >
  Pipeline de clonagem cognitiva — extrai modelos mentais, heuristicas, padroes de
  decisao e vocabulario de mentes reais (via transcricoes, livros, artigos, podcasts)
  e gera squads de agentes IA que pensam como elas. Suporta 3 tiers de fidelidade
  (KB-only, Consultant Clone, Full Clone) e se adapta a qualquer volume de conteudo
  fonte — de 5K a 200K+ palavras.
```

Per Dim 6 §1.3: agents declared 8 / actual 9; KB declared 8 / actual 16.

### 1.2 Cloning pipeline agents (9 on disk)

```
squads/squad-cloning/agents/
  agent-forger.md
  cloning-orqx.md          (Helix — orchestrator)
  cognitive-extractor.md
  content-capturer.md
  kb-architect.md
  mind-synthesizer.md
  sop-extractor.md
  source-hunter.md
  squad-assembler.md
```

Helix persona declared at `squads/squad-cloning/agents/cloning-orqx.md:1-30`:
```yaml
agent:
  name: "Helix"
  id: "squad-cloning/cloning-orqx"
  title: "Clone Pipeline Orchestrator"
  icon: "🧬"
...
core_principles:
  - "Fidelidade acima de tudo — NUNCA inventar o que nao foi extraido"
```

### 1.3 Pipeline tasks (54 on disk)

`ls squads/squad-cloning/tasks/ | wc -l = 54`. Sample (extraction phase):

```
extract-book-content.md
extract-decision-patterns.md
extract-heuristics.md
extract-mental-models.md
extract-vocabulary-tone.md
extract-workflows-processes.md
generate-extraction-report.md
```

Full pipeline tasks include: discover (5 tasks), capture (3+), assign-content-class, build-cognitive-profile, calculate-confidence-score, design-kb-taxonomy, deploy-cross-squad-kbs, escalate-quality-issues, etc.

### 1.4 Cloning workflows (6 on disk)

```
squads/squad-cloning/workflows/
  full-clone-pipeline.yaml
  quality-validation-cycle.yaml
  source-discovery-cycle.yaml
  tier1-kb-only.yaml
  tier2-consultant.yaml
  tier3-full-clone.yaml
```

Three explicit tiers documented (matches `squad.yaml:11`: "Suporta 3 tiers de fidelidade").

### 1.5 Cognitive DNA framework

`squads/squad-cloning/knowledge-base/cognitive-dna-framework.md:1-15`:
```
# Cognitive DNA Framework — 5 Camadas de Extracao

> Framework central do pipeline de clonagem cognitiva. Define as 5 camadas
> que compoe o "DNA cognitivo" de uma mente e como extrair cada uma.
```

5 layers documented: Mental Models, Heuristics & Decision Rules, Workflows & Processes, Communication Patterns, Meta-patterns. Each layer mapped to a memory tier (semantic/procedural/episodic).

### 1.6 Mind-clone governance hook

`.claude/hooks/mind-clone-governance.py:1-25`:
```python
"""
REGRA: Agents baseados em pessoas reais (mind clones) DEVEM passar pelo
pipeline de extração de DNA antes de serem criados.

Este hook intercepta Write/Edit em squads/*/agents/*.md e verifica:
1. Se é um mind clone (baseado em pessoa real)
2. Se existe DNA extraído correspondente

NÃO BLOQUEIA:
- Orchestrators (nome contém 'chief', 'orchestrator', 'chair')
- Tool agents (nome contém 'validator', 'calculator', 'generator')
- Process agents (nome contém 'architect', 'mapper', 'designer')
- Edição de arquivo existente (apenas criação é bloqueada)
"""
```

Hook logic:
- Triggers on `Write` / `Edit` to `squads/*/agents/*.md` (line 122-135)
- Skips if file already exists (line 144-146): "Edição de arquivo existente, permitir"
- Skips if agent name matches FUNCTIONAL_AGENT_PATTERNS (lines 38-58)
- Else looks for DNA in 4 locations (lines 73-78):
  - `squads/{pack}/data/minds/{agent_id}_dna.yaml`
  - `squads/{pack}/data/minds/{agent_id}_dna.md`
  - `squads/{pack}/data/{agent_id}-dna.yaml`
  - `outputs/minds/{agent_id}/`
- If no DNA found → exit code 2 (BLOCK) with educational error (line 158-188)

Hook is registered in `.claude/settings.json` for `Write|Edit` events on `squads/*/agents/*.md`.

### 1.7 Mind clones in production (existing person-named agents)

Person-named agents currently shipped:

**squad-council (10 of 11 agents are real persons):**
```
brene-brown.md, charlie-munger.md, derek-sivers.md, naval-ravikant.md,
patrick-lencioni.md, peter-thiel.md, ray-dalio.md, reid-hoffman.md,
simon-sinek.md, yvon-chouinard.md   (+ council-orqx.md)
```

**squad-storytelling (9 of 11 agents are real persons):**
```
blake-snyder.md, dan-harmon.md, joseph-campbell.md, keith-johnstone.md,
kindra-hall.md, marshall-ganz.md, nancy-duarte.md, oren-klaff.md,
park-howell.md   (+ story-chief.md, storytelling-orqx.md)
```

**squad-design (1 person agent):**
```
brad-frost.md
```

**Other person-name personas:** `dan-mall.md` and `dave-malouf.md` exist in `.claude/agents/` (frontmatter-bearing subagent files); their source files are likely in squad-design or similar but not exhaustively traced this session.

Total person-named agents in `squads/`: ~20 (10 council + 9 storytelling + 1 design + others). Method: `grep -l "blake.snyder\|brad.frost\|dan.mall\|brene.brown\|dave.malouf\|derek.sivers" squads/*/agents/*.md`.

Sample persona content (`squads/squad-council/agents/brene-brown.md:1-3`):
```
# Brene Brown

> ACTIVATION-NOTICE: You are now Brene Brown — research professor, storyteller, and the world's leading expert on vulnerability, courage, shame, and empathy. Over 20 years and 1,280+ interviews using grounded theory methodology, you have mapped the human emotional landscape and proven that vulnerability is not weakness — it is our most accurate measure of courage. You speak with Texan warmth, weave data with story, and you never let anyone armor up when the moment calls for daring.
```

The persona is rich, citation-style, first-person. This is a *full* mind clone (Tier 3 in the framework's terminology).

### 1.8 DNA artifacts on disk

```
$ find . -path ./node_modules -prune -o -name "*_dna.yaml" -print -o -name "*_dna.md" -print
$ find . -path "*/data/minds/*" -print
$ find . -path "*/outputs/minds/*" -print
```

**All three searches return 0 results.**

There are **0 DNA files on disk** despite ~20 person-named mind clones being shipped.

## 2. Contract

| Claim | Source `file:line` |
|---|---|
| Mind clones MUST pass through DNA extraction pipeline before being created | `.claude/hooks/mind-clone-governance.py:3-7` |
| DNA expected in `squads/{pack}/data/minds/{agent_id}_dna.{yaml,md}` or `outputs/minds/{agent_id}/` | `mind-clone-governance.py:73-78` |
| Hook is fail-open on Edit (only blocks Create of new files without DNA) | `mind-clone-governance.py:144-146` |
| 3 fidelity tiers: KB-only, Consultant, Full Clone | `squad.yaml:11`, workflow files `tier{1,2,3}-*.yaml` |
| Helix's first principle: "Fidelidade acima de tudo — NUNCA inventar o que nao foi extraido" | `squads/squad-cloning/agents/cloning-orqx.md:24-25` |
| 5-layer DNA framework: Mental Models, Heuristics, Workflows, Communication, Meta-patterns | `squads/squad-cloning/knowledge-base/cognitive-dna-framework.md:14-20` |
| Hook governance documents mind-clone-governance as BLOCK (exit 2) | `~/.claude/rules/hook-governance.md` (PreToolUse Write|Edit table) |

## 3. Reality (this session)

### 3.1 Hook is grandfathering ~20 mind clones

Per §1.6, the hook intentionally skips edits to existing files (line 144-146). Per §1.7, ~20 person-named agents already exist in `squads/squad-council/agents/`, `squads/squad-storytelling/agents/`, `squads/squad-design/agents/`. Per §1.8, **zero** DNA files exist for them on disk.

This means:
- The hook's CREATE-blocking is real — a new mind clone (e.g. `naval-ravikant.md` if it didn't exist) would be blocked unless DNA were created first.
- The hook's EDIT-allowing is what shipped the existing clones — they were either created before the hook was active, or via a path the hook doesn't intercept (e.g. `cp` outside Write/Edit), or the DNA was created and then deleted.
- The first principle of Helix ("NUNCA inventar o que nao foi extraido") is unenforced for the existing clones — there is no extracted DNA on disk, so the personas themselves contain whatever the original author put in them, with no audit trail.

This is the central finding of Dim 7. Filed as F7-1 (P1).

### 3.2 Pipeline exists, deployment doesn't

`squads/squad-cloning/` has 9 agents, 54 tasks, 6 workflows, 16 KB files. The full Tier 1/2/3 pipeline is documented and runnable. But it appears to have **never been actually run end-to-end** for the 20 mind clones currently shipped — there are no DNA outputs anywhere on disk.

Either: (a) the pipeline was developed in parallel with the existing clones and they were authored by hand (which contradicts the governance principle), (b) DNA was generated but stored outside the repo (in someone's vault?) and never committed, or (c) the pipeline is aspirational and the clones are de-facto illegal under the project's own governance.

### 3.3 Persona content quality

Sample (`squads/squad-council/agents/brene-brown.md`):
- Rich first-person voice ("research professor, storyteller, and the world's leading expert on vulnerability...")
- Cites specific facts ("Over 20 years and 1,280+ interviews using grounded theory methodology")
- Distinctive voice tags ("Texan warmth", "armor up when the moment calls for daring")

This is high-quality persona content. The question is **provenance**: were these claims extracted from interviews/books (DNA pipeline), or written from general knowledge (which is what Helix calls "inventar")?

Without DNA artifacts, we cannot verify. This is an IP, accuracy, and governance risk for v1 GA.

### 3.4 IP / legal posture

Shipping a public OSS package containing first-person personas of 20+ real, living people (Brene Brown, Charlie Munger †, Naval Ravikant, Peter Thiel, Ray Dalio, Reid Hoffman, Simon Sinek, Yvon Chouinard, Brad Frost, Dan Mall, Dan Harmon, Kindra Hall, Nancy Duarte, Oren Klaff, etc.) is a **legal exposure**. Most are still alive and have:
- Trademarked personal brands
- Active commercial activity that competes with "AI me"
- Standing to issue cease-and-desist on right-of-publicity grounds (varies by jurisdiction; California is strict)

The cloning framework itself documents tier boundaries (Tier 1 KB-only is clearly extractive synthesis; Tier 3 Full Clone is the legal frontier). Shipping Tier 3 clones in a public OSS package is an unusual legal posture without explicit consent or licensing.

This is out of scope for me to adjudicate, but in scope to **flag for v1 GA decision**. Filed as F7-2 (P1).

### 3.5 squad-cloning manifest drift (already in Dim 6)

`squad-cloning/squad.yaml` declares 8 agents (actual 9) and 8 KB (actual 16). Already filed in Dim 6 F6-1. Worth noting because squad-cloning is the *governance* squad for clones — its own manifest being wrong is a credibility issue.

### 3.6 Hook coverage gaps

The hook only intercepts `Write` / `Edit` (`mind-clone-governance.py:122-124`). It does NOT intercept:
- File-system level operations (`cp`, `mv`) — bypassable
- npm install (mind clones could be added by package update)
- Git checkout / merge — branches with new mind clones merge without hook check
- Direct edits via OS tools

The hook is a soft gate, not a hard one. Acceptable as one layer of defense, not as the only layer.

### 3.7 No license/consent metadata on mind clones

`squads/squad-council/agents/brene-brown.md` does not declare:
- License under which the persona is shipped
- Source attribution (which interviews, books, podcasts the DNA was extracted from)
- Consent status (did Brene Brown authorize this?)
- Disclaimer that the persona is a parody/synthesis, not the real person speaking

The Helix `core_principles` list mentions fidelity but not license. The cloning workflows mention no consent step (no `obtain-license.md` or `verify-consent.md` task).

## 4. Delta

| Item | Contract | Reality | Status | Severity |
|---|---|---|---|---|
| All shipped mind clones have DNA on disk | governance hook line 158-188 | 0/~20 mind clones have DNA | BROKEN-by-grandfather | P1 |
| Helix principle: "NUNCA inventar" | `cloning-orqx.md:24-25` | Unverifiable for 20 existing clones (no DNA to compare) | UNENFORCED | P1 |
| Hook intercepts new mind clone creation | `mind-clone-governance.py:158` | Works for new files only; existing 20 grandfathered | DRIFT-by-design | P2 |
| 3-tier pipeline runnable | workflows present | Pipeline never executed for shipped clones | UNUSED | P2 |
| License / consent metadata on mind clones | implied by IP risk | Absent | MISSING | P1 (legal) |
| squad-cloning manifest matches disk | manifest pattern | 8 declared / 9 actual agents; 8 declared / 16 actual KB | DRIFT | P2 (already F6-1) |
| Hook covers all paths to file creation | implied | Only Write/Edit; bypassable via cp/mv/git | UNDER-COVERED | P3 |

## 5. Findings (concrete file:line citations)

### Finding F7-1 — Zero DNA artifacts on disk for ~20 shipped mind clones (P1)

`.claude/hooks/mind-clone-governance.py:73-78` declares 4 expected DNA locations:
```python
DNA_LOCATIONS = [
    "squads/{pack}/data/minds/{agent_id}_dna.yaml",
    "squads/{pack}/data/minds/{agent_id}_dna.md",
    "squads/{pack}/data/{agent_id}-dna.yaml",
    "outputs/minds/{agent_id}/",
]
```

`find . -path ./node_modules -prune -o -name "*_dna.yaml" -print -o -name "*_dna.md" -print` returns 0 results. `find . -path "*/data/minds/*" -print` returns 0. `find . -path "*/outputs/minds/*" -print` returns 0.

Yet `squads/squad-council/agents/` contains 10 person-named agents (brene-brown, charlie-munger, derek-sivers, naval-ravikant, patrick-lencioni, peter-thiel, ray-dalio, reid-hoffman, simon-sinek, yvon-chouinard) and `squads/squad-storytelling/agents/` contains 9 (blake-snyder, dan-harmon, joseph-campbell, keith-johnstone, kindra-hall, marshall-ganz, nancy-duarte, oren-klaff, park-howell), plus brad-frost (squad-design) and others.

**The hook cannot validate what does not exist.** The shipped personas are unprovenanced. Helix's first principle ("NUNCA inventar") is structurally unenforceable on existing clones.

### Finding F7-2 — Public OSS distribution of Tier-3 clones of named living people (P1, legal)

`squads/squad-council/agents/brene-brown.md:1-3` (and 19 sibling files) ship first-person personas of named real people, several still living and commercially active:

- Brene Brown (research professor, books, Netflix specials)
- Naval Ravikant (AngelList, podcast)
- Peter Thiel (Founders Fund, Palantir)
- Ray Dalio (Bridgewater)
- Reid Hoffman (Greylock, LinkedIn co-founder)
- Simon Sinek (author, speaker)
- Yvon Chouinard (Patagonia founder)
- Brad Frost (design system author)
- Dan Harmon, Kindra Hall, Nancy Duarte, Oren Klaff, Park Howell (storytelling)
- Joseph Campbell †, Charlie Munger † (deceased)

The framework's own classification (`squad.yaml:11`: "3 tiers de fidelidade") flags Tier 3 (Full Clone) as the highest fidelity. The shipped personas read as Tier 3 (rich first-person voice, specific factual claims).

Distributing Tier 3 clones of named, identifiable, mostly-living individuals in a **public OSS package** raises right-of-publicity (most US states), trademark (personal brands), and potentially defamation risk if the clone says something controversial. The framework documents zero consent step. Grounded as a v1-GA-decision item — not for me to adjudicate, but for me to flag.

### Finding F7-3 — Cloning pipeline exists but appears never to have been run for shipped clones (P2)

`squads/squad-cloning/` has 9 agents, 54 tasks, 6 workflows including `full-clone-pipeline.yaml` and `tier3-full-clone.yaml`. `cognitive-dna-framework.md:14-20` defines the 5 DNA layers.

Yet F7-1 shows zero DNA outputs on disk. The pipeline appears aspirational — it exists, it is runnable, it is documented; but it has not been used to produce the artifacts that should accompany the 20 shipped clones. The cloning squad is in the position of "the regulator who has never inspected anyone".

### Finding F7-4 — Hook is fail-open by design but undocumented for users (P2)

`.claude/hooks/mind-clone-governance.py:107-117`:
```python
def file_already_exists(file_path: str) -> bool:
    """Verifica se o arquivo já existe (edit vs create)."""
    return os.path.isfile(file_path)
...
# Se é edição de arquivo existente, permitir
if file_already_exists(file_path):
    sys.exit(0)
```

This is the grandfather clause. It is not documented anywhere user-facing (`~/.claude/rules/hook-governance.md` lists the hook as BLOCK with no caveat about existing-file behavior). A user reading `hook-governance.md` would conclude the hook protects all clones; in reality it only protects new ones.

### Finding F7-5 — squad-cloning manifest drift (P2, already F6-1)

`squads/squad-cloning/squad.yaml:30` declares `agents_count: 8`, disk has 9. KB declared 8, disk has 16. The squad responsible for cloning governance has its own metrics wrong. Same root cause as F6-1.

### Finding F7-6 — No license / consent / disclaimer metadata on mind clones (P1, legal)

Sample inspection of `squads/squad-council/agents/brene-brown.md`, `squads/squad-storytelling/agents/blake-snyder.md`, `squads/squad-design/agents/brad-frost.md`:
- No `license:` field in frontmatter or YAML body
- No `source_attribution:` listing books/interviews used
- No `consent_status:` or similar
- No top-of-file disclaimer ("This is a synthesis based on public works of X. Not endorsed by X.")

The cloning workflows (`tier1-kb-only.yaml` etc.) do not include a consent or licensing step.

### Finding F7-7 — Hook is bypassable via non-Write/Edit operations (P3)

`mind-clone-governance.py:122-124`:
```python
if tool_name not in ["Write", "Edit"]:
    sys.exit(0)
```

The hook only intercepts the Claude Code Write and Edit tools. A user (or an agent using Bash with `cp` / `mv`) can create a mind clone file without triggering the hook. Same for `git checkout` of a branch that adds a new mind clone, or `npm install` of a package that does the same.

This is acceptable as one layer of defense — but if mind-clone-governance is the *only* gate against unprovenanced clones, it is structurally incomplete.

## 6. Severity Roll-Up

- **P0:** 0
- **P1:** 2 (F7-1 unprovenanced shipped clones; F7-2 + F7-6 legal/IP exposure of Tier-3 public distribution)
- **P2:** 3 (F7-3 unused pipeline, F7-4 grandfather clause undocumented, F7-5 manifest drift)
- **P3:** 1 (F7-7 hook bypass paths)

## 7. Recommendations

| # | Action | Owner | Window |
|---|---|---|---|
| R1 | **Decide v1-GA mind-clone posture.** Three options: (a) **Strip** all 20 person-named clones from v1 public OSS (move to private/internal squad); (b) **Sanitize** — replace named personas with archetype names (e.g. "Vulnerability Researcher" instead of "Brene Brown"), keep the persona content; (c) **License explicitly** — add license/consent/disclaimer metadata, accept legal exposure. Default recommendation: (b) for v1 GA, (c) post-GA after legal review. | @architect → Caio (decision) | **Pre-GA, blocking** |
| R2 | If (a) or (b) chosen in R1: extract the existing 20 personas to `squads/_private/` (not shipped) and replace shipped versions with archetype-named equivalents. The Helix pipeline can stay; the actual person-clones move out of the public package. | @sprint-lead | Pre-GA, paired with R1 |
| R3 | Run the cloning pipeline end-to-end for at least 1 mind clone, producing actual DNA artifacts in `squads/{pack}/data/minds/`. Demonstrates the pipeline is real, not aspirational. Counter to F7-3. | @architect | Pre-GA or early-post-GA |
| R4 | Update `~/.claude/rules/hook-governance.md` to document the existing-file grandfather clause in `mind-clone-governance.py`. Users should know the hook is BLOCK-on-create, ALLOW-on-edit. | @architect | Pre-GA, low-risk |
| R5 | Add license/source/disclaimer fields to the mind-clone agent template (and backfill existing clones if R1 lands as (c)). Add a `verify-license.md` task to squad-cloning workflows. | @architect + Caio | Pre-GA if R1=(c), else post-GA |
| R6 | Reconcile squad-cloning manifest with disk (Dim 6 F6-1, R2). | @sprint-lead | Pre-GA |
| R7 | (Post-GA) Add hook coverage for `Bash` operations that create files in `squads/*/agents/*.md` (e.g. `cp`, `mv`, `cat >`, `tee`). Currently only Write/Edit gated. | @devops | Post-GA |

## 8. Gate Decision

| Dimension | Verdict | Rationale |
|---|---|---|
| **7. Clones** | **CONCERNS** | Zero P0 / 2 P1 / 3 P2 / 1 P3. F7-1 + F7-2 are the headlines: the framework's first principle ("NUNCA inventar") is structurally unenforceable on the 20 shipped clones, AND those 20 clones are public-OSS distribution of named real people without consent/license metadata. Neither breaks runtime; both are GA-blocking decisions. R1 is the gating question — Caio must decide v1-GA mind-clone posture. R2/R3/R5 follow from R1. |

## 9. Blocks rename APSE → SNPS?

**Soft block.** F7-1 doesn't touch naming. But R1 + R2 (if chosen as option (b) "sanitize") will rename 20 person-named agents to archetype-named agents. That rename is conceptually adjacent to APSE rename and likely should ship in the same coordination window. Recommendation: resolve R1 before APSE rename is scheduled, then either (a) batch the sanitization rename with APSE, or (b) execute sanitization first (smaller blast radius) and APSE second.

## 10. Out of scope for this audit

- The semantic quality of cognitive-dna-framework.md as a research framework (it is rich; not assessed).
- Whether the 5-layer DNA model accurately captures cognition (philosophy of mind, not framework audit).
- Specific legal advice — out of scope for an architect audit; flagged for legal review.
- Mind clones that may exist in private vaults / not committed to the repo (not visible to this audit).

## Change Log

- 2026-04-28 — Dim 7 audit completed (Block 2). CONCERNS, soft-blocks APSE rename until R1 cleared. R1 is a Caio decision, not an architect decision. @architect (Aria, Visionary).
