# Spec Pipeline: Clarify Specification

> **Phase:** 4b - Clarify
> **Owner Agent:** @project-lead
> **Pipeline:** spec-pipeline

---

## Purpose

Desambiguar a especificação ANTES do QA gate e do plano. Roda DEPOIS de `write` (spec escrita)
e ANTES de `critique`. Varre o `spec.md` por uma taxonomia de 9 categorias de cobertura, faz no
máximo 5 perguntas guiadas por (Impacto × Incerteza) — uma de cada vez — e integra cada resposta
atomicamente no `spec.md`. Sub-especificação descoberta tarde é o retrabalho mais caro do pipeline;
o clarify ataca isso cedo, perguntando apenas o que muda decisão downstream.

---

## autoClaude

```yaml
autoClaude:
  version: '3.0'
  pipelinePhase: spec-clarify

  elicit: true # Interactive - asks the user clarifying questions
  deterministic: false # Output depends on user answers
  composable: true

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

    - name: requirements
      type: file
      path: docs/stories/{storyId}/spec/requirements.json
      required: false

  outputs:
    - name: spec.md
      type: file
      path: docs/stories/{storyId}/spec/spec.md
      mutation: append # Adds/updates the `## Clarifications` section + target sections

  verification:
    type: gate
    blocking: false # Skippable with explicit rework-risk warning
    completion_field: clarificationComplete

  contextRequirements:
    projectContext: true
    filesContext: true
    implementationPlan: false
    spec: true
```

---

## Coverage Taxonomy (9 categories)

Varra o `spec.md` e marque cada categoria como **Clear / Partial / Missing**. Perguntas só nascem
de categorias `Partial` ou `Missing` cujo esclarecimento muda uma decisão downstream.

```yaml
taxonomy:
  - id: tax-1
    name: 'Functional Scope & Behavior'
    looks_for: 'Core actions, in/out of scope, behavioral edges'

  - id: tax-2
    name: 'Domain & Data Model'
    looks_for: 'Entities, attributes, relationships, identity, lifecycle/state'

  - id: tax-3
    name: 'Interaction & UX Flow'
    looks_for: 'Steps, states, error/empty states, accessibility intent'

  - id: tax-4
    name: 'Non-Functional Quality Attributes'
    looks_for: 'Performance, scale, latency, availability, security targets (quantified)'

  - id: tax-5
    name: 'Integration & External Dependencies'
    looks_for: 'External services, APIs, contracts, failure modes of integrations'

  - id: tax-6
    name: 'Edge Cases & Failure Handling'
    looks_for: 'Boundary conditions, invalid input, partial failure, recovery'

  - id: tax-7
    name: 'Constraints & Tradeoffs'
    looks_for: 'Hard constraints, rejected alternatives, explicit tradeoffs'

  - id: tax-8
    name: 'Terminology & Consistency'
    looks_for: 'Consistent naming, no synonym drift, defined glossary terms'

  - id: tax-9
    name: 'Completion Signals'
    looks_for: 'Measurable done criteria, acceptance signals, Success Criteria present'

  - id: tax-misc
    name: 'Misc / Signals'
    looks_for: 'TODO / ??? placeholders, unquantified adjectives (fast/scalable/secure), [NEEDS CLARIFICATION] markers'
```

---

## Question Selection (Impact × Uncertainty)

```yaml
selection:
  heuristic: 'Impact × Uncertainty'

  rule: |
    Only include questions whose answers materially impact architecture, data modeling,
    task decomposition, test design, UX behavior, operational readiness, or compliance
    validation. Discard cosmetic questions that do not change a downstream decision.

  prioritize:
    - High impact + high uncertainty (ask first)
    - High impact + medium uncertainty
  discard:
    - Low impact (any uncertainty)
    - Already Clear in the taxonomy scan
```

---

## Question Format

```yaml
question_format:
  max_questions: 5
  one_at_a_time: true # Ask, wait for answer, integrate, then next

  styles:
    - type: multiple_choice
      options: '2 to 5 mutually exclusive options'
      include_recommendation: true # Mark the recommended option
    - type: short_answer
      constraint: 'answer in <= 5 words'
```

---

## Integration (atomic)

Cada resposta é integrada IMEDIATAMENTE antes da próxima pergunta — registro + aplicação na seção-alvo.

```yaml
integration:
  log_section:
    create_if_missing: '## Clarifications'
    subsection: '### Session {YYYY-MM-DD}'
    entry_format: '- Q: {question} -> A: {answer}'

  apply_change:
    description: 'Apply the answer to the target section of the spec'
    targets:
      - Functional Requirements (FR-*)
      - Key Entities / Data Model
      - Success Criteria (SC-*)
      - Edge Cases
      - Constraints (CON-*)
    rule: 'Never log an answer without applying it to the target section'
