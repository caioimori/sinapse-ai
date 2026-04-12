# Cloud Security Reference

## Purpose

Reference for cloud security across AWS, Azure, and GCP — shared responsibility model, IAM security, CSPM, container security, and Cloudflare-specific controls. Used by Nimbus (cloud-security-engineer).

---

## Shared Responsibility Model

The fundamental principle of cloud security. Understanding the boundary between provider and customer responsibility prevents the most common cloud security failures.

### AWS Shared Responsibility

| Layer | AWS Responsibility | Customer Responsibility |
|-------|-------------------|------------------------|
| Physical infrastructure | Data centers, hardware, networking | Nothing |
| Hypervisor | Virtualization layer | Nothing |
| Compute (EC2) | Physical host, hypervisor | OS, applications, data, networking within VPC |
| Managed Services (RDS, S3) | Service availability, underlying infra | Configuration, access controls, encryption settings |
| Serverless (Lambda) | Runtime, infrastructure | Function code, IAM permissions, data |
| SaaS (WorkMail) | Everything | Data, user management |

**The most common mistake:** Customers assume "it's in AWS so it's secure." Wrong — misconfigured S3 buckets, open security groups, and over-privileged IAM roles are all customer responsibility.

### Azure and GCP

Same model applies. Google Cloud's shared responsibility documentation explicitly states that security misconfiguration is the #1 cause of cloud incidents, and it falls under customer responsibility.

---

## IAM Security — The Highest-ROI Control

### Core IAM Principles

**Least Privilege:** Every identity (user, role, service account) should have only the minimum permissions required to perform its function.

**No wildcards in production:**
```json
// FORBIDDEN: wildcard permissions
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}

// REQUIRED: specific permissions
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:PutObject"
  ],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

### AWS IAM Best Practices

```bash
# Identify overprivileged IAM entities
# Use AWS IAM Access Analyzer
aws accessanalyzer create-analyzer --analyzer-name org-analyzer --type ORGANIZATION

# Generate least privilege policy from access logs
aws iam generate-service-last-accessed-details --arn arn:aws:iam::123456789012:role/my-role

# Check for admin policies attached to users (should use roles, not users)
aws iam list-users --query 'Users[*].UserName' --output text | \
  xargs -I{} aws iam list-attached-user-policies --user-name {}

# Ensure MFA is enabled for root account
aws iam get-account-summary --query 'SummaryMap.AccountMFAEnabled'

# Check for access keys older than 90 days (rotation policy)
aws iam list-users --query 'Users[*].UserName' --output text | \
  xargs -I{} aws iam list-access-keys --user-name {} \
  --query 'AccessKeyMetadata[?CreateDate<=`2025-01-01`]'
```

### Service-to-Service Authentication

**Never use static credentials for service-to-service auth:**

```javascript
// WRONG: Static credentials in code or environment
const awsConfig = {
  accessKeyId: 'AKIA...',  // Never hardcode or store in env as permanent credentials
  secretAccessKey: '...'   // Use IAM roles instead
}

// RIGHT: IAM role attached to EC2/Lambda/ECS task
// No credentials needed -- SDK discovers them automatically via instance metadata
const { S3Client } = require('@aws-sdk/client-s3')
const client = new S3Client({ region: 'us-east-1' })
// SDK automatically uses IAM role credentials
```

**GitHub Actions to AWS (OIDC federation -- no static keys):**
```yaml
# .github/workflows/deploy.yml
permissions:
  id-token: write  # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-role
          aws-region: us-east-1
          # No access keys needed -- OIDC token exchanges for temporary credentials
