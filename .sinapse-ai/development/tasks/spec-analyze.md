# Spec Pipeline: Analyze Cross-Consistency

> **Phase:** 7 - Analyze (final, READ-ONLY)
> **Owner Agent:** @quality-gate
> **Pipeline:** spec-pipeline

---

## Purpose

Provar, antes de gastar geração de código, que cada requisito virou task e que nada contradiz a
constituição do projeto. Roda DEPOIS de `plan` (fase final do pipeline) e ANTES do handoff para
implementação. É um gate **READ-ONLY**: não modifica nenhum arquivo — apenas lê spec ↔ plan ↔ tasks
↔ constitution, roda 6 passes de detecção e emite uma matriz requisito→task com lacunas e
inconsistências classificadas por severidade. Qualquer conflito constitucional é automaticamente
CRITICAL e bloqueia a implementação.

---

## autoClaude

```yaml
autoClaude:
  version: '3.0'
  pipelinePhase: spec-analyze

  elicit: false
  deterministic: true # Same artifacts = same findings
  composable: true

  readOnly: true # Contract: never mutate any file
  selfCritique:
    required: false

  inputs:
    - name: storyId
      type: string
      required: true

    - name: spec
      type: file
      path: docs/stories/{storyId}/spec/spec.md
      required: true

    - name: plan
      type: file
      path: docs/stories/{storyId}/spec/plan.json
      required: true

    - name: tasks
      type: file
      path: docs/stories/{storyId}/spec/tasks.md
      required: false

    - name: constitution
      type: file
      path: .sinapse-ai/constitution.md
      required: true

  outputs:
    - name: analyze-report.json
      type: file
      path: docs/stories/{storyId}/spec/analyze-report.json
      schema: analyze-report-schema

  verification:
    type: gate
    blocking: true
    verdict_field: gate

  contextRequirements:
    projectContext: true
    filesContext: true
    implementationPlan: true
    spec: true
```

---

## Read-Only Contract

```yaml
read_only_contract:
  rule: 'This task MUST NOT modify any file. Findings become recommendations, never auto-fixes.'
  rationale: 'An audit that edits the artifacts it audits cannot be trusted.'
  violations:
    - Editing spec.md / plan.json / tasks.md / constitution.md
    - Applying "auto-fixes" to resolve findings
  when_change_needed: 'Recommend the change; adjustment is done by the owner agent in a later pass.'
```

---

## Detection Passes (6)

