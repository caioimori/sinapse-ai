---
task: alert-triage-workflow
responsavel: "soc-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: alert_sources
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: soc_maturity
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["initial", "developing", "established", "mature"]

Saida:
  - campo: triage_workflow_document
    tipo: document
    destino: "soc-analyst team, cyber-orqx"

Checklist:
  - "[ ] Map all alert sources and categories"
  - "[ ] Define severity classification criteria"
  - "[ ] Design triage decision tree"
  - "[ ] Create SLA targets per severity"
  - "[ ] Define escalation procedures"
  - "[ ] Build automation opportunities"
  - "[ ] Document analyst procedures"
  - "[ ] Design quality metrics"
---

# Task: Alert Triage Workflow Design

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Sentinel (soc-analyst)
- **Complexity:** Standard

## Objective

Design a structured alert triage workflow that enables SOC analysts to efficiently classify, prioritize, investigate, and resolve security alerts. The workflow includes decision trees, severity classification, SLA targets, escalation procedures, and quality metrics.

> **OPERATIONAL SECURITY:** Alert triage workflows handle sensitive security data. Access to triage procedures and alert details should be restricted to authorized SOC personnel.

## Pre-Conditions

- Alert sources identified and configured
- SOC team structure defined
- Incident response plan available for escalation
- SIEM and SOAR platforms operational
- Understanding of current alert volume and types

## Inputs

- Alert sources (SIEM, EDR, firewall, cloud, email, custom)
- SOC maturity level (initial, developing, established, mature)
- Current alert volume and false positive rates
- SOC team size and shift coverage
- Existing triage procedures (if any)

## Steps

### 1. Inventory Alert Sources
Catalog all alert-generating systems:
| Source | Alert Types | Daily Volume | Current FP Rate | Priority |
|--------|-----------|-------------|-----------------|----------|
| SIEM | Correlation rules | | | |
| EDR | Endpoint alerts | | | |
| Firewall | Block/allow anomalies | | | |
| Cloud | AWS/Azure/GCP alerts | | | |
| Email | Phishing detections | | | |

### 2. Define Alert Severity Classification
Establish consistent severity criteria across all sources:

| Severity | Criteria | Examples | SLA |
|----------|---------|---------|-----|
| P1 — Critical | Active compromise, data exfiltration | Confirmed C2, ransomware execution | 15 min |
| P2 — High | Strong indicators of compromise | Suspicious lateral movement, credential dump | 1 hour |
| P3 — Medium | Anomalous behavior needs investigation | Unusual login patterns, policy violations | 4 hours |
| P4 — Low | Informational, low-risk anomaly | Failed login below threshold, scan activity | 24 hours |

### 3. Design Triage Decision Tree
Create a decision tree for each major alert category:
```
Alert Received
├── Is it a known false positive? → Close with FP tag
├── Is the affected asset critical? → Elevate severity
├── Is there active threat intelligence match? → Elevate to P1/P2
├── Can automated enrichment resolve? → Auto-enrich and re-evaluate
├── Needs manual investigation? → Assign to analyst
└── Is this part of an existing incident? → Merge with incident
```

### 4. Define Enrichment Steps
Specify automatic and manual enrichment for each alert type:

**Automated Enrichment (SOAR):**
- IP reputation lookup
- Domain/URL reputation
- Hash lookup (VirusTotal, malware databases)
- User context (role, department, recent activity)
- Asset context (criticality, OS, patch status)
- Threat intelligence correlation

**Manual Enrichment (Analyst):**
- User/manager verification
- Business context assessment
- Historical alert correlation
- Network traffic analysis

### 5. Create Investigation Templates
For each major alert category, provide structured investigation steps:
```yaml
investigation_template:
  alert_type: ""
  initial_questions:
    - ""
  enrichment_queries: []
  decision_criteria:
    true_positive: ""
    false_positive: ""
    needs_escalation: ""
  actions:
    true_positive: ""
    false_positive: ""
```

### 6. Define Escalation Procedures
| Trigger | Escalation Target | Method | SLA |
|---------|-------------------|--------|-----|
| P1 alert confirmed | IR team lead | Phone + ticket | Immediate |
| P2 needs IR | Senior analyst | Ticket + chat | 30 min |
| Analyst stuck > 30 min | Shift lead | Chat | Immediate |
| VIP account involved | CISO/management | Phone | 15 min |
| Data breach suspected | Legal + IR | Phone + email | Immediate |

### 7. Design Automation Opportunities
Identify alerts suitable for automated handling:
| Alert Pattern | Automation | Expected Reduction |
|--------------|-----------|-------------------|
| Known FP patterns | Auto-close with tag | 20-30% volume |
| Low-severity IOC match | Auto-enrich + prioritize | Faster triage |
| Common investigation queries | Auto-run on alert creation | Analyst time savings |
| Repeated alerts from same source | Auto-aggregate | Reduce noise |

### 8. Establish Quality Metrics
Define metrics to measure triage effectiveness:
| Metric | Target | Measurement |
|--------|--------|-------------|
| Mean Time to Triage (MTTT) | < 15 min (P1) | Alert creation to first analyst action |
| False Positive Rate | < 30% | FP closures / total alerts |
| Escalation Accuracy | > 90% | Valid escalations / total escalations |
| SLA Compliance | > 95% | Alerts triaged within SLA |
| Analyst Utilization | 60-80% | Active investigation time / shift time |

### 9. Create Shift Handover Procedure
Design handover process for shift changes:
- Open alert summary
- Active investigations status
- Pending escalations
- Key events since last handover
- Priority focus areas for incoming shift

### 10. Document and Train
Produce comprehensive documentation and training plan:
- Triage workflow document with decision trees
- Investigation template library
- Quick-reference guides per alert source
- New analyst onboarding checklist
- Monthly refresher topics

## Output

```yaml
alert_triage_workflow:
  date: ""
  soc_maturity: ""
  author: "Sentinel (soc-analyst)"

  alert_sources: []
  severity_classification: {}
  decision_trees: []
  investigation_templates: []
  escalation_procedures: []
  automation_opportunities: []

  metrics:
    mttt_target: ""
    fp_rate_target: ""
    sla_targets: {}

  training_plan: []
```

## Quality Criteria

- [ ] All alert sources cataloged with volume and FP rates
- [ ] Severity classification consistent across all sources
- [ ] Decision trees cover all major alert categories
- [ ] SLA targets defined and achievable for SOC size
- [ ] Escalation procedures include all severity levels
- [ ] Automation opportunities identified with expected impact
- [ ] Quality metrics defined with measurement methodology
- [ ] Shift handover procedure documented
