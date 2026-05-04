# Zero Trust Architecture Reference

## Purpose

Reference for implementing Zero Trust Architecture (ZTA) based on NIST SP 800-207 and NIST SP 800-207A (2025). Used by Wire (network-security-engineer) and Nimbus (cloud-security-engineer) for architecture decisions and hardening recommendations.

---

## Foundational Document: NIST SP 800-207

Published August 2020. The definitive US government standard for Zero Trust. In June 2025, NIST published SP 800-207A with 19 concrete architecture examples using commercial technologies.

**Core premise:** "Never trust, always verify" — no machine, user, or service is implicitly trusted, even inside the corporate network. Contrasts with the traditional "castle and moat" model where passing the firewall grants broad internal access.

---

## The 7 Zero Trust Tenets (NIST SP 800-207)

1. **All data sources and computing services are resources** — applies to personal devices, IoT, cloud services
2. **All communication is secured regardless of network location** — no "trusted internal network"
3. **Access to resources is granted per-session** — no persistent access grants
4. **Access is determined by dynamic policy** — identity, device health, posture, behavioral context
5. **Enterprise monitors and measures integrity of all assets** — continuous validation
6. **Authentication and authorization are dynamic and strictly enforced before access** — re-verify as context changes
7. **Enterprise collects information about assets and uses it to improve security posture** — telemetry-driven

---

## Zero Trust vs. Traditional Perimeter Security

| Aspect | Traditional (Castle & Moat) | Zero Trust |
|--------|----------------------------|------------|
| Trust model | Trust everything inside the network | Trust nothing by default |
| Network location | Inside = trusted | Location is irrelevant |
| Access control | VPN grants broad access | Per-resource, per-session access |
| Lateral movement | Easy — flat internal network | Difficult — microsegmentation |
| Identity | Static roles, rarely reviewed | Continuous verification with context |
| Devices | Corporate-managed = trusted | Device posture checked every session |
| Detection | Perimeter-focused | Assume breach, detect everywhere |

---

## The Three Pillars of Zero Trust

### Pillar 1: Identity

Every entity (user, service, device) must have a verified identity. Identity is the new perimeter.

**Identity controls:**
- Multi-Factor Authentication (MFA) — mandatory for all users, especially privileged access
- Conditional Access — access depends on user risk score, device compliance, location
- Privileged Identity Management (PIM) — just-in-time (JIT) access elevation for admins
- Service-to-service identity — machine identities via SPIFFE/SPIRE or cloud IAM roles
- Identity governance — regular access reviews, separation of duties

**Commercial identity providers (NIST SP 800-207A examples):**
- Microsoft Entra ID (formerly Azure AD) — enterprise standard, integrates with most SaaS
- Okta — multi-cloud identity platform
- Google Cloud Identity — strong for GCP-native environments
- HashiCorp Vault — service-to-service identity and secrets management

### Pillar 2: Devices

Device health and compliance as a factor in access decisions.

**Device controls:**
- Device compliance enforcement — OS version, patches, security software required
- Endpoint Detection and Response (EDR) — CrowdStrike, SentinelOne, Microsoft Defender
- Mobile Device Management (MDM) for BYOD — Intune, Jamf
- Device certificates — cryptographic device identity bound to hardware
- Continuous posture assessment — device health re-checked during session

### Pillar 3: Microsegmentation

Replace flat networks with fine-grained, software-defined segments where each workload can only communicate with exactly what it needs.

**Network controls:**
- Software-defined perimeter (SDP) — replace VPN with encrypted, identity-authenticated tunnels
- Microsegmentation — Illumio, Guardicore, Zscaler, Cilium (Kubernetes)
- Service mesh mTLS — Istio, Linkerd enforce mutual TLS between services
- Network policy — Kubernetes NetworkPolicy, AWS Security Groups, GCP Firewall Rules
- DNS filtering — block malicious domains at the resolver layer

---

## Zero Trust Implementation Roadmap (NIST 5-Phase Approach)

NIST recommends gradual adoption over big-bang deployment:

### Phase 1: Asset Discovery
- Complete inventory of all assets (hardware, software, data, services)
- Map all communication flows — who talks to whom
- Identify crown jewel assets — data and systems requiring highest protection
- Assess current identity and access management maturity

### Phase 2: Define Trust Zones
- Group assets by sensitivity and function
- Define which communication flows are allowed between zones
- Identify implicit trust relationships that need to be eliminated
- Document current network topology against desired Zero Trust model

### Phase 3: Policy Modeling
- Define access policies for each resource (who, what, when, from where, on what device)
- Model policies using least-privilege principle
- Define conditional access rules (location, device health, risk score thresholds)
- Validate policies don't break legitimate workflows

