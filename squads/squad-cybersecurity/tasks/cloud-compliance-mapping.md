---
task: cloud-compliance-mapping
responsavel: "cloud-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: cloud_provider
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["AWS", "Azure", "GCP", "multi-cloud"]
  - campo: compliance_frameworks
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: current_configuration
    tipo: text
    origem: "user input or cloud-security-posture-review"
    obrigatorio: false

Saida:
  - campo: compliance_mapping_report
    tipo: document
    destino: "compliance-officer, stakeholders"

Checklist:
  - "[ ] Identify applicable compliance frameworks"
  - "[ ] Map cloud controls to framework requirements"
  - "[ ] Assess current compliance status"
  - "[ ] Identify gaps and missing controls"
  - "[ ] Map cloud-native compliance tools"
  - "[ ] Define remediation for gaps"
  - "[ ] Create evidence collection plan"
  - "[ ] Produce compliance dashboard data"
---

# Task: Cloud Compliance Mapping

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Nimbus (cloud-security-engineer)
- **Complexity:** Standard

## Objective

Map cloud infrastructure configuration to compliance framework requirements (SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, etc.), identify compliance gaps, and produce a remediation plan with evidence collection guidance. Bridge the gap between cloud-native security controls and regulatory requirements.

## Pre-Conditions

- Cloud security posture review completed (or in progress)
- Compliance frameworks identified
- Understanding of cloud architecture
- Access to compliance framework documentation
- Coordination with compliance-officer agent

## Inputs

- Cloud provider (AWS, Azure, GCP, or multi-cloud)
- Compliance frameworks to map (SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR)
- Current cloud configuration status
- Existing compliance documentation
- Scope of compliance (which systems are in scope)

## Steps

### 1. Define Compliance Scope
Determine which cloud resources are in scope:
| Framework | Scope Definition | In-Scope Services | Data Types |
|-----------|-----------------|-------------------|-----------|
| SOC 2 | All production infrastructure | Compute, storage, network | Customer data |
| PCI DSS | Cardholder data environment | Payment processing | CHD, SAD |
| HIPAA | PHI-handling systems | Databases, storage | ePHI |
| GDPR | EU personal data processing | All services with EU data | Personal data |

### 2. Map Cloud Controls to Framework Requirements
Create a comprehensive mapping:

**Example: SOC 2 Trust Services Criteria**
| SOC 2 Criteria | Cloud Control | AWS Service | Azure Service | GCP Service |
|----------------|-------------|-------------|---------------|-------------|
| CC6.1 — Logical Access | IAM policies | IAM, SCP | RBAC, Conditional Access | IAM, Org Policies |
| CC6.1 — MFA | Multi-factor auth | MFA, SSO | Azure MFA | 2-Step Verification |
| CC6.7 — Data Classification | Resource tagging | Tags, Macie | Tags, Purview | Labels, DLP |
| CC7.1 — Monitoring | Security monitoring | CloudTrail, GuardDuty | Sentinel, Defender | SCC, Chronicle |

### 3. Assess Current Compliance Status
For each mapped control, assess implementation:
| Control | Required | Implemented | Evidence Available | Gap? |
|---------|---------|-------------|-------------------|------|
| | | [yes/partial/no] | [yes/no] | |

### 4. Identify Cloud-Native Compliance Tools
Map provider-native tools to compliance automation:

**AWS:**
- AWS Config Rules — continuous compliance monitoring
- AWS Audit Manager — evidence collection
- AWS Security Hub — aggregated findings
- AWS Artifact — compliance reports

**Azure:**
- Azure Policy — policy enforcement
- Azure Compliance Manager — compliance scoring
- Microsoft Defender for Cloud — security posture
- Azure Audit Logs — evidence trail

**GCP:**
- Security Command Center — security posture
- Organization Policy Service — guardrails
- Cloud Audit Logs — evidence trail
- Assured Workloads — compliance controls

### 5. Gap Analysis
Document compliance gaps:
| Framework | Control ID | Requirement | Current State | Gap | Remediation |
|-----------|-----------|------------|--------------|-----|-------------|
| | | | | | |

### 6. Define Remediation Plan
For each gap, provide specific cloud remediation:
- Infrastructure-as-Code to implement the control
- Cloud-native tool configuration
- Monitoring and alerting setup
- Evidence collection automation
- Estimated effort and timeline

### 7. Create Evidence Collection Plan
Define how compliance evidence will be gathered:
| Control | Evidence Type | Collection Method | Frequency | Storage |
|---------|-------------|------------------|-----------|---------|
| Access control | IAM policy snapshots | AWS Config, automated export | Daily | S3/audit bucket |
| Encryption | KMS key configuration | Config rule, automated | Continuous | Compliance tool |
| Monitoring | Alert history | SIEM export | Monthly | Audit repository |

### 8. Design Continuous Compliance Monitoring
Configure automated compliance checking:
- Cloud-native compliance rules (AWS Config, Azure Policy)
- Custom policy-as-code rules
- Drift detection and alerting
- Compliance score tracking over time
- Automated remediation where safe

### 9. Prepare Audit Support Documentation
Create documentation for auditors:
- System description and architecture
- Control description and implementation details
- Evidence collection procedures
- Exception and risk acceptance documentation
- Shared responsibility model explanation

### 10. Produce Compliance Mapping Report
Deliver comprehensive compliance mapping with gap analysis and remediation roadmap.

## Output

```yaml
compliance_mapping:
  provider: ""
  date: ""
  author: "Nimbus (cloud-security-engineer)"

  frameworks:
    - name: ""
      total_controls: 0
      compliant: 0
      partial: 0
      non_compliant: 0
      compliance_percentage: 0

  gaps:
    - framework: ""
      control: ""
      requirement: ""
      gap: ""
      remediation: ""
      priority: ""
      effort: ""

  evidence_plan: []
  continuous_monitoring: []
  audit_documentation: []
```

## Quality Criteria

- [ ] All applicable frameworks mapped
- [ ] Cloud controls mapped to specific framework requirements
- [ ] Current compliance status assessed per control
- [ ] Cloud-native compliance tools identified and recommended
- [ ] Gaps documented with specific remediation
- [ ] Evidence collection plan defined
- [ ] Continuous monitoring recommendations included
- [ ] Shared responsibility model explained
