---
task: log-analysis-playbook
responsavel: "soc-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: log_source
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: analysis_objective
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: siem_platform
    tipo: text
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: log_analysis_playbook
    tipo: document
    destino: "soc-analyst team, cyber-orqx"

Checklist:
  - "[ ] Identify log source and available fields"
  - "[ ] Define analysis objectives and use cases"
  - "[ ] Create baseline queries"
  - "[ ] Build anomaly detection queries"
  - "[ ] Document investigation workflows"
  - "[ ] Include example scenarios"
  - "[ ] Test all queries against real data"
  - "[ ] Create quick-reference card"
---

# Task: Log Analysis Playbook

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Sentinel (soc-analyst)
- **Complexity:** Standard

## Objective

Create a structured log analysis playbook for a specific log source that enables SOC analysts to efficiently investigate security events. The playbook includes baseline queries, anomaly detection patterns, investigation workflows, and example scenarios.

> **DEFENSIVE USE ONLY:** Log analysis playbooks are created for authorized security monitoring within the organization's own systems. All queries operate on data the organization is authorized to collect and analyze.

## Pre-Conditions

- Log source ingested into SIEM or log management platform
- Understanding of log format and available fields
- Normal baseline data available (minimum 30 days recommended)
- SOC team familiar with the SIEM query language

## Inputs

- Log source type (firewall, endpoint, authentication, cloud, application)
- Analysis objectives (incident investigation, threat hunting, compliance)
- SIEM platform and query language
- Known attack patterns relevant to this log source
- Compliance requirements for log analysis

## Steps

### 1. Log Source Profiling
Document the log source characteristics:
| Field | Value |
|-------|-------|
| Source | System/application generating logs |
| Format | Syslog, JSON, CEF, CLF, etc. |
| Volume | Average events per day |
| Retention | How long logs are kept |
| Key Fields | Fields most useful for analysis |
| Latency | Time from event to searchable |

### 2. Define Analysis Use Cases
Map objectives to specific analysis patterns:
| Use Case | Objective | Key Fields | ATT&CK Relevance |
|----------|----------|-----------|-------------------|
| Failed login surge | Brute force detection | user, src_ip, status | T1110 |
| Unusual access times | Compromised account | user, timestamp, geo | T1078 |
| Data exfiltration | Large outbound transfers | src, dst, bytes_out | T1048 |

### 3. Create Baseline Queries
Build queries that establish normal patterns:

**Volume Baselines:**
- Hourly event count by source
- Daily unique users/sources
- Typical data transfer volumes
- Common event types distribution

**Behavioral Baselines:**
- Normal login times per user group
- Standard access patterns
- Typical network flow patterns
- Regular process execution patterns

### 4. Build Anomaly Detection Queries
For each use case, create queries that identify deviations:

**Statistical Anomalies:**
- Events exceeding N standard deviations from baseline
- First-seen entities (new users, IPs, processes)
- Rare event types or combinations
- Unusual timing patterns

**Known-Bad Patterns:**
- IOC matching (IPs, domains, hashes)
- Known attack technique signatures
- Policy violation patterns
- Configuration change anomalies

### 5. Design Investigation Workflows
For each use case, create a step-by-step investigation flow:
```yaml
investigation_workflow:
  trigger: ""
  steps:
    - name: "Initial triage"
      query: ""
      look_for: ""
      decision_point: ""
    - name: "Context enrichment"
      query: ""
      correlate_with: ""
    - name: "Scope assessment"
      query: ""
      determine: ""
    - name: "Verdict"
      criteria:
        true_positive: ""
        false_positive: ""
        escalation: ""
```

### 6. Create Correlation Queries
Build queries that combine multiple log sources:
- Authentication logs + VPN logs = impossible travel
- Firewall logs + DNS logs = C2 communication
- Endpoint logs + email logs = phishing chain
- Cloud logs + identity logs = privilege escalation

### 7. Document Example Scenarios
Provide worked examples for training:

**Scenario 1: [Common Investigation Type]**
- Initial alert details
- Step-by-step investigation queries
- Expected findings at each step
- Decision points and outcomes

**Scenario 2: [Complex Investigation Type]**
- Multi-source correlation example
- Timeline reconstruction
- Evidence collection queries
- Escalation criteria

### 8. Build Quick-Reference Card
Create a one-page reference for common queries:
| Task | Query Template | Notes |
|------|---------------|-------|
| Find failed logins | `[query]` | Adjust threshold |
| Check user activity | `[query]` | Last 24 hours |
| Network connections | `[query]` | By source IP |

### 9. Test All Queries
Validate every query in the playbook:
- Run against real data to confirm syntax
- Verify results are meaningful
- Check query performance (execution time)
- Confirm field names match current schema

### 10. Review and Publish
Conduct peer review with SOC team and publish:
- Review queries for accuracy
- Validate investigation workflows
- Confirm escalation procedures are current
- Schedule periodic playbook updates

## Output

```yaml
log_analysis_playbook:
  log_source: ""
  platform: ""
  date: ""
  author: "Sentinel (soc-analyst)"

  use_cases:
    - name: ""
      objective: ""
      baseline_query: ""
      anomaly_query: ""
      investigation_workflow: []

  correlation_queries: []
  example_scenarios: []
  quick_reference: []

  maintenance:
    review_frequency: ""
    last_tested: ""
    query_count: 0
```

## Quality Criteria

- [ ] Log source fully profiled with field documentation
- [ ] Minimum 5 analysis use cases defined
- [ ] Baseline queries tested and producing results
- [ ] Anomaly detection queries validated
- [ ] Investigation workflows include decision points
- [ ] Correlation queries span multiple log sources
- [ ] Example scenarios provide hands-on training value
- [ ] Quick-reference card suitable for daily SOC use
