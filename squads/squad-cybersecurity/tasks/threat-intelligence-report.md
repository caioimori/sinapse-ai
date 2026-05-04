---
task: "threat-intelligence-report"
responsavel: "threat-analyst"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: topic
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: iocs
    tipo: list
    origem: "user input or SIEM"
    obrigatorio: false
  - campo: sector
    tipo: text
    origem: "user input"
    obrigatorio: false
Saida:
  - campo: intel_report
    tipo: document
    destino: "stakeholders, soc-analyst"
Checklist:
  - "[ ] Define intelligence requirements"
  - "[ ] Collect and analyze relevant threat data"
  - "[ ] Enrich IOCs with context"
  - "[ ] Map TTPs to MITRE ATT&CK"
  - "[ ] Assess confidence levels for all claims"
  - "[ ] Produce actionable recommendations"
---

# Threat Intelligence Report

## Objective

Produce a structured threat intelligence report on a specific threat actor, campaign, vulnerability, or sector-specific threat landscape. Transform raw data into actionable intelligence with confidence levels and defensive recommendations.

## Inputs

- Intelligence topic or question
- Indicators of Compromise (IOCs) if available
- Industry sector for contextual relevance
- Timeframe of interest

## Steps

1. **Define intelligence requirements** — What specific questions need answering? What decisions will this intelligence inform?

2. **Collect threat data** — Gather relevant information: adversary group profiles, known campaigns, published CVEs, IOCs, sector-specific threat reports.

3. **Analyze and correlate** — Cross-reference data points. Identify patterns, overlaps with known campaigns, and emerging trends.

4. **Enrich IOCs** — For each indicator (IP, domain, hash, URL, email), add context: reputation, geolocation, associated campaigns, first/last seen dates.

5. **Map to MITRE ATT&CK** — Identify techniques, tactics, and procedures associated with the threat. Create ATT&CK Navigator layer.

6. **Assess confidence** — Rate every claim: Confirmed (direct evidence), Probable (strong circumstantial), Possible (limited evidence), Unknown (insufficient data).

7. **Produce actionable output** — Detection rules, hunting queries, hardening recommendations, IOC blocklists. Intelligence without action is trivia.

## Quality Gates

- Every claim must have a confidence level
- IOCs must be enriched with context
- ATT&CK mapping must be specific (technique + sub-technique level)
- Recommendations must be actionable by SOC and engineering teams
- Report must use TLP classification for sharing

## Output Format

```markdown
# Threat Intelligence Report

**TLP:** [WHITE | GREEN | AMBER | RED]
**Confidence:** [Confirmed | Probable | Possible]
**Date:** [Report date]

## Executive Summary
[2-3 paragraph overview]

## Threat Overview
[Detailed analysis]

## MITRE ATT&CK Mapping
| Tactic | Technique | Sub-Technique | Confidence |
|--------|-----------|---------------|------------|

## Indicators of Compromise
| Type | Value | Context | First Seen | Confidence |
|------|-------|---------|------------|------------|

## Defensive Recommendations
1. [Detection rules]
2. [Hunting queries]
3. [Hardening actions]

## References
[Sources with reliability ratings]
```