Cruze 4 artefatos: `spec.md` (FR-###, SC-###, user stories, edge cases) ↔ `plan.json`
(arquitetura, data model, fases) ↔ `tasks.md` (IDs, fases, marcador `[P]`, file paths) ↔
`constitution.md` (princípios MUST/SHOULD).

```yaml
passes:
  - id: pass-1
    name: 'Duplication'
    detects: 'Near-duplicate requirements; the same behavior specified twice'
    default_severity: MEDIUM

  - id: pass-2
    name: 'Ambiguity'
    detects: 'Vague adjectives (fast/scalable/secure) without a metric; TODO/??? placeholders; open [NEEDS CLARIFICATION] markers'
    default_severity: HIGH

  - id: pass-3
    name: 'Underspecification'
    detects: 'Requirement with no object/outcome; task referencing an undefined file/path'
    default_severity: HIGH

  - id: pass-4
    name: 'Constitution Alignment'
    detects: 'Conflict with a MUST principle; a mandatory constitution section absent'
    default_severity: CRITICAL # Always

  - id: pass-5
    name: 'Coverage Gaps'
    detects: 'Requirement (FR-*) with zero tasks; task with no mapped requirement; Success Criterion (SC-*) with no task'
    default_severity: HIGH

  - id: pass-6
    name: 'Inconsistency'
    detects: 'Terminology drift; entity in plan absent from spec; contradictory task ordering'
    default_severity: MEDIUM
```

---

## Severity Rules

```yaml
severity:
  levels: [CRITICAL, HIGH, MEDIUM, LOW]

  rules:
    - 'Constitution conflict (pass-4) is ALWAYS CRITICAL — never downgraded, reinterpreted, or silently ignored.'
    - 'Coverage gap on a P0/P1 requirement -> escalate to CRITICAL.'
    - 'Ambiguity / Underspecification default HIGH; cosmetic-only -> LOW.'
    - 'Duplication / Inconsistency default MEDIUM.'

  max_findings: 50
```

---

## Output: Findings Table + Metrics

A saída humana é uma tabela de findings seguida do Coverage Summary. O artefato persistido é
`analyze-report.json` (schema abaixo).

```markdown
## Analyze Report — {storyId}

| ID  | Category | Severity | Location | Summary | Recommendation |
| --- | -------- | -------- | -------- | ------- | -------------- |
| A-1 | Constitution Alignment | CRITICAL | spec.md#3.1 ↔ constitution.md#Art-IV | Spec invents an unsourced feature | Remove or trace to FR-*/research; do not dilute Art. IV |
| A-2 | Coverage Gaps | HIGH | FR-3 ↔ tasks.md | FR-3 has zero tasks | Add a task covering FR-3 |

### Coverage Summary

- Total Requirements: {n}
- Total Tasks: {n}
- Coverage: {covered}/{total} ({pct}%)
- Ambiguity findings: {n}
- Duplication findings: {n}
- CRITICAL count: {n}
```

---

## Gate

```yaml
gate:
  order: 'Run AFTER plan, as the final phase, BEFORE handoff to implementation'
  blocking: true

  verdict:
    PASS:
      condition: 'No CRITICAL findings'
      next_action: 'Proceed to implementation (@developer *develop)'
    BLOCKED:
      condition: 'One or more CRITICAL findings (includes ANY constitution conflict)'
      next_action: |
        Resolve CRITICAL findings before /implement by ADJUSTING spec / plan / tasks.
        A constitution conflict MUST NOT be diluted, reinterpreted, or silently ignored.
      escalate_to: '@architect'
```

---

## Execution Flow

### Step 1: Load Artifacts (read-only)

```yaml
load:
  action: gather_all_artifacts
  files:
    - spec.md (required)
    - plan.json (required)
    - tasks.md (optional)
    - constitution.md (required)
  guard: 'Open read-only. No write handles.'
```

### Step 2: Build Requirement→Task Matrix

```yaml
build_matrix:
  action: map_requirements_to_tasks
  process: |
    1. Extract FR-*, NFR-*, SC-* from spec.md
    2. Extract task IDs + their referenced requirement from tasks.md
    3. Build a bidirectional map (requirement <-> tasks)
```

### Step 3: Run 6 Detection Passes

```yaml
run_passes:
  for_each: pass in [Duplication, Ambiguity, Underspecification, Constitution Alignment, Coverage Gaps, Inconsistency]
  process: |
    1. Execute detection over the relevant artifact pair(s)
    2. Record each finding (location, summary)
    3. Assign severity (constitution conflict ALWAYS CRITICAL)
    4. Cap total findings at 50
```

### Step 4: Compute Metrics

```yaml
metrics:
  action: compute_coverage
  fields:
    - totalRequirements
    - totalTasks
    - coveragePct
    - ambiguityCount
    - duplicationCount
    - criticalCount
```

### Step 5: Emit Report + Verdict

```yaml
emit:
  action: write_analyze_report
  outputs:
    - findings table (markdown, to user)
    - analyze-report.json (persisted artifact)
  verdict: 'BLOCKED if criticalCount > 0, else PASS'
```

---

## Output Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["storyId", "analyzedAt", "gate", "findings", "metrics"],
  "properties": {
    "storyId": { "type": "string" },
    "analyzedAt": { "type": "string", "format": "date-time" },
    "analyzedBy": { "type": "string", "default": "@quality-gate" },
    "readOnly": { "type": "boolean", "const": true },
    "gate": { "enum": ["PASS", "BLOCKED"] },
    "gateReason": { "type": "string" },
    "findings": {
      "type": "array",
      "maxItems": 50,
      "items": {
        "type": "object",
        "required": ["id", "category", "severity", "location", "summary", "recommendation"],
        "properties": {
          "id": { "type": "string", "pattern": "^A-\\d+$" },
          "category": {
            "enum": [
              "Duplication",
              "Ambiguity",
              "Underspecification",
              "Constitution Alignment",
              "Coverage Gaps",
              "Inconsistency"
            ]
          },
          "severity": { "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
          "location": { "type": "string" },
          "summary": { "type": "string" },
          "recommendation": { "type": "string" }
        }
      }
    },
    "metrics": {
      "type": "object",
      "required": ["totalRequirements", "totalTasks", "coveragePct", "criticalCount"],
      "properties": {
        "totalRequirements": { "type": "integer", "minimum": 0 },
        "totalTasks": { "type": "integer", "minimum": 0 },
        "coveragePct": { "type": "number", "minimum": 0, "maximum": 100 },
        "ambiguityCount": { "type": "integer", "minimum": 0 },
        "duplicationCount": { "type": "integer", "minimum": 0 },
        "criticalCount": { "type": "integer", "minimum": 0 }
      }
    }
  }
}
```

---

## Integration

### Command Integration (@quality-gate)

```yaml
command:
  name: '*analyze-spec'
  syntax: '*analyze-spec {story-id}'
  agent: qa

  examples:
    - '*analyze-spec STORY-42'
```

### Pipeline Integration

```yaml
pipeline:
  phase: analyze
  previous_phase: plan
  next_phase: none # Final phase - hands off to implementation (SDC)

  requires:
    - spec.md
    - plan.json
    - constitution.md

  optional:
    - tasks.md

  gate: true # Blocking gate
  readOnly: true

  on_verdict:
    PASS:
      action: handoff_to_implementation
    BLOCKED:
      action: halt
      escalate_to: '@architect'
```

---

## Error Handling

```yaml
errors:
  - id: missing-spec
    condition: 'spec.md not found'
    action: 'Halt - cannot analyze without a spec'
    blocking: true

  - id: missing-plan
    condition: 'plan.json not found'
    action: 'Halt - analyze runs after plan'
    blocking: true

  - id: missing-tasks
    condition: 'tasks.md not found'
    action: 'Run with reduced coverage analysis; flag tasks coverage as UNKNOWN'
    blocking: false

  - id: missing-constitution
    condition: 'constitution.md not found'
    action: 'Halt - constitution alignment pass cannot run'
    blocking: true
```

---

## Examples

### Example: BLOCKED on constitution conflict + coverage gap

**Input:** spec.md adds a feature with no FR source; FR-3 has no task.

**Output:**

```json
{
  "storyId": "STORY-42",
  "analyzedBy": "@quality-gate",
  "readOnly": true,
  "gate": "BLOCKED",
  "gateReason": "1 CRITICAL (constitution conflict) + 1 HIGH (coverage gap)",
  "findings": [
    {
      "id": "A-1",
      "category": "Constitution Alignment",
      "severity": "CRITICAL",
      "location": "spec.md#3.1 ↔ constitution.md#Article-IV",
      "summary": "Spec includes a feature with no FR/research source (No Invention)",
      "recommendation": "Remove the feature or trace it to a requirement; do not dilute Article IV"
    },
    {
      "id": "A-2",
      "category": "Coverage Gaps",
      "severity": "HIGH",
      "location": "FR-3 ↔ tasks.md",
      "summary": "FR-3 has zero tasks",
      "recommendation": "Add at least one task covering FR-3"
    }
  ],
  "metrics": {
    "totalRequirements": 5,
    "totalTasks": 7,
    "coveragePct": 80,
    "ambiguityCount": 0,
    "duplicationCount": 0,
    "criticalCount": 1
  }
}
```

---

## Metadata

```yaml
metadata:
  story: '3.7'
  epic: 'Epic 3 - Spec Pipeline'
  created: '2026-06-24'
  author: '@quality-gate (Litmus)'
  version: '1.0.0'
  source: 'GitHub Spec Kit — templates/commands/analyze.md'
  tags:
    - spec-pipeline
    - analyze
    - consistency
    - constitution
    - read-only
    - quality-gate
```

## Handoff
next_agent: @developer
next_command: *develop {story-id}
condition: Analyze gate is PASS (no CRITICAL findings)
alternatives:
  - agent: @architect, command: *analyze-impact, condition: Analyze gate is BLOCKED (CRITICAL findings open)
