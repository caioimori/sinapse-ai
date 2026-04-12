---
task: "threat-hunting-campaign"
responsavel: "soc-analyst"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: hypothesis
    tipo: text
    origem: "user input or threat intelligence"
    obrigatorio: true
  - campo: data_sources
    tipo: list
    origem: "environment"
    obrigatorio: true
Saida:
  - campo: hunt_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Define testable hypothesis"
  - "[ ] Identify required data sources"
  - "[ ] Develop hunt queries"
  - "[ ] Execute queries and analyze results"
  - "[ ] Document findings or validated negatives"
  - "[ ] Convert findings into detection rules"
---

# Threat Hunting Campaign

## Objective

Execute a hypothesis-driven threat hunting campaign to proactively search for threats that evade existing detections. Produce either confirmed findings or validated negatives, and convert results into detection rules.

## Inputs

- Hunting hypothesis (what adversary behavior we are looking for)
- Available data sources (logs, telemetry)
- Relevant threat intelligence (IOCs, TTPs)
- Timeframe for the hunt

## Steps

1. **Formulate hypothesis** — Based on threat intelligence, recent incidents, or detection gap analysis. The hypothesis must be specific and testable: "Adversaries may be using [technique] to [objective] in our [environment]."

2. **Identify data sources** — Map required data sources to the hypothesis. Assess data quality and coverage. Document gaps.

3. **Develop queries** — Write search queries for each data source. Include both exact IOC matches and behavioral patterns.

4. **Execute and analyze** — Run queries across the specified timeframe. Analyze results for anomalies. Filter noise from signal.

5. **Investigate leads** — For each potential finding, perform deep analysis. Build timeline. Determine if activity is malicious, suspicious, or benign.

6. **Document results** — Whether the hunt found threats or validated their absence, document: hypothesis, methodology, queries used, results, and conclusions.

7. **Create detections** — Convert confirmed findings into Sigma detection rules. For validated negatives, document as evidence of control effectiveness.

## Quality Gates

- Hypothesis must be specific and linked to a MITRE ATT&CK technique
- At least 2 data sources must be queried
- All queries must be documented for reproducibility
- Findings must include evidence and timeline
- Validated negatives are valid outcomes (not failures)
