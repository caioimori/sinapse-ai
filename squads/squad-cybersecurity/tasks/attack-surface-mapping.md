---
task: attack-surface-mapping
responsavel: "threat-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_name
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: known_assets
    tipo: list
    origem: "user input"
    obrigatorio: false
  - campo: scope
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["external", "internal", "full"]

Saida:
  - campo: attack_surface_map
    tipo: document
    destino: "stakeholders, penetration-tester, cyber-orqx"

Checklist:
  - "[ ] Enumerate all external-facing assets"
  - "[ ] Discover shadow IT and unknown assets"
  - "[ ] Map exposed services and ports"
  - "[ ] Identify third-party integrations"
  - "[ ] Classify assets by risk exposure"
  - "[ ] Document findings with remediation priorities"
---

# Task: Attack Surface Mapping

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Shield (threat-analyst)
- **Complexity:** Complex

## Objective

Map and document the complete attack surface of an organization, including external-facing assets, exposed services, shadow IT, third-party integrations, and internal high-value targets. The output enables prioritized hardening and informs penetration testing scope.

> **AUTHORIZED USE ONLY:** Attack surface mapping must be performed only on assets owned or explicitly authorized by the organization. Never enumerate or probe third-party assets without written authorization.

## Pre-Conditions

- Written authorization to perform asset discovery
- Organization name and known domain names
- Network ranges (if internal scope included)
- Access to DNS records and cloud account inventories

## Inputs

- Organization name and primary domains
- Known assets and IP ranges
- Scope: external-only, internal-only, or full
- Cloud provider account details (for cloud asset discovery)
- Previous asset inventories (if available)

## Steps

### 1. Passive Reconnaissance
Gather information without directly probing targets:
- DNS records (A, AAAA, MX, TXT, CNAME, NS)
- Certificate transparency logs (crt.sh, Censys)
- WHOIS and registrar data
- Public code repositories (accidental exposure)
- Job postings (technology stack hints)
- Social media and public documents

### 2. Subdomain Enumeration
Discover subdomains through multiple methods:
- DNS brute-forcing with targeted wordlists
- Certificate transparency log analysis
- Search engine dorking
- Historical DNS data

### 3. Service and Port Discovery
For each discovered asset, identify exposed services:
| Asset | IP | Open Ports | Services | Version | Risk Level |
|-------|-----|-----------|----------|---------|-----------|

### 4. Cloud Asset Discovery
Enumerate cloud-hosted assets across providers:
- AWS: S3 buckets, EC2 instances, Lambda functions, API Gateways
- Azure: Blob storage, App Services, Functions
- GCP: Cloud Storage, Compute Engine, Cloud Functions
- SaaS integrations (OAuth apps, API keys)

### 5. Shadow IT Identification
Discover unauthorized or unmanaged assets:
- Unregistered domains and subdomains
- Personal cloud accounts used for work
- Unauthorized SaaS applications
- Development/staging environments exposed to internet

### 6. Third-Party Integration Mapping
Document all third-party connections:
- API integrations and data flows
- OAuth authorizations
- Embedded widgets and scripts
- Supply chain software dependencies

### 7. Technology Stack Fingerprinting
Identify technology stacks per asset:
- Web frameworks and CMS
- Server software and versions
- Client-side libraries
- API technologies

### 8. Risk Classification
Classify each asset by exposure risk:
| Risk Level | Criteria | Example |
|-----------|---------|---------|
| Critical | Internet-facing, sensitive data, unpatched | Production database with public IP |
| High | Internet-facing, business-critical | Customer-facing web application |
| Medium | Internal, moderate sensitivity | Internal admin panels |
| Low | Internal, non-sensitive | Development documentation |

### 9. Gap Analysis
Compare discovered assets against known asset inventory. Identify:
- Assets not in inventory (shadow IT)
- Decommissioned assets still running
- Assets missing security controls
- Misconfigured cloud resources

### 10. Generate Attack Surface Report
Compile findings into a structured report with visualizations, risk ratings, and remediation priorities.

## Output

```yaml
attack_surface_map:
  organization: ""
  scope: "[external/internal/full]"
  date: ""

  asset_summary:
    total_discovered: 0
    external_facing: 0
    shadow_it: 0
    critical_risk: 0

  assets:
    - hostname: ""
      ip: ""
      type: "[web/api/database/storage/other]"
      services: []
      technology_stack: []
      risk_level: "[critical/high/medium/low]"
      in_inventory: true
      notes: ""

  third_party_integrations:
    - name: ""
      type: "[api/oauth/widget/dependency]"
      data_shared: ""
      risk: ""

  recommendations:
    - action: ""
      priority: "[immediate/short-term/long-term]"
      assets_affected: []
```

## Quality Criteria

- [ ] All known domains and IP ranges enumerated
- [ ] Shadow IT assets identified and flagged
- [ ] Every discovered asset has a risk classification
- [ ] Third-party integrations documented with data flow
- [ ] Gap analysis completed against known inventory
- [ ] Recommendations are prioritized and actionable
- [ ] Report suitable for both technical and management audiences
- [ ] No unauthorized probing of third-party assets
