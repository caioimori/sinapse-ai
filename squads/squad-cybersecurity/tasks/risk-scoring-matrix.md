---
task: risk-scoring-matrix
responsavel: "threat-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: asset_inventory
    tipo: list
    origem: "user input or attack-surface-mapping"
    obrigatorio: true
  - campo: risk_framework
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["NIST-CSF", "ISO-27005", "FAIR", "custom"]

Saida:
  - campo: risk_scoring_matrix
    tipo: document
    destino: "stakeholders, compliance-officer, cyber-orqx"

Checklist:
  - "[ ] Define risk scoring methodology"
  - "[ ] Inventory and classify all assets"
  - "[ ] Identify threats per asset"
  - "[ ] Assess vulnerability exposure"
  - "[ ] Calculate risk scores"
  - "[ ] Produce prioritized risk register"
---

# Task: Risk Scoring Matrix

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Shield (threat-analyst)
- **Complexity:** Standard

## Objective

Create a structured risk scoring matrix that quantifies security risk for organizational assets by combining threat likelihood, vulnerability exposure, asset value, and control effectiveness. The output drives resource allocation and mitigation prioritization.

## Pre-Conditions

- Asset inventory available (from attack-surface-mapping or existing CMDB)
- Organizational risk appetite defined or to be established
- Stakeholder alignment on risk framework selection
- Understanding of existing security controls

## Inputs

- Asset inventory with classification
- Risk framework preference (NIST CSF, ISO 27005, FAIR, or custom)
- Existing security controls documentation
- Business impact analysis (if available)
- Compliance requirements

## Steps

### 1. Select Risk Scoring Methodology
Choose and configure the scoring approach:
| Framework | Best For | Scoring Type |
|-----------|---------|-------------|
| NIST CSF | General enterprise | Qualitative (1-5) |
| ISO 27005 | Compliance-driven orgs | Qualitative/Quantitative |
| FAIR | Financial quantification | Quantitative ($) |
| Custom | Specific org needs | Hybrid |

### 2. Define Scoring Dimensions
Establish the factors that compose the risk score:

**Likelihood Factors (1-5):**
| Score | Label | Description |
|-------|-------|------------|
| 1 | Rare | Less than once per 5 years |
| 2 | Unlikely | Once per 2-5 years |
| 3 | Possible | Once per 1-2 years |
| 4 | Likely | Multiple times per year |
| 5 | Almost Certain | Monthly or more frequent |

**Impact Factors (1-5):**
| Score | Label | Financial | Operational | Reputational |
|-------|-------|----------|-------------|-------------|
| 1 | Negligible | < $10K | Minutes downtime | No coverage |
| 2 | Minor | $10K-$100K | Hours downtime | Local coverage |
| 3 | Moderate | $100K-$1M | Day downtime | Industry coverage |
| 4 | Major | $1M-$10M | Week downtime | National coverage |
| 5 | Catastrophic | > $10M | Extended outage | Global coverage |

### 3. Classify Assets
Categorize each asset by business value:
| Asset | Type | Data Classification | Business Criticality | Owner |
|-------|------|-------------------|---------------------|-------|

### 4. Map Threats to Assets
For each asset, identify applicable threats:
- External threats (from threat landscape report)
- Internal threats (insider, accidental)
- Environmental threats (natural disaster, power failure)
- Supply chain threats (third-party compromise)

### 5. Assess Vulnerability Exposure
Rate each asset's vulnerability to identified threats:
- Known unpatched vulnerabilities (CVE data)
- Configuration weaknesses
- Missing security controls
- Historical incident data

### 6. Evaluate Existing Controls
Rate the effectiveness of controls already in place:
| Control Effectiveness | Score | Description |
|----------------------|-------|------------|
| Fully effective | 0.2 | Comprehensive, tested, automated |
| Mostly effective | 0.4 | Good coverage with minor gaps |
| Partially effective | 0.6 | Significant gaps or untested |
| Minimally effective | 0.8 | Exists but largely ineffective |
| No control | 1.0 | No mitigating control in place |

### 7. Calculate Risk Scores
Apply the scoring formula:
```
Risk Score = Likelihood × Impact × Control Gap Factor
```
Normalize to a 1-25 scale for the risk heat map.

### 8. Build Risk Heat Map
| | Impact 1 | Impact 2 | Impact 3 | Impact 4 | Impact 5 |
|---|---------|---------|---------|---------|---------|
| Likelihood 5 | 5 | 10 | 15 | 20 | **25** |
| Likelihood 4 | 4 | 8 | 12 | **16** | **20** |
| Likelihood 3 | 3 | 6 | **9** | **12** | **15** |
| Likelihood 2 | 2 | 4 | 6 | 8 | 10 |
| Likelihood 1 | 1 | 2 | 3 | 4 | 5 |

### 9. Produce Risk Register
Compile the prioritized risk register with treatment recommendations:
- **Mitigate** — Implement controls to reduce risk
- **Transfer** — Insurance or contractual transfer
- **Accept** — Within risk appetite, document acceptance
- **Avoid** — Eliminate the activity or asset

### 10. Review and Validate
Present the risk scoring matrix to stakeholders for validation. Ensure alignment between calculated risk levels and business perception.

## Output

```yaml
risk_scoring_matrix:
  framework: ""
  date: ""
  assessor: "Shield (threat-analyst)"

  risk_register:
    - asset: ""
      threat: ""
      likelihood: 0
      impact: 0
      control_effectiveness: 0.0
      risk_score: 0
      risk_level: "[critical/high/medium/low]"
      treatment: "[mitigate/transfer/accept/avoid]"
      recommended_action: ""

  heat_map_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  risk_appetite_threshold: 0
  risks_above_appetite: 0
```

## Quality Criteria

- [ ] Risk framework selected and documented
- [ ] All assets classified with business criticality
- [ ] Threats mapped to each asset with evidence
- [ ] Existing controls evaluated for effectiveness
- [ ] Risk scores calculated consistently
- [ ] Risk heat map generated
- [ ] Treatment recommendations for all high/critical risks
- [ ] Stakeholder review and validation completed
