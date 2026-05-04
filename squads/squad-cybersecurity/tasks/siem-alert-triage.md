---
task: "siem-alert-triage"
responsavel: "soc-analyst"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: alert_data
    tipo: text
    origem: "SIEM or user input"
    obrigatorio: true
  - campo: log_sources
    tipo: list
    origem: "SIEM"
    obrigatorio: false
Saida:
  - campo: triage_verdict
    tipo: document
    destino: "incident-responder or closure"
Checklist:
  - "[ ] Contextualize the alert (what triggered, source, target)"
  - "[ ] Enrich with additional data sources"
  - "[ ] Correlate with related events"
  - "[ ] Determine verdict (TP, FP, BTP, Inconclusive)"
  - "[ ] Document rationale"
  - "[ ] Escalate or close with appropriate action"
---

# SIEM Alert Triage

## Objective

Analyze a SIEM alert through the structured triage framework: contextualize, enrich, correlate, verdict. Determine whether the alert represents a true positive requiring response or a false positive requiring tuning.

## Inputs

- Alert data (rule name, severity, source, destination, timestamp, raw event)
- Available log sources for correlation
- Asset inventory context (if available)
- User directory context (if available)

## Steps

1. **Contextualize** — What rule triggered? What is the source system/user? What is the target? When did it occur? Is this asset critical?

2. **Enrich** — Query threat intelligence for source IPs/domains. Check asset inventory for system classification. Check user directory for account status and role.

3. **Correlate** — Search for related events: same source across different log sources, same target from different sources, timeline of surrounding events.

4. **Analyze** — Map observed behavior to known attack patterns (MITRE ATT&CK). Assess whether behavior is consistent with legitimate activity or adversary action.

5. **Verdict** — Classify as: True Positive (confirmed malicious), False Positive (benign trigger), Benign True Positive (real but authorized), or Inconclusive (need more data).

6. **Act** — TP: Escalate to incident response with timeline. FP: Document for rule tuning. BTP: Add exception. Inconclusive: Request additional log sources.

## Quality Gates

- Verdict must be justified with evidence
- Correlation must include at least 2 data sources
- Escalations must include complete timeline
- False positives must include tuning recommendation
