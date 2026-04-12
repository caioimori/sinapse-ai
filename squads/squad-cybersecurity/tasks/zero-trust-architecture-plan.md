---
task: zero-trust-architecture-plan
responsavel: "network-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_architecture
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: zt_framework
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["NIST-SP-800-207", "CISA-ZTMM", "Forrester-ZTX", "custom"]
  - campo: priority_use_cases
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: zero_trust_plan
    tipo: document
    destino: "stakeholders, all-agents"

Checklist:
  - "[ ] Assess current architecture against ZT principles"
  - "[ ] Define zero trust pillars maturity"
  - "[ ] Design identity-centric access model"
  - "[ ] Plan device trust and posture assessment"
  - "[ ] Design network micro-segmentation"
  - "[ ] Plan data-centric security controls"
  - "[ ] Design continuous verification"
  - "[ ] Create phased implementation roadmap"
---

# Task: Zero Trust Architecture Plan

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Wire (network-security-engineer)
- **Complexity:** Complex

## Objective

Develop a comprehensive Zero Trust Architecture (ZTA) implementation plan that transitions the organization from a perimeter-based security model to a "never trust, always verify" approach. Cover all ZT pillars: identity, devices, network, applications, and data with continuous verification and least-privilege access.

## Pre-Conditions

- Current architecture documented
- Executive sponsorship for ZT initiative
- Understanding of critical assets and data flows
- Identity provider and directory services in place
- Budget and timeline expectations defined

## Inputs

- Current architecture description
- ZT framework preference (NIST SP 800-207, CISA ZTMM, Forrester ZTX)
- Priority use cases (remote workforce, cloud migration, compliance)
- Existing security investments to leverage
- Known pain points with current access model

## Steps

### 1. Assess Current ZT Maturity
Evaluate against CISA Zero Trust Maturity Model:
| Pillar | Traditional | Initial | Advanced | Optimal | Current |
|--------|-----------|---------|----------|---------|---------|
| Identity | Password-only | MFA, basic SSO | Risk-based auth, MFA everywhere | Continuous validation | |
| Devices | Domain-joined only | Basic inventory | Compliance checking | Continuous posture | |
| Networks | Flat, perimeter | Segmented | Micro-segmented | Encrypted, identity-aware | |
| Applications | VPN access | SSO integration | Per-app access | Continuous authorization | |
| Data | Location-based | Classification | Automated DLP | Real-time protection | |

### 2. Define Zero Trust Principles
Establish organizational ZT principles:
- Verify explicitly — authenticate and authorize every access request
- Use least privilege — minimize access to just-in-time, just-enough
- Assume breach — minimize blast radius, segment access, verify end-to-end

### 3. Design Identity Pillar
Plan identity-centric access controls:
- Strong authentication for all users (MFA, passwordless)
- Conditional access policies (risk-based, context-aware)
- Just-in-time privilege elevation
- Service identity and workload identity
- Identity threat detection and response
- Directory consolidation and SSO

### 4. Design Device Trust Pillar
Plan device posture assessment:
- Device inventory and registration
- Compliance posture checking before access
- Endpoint detection and response (EDR)
- Mobile device management (MDM/MAM)
- BYOD policy and controls
- IoT device segmentation

### 5. Design Network Pillar
Plan network evolution:
- Replace VPN with Zero Trust Network Access (ZTNA)
- Micro-segmentation implementation
- Software-defined perimeter
- Encrypted communications (mTLS)
- Network traffic inspection and monitoring
- DNS-layer security

### 6. Design Application Pillar
Plan application access transformation:
- Per-application access policies (not network-wide)
- Application-level authentication and authorization
- API gateway security
- SaaS security and CASB integration
- Application behavior monitoring
- Secure software development lifecycle

### 7. Design Data Pillar
Plan data-centric security:
- Data classification and labeling
- Data Loss Prevention (DLP) integration
- Encryption controls (at rest, in transit, in use)
- Data access governance
- Rights management
- Data lineage and flow monitoring

### 8. Plan Visibility and Analytics
Design continuous monitoring:
- Centralized log aggregation across all pillars
- User and Entity Behavior Analytics (UEBA)
- Automated threat detection across ZT policy enforcement points
- Risk scoring and adaptive policies
- Security orchestration and automated response

### 9. Technology Stack Selection
Map ZT capabilities to technology:
| Capability | Options | Integration Points |
|-----------|---------|-------------------|
| Identity Provider | Entra ID, Okta, Ping | All pillars |
| ZTNA | Zscaler, Cloudflare, Palo Alto | Network, Apps |
| EDR/XDR | CrowdStrike, SentinelOne, Defender | Devices |
| CASB/SSE | Netskope, Zscaler, Microsoft | Apps, Data |
| Micro-segmentation | Illumio, Guardicore, NSX | Network |
| DLP | Microsoft Purview, Symantec | Data |
| SIEM/SOAR | Sentinel, Splunk, Chronicle | Visibility |

### 10. Create Phased Implementation Roadmap
Define a realistic multi-phase rollout:
| Phase | Duration | Focus | Quick Wins |
|-------|----------|-------|-----------|
| 1 — Foundation | 0-3 months | Identity: MFA everywhere, SSO | Eliminate passwords |
| 2 — Visibility | 3-6 months | Logging, UEBA, asset inventory | Detect anomalies |
| 3 — Access | 6-12 months | ZTNA, conditional access, device trust | Replace VPN |
| 4 — Segmentation | 12-18 months | Micro-segmentation, per-app access | Reduce blast radius |
| 5 — Optimization | 18-24 months | Automation, adaptive policies, continuous | Full ZT posture |

## Output

```yaml
zero_trust_plan:
  framework: ""
  date: ""
  author: "Wire (network-security-engineer)"

  maturity_assessment:
    identity: "[traditional/initial/advanced/optimal]"
    devices: "[traditional/initial/advanced/optimal]"
    networks: "[traditional/initial/advanced/optimal]"
    applications: "[traditional/initial/advanced/optimal]"
    data: "[traditional/initial/advanced/optimal]"

  pillar_designs:
    identity: {}
    devices: {}
    networks: {}
    applications: {}
    data: {}

  technology_stack: []
  implementation_roadmap: []
  budget_estimate: ""
  success_metrics: []
```

## Quality Criteria

- [ ] Current ZT maturity assessed across all pillars
- [ ] ZT principles aligned with organizational context
- [ ] All five ZT pillars addressed in design
- [ ] Technology stack recommendations vendor-agnostic where possible
- [ ] Implementation roadmap is phased and realistic
- [ ] Quick wins identified for each phase
- [ ] Budget and resource requirements estimated
- [ ] Success metrics defined for measuring progress
