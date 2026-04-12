---
task: network-segmentation-design
responsavel: "network-security-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: network_topology
    tipo: document
    origem: "user input"
    obrigatorio: true
  - campo: segmentation_model
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["zone-based", "micro-segmentation", "zero-trust", "hybrid"]

Saida:
  - campo: segmentation_design
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Map current network topology"
  - "[ ] Identify data flows and dependencies"
  - "[ ] Define security zones"
  - "[ ] Design inter-zone access policies"
  - "[ ] Plan DMZ and critical asset isolation"
  - "[ ] Define monitoring requirements per zone"
  - "[ ] Create implementation roadmap"
  - "[ ] Validate with business requirements"
---

# Task: Network Segmentation Design

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Wire (network-security-engineer)
- **Complexity:** Complex

## Objective

Design a network segmentation architecture that isolates assets based on sensitivity, function, and trust level. Limit lateral movement, contain breaches, and enforce least-privilege network access. The design covers both traditional and cloud-native network environments.

> **DEFENSIVE ARCHITECTURE:** Network segmentation is a defensive control designed to reduce attack surface and contain threats. This design must be validated before implementation to avoid business disruption.

## Pre-Conditions

- Current network topology documented
- Asset inventory with classification
- Understanding of application dependencies and data flows
- Business requirements for connectivity
- Change management process available for implementation

## Inputs

- Current network topology and diagrams
- Segmentation model preference (zone-based, micro-segmentation, zero-trust, hybrid)
- Asset inventory with data classification
- Application dependency maps
- Compliance requirements (PCI DSS CDE segmentation, HIPAA, etc.)

## Steps

### 1. Map Current Network State
Document the existing network:
- Network topology (subnets, VLANs, VPCs)
- Routing architecture
- Current firewall placement
- Inter-site connectivity (WAN, VPN, SD-WAN)
- Cloud network architecture
- Remote access infrastructure

### 2. Identify Data Flows and Dependencies
Map all communication paths:
| Source Zone | Destination Zone | Protocol/Port | Application | Business Purpose | Volume |
|-----------|-----------------|-------------|-------------|-----------------|--------|
| | | | | | |

### 3. Define Security Zones
Create a zone hierarchy based on trust and sensitivity:
| Zone | Trust Level | Data Classification | Examples | Access Policy |
|------|-----------|-------------------|---------|-------------|
| DMZ | Untrusted | Public | Web servers, WAF | Strict ingress/egress |
| Production | High Trust | Confidential | App servers, databases | Restricted access |
| Corporate | Medium Trust | Internal | Workstations, printers | Standard access |
| Development | Medium Trust | Internal | Dev servers, CI/CD | Isolated from prod |
| Management | Highest Trust | Restricted | Admin interfaces, IPMI | Highly restricted |
| Guest | No Trust | None | Guest WiFi | Internet only |

### 4. Design Inter-Zone Policies
Define allowed traffic between zones:
```
DMZ → Production: Only specific app ports, via load balancer
Corporate → Production: Via jump host/bastion only
Development → Production: BLOCKED (use CI/CD pipeline)
Guest → ANY internal: BLOCKED
Management → All: Restricted to management ports
```

### 5. Design Micro-Segmentation (if applicable)
Within zones, further segment by application:
- Application-level segmentation (web tier, app tier, data tier)
- Workload identity-based policies
- Container/pod network policies
- Host-based firewalls for lateral movement prevention

### 6. Plan Critical Asset Isolation
Identify and isolate high-value targets:
- Database servers (especially PII, financial data)
- Authentication infrastructure (AD, LDAP, PKI)
- Backup infrastructure
- Security tooling (SIEM, EDR management)
- Key management systems
- CI/CD pipeline infrastructure

### 7. Design Monitoring Points
Place monitoring at strategic locations:
| Location | Monitoring Type | Purpose |
|----------|---------------|---------|
| Zone boundaries | Flow logs, IDS/IPS | Inter-zone anomaly detection |
| DMZ | Full packet capture | Threat detection |
| Production ingress | WAF, DDoS protection | Application protection |
| Management zone | Full audit logging | Privileged access monitoring |
| Internet egress | Proxy, DLP | Data exfiltration prevention |

### 8. Address Cloud Network Segmentation
Design cloud-specific segmentation:
- VPC/VNet design and peering
- Security groups and network ACLs
- Private endpoints for cloud services
- Transit Gateway / Hub-Spoke architecture
- Cloud-to-on-premises connectivity
- Service mesh segmentation

### 9. Create Implementation Roadmap
Phase the implementation to minimize disruption:
| Phase | Actions | Risk | Duration |
|-------|---------|------|----------|
| 1 | Monitor and document current flows | Low | 2-4 weeks |
| 2 | Implement zone boundaries (permissive) | Low | 2-4 weeks |
| 3 | Tighten inter-zone policies | Medium | 4-8 weeks |
| 4 | Implement micro-segmentation | Medium | 4-8 weeks |
| 5 | Enforce deny-by-default | High | 2-4 weeks |

### 10. Validate and Document
Produce the final segmentation design with validation plan.

## Output

```yaml
segmentation_design:
  date: ""
  author: "Wire (network-security-engineer)"

  zones:
    - name: ""
      trust_level: ""
      assets: []
      ingress_policy: ""
      egress_policy: ""

  inter_zone_policies:
    - source: ""
      destination: ""
      allowed: ""
      denied: ""

  monitoring_points: []
  implementation_roadmap: []
  validation_plan: ""
```

## Quality Criteria

- [ ] Current network topology fully documented
- [ ] Data flows mapped between all components
- [ ] Security zones defined with clear trust levels
- [ ] Inter-zone policies follow least privilege
- [ ] Critical assets have additional isolation
- [ ] Monitoring points cover all zone boundaries
- [ ] Implementation roadmap is phased to minimize disruption
- [ ] Cloud and on-premises environments both addressed
