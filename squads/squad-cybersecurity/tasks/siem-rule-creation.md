---
task: siem-rule-creation
responsavel: "soc-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: detection_requirement
    tipo: text
    origem: "user input or threat-analyst"
    obrigatorio: true
  - campo: siem_platform
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["Splunk", "Sentinel", "Elastic", "QRadar", "Chronicle", "generic-sigma"]
  - campo: log_sources
    tipo: list
    origem: "user input"
    obrigatorio: true

Saida:
  - campo: siem_rules
    tipo: document
    destino: "soc-analyst, cyber-orqx"

Checklist:
  - "[ ] Define detection objective and threat mapping"
  - "[ ] Identify required log sources"
  - "[ ] Write detection logic"
  - "[ ] Define alert severity and context"
  - "[ ] Test against known-good and known-bad data"
  - "[ ] Tune for false positive reduction"
  - "[ ] Document rule and create runbook"
  - "[ ] Deploy with monitoring period"
---

# Task: SIEM Rule Creation

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Sentinel (soc-analyst)
- **Complexity:** Standard

## Objective

Create, test, and deploy SIEM detection rules that identify security threats, suspicious behaviors, and policy violations. Rules should be precise enough to minimize false positives while maintaining detection coverage. Each rule includes a MITRE ATT&CK mapping and an analyst runbook.

> **DEFENSIVE DETECTION ONLY:** SIEM rules are created exclusively for defensive monitoring and threat detection. All rules must be tested in a controlled environment before production deployment.

## Pre-Conditions

- SIEM platform operational with log ingestion
- Required log sources available and indexed
- Understanding of normal baseline activity
- MITRE ATT&CK mapping for the detection objective
- Test environment or historical data for validation

## Inputs

- Detection requirement (what threat/behavior to detect)
- SIEM platform (Splunk, Sentinel, Elastic, QRadar, Chronicle, or Sigma)
- Available log sources
- MITRE ATT&CK technique(s) to detect
- Known false positive patterns (if available)
- Threat intelligence context

## Steps

### 1. Define Detection Objective
Map the detection requirement to specific observables:
| Field | Value |
|-------|-------|
| Threat | What are we detecting? |
| ATT&CK Technique | T-code(s) |
| ATT&CK Tactic | Tactic phase |
| Data Sources | Required log types |
| Observable | What event pattern indicates the threat? |
| Priority | Detection urgency |

### 2. Identify and Validate Log Sources
Confirm required data is available:
| Log Source | Fields Needed | Availability | Latency |
|-----------|--------------|-------------|---------|
| | | | |

### 3. Analyze Normal Baseline
Before writing detection logic, understand the baseline:
- What does normal activity look like for this data source?
- What are common benign events that match the pattern?
- What exclusions will be needed?
- What volume of events is expected?

### 4. Write Detection Logic
Create the detection rule in the target SIEM query language:

**Sigma Rule (platform-agnostic):**
```yaml
title: ""
id: ""
status: experimental
description: ""
references: []
author: "Sentinel (soc-analyst)"
date: ""
tags:
  - attack.technique_id
logsource:
  category: ""
  product: ""
detection:
  selection:
    field: value
  condition: selection
falsepositives:
  - ""
level: ""
```

### 5. Define Alert Context and Enrichment
Specify what context to include in the alert:
- Source and destination details
- User and process information
- Historical count of similar events
- Threat intelligence matches
- Asset criticality information
- Related alerts in the last 24 hours

### 6. Implement Severity Classification
| Severity | Criteria | Response SLA |
|----------|---------|-------------|
| Critical | Confirmed compromise indicator | Immediate |
| High | Strong suspicious activity | 1 hour |
| Medium | Anomalous behavior, needs investigation | 4 hours |
| Low | Policy violation, informational | 24 hours |

### 7. Test with Known-Good Data
Run the rule against historical data:
- Verify expected false positive rate
- Confirm no critical true positives are missed
- Measure alert volume against SOC capacity
- Validate enrichment fields populate correctly

### 8. Test with Known-Bad Data
Validate detection against known attack patterns:
- Replay or simulate the target attack technique
- Confirm the rule fires correctly
- Verify alert contains sufficient context for triage
- Test edge cases and evasion variants

### 9. Tune for Production
Refine the rule based on testing:
- Add exclusions for known benign patterns
- Adjust thresholds for acceptable alert volume
- Add correlation with other rules if applicable
- Set appropriate alert aggregation windows

### 10. Create Analyst Runbook
Document the response procedure for this alert:
```yaml
runbook:
  alert_name: ""
  description: ""
  severity: ""
  investigation_steps:
    - step: ""
      tool: ""
      expected: ""
  true_positive_actions: []
  false_positive_handling: ""
  escalation_criteria: ""
```

### 11. Deploy and Monitor
Deploy to production with a monitoring period:
- Enable rule in alerting mode (or silent mode for initial period)
- Monitor false positive rate for first 7 days
- Adjust thresholds as needed
- Confirm with SOC team after monitoring period

## Output

```yaml
siem_rule_package:
  rule_name: ""
  platform: ""
  date_created: ""
  author: "Sentinel (soc-analyst)"

  detection:
    attack_technique: ""
    attack_tactic: ""
    log_sources: []
    query: ""
    sigma_rule: ""

  testing:
    true_positive_rate: ""
    false_positive_rate: ""
    alert_volume_daily: ""
    test_date: ""

  runbook: {}
  deployment_status: "[testing/silent/active]"
```

## Quality Criteria

- [ ] Detection objective clearly mapped to MITRE ATT&CK
- [ ] Rule tested against both known-good and known-bad data
- [ ] False positive rate acceptable for SOC capacity
- [ ] Alert includes sufficient context for triage
- [ ] Analyst runbook documented
- [ ] Sigma format available for portability
- [ ] Monitoring period planned after deployment
- [ ] Rule documented in detection rule inventory
