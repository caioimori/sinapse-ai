---
task: "cloud-security-assessment"
responsavel: "cloud-security-engineer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: cloud_provider
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["aws", "azure", "gcp", "multi-cloud"]
  - campo: account_scope
    tipo: text
    origem: "user input"
    obrigatorio: true
Saida:
  - campo: cspm_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Identify cloud provider and services in use"
  - "[ ] Run CIS Benchmark assessment"
  - "[ ] Audit IAM configuration"
  - "[ ] Review network security controls"
  - "[ ] Check encryption at rest and in transit"
  - "[ ] Review logging and monitoring"
  - "[ ] Assess storage security"
  - "[ ] Produce prioritized findings"
---

# Cloud Security Assessment

## Objective

Conduct a comprehensive Cloud Security Posture Management (CSPM) assessment against CIS Benchmarks. Identify misconfigurations, overprivileged access, and security gaps across cloud infrastructure.

## Inputs

- Cloud provider(s) in use
- Account/subscription/project scope
- Services inventory (or will be discovered)
- Compliance requirements affecting cloud usage

## Steps

1. **Inventory cloud assets** — Enumerate all active services, instances, databases, storage, networking components, and IAM entities.

2. **IAM assessment** — Review root/admin account usage, user permissions, service accounts/roles, MFA enforcement, credential age, unused permissions.

3. **Network security** — Review VPC/VNet configuration, security groups/NSGs, NACLs, public-facing resources, flow logs, peering connections.

4. **Data protection** — Check encryption at rest for all storage services, encryption in transit enforcement, key management, public storage access.

5. **Logging and monitoring** — Verify cloud audit logging (CloudTrail/Activity Log/Audit Log), log integrity, alerting, flow logs, access logging.

6. **Compute security** — Instance metadata protection, patch management, security agent deployment, public IP exposure.

7. **CIS Benchmark scoring** — Score each category against the applicable CIS Benchmark. Document pass/fail for each control.

8. **Prioritize findings** — Rank by severity (critical misconfigurations first), exploitability, and blast radius.

## Quality Gates

- All CIS Benchmark categories assessed
- IAM must be thoroughly reviewed (most common attack vector)
- Every finding must include specific remediation steps
- Remediation should include IaC code where applicable
