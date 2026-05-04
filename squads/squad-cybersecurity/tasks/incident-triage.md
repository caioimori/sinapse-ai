---
task: "incident-triage"
responsavel: "incident-responder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: incident_report
    tipo: text
    origem: "SOC escalation or user report"
    obrigatorio: true
  - campo: initial_evidence
    tipo: list
    origem: "SOC or monitoring"
    obrigatorio: false
Saida:
  - campo: incident_classification
    tipo: document
    destino: "IR team, management"
Checklist:
  - "[ ] Validate the incident report"
  - "[ ] Classify severity (SEV1-4)"
  - "[ ] Identify scope (systems, users, data)"
  - "[ ] Determine if incident is active or historical"
  - "[ ] Initiate evidence preservation"
  - "[ ] Activate appropriate response resources"
  - "[ ] Send initial notification"
---

# Incident Triage

## Objective

Rapidly assess a reported security incident, classify its severity, determine scope, and initiate the appropriate response. This is the entry point to the NIST IR lifecycle.

## Inputs

- Incident report (from SOC escalation, user report, or automated alert)
- Initial evidence (logs, screenshots, alert data)
- System context (affected assets, criticality)

## Steps

1. **Validate the report** — Is this a confirmed security incident or a false alarm? Review initial evidence. Distinguish incidents from events.

2. **Classify severity** — Apply severity criteria: SEV1 (critical — active breach), SEV2 (high — confirmed compromise), SEV3 (medium — suspicious activity), SEV4 (low — minor violation).

3. **Determine scope** — What systems are affected? What users are impacted? What data may be compromised? Is the scope still expanding?

4. **Assess status** — Is the incident ongoing or historical? Is the attacker still active? Is data still being exfiltrated?

5. **Preserve evidence** — Initiate volatile evidence capture before any containment changes. Memory captures, network connection snapshots, process lists.

6. **Activate resources** — Based on severity, activate appropriate team members and external resources.

7. **Send initial notification** — Notify stakeholders per severity-based communication plan.

## Quality Gates

- Severity classification must be justified
- Scope assessment must identify affected systems, users, and data categories
- Evidence preservation must begin before containment
- Initial notification must go out within severity-based SLA
