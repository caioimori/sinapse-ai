---
task: data-classification-framework
responsavel: "compliance-officer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_profile
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: compliance_requirements
    tipo: list
    origem: "user input"
    obrigatorio: false
  - campo: data_types
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: classification_framework
    tipo: document
    destino: "stakeholders, all-agents"

Checklist:
  - "[ ] Define classification levels"
  - "[ ] Map data types to classifications"
  - "[ ] Define handling requirements per level"
  - "[ ] Create labeling standards"
  - "[ ] Define access controls per level"
  - "[ ] Establish data lifecycle rules"
  - "[ ] Design implementation plan"
  - "[ ] Create training materials"
---

# Task: Data Classification Framework

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Govern (compliance-officer)
- **Complexity:** Standard

## Objective

Design a comprehensive data classification framework that categorizes organizational data by sensitivity level, defines handling requirements for each level, and establishes labeling, access control, storage, transmission, and disposal requirements. The framework enables consistent data protection aligned with compliance obligations.

## Pre-Conditions

- Organization's data landscape understood
- Compliance requirements identified
- Executive sponsorship for data governance
- IT and business stakeholder engagement
- Legal review available

## Inputs

- Organization profile (industry, size, data types)
- Compliance requirements (GDPR, HIPAA, PCI DSS, SOC 2)
- Known data types processed
- Existing classification practices (if any)
- Technology platforms used for data storage and processing

## Steps

### 1. Define Classification Levels
Establish classification tiers:
| Level | Label | Description | Examples |
|-------|-------|-----------|---------|
| 4 | Restricted | Highest sensitivity, regulated | PII, PHI, cardholder data, trade secrets |
| 3 | Confidential | Business-sensitive, internal | Financial reports, employee data, contracts |
| 2 | Internal | General internal use | Internal communications, processes, procedures |
| 1 | Public | Approved for public disclosure | Marketing materials, public website content |

### 2. Map Data Types to Classifications
Catalog organizational data:
| Data Type | Classification | Compliance Driver | Owner | Storage |
|----------|---------------|-------------------|-------|---------|
| Customer PII | Restricted | GDPR, CCPA | Legal | Encrypted DB |
| Employee records | Confidential | Employment law | HR | HR system |
| Financial data | Restricted | SOX, PCI | Finance | ERP |
| Source code | Confidential | Trade secret | Engineering | Git |
| Marketing content | Public | — | Marketing | CMS |

### 3. Define Handling Requirements Per Level
| Requirement | Restricted | Confidential | Internal | Public |
|------------|-----------|-------------|----------|--------|
| Encryption at rest | Required (AES-256) | Required | Recommended | Not required |
| Encryption in transit | Required (TLS 1.2+) | Required | Required | Recommended |
| Access control | Need-to-know, MFA | Role-based | Authenticated | Open |
| Sharing (external) | Prohibited without approval | NDA required | Restricted | Allowed |
| Sharing (internal) | Named individuals | Team/department | All employees | All |
| Printing | Prohibited | With marking | Allowed | Allowed |
| Storage location | Approved systems only | Approved systems | Company systems | Any |
| Backup | Encrypted backups | Regular backups | Regular backups | Optional |

### 4. Create Labeling Standards
Define how data is labeled:
| Medium | Labeling Method | Format |
|--------|----------------|--------|
| Documents | Header/footer classification | "[RESTRICTED] Company Name" |
| Emails | Subject prefix + banner | "[CONFIDENTIAL] Subject" |
| Databases | Column/table metadata | Classification tag |
| Files | Metadata properties | Classification attribute |
| Cloud storage | Resource tags | classification: restricted |
| Physical media | Physical label | Color-coded stickers |

### 5. Define Access Control Requirements
Map classification to access controls:
| Level | Authentication | Authorization | Monitoring |
|-------|---------------|-------------|-----------|
| Restricted | MFA + certificate | Individual approval | Full audit logging |
| Confidential | MFA | Role-based | Access logging |
| Internal | SSO | Department-based | Standard logging |
| Public | None | None | Minimal |

### 6. Establish Data Lifecycle Rules
Define lifecycle management per classification:
| Phase | Restricted | Confidential | Internal | Public |
|-------|-----------|-------------|----------|--------|
| Creation | Classify at creation | Classify at creation | Default | Default |
| Storage | Encrypted, restricted | Encrypted | Standard | Standard |
| Usage | Audit trail required | Access logging | Standard | None |
| Sharing | Formal approval | NDA/agreement | Internal only | Open |
| Archival | Encrypted archive | Standard archive | Standard | Standard |
| Retention | Per regulation | 7 years | 3 years | As needed |
| Disposal | Secure destruction | Secure deletion | Standard deletion | Standard |

### 7. Design DLP Integration
Map classification to Data Loss Prevention controls:
- Email DLP rules per classification level
- Cloud DLP scanning for classified data
- Endpoint DLP for Restricted data
- Network DLP for exfiltration prevention
- Automated classification suggestions

### 8. Create Exception Process
Define how exceptions to classification rules are handled:
- Exception request form and workflow
- Approval authority per classification level
- Time-limited exceptions only
- Exception tracking and reporting
- Periodic exception review

### 9. Design Implementation Plan
Phase the framework rollout:
| Phase | Activities | Timeline |
|-------|-----------|----------|
| 1 — Foundation | Define framework, classify critical data | Month 1-2 |
| 2 — Tooling | Deploy labeling tools, DLP baseline | Month 2-4 |
| 3 — Training | Train all employees, data owners | Month 4-5 |
| 4 — Enforcement | Enable DLP enforcement, monitoring | Month 5-6 |
| 5 — Optimization | Refine rules, automate classification | Ongoing |

### 10. Create Training Materials
Develop classification training:
- Visual quick-reference guide (one-page)
- Classification decision tree
- Examples of correctly classified data
- Common mistakes and how to avoid them
- Procedure for reclassification requests

## Output

```yaml
data_classification_framework:
  date: ""
  author: "Govern (compliance-officer)"
  version: ""

  classification_levels:
    - level: 0
      label: ""
      description: ""
      handling: {}

  data_inventory:
    - type: ""
      classification: ""
      owner: ""
      compliance: ""

  handling_matrix: {}
  labeling_standards: {}
  access_controls: {}
  lifecycle_rules: {}
  implementation_plan: []
  training_materials: []
```

## Quality Criteria

- [ ] Classification levels appropriate for organization size
- [ ] All known data types classified
- [ ] Handling requirements defined for each level
- [ ] Labeling standards practical and enforceable
- [ ] Access controls aligned with classification levels
- [ ] Data lifecycle rules include retention and disposal
- [ ] DLP integration planned
- [ ] Implementation plan phased and realistic