```

---

## Cloud Security Posture Management (CSPM)

### What CSPM Does

CSPM tools continuously scan cloud environments for misconfigurations against security benchmarks (CIS, NIST, PCI DSS, HIPAA, LGPD-aligned).

### Open Source CSPM Tools

| Tool | Clouds | Focus |
|------|--------|-------|
| **Prowler** | AWS, Azure, GCP, Kubernetes | 300+ checks, CIS benchmarks, compliance |
| **ScoutSuite** | AWS, Azure, GCP | GUI report, baseline audit |
| **Checkov** | IaC (Terraform, CloudFormation, ARM) | Shift-left — scan before deploy |
| **tfsec** | Terraform | Security analysis of Terraform code |
| **KICS** | Multi-IaC | Queries for misconfig in code |

```bash
# Prowler AWS assessment
prowler aws --profile myprofile --compliance cis_level2_aws_1.4

# Checkov on Terraform code
checkov -d ./terraform --framework terraform --compact

# Scout Suite
python scout.py aws --profile myprofile --services iam s3 ec2 rds
```

### CIS Benchmark Critical Checks

**AWS (CIS Level 1):**
```
IAM
[ ] Root account has no active access keys
[ ] MFA enabled for root account
[ ] MFA enabled for all IAM users with console access
[ ] Password policy meets requirements (min 14 chars, complexity)
[ ] Access keys rotated within 90 days
[ ] No user with AdministratorAccess policy (use roles)

Networking
[ ] No security groups allow unrestricted inbound SSH (0.0.0.0/0:22)
[ ] No security groups allow unrestricted inbound RDP (0.0.0.0/0:3389)
[ ] VPC flow logs enabled on all VPCs
[ ] Default VPC security group has no inbound/outbound rules

Logging
[ ] CloudTrail enabled in all regions
[ ] CloudTrail log file validation enabled
[ ] CloudTrail logs sent to S3 with MFA delete
[ ] CloudWatch alarms on root account usage
[ ] Config service enabled in all regions

Storage
[ ] S3 Block Public Access enabled at account level
[ ] S3 bucket versioning enabled for critical buckets
[ ] S3 server-side encryption enabled

Database
[ ] RDS instances not publicly accessible
[ ] RDS snapshots not publicly accessible
[ ] RDS encryption at rest enabled
```

---

## Container Security

### Image Security

```bash
# Scan container images for vulnerabilities before pushing
# Trivy (recommended -- fast, accurate)
trivy image --severity HIGH,CRITICAL myapp:latest

# Exit non-zero if high/critical vulnerabilities found (for CI gate)
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Grype (alternative)
grype myapp:latest --fail-on high

# In GitHub Actions
- name: Container Security Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'myapp:latest'
    format: 'sarif'
    exit-code: '1'
    severity: 'HIGH,CRITICAL'
```

### Dockerfile Security

```dockerfile
# Use specific version tags -- never :latest in production
FROM node:20.18-alpine3.20

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy files as root, then switch
COPY --chown=nextjs:nodejs . .

# Switch to non-root
USER nextjs

# Read-only filesystem when possible
# Run with: docker run --read-only --tmpfs /tmp myapp
```

### Kubernetes Security Context

```yaml
# Pod Security Context -- harden pods
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true        # Prevent running as root
    runAsUser: 1001           # Non-root UID
    fsGroup: 1001             # File system group
    seccompProfile:
      type: RuntimeDefault    # Enable seccomp filtering
  containers:
  - name: myapp
    securityContext:
      allowPrivilegeEscalation: false   # Prevent sudo/setuid
      readOnlyRootFilesystem: true      # Immutable filesystem
      capabilities:
        drop: [ALL]                     # Drop all Linux capabilities
        add: [NET_BIND_SERVICE]         # Add only what's needed
```

### Kubernetes RBAC Audit

```bash
# Find service accounts with cluster-admin (over-privileged)
kubectl get clusterrolebindings -o json | \
  jq '.items[] | select(.roleRef.name=="cluster-admin") | .subjects'

# Find pods with hostPath volumes (potential container escape)
kubectl get pods -A -o json | \
  jq '.items[] | select(.spec.volumes[]?.hostPath != null) | {name:.metadata.name, ns:.metadata.namespace}'

# Find privileged containers
kubectl get pods -A -o json | \
  jq '.items[] | select(.spec.containers[].securityContext.privileged == true) | .metadata'

