# SINAPSE Framework Evolution Pipeline

**Status:** Draft v1.0
**Date:** 2026-05-07
**Author:** @sinapse-orqx
**Approval gate:** Caio Imori (sole orchestrator approver)
**Triggered by:** Sessão de correção Wave 1.A revelou que descobertas de auditoria em projetos consumidores não retornavam ao framework como evolução formal

---

## Purpose

Define how the SINAPSE framework (`sinapse-ai`) evolves from real-world findings discovered in consumer projects. The framework is not static — it grows via **audited evidence** from production usage. This document specifies the formal pipeline:

```text
Project audit → Finding → Proposal → Caio Imori approval → sinapse-ai PR → Distribution
```

Without this pipeline:
- Findings die in project RUN-LOGs
- The same lessons get re-learned in every new epic
- Framework conventions drift as each project re-invents
- Tokens are spent re-discovering what was already discovered

With this pipeline:
- Every audit finding is a candidate framework evolution
- Caio Imori as orchestrator decides what is generic enough to promote
- Approved findings ship as framework PRs (rules, agents, hooks, tasks, templates)
- Consumer projects pull the evolved framework on next sync

---

## Roles

### Auditor (any agent or Caio Imori)
- Identifies a finding during project work that may have framework-wide implications
- Writes the finding using the AuditFinding template (below)
- Submits to the Proposal Gate

### Proposer (typically @sinapse-orqx or domain specialist)
- Receives an AuditFinding
- Decides: scope-bound (project-only) vs framework-candidate
- If framework-candidate: drafts a FrameworkProposal using template (below)
- Includes: pattern generalization, target framework artifact, migration path, deprecation plan

### Approver (Caio Imori — sole authority)
- Reviews FrameworkProposal
- Decides: APPROVED / REJECTED / NEEDS_REVISION
- If APPROVED: signs the proposal with `orchestrator_decision` field + timestamp
- Approval triggers PR creation against `sinapse-ai`

### Implementer (@sinapse-orqx + relevant specialist)
- Opens PR in `sinapse-ai` with the changes specified in approved proposal
- Updates: agent definitions, rules, hooks, tasks, templates, governance docs
- Cross-references the source AuditFinding and FrameworkProposal in PR description

### Distributor (the consumer projects, on demand)
- Consumer project pulls latest `sinapse-ai` (via npm install / git submodule / vendored copy)
- Existing project conventions evolve to match new framework

---

## Triggers

A finding becomes a candidate for framework evolution when **at least one** of these is true:

| Trigger | Example |
|---|---|
| Same problem appears in 2+ projects | (none yet for initial audits — N=1 currently) |
| Same problem could affect any future project of similar type | YOLO terminal inventing vocabulary without dictionary lookup → **could happen in any DB-touching project** |
| Existing framework rule was violated and the violation was undetectable | Rule `prompt-language.md` (English-only for LLM prompts) was violated; no enforcement existed |
| Existing framework artifact is missing or insufficient | `@sinapse-orqx` lacks `triage.routing_matrix` for squad consultation |
| Audit reveals architectural convention drift | Multiple vocabularies coexist in same domain — needs canonical store pattern |
| Workflow gate is missing or asymmetric | Gate G0 marked passed based on static CI; no runtime validation |

**Auditor flag:** when writing a finding, the auditor MUST mark `framework_candidate: true|false` with rationale.

---

## Templates

### AuditFinding (YAML)

Lives in: `<project>/docs/audits/<finding-id>.yaml` initially. If approved as framework-candidate, copy to `audits/promoted/<finding-id>.yaml`.

```yaml
audit_finding:
  version: "1.0"
  id: "AF-<YYYYMMDD>-<slug>"          # e.g., AF-20260507-vocabulary-contract-failure
  date: "<ISO-8601>"
  auditor: "<agent-id or caioimori>"
  source_session: "<short summary of session that discovered>"

  context:
    project: "<project name>"
    epic: "<epic id>"
    triggered_by: "<event that exposed the finding>"

  finding:
    summary: "<one-sentence finding>"
    evidence:
      - "<concrete evidence 1>"
      - "<concrete evidence 2>"
    impact_observed:
      blast_radius: "low|medium|high|critical"
      affected_artifacts: ["<list>"]
      cost: "<tokens, time, prod incidents, etc>"

  framework_candidate: true|false
  framework_candidate_rationale: |
    <why this is or isn't a framework concern>

  references:
    - kind: ADR
      path: "<path>"
    - kind: code
      path: "<path>"

  proposed_disposition:
    - "<short disposition 1, e.g., 'add hook', 'extend agent triage', 'create rule'>"
```

### FrameworkProposal (YAML)

Lives in: `governance/proposals/PROP-<YYYYMMDD>-<slug>.yaml`.