### Phase 4: Pilot Small Environment
- Select a contained environment (one application, one team)
- Deploy identity enforcement, device compliance, and microsegmentation for pilot scope
- Measure impact on productivity and security
- Iterate on policy before broader rollout

### Phase 5: Monitor, Adjust, and Expand
- Deploy monitoring and telemetry across the pilot
- Tune policies based on observed access patterns
- Expand to next scope incrementally
- Maintain continuous improvement cycle

---

## Practical Implementation: Cloud-Native Zero Trust

### AWS Zero Trust Pattern

```
IAM Identity Center (SSO) → Conditional Access → Resources
    ↑                              ↑
Device Compliance              VPC Endpoint
(AWS Verified Access)          (no internet exposure)
```

**Key AWS services:**
- **AWS IAM Identity Center** — centralized SSO across all AWS accounts
- **AWS Verified Access** — application-level zero trust without VPN
- **VPC Endpoints** — private connectivity to AWS services without internet traversal
- **AWS PrivateLink** — service mesh private communication
- **Service Control Policies (SCPs)** — organization-wide guardrails
- **IMDSv2** — prevent SSRF from accessing EC2 metadata (mandatory)

### Kubernetes Zero Trust Pattern

```
SPIFFE/SPIRE (workload identity)
    → Istio/Linkerd mTLS (service mesh)
    → Network Policies (microsegmentation)
    → RBAC + OPA/Gatekeeper (authorization)
    → Falco (runtime detection)
```

**Key Kubernetes controls:**
- **RBAC** — role-based access for every service account, no cluster-admin in production
- **Pod Security Standards** — enforce restricted pod configurations (no privileged containers)
- **Network Policies** — deny-all default, explicit allow rules per namespace
- **User namespaces** — isolate container UIDs from host (beta, on by default in K8s 1.32+)
- **mTLS via service mesh** — Istio or Linkerd for automatic mutual TLS between pods
- **Admission control** — Kyverno or OPA/Gatekeeper for policy enforcement

### Identity-First Access for SaaS Apps

For organizations using Supabase, the zero trust pattern at the application layer:

```sql
-- Row Level Security = zero trust at data layer
-- No row is accessible without explicit policy authorization
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

-- Policy: identity-based access, per-row
CREATE POLICY "zero_trust_data_access"
ON sensitive_data
FOR ALL
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  AND (SELECT auth.jwt() -> 'app_metadata' ->> 'clearance_level')::int >= required_clearance
);
```

---

## Common Zero Trust Anti-Patterns

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| VPN as Zero Trust | VPN still grants broad network access after auth — not zero trust |
| Identity-only Zero Trust | Without device compliance and microsegmentation, identity alone is insufficient |
| "We have MFA so we're zero trust" | MFA is table stakes, not ZTA |
| Big bang ZTA deployment | Creates productivity disruption, typically fails — use phased approach |
| Treating cloud as trusted | Cloud workloads need the same zero trust controls as on-prem |
| Over-relying on network perimeter | Assumes breach never happens inside — incorrect assumption |

---

## Zero Trust for Brazilian/LGPD Context

Zero Trust architecture directly supports LGPD compliance:

| LGPD Article | Zero Trust Control |
|-------------|-------------------|
| Art. 46 — Technical security measures | Identity verification, encryption in transit (mTLS), access control |
| Art. 38 — DPIA | Zero trust access logs enable privacy impact analysis |
| Art. 48 — Breach notification | Detailed telemetry enables faster breach detection and scoping |
| Art. 7 — Lawful basis for processing | Access logs prove data was only accessed per authorized purpose |
| Principle of data minimization | Microsegmentation prevents services accessing data they don't need |

---

## Key Metrics for Zero Trust Maturity

| Metric | Immature | Mature |
|--------|---------|--------|
| % of resources requiring MFA | < 50% | 100% |
| % of services using mutual TLS | 0% | > 80% |
| Mean time to detect lateral movement | Days | Minutes |
| % of network with microsegmentation | < 20% | > 90% |
| % of access with just-in-time privileged access | 0% | 100% of privileged |
| % of devices with compliance enforcement | < 30% | 100% |

---

## Sources

- NIST SP 800-207 (Zero Trust Architecture): https://csrc.nist.gov/pubs/sp/800/207/final
- NIST SP 800-207A (19 ZTA examples): https://www.nist.gov/news-events/news/2025/06/nist-offers-19-ways-build-zero-trust-architectures
- CISA Zero Trust Maturity Model: https://www.cisa.gov/zero-trust-maturity-model