# Network policies coverage
kubectl get networkpolicies -A
# Any namespace without NetworkPolicy = no network isolation
```

---

## AWS Security Services Reference

| Service | Purpose | When to Use |
|---------|---------|-------------|
| **IAM Access Analyzer** | Detect external access and unused permissions | Continuous — enable organization-wide |
| **AWS GuardDuty** | Threat detection (ML-based, CloudTrail/VPC flow/DNS analysis) | Always-on in production |
| **AWS Security Hub** | Centralized security findings + compliance checks | Enable CIS/PCI/NIST benchmarks |
| **AWS Config** | Track configuration changes, compliance rules | Audit trail, compliance |
| **AWS Inspector** | Vulnerability assessment for EC2, Lambda, ECR | Continuous scanning |
| **AWS Macie** | PII discovery in S3 | LGPD/privacy compliance |
| **AWS WAF** | Web application firewall | All public-facing applications |
| **AWS Shield** | DDoS protection | Standard: free; Advanced: $3K/month |
| **AWS KMS** | Key management | Encrypt all data at rest |
| **AWS Secrets Manager** | Secrets rotation | All credentials, API keys, database passwords |

---

## Cloudflare Security Controls

Cloudflare provides security controls that protect at the edge before traffic reaches origin servers:

### WAF (Web Application Firewall)

```
Managed Rules:
- OWASP Core Rule Set: blocks SQLi, XSS, path traversal
- Cloudflare Managed: updated automatically for emerging threats
- Custom Rules: write your own for application-specific patterns

Custom Rule Examples:
- Block requests from specific countries
- Block requests with suspicious User-Agent strings
- Rate limit specific endpoints (e.g., /api/auth/login → 5/min per IP)
- Block requests without valid origin header
```

### DDoS Protection

```
Layer 3/4 (Network DDoS): Always-on, included in all plans
Layer 7 (Application DDoS): Configurable thresholds
- HTTP Flood protection
- Slowloris protection
- Cache-busting attack protection

Enable via Dashboard: Security → DDoS → HTTP DDoS attack protection
```

### Zero Trust (Cloudflare Access)

```
Replace VPN with identity-aware access:
- Protect internal tools (Kibana, Grafana, Metabase, etc.)
- Require corporate SSO before reaching origin
- No open port on origin server needed
- Audit log of every access request
```

---

## LGPD Cloud Compliance

For Brazilian personal data, cloud configuration must support LGPD requirements:

| LGPD Requirement | Cloud Control |
|----------------|--------------|
| Data residency preference | Use Brazilian regions: AWS sa-east-1, Azure Brazil South, GCP southamerica-east1 |
| International transfers (SCCs since Aug 2025) | Standard Contractual Clauses with cloud provider |
| Encryption (Art. 46) | Enable encryption at rest (KMS/CMEK) and enforce TLS in transit |
| Audit logging (Art. 46) | CloudTrail/Activity Log/Cloud Audit Logs enabled and retained |
| Data subject rights (Art. 18) | Implement deletion capability for personal data in cloud storage |
| Breach notification (Art. 48) | GuardDuty/Security Center alerts → incident response → ANPD notification |

**Brazilian region availability:**
- AWS: sa-east-1 (Sao Paulo, 3 AZs) — since 2011
- Azure: Brazil South (Campinas, 3 AZs) — since 2014
- GCP: southamerica-east1 (Osasco, 3 AZs) — since 2017
- Cloudflare: POPs in Sao Paulo, Rio de Janeiro, Fortaleza, Porto Alegre, Brasilia

---

## Sources

- AWS Well-Architected Security Pillar: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/
- CIS AWS Benchmark: https://www.cisecurity.org/benchmark/amazon_web_services
- NIST SP 800-207 Zero Trust: https://csrc.nist.gov/pubs/sp/800/207/final
- Prowler: https://github.com/prowler-cloud/prowler
- Trivy: https://github.com/aquasecurity/trivy
- Cloudflare Zero Trust: https://developers.cloudflare.com/cloudflare-one/
