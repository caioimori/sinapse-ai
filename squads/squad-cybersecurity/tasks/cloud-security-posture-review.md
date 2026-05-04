---
task: cloud-security-posture-review
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
  - campo: account_scope
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: compliance_framework
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: cspm_report
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Inventory all cloud resources"
  - "[ ] Assess IAM configuration"
  - "[ ] Review network security controls"
  - "[ ] Evaluate data protection measures"
  - "[ ] Check logging and monitoring"
  - "[ ] Assess compute security"
  - "[ ] Review compliance posture"
  - "[ ] Produce prioritized remediation plan"
---

# Task: Cloud Security Posture Review

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Nimbus (cloud-security-engineer)
- **Complexity:** Complex

## Objective

Conduct a comprehensive Cloud Security Posture Management (CSPM) review that assesses the security configuration of cloud infrastructure across identity, network, data, compute, logging, and compliance domains. Identify misconfigurations, drift from security baselines, and produce a prioritized remediation plan.

> **AUTHORIZED REVIEW ONLY:** This review must be performed with explicit authorization from the cloud account owner. Only use read-only access for assessment. No configuration changes during the review phase.

## Pre-Conditions

- Read-only access to cloud account(s)
- Authorization from cloud account owner
- Understanding of cloud architecture and services in use
- CIS Benchmark for the target cloud provider available
- Compliance requirements identified

## Inputs

- Cloud provider (AWS, Azure, GCP, or multi-cloud)
- Account/subscription/project scope
- Compliance frameworks to map against (CIS, SOC 2, HIPAA, PCI DSS)
- Architecture documentation (if available)
- Previous assessment findings (if available)

## Steps

### 1. Cloud Resource Inventory
Enumerate all resources across regions:
| Resource Type | Count | Region | Owner/Tag | Criticality |
|-------------|-------|--------|-----------|------------|
| Compute instances | | | | |
| Storage buckets/blobs | | | | |
| Databases | | | | |
| Networking (VPCs, subnets) | | | | |
| Serverless functions | | | | |
| Container services | | | | |
| Load balancers | | | | |

### 2. Identity and Access Management Review
Assess IAM posture:
- Root/admin account security (MFA, usage)
- Principle of least privilege adherence
- Service account permissions and key rotation
- Cross-account access configurations
- Federation and SSO configuration
- Unused or dormant accounts
- Overly permissive policies (wildcards)

### 3. Network Security Assessment
Review network controls:
- VPC/VNet configuration and segmentation
- Security group and NACL rules
- Public-facing resources inventory
- VPN and Direct Connect/ExpressRoute configuration
- DNS configuration security
- Load balancer SSL/TLS settings
- Network flow logging enabled

### 4. Data Protection Review
Assess data security controls:
- Encryption at rest (all storage services)
- Encryption in transit (TLS configuration)
- Key management (KMS policies, key rotation)
- Bucket/blob access policies (no public access)
- Database security (encryption, access controls)
- Backup and recovery configuration
- Data loss prevention controls

### 5. Compute Security Assessment
Review compute security:
- Instance/VM patching status
- AMI/image security (approved images)
- Instance metadata service configuration (IMDSv2)
- Container security (image scanning, runtime)
- Serverless function permissions
- Auto-scaling configuration security
- Boot integrity verification

### 6. Logging and Monitoring Review
Verify observability:
| Service | Logging Enabled | Centralized | Retention | Alert Rules |
|---------|----------------|------------|-----------|-------------|
| CloudTrail/Activity Log | | | | |
| VPC Flow Logs | | | | |
| DNS Query Logs | | | | |
| Access Logs (S3, LB) | | | | |
| Database Audit Logs | | | | |
| Container Logs | | | | |

### 7. Compliance Posture Mapping
Map findings to compliance frameworks:
| Control | CIS Benchmark | SOC 2 | HIPAA | Status |
|---------|--------------|-------|-------|--------|
| MFA for root | 1.5 | CC6.1 | 164.312(d) | |
| Encryption at rest | 2.1 | CC6.1 | 164.312(a)(2)(iv) | |
| Logging enabled | 3.1 | CC7.2 | 164.312(b) | |

### 8. Risk Prioritization
Score each finding:
| Finding | Severity | Exploitability | Business Impact | Priority |
|---------|---------|---------------|----------------|----------|
| Public S3 bucket | Critical | Easy | Data exposure | P1 |
| Missing MFA | High | Medium | Account takeover | P1 |
| Overpermissive SG | Medium | Medium | Lateral movement | P2 |

### 9. Remediation Planning
For each finding, provide specific remediation:
- Infrastructure-as-Code snippets (Terraform, CloudFormation)
- CLI commands for manual remediation
- Estimated effort and risk of remediation
- Verification steps post-remediation
- Prevention controls (SCPs, Azure Policy, Org Policies)

### 10. Produce CSPM Report
Compile comprehensive report with executive summary, detailed findings, compliance mapping, and prioritized remediation roadmap.

## Output

```yaml
cspm_report:
  provider: ""
  scope: ""
  date: ""
  author: "Nimbus (cloud-security-engineer)"

  resource_inventory:
    total_resources: 0
    regions_in_use: []

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  domain_scores:
    identity: "[strong/adequate/weak]"
    network: "[strong/adequate/weak]"
    data: "[strong/adequate/weak]"
    compute: "[strong/adequate/weak]"
    logging: "[strong/adequate/weak]"
    compliance: "[strong/adequate/weak]"

  findings:
    - title: ""
      domain: ""
      severity: ""
      cis_reference: ""
      remediation: ""
      iac_snippet: ""

  compliance_posture:
    framework: ""
    controls_assessed: 0
    controls_passing: 0
    compliance_percentage: 0

  overall_posture: "[strong/adequate/needs-improvement/critical]"
```

## Quality Criteria

- [ ] All cloud resources inventoried across regions
- [ ] IAM review includes least privilege assessment
- [ ] Network security covers public exposure
- [ ] Data protection verified for all storage services
- [ ] Logging and monitoring assessed for all critical services
- [ ] Findings mapped to CIS Benchmarks
- [ ] Remediation includes IaC snippets where possible
- [ ] Report suitable for both technical and management audiences
