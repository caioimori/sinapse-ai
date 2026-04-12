---
task: vendor-security-assessment
responsavel: "compliance-officer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: vendor_name
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: vendor_type
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["saas", "infrastructure", "service-provider", "software-vendor", "data-processor"]
  - campo: data_shared
    tipo: text
    origem: "user input"
    obrigatorio: true

Saida:
  - campo: vendor_assessment_report
    tipo: document
    destino: "stakeholders, procurement"

Checklist:
  - "[ ] Classify vendor risk tier"
  - "[ ] Review security certifications"
  - "[ ] Assess security questionnaire responses"
  - "[ ] Evaluate data handling practices"
  - "[ ] Review contractual protections"
  - "[ ] Check incident history"
  - "[ ] Assess subprocessor risks"
  - "[ ] Produce risk-rated assessment"
---

# Task: Third-Party Vendor Security Assessment

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Govern (compliance-officer)
- **Complexity:** Standard

## Objective

Conduct a structured security assessment of a third-party vendor to evaluate their security posture, data handling practices, and compliance status. Determine the risk level of engaging with the vendor and identify required contractual protections and monitoring controls.

> **FAIR ASSESSMENT:** Vendor assessments should be proportionate to the risk tier. Avoid imposing enterprise-level requirements on low-risk vendors. Respect vendor confidentiality and assess based on verifiable evidence.

## Pre-Conditions

- Vendor engagement or renewal under consideration
- Understanding of data to be shared with vendor
- Vendor security questionnaire distributed (SIG, CAIQ, or custom)
- Procurement/legal team engaged
- Vendor risk classification framework defined

## Inputs

- Vendor name and service description
- Vendor type (SaaS, infrastructure, service provider, software, data processor)
- Data to be shared (type, classification, volume)
- Vendor-provided security documentation
- Existing contract terms (if renewal)
- Compliance requirements applicable to the engagement

## Steps

### 1. Classify Vendor Risk Tier
Determine assessment depth based on risk:
| Factor | Critical | High | Medium | Low |
|--------|---------|------|--------|-----|
| Data access | PII, financial, health | Business confidential | Internal only | No data |
| System access | Production admin | Production read | Dev/staging | None |
| Business impact | Service-stopping | Degraded ops | Minor | Negligible |
| **Assessment** | Full deep-dive | Comprehensive | Standard | Light review |

### 2. Review Security Certifications
Evaluate vendor's certification status:
| Certification | Status | Valid Until | Scope Covers Our Use? |
|--------------|--------|------------|----------------------|
| SOC 2 Type II | | | |
| ISO 27001 | | | |
| PCI DSS | | | |
| HIPAA | | | |
| FedRAMP | | | |

### 3. Assess Security Questionnaire Responses
Evaluate vendor responses across key domains:
| Domain | Score (1-5) | Key Findings |
|--------|-----------|-------------|
| Access Control | | |
| Data Protection | | |
| Incident Response | | |
| Network Security | | |
| Application Security | | |
| Business Continuity | | |
| HR Security | | |
| Compliance | | |
| Change Management | | |
| Physical Security | | |

### 4. Evaluate Data Handling Practices
Assess how vendor handles organization data:
- Data encryption (at rest and in transit)
- Data residency and sovereignty
- Data retention and deletion
- Data backup and recovery
- Data isolation (multi-tenancy)
- Data access controls and logging
- Right to audit data handling

### 5. Review Incident History
Research vendor's security track record:
- Known breaches or security incidents
- Vulnerability disclosure practices
- Incident response capabilities
- Breach notification history
- Public security advisories
- Bug bounty program existence

### 6. Assess Subprocessor Risk
Evaluate the vendor's supply chain:
- List of subprocessors handling data
- Subprocessor security requirements
- Notification of subprocessor changes
- Data flow to subprocessors
- Geographic distribution of subprocessors

### 7. Review Contractual Protections
Verify security requirements in contracts:
| Clause | Required | In Contract | Notes |
|--------|---------|-------------|-------|
| Data Processing Agreement | | | |
| Breach notification (timeline) | | | |
| Right to audit | | | |
| Data deletion on termination | | | |
| Security requirements | | | |
| Liability/indemnification | | | |
| Insurance requirements | | | |
| Subprocessor restrictions | | | |
| SLA and uptime guarantees | | | |

### 8. Conduct Risk Scoring
Calculate vendor risk score:
| Factor | Weight | Score (1-5) | Weighted |
|--------|--------|-----------|---------|
| Security maturity | 25% | | |
| Data sensitivity | 25% | | |
| Incident history | 15% | | |
| Certifications | 15% | | |
| Contractual protections | 10% | | |
| Subprocessor risk | 10% | | |
| **Total** | 100% | | |

### 9. Define Ongoing Monitoring Requirements
Based on risk tier, define monitoring:
| Monitoring Activity | Critical | High | Medium | Low |
|-------------------|---------|------|--------|-----|
| Annual reassessment | Required | Required | Required | Optional |
| Continuous monitoring | Required | Recommended | — | — |
| Incident notification test | Annual | Annual | — | — |
| Certification renewal check | Annual | Annual | Annual | — |
| SLA review | Quarterly | Quarterly | Annual | — |

### 10. Produce Assessment Report
Compile findings into a decision-ready report with risk rating and recommendations.

## Output

```yaml
vendor_assessment:
  vendor: ""
  type: ""
  date: ""
  author: "Govern (compliance-officer)"

  risk_tier: "[critical/high/medium/low]"
  risk_score: 0.0

  certifications: []
  assessment_scores: {}
  data_handling_assessment: {}
  contractual_gaps: []
  incident_history: []

  verdict: "[approved/approved-with-conditions/deferred/rejected]"
  conditions: []
  monitoring_requirements: []
  next_review_date: ""
```

## Quality Criteria

- [ ] Vendor classified into appropriate risk tier
- [ ] Security certifications verified and scope validated
- [ ] Questionnaire responses evaluated across all domains
- [ ] Data handling practices assessed
- [ ] Contractual protections reviewed against requirements
- [ ] Risk score calculated with consistent methodology
- [ ] Ongoing monitoring defined based on risk tier
- [ ] Assessment verdict actionable for procurement decision
