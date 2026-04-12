---
task: "post-incident-review"
responsavel: "incident-responder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: incident_documentation
    tipo: document
    origem: "IR lifecycle"
    obrigatorio: true
  - campo: forensic_report
    tipo: document
    origem: "forensic-analysis task"
    obrigatorio: false
Saida:
  - campo: pir_report
    tipo: document
    destino: "all stakeholders"
Checklist:
  - "[ ] Compile complete incident timeline"
  - "[ ] Identify root cause"
  - "[ ] Assess what worked well"
  - "[ ] Identify what needs improvement"
  - "[ ] Define corrective actions with owners and deadlines"
  - "[ ] Update detection rules and playbooks"
  - "[ ] Calculate incident metrics"
---

# Post-Incident Review

## Objective

Conduct a blameless post-incident review (PIR) to document lessons learned, identify root cause, and define corrective actions that prevent recurrence. Every incident is a learning opportunity.

## Inputs

- Complete incident documentation (timeline, actions, communications)
- Forensic analysis report (if available)
- Input from all involved team members
- Relevant metrics (time to detect, time to contain, time to recover)

## Steps

1. **Build complete timeline** — Reconstruct the full incident lifecycle from initial compromise through detection, response, containment, eradication, and recovery.

2. **Root cause analysis** — Identify the primary cause (vulnerability, misconfiguration, social engineering, etc.) and contributing factors. Use the "5 Whys" technique.

3. **Assess response effectiveness** — What worked well? Where were delays? Were playbooks followed? Was communication effective? Were escalations timely?

4. **Identify improvements** — Detection gaps, response process gaps, tool gaps, training gaps, communication gaps.

5. **Define corrective actions** — Each improvement must be a specific action with an owner, deadline, and success criteria. Categorize as: Quick Win (days), Short-term (weeks), Long-term (months).

6. **Update artifacts** — Update detection rules, IR playbooks, runbooks, and training materials based on lessons learned.

7. **Calculate metrics** — MTTD (Mean Time to Detect), MTTC (Mean Time to Contain), MTTR (Mean Time to Recover), total incident cost, data impact.

## Quality Gates

- Review must be blameless — focus on process, not people
- Root cause must go beyond surface symptoms
- Every corrective action must have an owner and deadline
- Detection rules must be updated based on findings
- PIR report must be completed within 5 business days of incident closure
