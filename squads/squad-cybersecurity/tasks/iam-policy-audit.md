---
task: iam-policy-audit
responsavel: "cloud-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: cloud_provider
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["AWS", "Azure", "GCP"]
  - campo: scope
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: focus_area
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["full-audit", "privilege-escalation", "service-accounts", "cross-account"]

Saida:
  - campo: iam_audit_report
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Inventory all identities and roles"
  - "[ ] Analyze policy permissions"
  - "[ ] Identify overprivileged identities"
  - "[ ] Check credential hygiene"
  - "[ ] Map privilege escalation paths"
  - "[ ] Assess cross-account access"
  - "[ ] Review service account security"
  - "[ ] Produce hardening recommendations"
---

# Task: IAM Policy Audit and Hardening

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Nimbus (cloud-security-engineer)
- **Complexity:** Standard

## Objective

Audit Identity and Access Management (IAM) policies across cloud accounts to identify overprivileged identities, potential privilege escalation paths, dormant accounts, and policy misconfigurations. Produce a hardening plan that enforces least privilege.

> **READ-ONLY ASSESSMENT:** IAM audits must use read-only access. No policy modifications during the audit phase. Changes are implemented only after review and approval.

## Pre-Conditions

- Read-only access to IAM service
- Cloud provider account scope defined
- Understanding of organizational structure
- Knowledge of application and service dependencies

## Inputs

- Cloud provider (AWS, Azure, GCP)
- Scope (accounts, subscriptions, projects)
- Focus area (full audit, privilege escalation, service accounts, cross-account)
- Known application dependencies on IAM roles
- Compliance requirements (SOC 2, HIPAA, PCI DSS)

## Steps

### 1. Identity Inventory
Catalog all identities:
| Identity Type | Count | Active (90d) | MFA | Last Used |
|-------------|-------|-------------|-----|-----------|
| Root/Global Admin | | | | |
| Human users | | | | |
| Service accounts | | | | |
| Roles (assumable) | | | | |
| Groups | | | | |
| Machine identities | | | | |

### 2. Analyze Policy Permissions
For each identity, assess effective permissions:
- List all attached policies (managed and inline)
- Calculate effective permissions (considering denies)
- Identify wildcard permissions (Action: *, Resource: *)
- Flag admin-equivalent policies
- Identify unused permissions (access advisor data)

### 3. Identify Overprivileged Identities
Compare granted permissions to actual usage:
| Identity | Granted Permissions | Used Permissions (90d) | Excess | Risk |
|----------|-------------------|----------------------|--------|------|
| | | | | |

### 4. Map Privilege Escalation Paths
Identify paths an attacker could use to escalate privileges:
- IAM policy modification permissions
- Role chaining opportunities
- Service-linked role abuse
- Cross-service privilege escalation
- Assume role chains

### 5. Credential Hygiene Assessment
Check credential security:
| Check | Status | Finding |
|-------|--------|---------|
| Root account MFA | | |
| Access key age (> 90 days) | | |
| Unused access keys | | |
| Password policy strength | | |
| Credential rotation schedule | | |
| Programmatic access vs console | | |

### 6. Service Account Security
Review non-human identities:
- Service account key management
- Key rotation frequency
- Scope of service account permissions
- Service account usage monitoring
- Workload identity federation adoption

### 7. Cross-Account Access Review
Assess trust relationships:
- External account trust policies
- Confused deputy prevention (ExternalId)
- Third-party vendor access
- Cross-account role assumption logging
- Least privilege for cross-account roles

### 8. Policy Best Practice Validation
Check against security best practices:
| Best Practice | Status |
|-------------|--------|
| No wildcard actions in production | |
| Conditions on sensitive actions | |
| Permission boundaries in place | |
| SCPs/Azure Policy for guardrails | |
| Tag-based access control | |
| Session duration limits | |

### 9. Develop Hardening Plan
For each finding, provide specific remediation:
- Policy replacement (overpermissive to least privilege)
- Credential rotation plan
- MFA enforcement
- Unused identity cleanup
- Permission boundary implementation
- Monitoring and alerting configuration

### 10. Produce IAM Audit Report
Compile findings with risk ratings and implementation-ready hardening recommendations.

## Output

```yaml
iam_audit_report:
  provider: ""
  scope: ""
  date: ""
  author: "Nimbus (cloud-security-engineer)"

  identity_summary:
    total_identities: 0
    overprivileged: 0
    dormant: 0
    no_mfa: 0
    stale_keys: 0

  findings:
    - identity: ""
      type: ""
      finding: ""
      severity: ""
      remediation: ""
      risk: ""

  privilege_escalation_paths:
    - path: ""
      risk: ""
      mitigation: ""

  hardening_actions:
    - action: ""
      priority: ""
      effort: ""
      identities_affected: 0
```

## Quality Criteria

- [ ] All identity types inventoried
- [ ] Effective permissions calculated (not just attached policies)
- [ ] Overprivileged identities identified with evidence
- [ ] Privilege escalation paths mapped
- [ ] Credential hygiene assessed
- [ ] Cross-account access reviewed
- [ ] Hardening plan is specific and implementation-ready
- [ ] No policy changes made during audit