```

---

## Stop Criteria

```yaml
stop_when:
  any_of:
    - 'All critical ambiguities resolved'
    - 'User says proceed / done / skip'
    - 'Reached 5 questions'
    - 'No critical ambiguity detected in the taxonomy scan (zero questions is valid)'
```

---

## Gate

```yaml
gate:
  order: 'Run (and complete) clarify BEFORE the plan phase'
  blocking: false

  on_skip:
    allowed: true
    required_action: |
      Warn explicitly: downstream rework risk increases when clarification is skipped.
    message: |
      ⚠️ Skipping clarification. Ambiguities in the spec may surface during plan/implement,
      increasing rework cost. Proceeding at user request.
```

---

## Execution Flow

### Step 1: Scan Coverage

```yaml
scan:
  action: scan_spec_against_taxonomy
  for_each: category in taxonomy
  process: |
    1. Read spec.md
    2. Mark category Clear / Partial / Missing
    3. Note specific gap location (section)
```

### Step 2: Select Questions

```yaml
select:
  action: rank_by_impact_uncertainty
  process: |
    1. Build candidate questions from Partial/Missing categories
    2. Apply the materially-impacts filter (discard cosmetic)
    3. Rank by Impact x Uncertainty
    4. Cap the queue at 5
```

### Step 3: Ask & Integrate Loop

```yaml
ask_loop:
  for_each: question in selected (max 5)
  process: |
    1. Ask ONE question (multiple-choice 2-5 opts w/ recommendation, OR short answer <=5 words)
    2. Wait for the answer
    3. Append `- Q: ... -> A: ...` under `## Clarifications` / `### Session {date}`
    4. Apply the answer to the target spec section
    5. Re-check stop criteria; break if met
```

### Step 4: Finalize

```yaml
finalize:
  action: confirm_clarification_complete
  process: |
    1. Ensure every asked question was both logged AND applied
    2. Set clarificationComplete = true
    3. Hand off to critique
```

---

## Integration

### Command Integration (@project-lead)

```yaml
command:
  name: '*clarify-spec'
  syntax: '*clarify-spec {story-id}'
  agent: pm

  examples:
    - '*clarify-spec STORY-42'
```

### Pipeline Integration

```yaml
pipeline:
  phase: clarify
  previous_phase: spec
  next_phase: critique

  requires:
    - spec.md

  optional:
    - requirements.json

  gate: true # Order gate: complete before plan
  blocking: false # Skippable with rework-risk warning

  pass_to_next:
    - spec.md
```

---

## Error Handling

```yaml
errors:
  - id: missing-spec
    condition: 'spec.md not found'
    action: 'Halt - cannot clarify without a spec'
    blocking: true

  - id: no-ambiguity
    condition: 'Taxonomy scan finds zero critical ambiguities'
    action: 'Skip questions, set clarificationComplete=true, proceed to critique'
    blocking: false

  - id: user-defers
    condition: 'User declines to answer / says proceed'
    action: 'Warn of rework risk, set clarificationComplete=false, proceed'
    blocking: false
```

---

## Examples

### Example: Clarify a vague NFR

**Input:** spec.md says "the endpoint should be fast" (tax-4 = Partial, unquantified adjective)

**Interaction:**

```
Q: What is the acceptable p95 latency for the endpoint?
   A) < 100ms   B) < 300ms (recommended)   C) < 1s   D) No target needed
A: B
```

**Spec mutation:**

```markdown
## Clarifications

### Session 2026-06-24

- Q: What is the acceptable p95 latency for the endpoint? → A: < 300ms (p95)

<!-- and NFR section updated: -->
| Category    | Requirement              | Target        |
| ----------- | ------------------------ | ------------- |
| Performance | Endpoint response (p95)  | < 300ms       |
```

---

## Metadata

```yaml
metadata:
  story: '3.4b'
  epic: 'Epic 3 - Spec Pipeline'
  created: '2026-06-24'
  author: '@project-lead (Axis)'
  version: '1.0.0'
  source: 'GitHub Spec Kit — templates/commands/clarify.md'
  tags:
    - spec-pipeline
    - clarify
    - ambiguity
    - elicitation
    - product-lead
```

## Handoff
next_agent: @quality-gate
next_command: *critique-spec {story-id}
condition: Clarification complete (no critical ambiguities open) OR user proceeds with rework-risk warning
