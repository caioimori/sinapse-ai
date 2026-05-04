---
task: "iam-audit"
responsavel: "cloud-security-engineer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: cloud_provider
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["aws", "azure", "gcp"]
  - campo: scope
    tipo: text
    origem: "user input"
    obrigatorio: true
Saida:
  - campo: iam_audit_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Inventory all IAM entities (users, roles, service accounts, groups)"
  - "[ ] Identify overprivileged accounts"
  - "[ ] Check for unused credentials and access keys"
  - "[ ] Verify MFA enforcement"
  - "[ ] Review cross-account/cross-project trust"
  - "[ ] Check for privilege escalation paths"
  - "[ ] Assess password and credential policies"
  - "[ ] Provide least-privilege recommendations"
---

# IAM Audit

## Objective

Conduct a thorough audit of Identity and Access Management configuration in a cloud environment. Identify overprivileged access, unused credentials, missing MFA, and privilege escalation paths. IAM is the cloud perimeter — get it right or nothing else matters.

## Inputs

- Cloud provider (AWS, Azure, GCP)
- Account/subscription/project scope
- IAM policy exports or access analyzer output (if available)

## Steps

1. **Inventory IAM entities** — List all users, groups, roles, service accounts, and policies. Identify orphaned entities.

2. **Analyze permissions** — For each entity, identify effective permissions. Flag wildcard permissions (Resource: *), admin-level access, and dangerous permission combinations.

3. **Check credential hygiene** — Identify unused credentials (>90 days), long-lived access keys, credentials not rotated, and root account usage.

4. **Verify MFA** — Check MFA enforcement for all human users, especially for console access and privileged operations.

5. **Review trust relationships** — Cross-account role assumptions, external identity provider trust, service account impersonation chains.

6. **Privilege escalation analysis** — Identify permission combinations that allow privilege escalation (e.g., iam:CreateRole + iam:AttachRolePolicy, or lambda:CreateFunction + iam:PassRole).

7. **Generate recommendations** — For each finding, provide specific least-privilege policy recommendations with example JSON/YAML.

## Quality Gates

- Every IAM entity must be reviewed
- Privilege escalation paths must be explicitly analyzed
- Recommendations must include specific policy examples
- MFA status must be verified for all human users
