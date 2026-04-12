---
task: human-in-the-loop-design
responsavel: "@swarm-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: false
Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true
Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Human-in-the-Loop Design

## Objective

Design human-in-the-loop (HITL) patterns for AI-powered workflows that balance automation speed with human oversight. Define when human intervention is required, how to present decisions effectively, how to incorporate feedback, and how to minimize friction while maintaining control.

## Pre-Conditions

- AI workflow identified that requires human oversight
- Risk assessment completed (what happens if AI makes wrong decision)
- Human reviewer roles and availability defined
- Acceptable response time for human review established
- Feedback capture requirements documented

## Steps

1. **Classify Decision Points** — Analyze the workflow and classify each decision point: autonomous (AI decides, low risk, reversible), supervised (AI recommends, human approves, medium risk), controlled (human decides with AI assistance, high risk), and manual (human only, critical/irreversible). Create a decision classification matrix.
2. **Design Approval Workflows** — For supervised decisions, design the approval flow: AI generates recommendation with reasoning, presents to human with clear options (approve/reject/modify), captures human decision with optional rationale, and proceeds based on decision. Define timeout behavior (auto-approve, auto-reject, or escalate).
3. **Create Decision Presentation Format** — Design how AI presents decisions to humans: summary of the situation, AI recommendation with confidence level, alternatives considered with pros/cons, risk assessment, and clear action buttons. Minimize cognitive load — the human should be able to decide in under 30 seconds for routine decisions.
4. **Implement Feedback Capture** — Design how human feedback is collected and used: structured feedback (approve/reject + reason code), free-text feedback (for nuanced corrections), implicit feedback (human modifies AI output — capture the delta), and batch feedback (periodic review of AI decisions).
5. **Build Escalation Paths** — Define escalation triggers: AI confidence below threshold, human reviewer unavailable within timeout, conflicting feedback from multiple reviewers, and novel situations not covered by existing rules. Each trigger must have a clear escalation target and procedure.
6. **Design Progressive Autonomy** — Create a system where the AI earns more autonomy over time: track AI decision quality per category, increase autonomy threshold when accuracy exceeds target (e.g., 95% approval rate for 30 days), decrease autonomy when errors occur, and notify humans of autonomy level changes.
7. **Implement Audit Trail** — Design a complete audit trail: every AI decision (with reasoning), every human override (with rationale), every escalation (with resolution), and every autonomy level change. The audit trail must be searchable and support compliance review.
8. **Create Undo and Rollback** — Design undo capabilities for human-approved actions: immediate undo (within time window), rollback (revert to previous state), and damage assessment (what was affected by the decision). Define which actions are reversible and which are not.
9. **Optimize the Human Experience** — Reduce reviewer fatigue: batch similar decisions for efficient review, highlight anomalies that need attention, provide context summaries (not raw data), and track reviewer workload to prevent burnout.
10. **Test with Simulation** — Simulate the HITL workflow: generate realistic decision scenarios, present to test reviewers, measure decision time, accuracy, and satisfaction. Identify friction points and optimize the flow.

## Output

```markdown
# Human-in-the-Loop Design: {Workflow Name}

## Decision Classification Matrix
| Decision Point | Classification | Risk Level | Reversible? |
|---------------|---------------|-----------|-------------|
| {decision} | {autonomous/supervised/controlled/manual} | {low/med/high} | {yes/no} |

## Approval Workflow
### Supervised Decisions
1. AI generates recommendation
2. Present to reviewer: {format}
3. Reviewer decides: {options}
4. Capture feedback: {method}
5. Timeout: {action after N minutes}

## Decision Presentation Template
```
## Decision Required: {title}
**Situation:** {1-2 sentence summary}
**AI Recommendation:** {recommendation} (Confidence: {%})
**Alternatives:** {list}
**Risk:** {assessment}
**Actions:** [Approve] [Reject] [Modify]
```

## Progressive Autonomy Rules
| Category | Current Level | Threshold to Upgrade | Threshold to Downgrade |
|----------|-------------|---------------------|----------------------|

## Audit Trail Schema
| Field | Type | Purpose |
|-------|------|---------|

## Escalation Paths
| Trigger | Escalation Target | Procedure | SLA |
|---------|-------------------|-----------|-----|

## Undo Capabilities
| Action Type | Undo Window | Rollback Method |
|------------|-------------|----------------|
```

## Quality Criteria

- Every decision point must be classified with risk level and reversibility
- Supervised decisions must present recommendation in a format decidable in under 30 seconds
- Feedback capture must support both structured and free-text input
- Progressive autonomy must have clear, measurable thresholds for upgrade and downgrade
- Audit trail must be complete (zero gaps in decision history)
- Undo capabilities must exist for all reversible actions with defined time windows
