---
task: supply-chain-risk-assessment
responsavel: "threat-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: vendor_list
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: assessment_depth
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["quick-scan", "standard", "deep-dive"]

Saida:
  - campo: supply_chain_risk_report
    tipo: document
    destino: "stakeholders, compliance-officer, cyber-orqx"

Checklist:
  - "[ ] Inventory all third-party vendors and dependencies"
  - "[ ] Classify vendors by data access and criticality"
  - "[ ] Assess vendor security posture"
  - "[ ] Evaluate software dependency risks"
  - "[ ] Identify single points of failure"
  - "[ ] Produce risk-ranked vendor report"
---

# Task: Supply Chain Risk Assessment

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Shield (threat-analyst)
- **Complexity:** Complex

## Objective

Assess security risks across the organization's supply chain — including software vendors, SaaS providers, open-source dependencies, and service partners. Identify concentration risks, evaluate vendor security postures, and produce a prioritized risk report with mitigation strategies.

> **ETHICAL ASSESSMENT:** This assessment relies on publicly available information, vendor-provided documentation, and authorized questionnaires. No unauthorized testing of vendor systems is performed.

## Pre-Conditions

- Vendor inventory or procurement records available
- Software Bill of Materials (SBOM) for key applications
- Authorization to conduct vendor assessments
- Risk appetite defined for third-party risk

## Inputs

- List of vendors, SaaS providers, and service partners
- Software dependency manifests (package.json, requirements.txt, etc.)
- Existing vendor contracts and SLAs
- Previous vendor assessments (if available)
- Assessment depth (quick-scan, standard, deep-dive)

## Steps

### 1. Inventory Supply Chain Components
Catalog all third-party relationships:
| Category | Examples | Risk Factor |
|----------|---------|------------|
| SaaS providers | CRM, email, collaboration | Data access |
| Infrastructure | Cloud, CDN, DNS | Availability |
| Software libraries | npm, PyPI, Maven packages | Code execution |
| Service partners | MSP, consultants, contractors | Access privileges |
| Hardware vendors | Servers, network equipment | Firmware integrity |

### 2. Classify Vendors by Risk Tier
| Tier | Data Access | Business Impact | Assessment Depth |
|------|-----------|----------------|-----------------|
| Critical | PII, financial, secrets | Service-stopping | Deep-dive |
| High | Business data, config | Degraded service | Standard |
| Medium | Non-sensitive data | Minor impact | Quick-scan |
| Low | No data access | Negligible impact | Periodic review |

### 3. Assess Vendor Security Posture
For each vendor (depth based on tier):
- Security certifications (SOC 2, ISO 27001, PCI DSS)
- Incident history and disclosure practices
- Security questionnaire responses (SIG, CAIQ)
- Public breach history and vulnerability record
- Security team maturity indicators

### 4. Analyze Software Dependencies
Review open-source and third-party library risks:
- Generate or review SBOM for critical applications
- Check for known vulnerabilities (CVE databases)
- Assess maintenance status (last update, contributor count)
- Identify transitive dependency risks
- Check for license compliance issues

### 5. Identify Concentration Risks
Map dependencies to identify single points of failure:
- Multiple services depending on one vendor
- Single-source dependencies with no alternatives
- Geographic concentration of vendors
- Shared infrastructure across vendors

### 6. Evaluate Data Flow Risks
For each vendor handling organization data:
- What data is shared and in what form
- Data residency and sovereignty implications
- Encryption in transit and at rest
- Data retention and deletion practices
- Subprocessor chains

### 7. Assess Contractual Protections
Review contracts for security provisions:
- Right-to-audit clauses
- Breach notification timelines
- Data processing agreements
- Liability and indemnification
- Exit and data portability provisions

### 8. Score and Rank Risks
Apply a consistent scoring model:
| Factor | Weight | Score (1-5) |
|--------|--------|------------|
| Data sensitivity | 25% | |
| Business criticality | 25% | |
| Security posture | 20% | |
| Concentration risk | 15% | |
| Contractual protection | 15% | |

### 9. Develop Mitigation Strategies
For high-risk vendors:
- Require security improvements with timelines
- Implement compensating controls
- Develop contingency/exit plans
- Increase monitoring and review frequency
- Consider alternative vendors

### 10. Compile Supply Chain Risk Report
Produce a comprehensive report with executive summary, vendor scorecards, risk rankings, and mitigation roadmap.

## Output

```yaml
supply_chain_assessment:
  date: ""
  total_vendors_assessed: 0

  vendor_risk_summary:
    critical_risk: 0
    high_risk: 0
    medium_risk: 0
    low_risk: 0

  vendors:
    - name: ""
      tier: "[critical/high/medium/low]"
      risk_score: 0
      certifications: []
      data_access: ""
      key_findings: []
      mitigation: ""

  software_dependencies:
    total_packages: 0
    vulnerable: 0
    unmaintained: 0
    critical_cves: []

  concentration_risks:
    - description: ""
      affected_services: []
      mitigation: ""

  recommendations:
    - action: ""
      vendor: ""
      priority: "[immediate/short-term/long-term]"
```

## Quality Criteria

- [ ] All critical and high-tier vendors assessed
- [ ] Software dependencies analyzed for vulnerabilities
- [ ] Concentration risks identified with impact analysis
- [ ] Vendor risk scores calculated consistently
- [ ] Data flow risks documented for data-handling vendors
- [ ] Mitigation strategies provided for high-risk findings
- [ ] Report includes both technical and business perspectives
- [ ] No unauthorized testing of vendor infrastructure
