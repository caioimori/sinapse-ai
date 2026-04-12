---
task: dns-security-hardening
responsavel: "network-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: dns_infrastructure
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: dns_provider
    tipo: text
    origem: "user input"
    obrigatorio: false
  - campo: assessment_scope
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["internal-dns", "external-dns", "full"]

Saida:
  - campo: dns_hardening_plan
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Audit current DNS configuration"
  - "[ ] Assess DNSSEC implementation"
  - "[ ] Review DNS filtering and security"
  - "[ ] Evaluate DoH/DoT deployment"
  - "[ ] Check for DNS-based attacks"
  - "[ ] Review DNS logging and monitoring"
  - "[ ] Assess email authentication DNS records"
  - "[ ] Produce hardening implementation plan"
---

# Task: DNS Security Hardening

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Wire (network-security-engineer)
- **Complexity:** Standard

## Objective

Audit and harden DNS infrastructure security covering DNSSEC, DNS filtering, encrypted DNS (DoH/DoT), email authentication records (SPF, DKIM, DMARC), DNS-based threat prevention, and monitoring. DNS is a critical attack surface for data exfiltration, C2 communication, and phishing — proper hardening is essential.

> **DEFENSIVE HARDENING:** DNS security hardening is a defensive measure to protect organizational infrastructure. All changes should be tested in a non-production environment before deployment.

## Pre-Conditions

- Access to DNS management infrastructure
- Understanding of DNS architecture (authoritative, recursive, forwarders)
- Domain registrar access (for DNSSEC and record management)
- Knowledge of email infrastructure (for SPF/DKIM/DMARC)

## Inputs

- DNS infrastructure description (servers, providers, architecture)
- DNS provider (internal, cloud-managed, hybrid)
- Assessment scope (internal DNS, external DNS, full)
- Domain names managed
- Current DNS security controls in place

## Steps

### 1. DNS Infrastructure Audit
Document current DNS architecture:
| Component | Type | Provider | Version | Purpose |
|-----------|------|---------|---------|---------|
| Authoritative DNS | | | | External resolution |
| Recursive DNS | | | | Internal resolution |
| DNS forwarders | | | | Conditional forwarding |
| DNS filtering | | | | Security filtering |

### 2. DNSSEC Assessment
Evaluate DNS Security Extensions:
| Check | Status | Finding |
|-------|--------|---------|
| DNSSEC enabled on authoritative zones | | |
| DNSSEC validation on recursive resolvers | | |
| Key signing key (KSK) management | | |
| Zone signing key (ZSK) rotation | | |
| DS records properly delegated | | |
| DNSSEC chain of trust validated | | |

### 3. DNS Filtering and Threat Prevention
Assess DNS-layer security:
- DNS filtering service deployed (Quad9, Cloudflare Gateway, Umbrella)
- Malware domain blocking
- Phishing domain blocking
- Newly registered domain (NRD) blocking
- DGA (Domain Generation Algorithm) detection
- DNS tunneling detection
- Typosquatting protection

### 4. Encrypted DNS Deployment
Evaluate encrypted DNS protocols:
| Protocol | Use Case | Status | Configuration |
|----------|---------|--------|-------------|
| DoH (DNS over HTTPS) | Client to recursive | | |
| DoT (DNS over TLS) | Client to recursive | | |
| DoQ (DNS over QUIC) | Emerging | | |
| Zone transfers (TSIG/TLS) | Server to server | | |

### 5. Email Authentication DNS Records
Review email security DNS records:
| Record | Domain | Status | Configuration | Issue |
|--------|--------|--------|--------------|-------|
| SPF | | | | |
| DKIM | | | | |
| DMARC | | | | |
| MTA-STS | | | | |
| DANE/TLSA | | | | |

### 6. DNS Record Hygiene
Audit DNS records for security issues:
- Stale records pointing to decommissioned systems
- Dangling CNAME records (subdomain takeover risk)
- Wildcard DNS records (if appropriate)
- Internal hostnames exposed in public DNS
- Zone transfer restrictions (AXFR/IXFR)
- SOA record configuration

### 7. DNS Server Hardening
Secure DNS server configuration:
- Restrict recursive queries to authorized networks
- Rate limiting to prevent DNS amplification
- Response Rate Limiting (RRL) on authoritative servers
- Disable unnecessary DNS features
- Version string hiding
- Restrict zone transfers to authorized secondaries
- OS-level hardening of DNS servers

### 8. DNS Monitoring and Logging
Implement DNS visibility:
| Capability | Status | Tool |
|-----------|--------|------|
| DNS query logging | | |
| DNS response logging | | |
| NXDOMAIN monitoring | | |
| High-entropy domain detection | | |
| DNS tunneling alerting | | |
| Zone change monitoring | | |
| SIEM integration | | |

### 9. DNS Resilience
Assess DNS availability and resilience:
- Geographic distribution of DNS servers
- Anycast configuration
- Secondary/tertiary DNS providers
- DDoS protection for DNS infrastructure
- DNS failover and health checking
- TTL configuration strategy

### 10. Produce DNS Hardening Plan
Compile findings with prioritized hardening actions and implementation guidance.

## Output

```yaml
dns_hardening_plan:
  date: ""
  author: "Wire (network-security-engineer)"

  domains_assessed: []
  dns_infrastructure: {}

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  hardening_actions:
    - area: ""
      action: ""
      priority: "[P1/P2/P3]"
      effort: "[low/medium/high]"
      implementation: ""

  email_auth_status:
    spf: "[configured/misconfigured/missing]"
    dkim: "[configured/misconfigured/missing]"
    dmarc: "[configured/misconfigured/missing]"
    dmarc_policy: "[none/quarantine/reject]"

  overall_posture: "[strong/adequate/needs-improvement/weak]"
```

## Quality Criteria

- [ ] DNS infrastructure fully documented
- [ ] DNSSEC assessed for all managed zones
- [ ] DNS filtering evaluated for threat prevention
- [ ] Email authentication records (SPF/DKIM/DMARC) reviewed
- [ ] DNS record hygiene checked (stale, dangling CNAMEs)
- [ ] DNS server hardening assessed
- [ ] Monitoring and logging capabilities evaluated
- [ ] Hardening plan prioritized and implementation-ready