```yaml
framework_proposal:
  version: "1.0"
  id: "PROP-<YYYYMMDD>-<slug>"
  date: "<ISO-8601>"
  proposer: "<agent-id>"
  source_finding: "AF-<YYYYMMDD>-<slug>"

  target:
    layer: "L1|L2|L3"                 # framework boundary layers (see boundary docs)
    artifact_type: "agent|rule|hook|task|template|governance|workflow"
    artifact_path: "<intended path in sinapse-ai>"
    operation: "create|modify|deprecate"

  generalization:
    pattern_name: "<name of the pattern>"
    when_to_apply: |
      <conditions under which any project should apply this>
    examples_from_other_domains: ["<list>"]

  migration_path:
    breaking_change: true|false
    affected_consumers: ["<list of projects/agents that need updating>"]
    rollout_plan: |
      <steps to apply without breaking existing consumers>

  deprecation_plan:
    deprecates: ["<list of artifacts being replaced>"]
    sunset_window: "<duration, e.g., '2 weeks after merge'>"

  cost_benefit:
    cost: "<engineering effort, token cost, complexity added>"
    benefit: "<problems prevented, tokens saved, audit improved>"
    risk: "<low|medium|high — what could go wrong>"

  approval:
    orchestrator_decision: "PENDING|APPROVED|REJECTED|NEEDS_REVISION"
    approved_at: "<ISO-8601 or null>"
    decision_rationale: |
      <reasoning, especially if reject or needs-revision>
    revision_request: ["<list>"]      # filled if NEEDS_REVISION

  implementation:
    pr_url: "<filled when PR opens>"
    merged_at: "<ISO-8601 when shipped>"
    distributed_to: ["<projects that pulled the change>"]
```

---

## Decision flow

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Project session discovers issue                          │
│    (auditor agent or Caio Imori)                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Auditor writes AuditFinding YAML                         │
│    Lives in <project>/docs/audits/                          │
│    Marks framework_candidate: true|false                    │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        false (scope-bound)          true (framework candidate)
              │                             │
              ▼                             ▼
       Project handles it          ┌─────────────────────┐
       internally; finding         │ 3. @sinapse-orqx or  │
       archived in project.        │    domain specialist │
                                   │    drafts            │
                                   │    FrameworkProposal │
                                   └──────────┬──────────┘
                                              │
                                              ▼
                                   ┌─────────────────────┐
                                   │ 4. Caio Imori reviews│
                                   │    APPROVED / REJECTED│
                                   │    / NEEDS_REVISION  │
                                   └──────────┬──────────┘
                                              │
                       ┌──────────────────────┼──────────────────────┐
                       │                      │                      │
                     APPROVED             NEEDS_REVISION           REJECTED
                       │                      │                      │
                       ▼                      ▼                      ▼
              ┌──────────────────┐    Loop back to        Document why,
              │ 5. PR opens in    │    proposer          archive proposal,
              │    sinapse-ai with│    with revision     close finding.
              │    changes        │    notes
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ 6. CI + review +  │
              │    merge          │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │ 7. Consumer       │
              │    projects pull  │
              │    on next sync   │
              └──────────────────┘
