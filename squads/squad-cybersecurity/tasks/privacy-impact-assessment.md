---
task: privacy-impact-assessment
responsavel: "compliance-officer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: project_description
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: personal_data_types
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: applicable_regulations
    tipo: list
    origem: "user input"
    obrigatorio: false
    valores: ["GDPR", "CCPA", "LGPD", "HIPAA", "PIPEDA", "other"]

Saida:
  - campo: pia_report
    tipo: document
    destino: "stakeholders, legal, DPO"

Checklist:
  - "[ ] Describe the project and data processing"
  - "[ ] Identify personal data types and subjects"
  - "[ ] Assess necessity and proportionality"
  - "[ ] Identify privacy risks"
  - "[ ] Evaluate risk likelihood and severity"
  - "[ ] Define mitigation measures"
  - "[ ] Document legal basis for processing"
  - "[ ] Obtain DPO/legal review"
---

# Task: Privacy Impact Assessment

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Govern (compliance-officer)
- **Complexity:** Standard

## Objective

Conduct a Privacy Impact Assessment (PIA) / Data Protection Impact Assessment (DPIA) for a new project, system, or process that involves personal data. Identify privacy risks, assess their severity, and define mitigation measures to ensure compliance with applicable data protection regulations.

> **REGULATORY COMPLIANCE:** Under GDPR Article 35, a DPIA is mandatory for processing that is likely to result in high risk to individuals' rights and freedoms. Under LGPD, similar assessments are required by the ANPD. This assessment must be reviewed by the DPO or legal counsel.

## Pre-Conditions

- Project or system description available
- Personal data types to be processed identified
- Data Protection Officer (DPO) or legal counsel available
- Applicable privacy regulations identified
- Stakeholders willing to participate in assessment

## Inputs

- Project or system description
- Personal data types to be processed
- Applicable regulations (GDPR, CCPA, LGPD, HIPAA, PIPEDA)
- Data subjects affected
- Purpose of data processing
- Existing privacy controls

## Steps

### 1. Describe the Processing Activity
Document the project's data processing:
| Field | Description |
|-------|-----------|
| Project name | |
| Purpose of processing | |
| Legal basis | |
| Data subjects | |
| Personal data types | |
| Special category data | |
| Processing operations | |
| Data retention period | |
| Technology used | |

### 2. Map Data Flows
Document how personal data flows through the system:
```
Collection → Processing → Storage → Sharing → Deletion
    ↓            ↓           ↓          ↓          ↓
  [Source]   [Operations] [Location] [Recipients] [Method]
```

| Stage | Description | Location | Security Controls |
|-------|-----------|----------|------------------|
| Collection | How data is gathered | | |
| Processing | What operations are performed | | |
| Storage | Where data is kept | | |
| Sharing | Who receives data | | |
| Deletion | How data is destroyed | | |

### 3. Assess Necessity and Proportionality
Evaluate whether processing is justified:
| Question | Assessment |
|----------|-----------|
| Is processing necessary for the stated purpose? | |
| Could the purpose be achieved with less data? | |
| Is the processing proportionate to the purpose? | |
| Are there alternatives that are less privacy-invasive? | |
| Is data minimization applied? | |
| Are retention periods justified? | |

### 4. Identify Privacy Risks
Catalog risks to data subjects:
| Risk | Description | Source | Affected Rights |
|------|-----------|--------|----------------|
| Unauthorized access | Data breach exposing PII | External/Internal | Confidentiality |
| Excessive collection | Collecting more data than needed | Design | Data minimization |
| Purpose creep | Using data beyond original purpose | Operational | Purpose limitation |
| Inadequate consent | Consent not freely given or specific | Legal | Lawfulness |
| Cross-border transfer | Data transferred to inadequate jurisdiction | Architecture | Transfer safeguards |
| Profiling/ADM | Automated decisions affecting individuals | Algorithm | Right to human review |
| Retention excess | Keeping data longer than necessary | Policy | Storage limitation |
| Transparency gap | Individuals not informed of processing | Communication | Right to information |

### 5. Assess Risk Severity and Likelihood
Rate each identified risk:
| Risk | Likelihood | Severity | Risk Level | Justification |
|------|-----------|---------|-----------|--------------|
| | (1-4) | (1-4) | (L×S) | |

**Severity scale:**
| Score | Level | Impact on Individual |
|-------|-------|---------------------|
| 1 | Low | Minor inconvenience |
| 2 | Medium | Significant inconvenience |
| 3 | High | Serious consequences |
| 4 | Very High | Irreversible consequences |

### 6. Define Mitigation Measures
For each risk, specify controls:
| Risk | Mitigation | Control Type | Residual Risk |
|------|-----------|-------------|--------------|
| Unauthorized access | Encryption, access controls, audit | Technical | Low |
| Excessive collection | Data minimization review | Organizational | Low |
| Cross-border transfer | Standard contractual clauses | Legal | Medium |
| Transparency gap | Privacy notice update | Communication | Low |

### 7. Document Legal Basis
For each processing activity, confirm legal basis:
| Processing Activity | Legal Basis | Justification |
|--------------------|-----------|--------------|
| | Consent / Contract / Legal obligation / Vital interests / Public task / Legitimate interests | |

### 8. Assess Data Subject Rights
Verify that data subject rights can be fulfilled:
| Right | GDPR Article | Supported | Implementation |
|-------|-------------|-----------|---------------|
| Access | Art. 15 | | |
| Rectification | Art. 16 | | |
| Erasure | Art. 17 | | |
| Restriction | Art. 18 | | |
| Data portability | Art. 20 | | |
| Object | Art. 21 | | |
| Automated decisions | Art. 22 | | |

### 9. Consult Stakeholders
Obtain input from:
- Data Protection Officer (DPO)
- Legal counsel
- IT/Security team
- Business process owners
- Data subjects or their representatives (where appropriate)

### 10. Compile PIA/DPIA Report
Produce a formal assessment report for regulatory compliance:

**Required sections:**
- Processing description
- Necessity and proportionality assessment
- Risk identification and assessment
- Mitigation measures
- Data subject rights implementation
- DPO opinion
- Final risk assessment and recommendation

## Output

```yaml
privacy_impact_assessment:
  project: ""
  date: ""
  author: "Govern (compliance-officer)"
  regulations: []

  processing_description:
    purpose: ""
    legal_basis: ""
    data_subjects: []
    data_types: []
    retention: ""

  data_flow: []

  risks:
    - risk: ""
      likelihood: 0
      severity: 0
      risk_level: ""
      mitigation: ""
      residual_risk: ""

  data_subject_rights:
    access: "[supported/partial/not-supported]"
    rectification: "[supported/partial/not-supported]"
    erasure: "[supported/partial/not-supported]"
    portability: "[supported/partial/not-supported]"

  dpo_opinion: ""
  recommendation: "[proceed/proceed-with-conditions/do-not-proceed]"
  conditions: []
  review_date: ""
```

## Quality Criteria

- [ ] Processing activity fully described
- [ ] Data flows mapped from collection to deletion
- [ ] Necessity and proportionality assessed
- [ ] All privacy risks identified and rated
- [ ] Mitigation measures defined for each risk
- [ ] Legal basis documented for each processing activity
- [ ] Data subject rights implementation verified
- [ ] DPO or legal counsel review included
