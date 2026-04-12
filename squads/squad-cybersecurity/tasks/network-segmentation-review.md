---
task: "network-segmentation-review"
responsavel: "network-security-engineer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: network_topology
    tipo: document
    origem: "user input"
    obrigatorio: true
  - campo: firewall_rules
    tipo: document
    origem: "firewall export"
    obrigatorio: false
Saida:
  - campo: segmentation_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Map current network zones and trust boundaries"
  - "[ ] Identify all inter-zone communication paths"
  - "[ ] Assess segmentation adequacy for critical assets"
  - "[ ] Identify lateral movement risks"
  - "[ ] Review micro-segmentation coverage"
  - "[ ] Provide segmentation improvement recommendations"
---

# Network Segmentation Review

## Objective

Assess the effectiveness of network segmentation in limiting blast radius and preventing lateral movement. Review zone architecture, inter-zone policies, and micro-segmentation coverage.

## Inputs

- Network topology (diagrams, IP ranges, VLAN assignments)
- Firewall rule exports (if available)
- Asset inventory with criticality classifications
- Known compliance requirements (PCI DSS CDE segmentation, etc.)

## Steps

1. **Map current zones** — Document all network zones: DMZ, application tiers, database tiers, management, user networks, IoT/OT, guest. Map VLAN assignments and IP ranges.

2. **Identify trust boundaries** — Where do trust levels change? What controls enforce those boundaries? Are boundaries physical (firewall) or logical (VLAN/ACL)?

3. **Analyze inter-zone flows** — Document allowed communication between zones. Identify overly permissive flows. Verify flows match documented business requirements.

4. **Assess lateral movement risk** — If an attacker compromises a host in Zone A, what can they reach? Map lateral movement paths across the network.

5. **Review critical asset protection** — Are databases, key management systems, and sensitive data stores in properly isolated zones? Is access strictly controlled?

6. **Evaluate micro-segmentation** — Is segmentation applied at the workload level (not just VLAN)? Are host-based firewalls, container network policies, or SDN in use?

7. **Compliance alignment** — Verify segmentation meets applicable requirements (PCI DSS scope reduction, HIPAA ePHI isolation, etc.).

## Quality Gates

- All zones must be documented with purpose and controls
- Lateral movement paths must be explicitly analyzed
- Critical assets must have verified isolation
- Recommendations must be prioritized by risk reduction