```

---

## Worked example

This is what the pipeline would look like for a hypothetical vocabulary contract failure discovered in a SINAPSE consumer project.

### AuditFinding `AF-20260507-vocabulary-contract-failure.yaml`

```yaml
audit_finding:
  version: "1.0"
  id: "AF-20260507-vocabulary-contract-failure"
  date: "2026-05-07T17:00:00Z"
  auditor: "@sinapse-orqx"
  source_session: "Wave 1.A correction session; DB migration failed due to invented vocabulary"

  context:
    project: "sinapse-plataform"
    epic: "EPIC-MVP-ONBOARDING"
    triggered_by: "Migration apply failed due to invented PT-BR vocabulary not in dictionary"

  finding:
    summary: "YOLO terminal can write a migration with invented vocabulary because no pre-flight forces dictionary lookup."
    evidence:
      - "Migration used humanized PT-BR invented in YOLO session"
      - "Multiple vocabularies coexist in same domain"
      - "Dictionary existed but was never consulted"
      - "Static CI passed; runtime pgTAP never ran"
    impact_observed:
      blast_radius: "high"
      affected_artifacts: ["migration", "Wave 1.A gate G0", "EPIC-MVP-ONBOARDING timeline"]
      cost: "1 reverted migration, ~80 minutes audit + correction session"

  framework_candidate: true
  framework_candidate_rationale: |
    Any DB-touching project under SINAPSE faces this risk. The fix is not project-specific:
    1. Pre-flight hook on Edit/Write of supabase/migrations/*.sql
    2. Vocabulary contract pattern as framework convention
    3. @sinapse-orqx triage matrix to consult db-inventory before delegating

  references:
    - kind: ADR
      path: "docs/decisions/ADR-DBOPS-V1-vocabulary-contract-failure.md"
    - kind: hook
      path: ".claude/hooks/migration-dictionary-guard.cjs"

  proposed_disposition:
    - "Promote migration-dictionary-guard.cjs to sinapse-ai hooks/ as framework hook"
    - "Extend @sinapse-orqx with triage.routing_matrix consulting db-inventory before migration tasks"
    - "Document Vocabulary Contract pattern in governance/patterns/"
```

### FrameworkProposal `PROP-20260507-vocabulary-contract.yaml`

```yaml
framework_proposal:
  version: "1.0"
  id: "PROP-20260507-vocabulary-contract"
  date: "2026-05-07T18:30:00Z"
  proposer: "@sinapse-orqx"
  source_finding: "AF-20260507-vocabulary-contract-failure"

  target:
    layer: "L1+L2"
    artifact_type: "rule|hook|agent|governance"
    artifact_path: |
      Multiple:
      - .claude/rules/vocabulary-contract.md (NEW)
      - hooks/migration-dictionary-guard.cjs (NEW, copied + generalized)
      - .sinapse-ai/development/agents/snps-orqx.md (MODIFY: add triage.routing_matrix)
      - governance/patterns/vocabulary-store.md (NEW pattern doc)
    operation: "create|modify"

  generalization:
    pattern_name: "Vocabulary Contract Store"
    when_to_apply: |
      Whenever a project has a domain enum or text[] column that:
      1. Has multiple writers (UI form + RPC + scraper + manual SQL)
      2. Has multiple consumer surfaces (DB CHECK + Zod + UI labels + LLM context)
      3. Has historical drift (legacy values that don't match current convention)
    examples_from_other_domains:
      - "Marketing: campaign_status (lead, qualified, converted, churned)"
      - "Finance: payment_method, billing_responsible enums"

  migration_path:
    breaking_change: false
    affected_consumers: ["sinapse-plataform"]
    rollout_plan: |
      1. PR adds files to sinapse-ai (no existing files broken)
      2. sinapse-plataform pulls sinapse-ai update on next sync
      3. Project-local hook is replaced by sinapse-ai version
      4. Documentation cross-references updated

  deprecation_plan:
    deprecates: ["sinapse-plataform/.claude/hooks/migration-dictionary-guard.cjs (project-local copy)"]
    sunset_window: "Immediate after framework version pulled"

  cost_benefit:
    cost: "~3-4 hours engineering to generalize hook + write pattern doc + extend @sinapse-orqx"
    benefit: "Prevents the same failure mode in any future SINAPSE project."
    risk: "low — additive changes; no existing behavior modified"

  approval:
    orchestrator_decision: "PENDING"
    approved_at: null
    decision_rationale: ""
    revision_request: []

  implementation:
    pr_url: ""
    merged_at: ""
    distributed_to: []
```

This is the artifact Caio Imori reviews. On `APPROVED`, the PR opens in `sinapse-ai`.

---

## Operational rules

1. **No framework change without an approved proposal.** Even if @sinapse-orqx spots an opportunity, it MUST go through the pipeline. Caio Imori is the gate.
2. **Project-bound findings stay project-bound.** Not every audit promotes. The `framework_candidate: false` path is normal and healthy.
3. **Agent opinions are evidence, not authority.** Agent analysis is input to the proposal but cannot bypass Caio Imori.
4. **Approval is per-proposal, not per-class.** Approving one vocabulary-contract proposal does not auto-approve future similar ones.
5. **Reverts use the pipeline.** If a framework change shipped and proves harmful, a new proposal `PROP-<date>-revert-<id>` opens. Same gate.
6. **All proposals (approved + rejected + revised) archived forever.** They are the institutional memory of the framework's evolution.

---

## Storage layout in sinapse-ai

```text
sinapse-ai/
├── audits/
│   ├── README.md                              # explains this folder
│   ├── promoted/                              # findings that became proposals
│   │   └── AF-<YYYYMMDD>-<slug>.yaml
│   └── archived/                              # findings that stayed scope-bound (project-only)
│       └── (none yet)
├── governance/
│   ├── evolution-pipeline.md                  # this document
│   ├── handoff-types.md                       # contract handoff vs micro-handoff (TBD)
│   ├── proposals/
│   │   ├── README.md                          # explains this folder
│   │   ├── PROP-<YYYYMMDD>-<slug>.yaml
│   │   └── archive/                           # rejected or superseded proposals
│   ├── patterns/
│   │   ├── README.md                          # catalog of approved patterns
│   │   └── <pattern-name>.md                  # (created on first APPROVED proposal)
│   └── templates/
│       ├── audit-finding-tmpl.yaml            # YAML template for AuditFindings
│       └── framework-proposal-tmpl.yaml       # YAML template for FrameworkProposals
```

---

## Out of scope (this version)

- Automated detection of framework-candidate findings (would need ML/heuristic; future work)
- Multi-orchestrator approval (currently Caio Imori is sole approver; future may add @architect or @quality-gate as co-approvers for non-strategic changes)
- Cross-organization adoption (this is internal to SINAPSE projects for now)
- Versioning sinapse-ai releases (already handled by `CHANGELOG.md` and `package.json` version)

---

— @sinapse-orqx, formalizing the R&D evolution pipeline for the SINAPSE framework
